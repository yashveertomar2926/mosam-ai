import re
from typing import Dict, Any, Optional, Tuple
from app.services.geocoding import search_locations, reverse_geocode, POPULAR_CITIES
from app.services.meteo_client import fetch_weather_raw, get_wmo_description, calculate_dew_point
from app.services.bulletin_engine import evaluate_cpcb_naqi, generate_bulletin
from app.services.consensus_engine import compute_retrospective_and_consensus

GPS_KEYWORDS = [
    "current location", "my location", "gps", "right here", "where i am",
    "mera location", "meri location", "mera current location", "apna location",
    "hamara location", "current spot", "here", "live location"
]

STOPWORDS = {
    "the", "my", "our", "this", "here", "today", "tomorrow", "now", "tonight",
    "aaj", "kal", "weather", "in", "at", "for", "about", "around", "doing",
    "me", "mein", "kaisa", "hai", "good", "bad", "rain", "sun"
}

def extract_city_candidate(query: str) -> Tuple[Optional[str], bool]:
    """
    Extracts potential city candidate name or GPS intent from user message.
    Returns (city_candidate, is_gps_requested)
    """
    q_lower = query.lower().strip()

    

    q_clean = re.sub(r"[?!.,]", " ", query).strip()

    # 1. English patterns
    patterns_en = [
        r"\b(?:weather\s+(?:in|of|at|for|around|about))\s+([a-zA-Z\s]+?)(?:\s+(?:today|tomorrow|now|tonight|this week)|$)",
        r"\b(?:how\s+is|what\s+about)\s+(?:the\s+weather\s+in\s+)?([a-zA-Z\s]+?)(?:\s+(?:today|tomorrow|now|doing)|$)",
        r"\b(?:will\s+it\s+rain\s+in)\s+([a-zA-Z\s]+?)(?:\s+(?:today|tomorrow|now)|$)",
        r"\b(?:in|at|for|around|about)\s+([a-zA-Z]+)(?:\s+(?:today|tomorrow|now|tonight)|$)",
        r"\b([a-zA-Z]+)\s+(?:weather|forecast|temperature)\b",
    ]
    for pat in patterns_en:
        m = re.search(pat, q_clean, re.IGNORECASE)
        if m:
            cand = m.group(1).strip()
            if cand.lower() not in STOPWORDS and len(cand) >= 3:
                return cand, False

    # 2. Hindi Devanagari patterns
    # e.g., "मेरठ में", "मेरठ का मौसम", "मेरठ की बारिश", "मेरठ का तापमान"
    m_hi = re.search(r"([^\s]+)\s+(?:में|का\s+मौसम|की\s+बारिश|का\s+हाल|का\s+तापमान)", q_clean)
    if m_hi:
        cand = m_hi.group(1).strip()
        if cand not in ["आज", "कल", "यहाँ", "वहाँ", "मौसम", "क्या"]:
            return cand, False

    # 3. Hindi in Latin script: e.g. "meerut me", "jaipur ka mausam"
    m_hi_latin = re.search(r"([a-zA-Z]+)\s+(?:me|mein|ka\s+mausam|ki\s+barish|ka\s+hal)", q_clean, re.IGNORECASE)
    if m_hi_latin:
        cand = m_hi_latin.group(1).strip()
        if cand.lower() not in STOPWORDS and len(cand) >= 3:
            return cand, False

    # 4. Telugu patterns: <City> లో
    m_te = re.search(r"([^\s]+)\s*లో", q_clean)
    if m_te:
        cand = m_te.group(1).strip()
        if cand not in ["ఈరోజు", "రేపు", "ఇక్కడ"]:
            return cand, False

    # 5. Malayalam patterns: <City> ൽ or യിൽ
    m_ml = re.search(r"([^\s]+)\s*(?:ൽ|യിൽ)", q_clean)
    if m_ml:
        cand = m_ml.group(1).strip()
        if cand not in ["ഇന്ന്", "നാളെ", "ഇവിടെ"]:
            return cand, False

    # 6. Popular city fallback check
    for pc in POPULAR_CITIES:
        c_name = pc["name"].lower()
        if re.search(rf"\b{re.escape(c_name)}\b", q_lower):
            return pc["name"], False

    # Check GPS keywords only after checking for an explicit city
    for kw in GPS_KEYWORDS:
        if re.search(rf"\b{re.escape(kw)}\b", q_lower):
            return None, True

    return None, False


