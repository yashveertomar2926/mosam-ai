import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.bulletin_engine import evaluate_cpcb_naqi, generate_bulletin, is_within_india
from app.services.decision_engine import evaluate_decision_windows
from app.services.nlg_engine import classify_intent, generate_nlg_response

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "India Meteorological Department (IMD)" in data["governmentSources"]

def test_india_bounding_box():
    # New Delhi
    assert is_within_india(28.6139, 77.2090) is True
    # Kochi
    assert is_within_india(9.9312, 76.2673) is True
    # London
    assert is_within_india(51.5074, -0.1278) is False

def test_cpcb_naqi_calculation():
    air_data = {
        "current": {"pm2_5": 85.0, "pm10": 160.0}
    }
    naqi = evaluate_cpcb_naqi(air_data)
    assert naqi["index"] > 100
    assert naqi["category"] in ["Moderate", "Poor", "Very Poor"]
    assert "healthAdvisory" in naqi
    assert "primaryPollutant" in naqi

def test_agromet_spray_rule():
    # Wind > 15 km/h -> Spray HOLD
    current = {"temperature_2m": 28.0, "wind_speed_10m": 18.5, "wind_gusts_10m": 22.0, "weather_code": 1}
    daily = {"precipitation_sum": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]}
    hourly = {"precipitation_probability": [10, 10, 10]}
    cpcb = {"index": 55, "category": "Satisfactory", "primaryPollutant": "PM2.5", "healthAdvisory": "Minimal", "outdoorCardioPermitted": True, "sensitiveGroupNotice": "Safe"}

    bulletin = generate_bulletin(28.6139, 77.2090, current, daily, hourly, cpcb)
    assert bulletin["isImd"] is True
    assert bulletin["authority"] == "India Meteorological Department (IMD)"
    assert bulletin["agromet"]["spraySafetyStatus"] == "HOLD"
    assert "15 km/h limit" in bulletin["agromet"]["spraySafetyReason"]

def test_decision_windows_20_activities():
    current = {"temperature_2m": 26.0, "apparent_temperature": 27.0, "relative_humidity_2m": 55, "wind_speed_10m": 11.0, "weather_code": 0, "uv_index": 5.0, "cloud_cover": 20, "is_day": 1}
    hourly = {"precipitation_probability": [0]*12, "precipitation": [0.0]*12}
    daily = {}
    cpcb = {"index": 50, "category": "Good", "pm2_5": 20.0}

    decisions = evaluate_decision_windows(current, hourly, daily, cpcb)
    assert len(decisions) >= 20
    # Check required fields
    for d in decisions:
        assert "id" in d
        assert "title" in d
        assert "status" in d
        assert "suitabilityScore" in d
        assert "bestTimeWindow" in d
        assert "description" in d
        assert "icon" in d

def test_nlg_intent_and_multilingual():
    q_wedding = "Is it safe to organize an outdoor wedding reception today?"
    assert classify_intent(q_wedding) == "wedding_event"

    q_spray = "Can we spray pesticide on the wheat crops this morning?"
    assert classify_intent(q_spray) == "farming_spraying"

    q_asthma = "What is the air pollution risk for my asthma?"
    assert classify_intent(q_asthma) == "asthma_health"

    mock_ctx = {
        "current": {"temperature": 28.0, "feelsLike": 29.0, "humidity": 60, "windSpeed": 10.0, "weatherDescription": "Clear", "pressure": 1012.0},
        "governmentBulletin": {
            "authority": "India Meteorological Department (IMD)",
            "alertLevel": "Green",
            "alertTitle": "Normal",
            "agromet": {"spraySafetyStatus": "SAFE", "spraySafetyReason": "Gentle wind and zero rain", "fieldDrainageStatus": "Optimal"},
            "cpcbNaqi": {"index": 62, "category": "Satisfactory", "healthAdvisory": "Air is good"}
        },
        "retrospective": {"tempComparisonText": "Same as yesterday", "rainAccumulationPast72h": 0.0, "pressureTendency": "Steady"}
    }

    # English
    en_reply, en_badge = generate_nlg_response(q_spray, "New Delhi", mock_ctx, "en")
    assert "spray" in en_reply.lower()
    assert "IMD Alert: Green" in en_badge

    # Hindi
    hi_reply, hi_badge = generate_nlg_response(q_spray, "New Delhi", mock_ctx, "hi")
    assert "कीटनाशक" in hi_reply or "कृषि" in hi_reply

    # Telugu
    te_reply, te_badge = generate_nlg_response(q_spray, "Hyderabad", mock_ctx, "te")
    assert "పిచికారీ" in te_reply or "మందు" in te_reply or "పంట" in te_reply

    # Malayalam
    ml_reply, ml_badge = generate_nlg_response(q_spray, "Kochi", mock_ctx, "ml")
    assert "കീടനാശിനി" in ml_reply or "കാലാവസ്ഥാ" in ml_reply

    # Tamil
    ta_reply, ta_badge = generate_nlg_response(q_spray, "Chennai", mock_ctx, "ta")
    assert "பூச்சிக்கொல்லி" in ta_reply or "பயிர்களுக்கு" in ta_reply

    # Marathi
    mr_reply, mr_badge = generate_nlg_response(q_spray, "Pune", mock_ctx, "mr")
    assert "कीटकनाशक" in mr_reply or "पिकांवर" in mr_reply

    # Bengali
    bn_reply, bn_badge = generate_nlg_response(q_spray, "Kolkata", mock_ctx, "bn")
    assert "কীটনাশক" in bn_reply or "ফসলে" in bn_reply

@pytest.mark.anyio
async def test_target_location_detection():
    from app.services.location_detector import detect_target_location
    cur = {"name": "New Delhi", "latitude": 28.6139, "longitude": 77.2090}

    # 1. English city in query
    loc, ctx, switched, gps = await detect_target_location("What is the weather in Meerut?", cur)
    assert switched is True
    assert loc is not None
    assert loc["name"] == "Meerut"
    assert gps is False

    # 2. Hindi city in query
    loc_hi, ctx_hi, switched_hi, gps_hi = await detect_target_location("मेरठ का मौसम कैसा है", cur)
    assert switched_hi is True
    assert loc_hi["name"] == "Meerut"

    # 3. No city (default)
    loc_def, ctx_def, switched_def, gps_def = await detect_target_location("Can I dry laundry today?", cur)
    assert switched_def is False
    assert loc_def is None
    assert gps_def is False

    # 4. GPS request
    loc_gps, ctx_gps, switched_gps, gps_req = await detect_target_location("what is the weather at my location?", cur)
    assert gps_req is True
    assert switched_gps is False