async def detect_target_location(
    query: str,
    current_location: Dict[str, Any]
) -> Tuple[Optional[Dict[str, Any]], Optional[Dict[str, Any]], bool, bool]:
    """
    Detects if a different city or GPS location was requested.
    Returns: (resolved_location, weather_context, is_switched, is_gps)
    """
    city_cand, is_gps = extract_city_candidate(query)

    if is_gps:
        return None, None, False, True

    if not city_cand:
        return None, None, False, False

    cur_name = current_location.get("name", "").lower()
    if city_cand.lower() == cur_name:
        return None, None, False, False

    # Resolve candidate through geocoding
    candidates = await search_locations(city_cand)
    if not candidates:
        return None, None, False, False

    target_loc = candidates[0]
    # Verify it is indeed different from current
    if target_loc["name"].lower() == cur_name:
        return None, None, False, False

    # Fetch live weather and government alerts for target location
    lat = target_loc["latitude"]
    lon = target_loc["longitude"]
    raw_data = await fetch_weather_raw(lat, lon)
    forecast = raw_data.get("forecast", {})
    air = raw_data.get("air_quality", {})

    cpcb = evaluate_cpcb_naqi(air)
    bulletin = generate_bulletin(
        lat, lon, forecast.get("current", {}), forecast.get("daily", {}), forecast.get("hourly", {}), cpcb
    )
    retro, consensus = compute_retrospective_and_consensus(forecast)

    cur_raw = forecast.get("current", {})
    cur_temp = float(cur_raw.get("temperature_2m", 25.0) if cur_raw.get("temperature_2m") is not None else 25.0)
    cur_hum = int(cur_raw.get("relative_humidity_2m", 50) if cur_raw.get("relative_humidity_2m") is not None else 50)
    cur_wcode = int(cur_raw.get("weather_code", 0) if cur_raw.get("weather_code") is not None else 0)

    formatted_current = {
        "temperature": round(cur_temp, 1),
        "feelsLike": round(cur_raw.get("apparent_temperature", cur_temp), 1),
        "humidity": cur_hum,
        "weatherCode": cur_wcode,
        "weatherDescription": get_wmo_description(cur_wcode),
        "windSpeed": round(cur_raw.get("wind_speed_10m", 10.0), 1),
        "windDirection": int(cur_raw.get("wind_direction_10m", 0)),
        "windGusts": round(cur_raw.get("wind_gusts_10m", 15.0), 1),
        "pressure": round(cur_raw.get("surface_pressure", 1012.0), 1),
        "uvIndex": round(cur_raw.get("uv_index", 5.0), 1),
        "cloudCover": int(cur_raw.get("cloud_cover", 20)),
        "isDay": bool(cur_raw.get("is_day", 1)),
        "precipitation": round(cur_raw.get("precipitation", 0.0), 1),
        "dewPoint": calculate_dew_point(cur_temp, cur_hum),
        # Retain raw keys for backward compatibility
        "temperature_2m": cur_temp,
        "apparent_temperature": cur_raw.get("apparent_temperature", cur_temp),
        "relative_humidity_2m": cur_hum,
        "wind_speed_10m": cur_raw.get("wind_speed_10m", 10.0),
        "wind_gusts_10m": cur_raw.get("wind_gusts_10m", 15.0),
        "surface_pressure": cur_raw.get("surface_pressure", 1012.0),
        "weather_code": cur_wcode,
    }

    target_weather_ctx = {
        "current": formatted_current,
        "daily": forecast.get("daily", {}),
        "hourly": forecast.get("hourly", {}),
        "governmentBulletin": bulletin,
        "retrospective": retro,
        "airQuality": cpcb,
        "confidence": consensus
    }

    return target_loc, target_weather_ctx, True, False
