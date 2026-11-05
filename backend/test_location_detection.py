import pytest
from app.services.location_detector import detect_target_location

@pytest.mark.anyio
async def test_detect_english_city():
    cur = {"name": "New Delhi", "latitude": 28.6139, "longitude": 77.2090}
    loc, ctx, switched, gps = await detect_target_location("What is the weather in Meerut?", cur)
    assert switched is True
    assert loc is not None
    assert loc["name"] == "Meerut"
    assert gps is False
    assert ctx is not None
    assert "current" in ctx
    assert "temperature" in ctx["current"]

@pytest.mark.anyio
async def test_detect_hindi_city():
    cur = {"name": "New Delhi", "latitude": 28.6139, "longitude": 77.2090}
    loc, ctx, switched, gps = await detect_target_location("मेरठ का मौसम कैसा है", cur)
    assert switched is True
    assert loc is not None
    assert loc["name"] == "Meerut"
    assert gps is False

@pytest.mark.anyio
async def test_detect_telugu_city():
    cur = {"name": "New Delhi", "latitude": 28.6139, "longitude": 77.2090}
    loc, ctx, switched, gps = await detect_target_location("హైదరాబాద్ లో వాతావరణం", cur)
    assert switched is True
    assert loc is not None
    assert loc["name"] == "Hyderabad"
    assert gps is False

@pytest.mark.anyio
async def test_detect_gps_intent():
    cur = {"name": "New Delhi", "latitude": 28.6139, "longitude": 77.2090}
    loc, ctx, switched, gps = await detect_target_location("use my gps", cur)
    assert gps is True
    assert switched is False
    assert loc is None

@pytest.mark.anyio
async def test_detect_no_switch_on_normal_query():
    cur = {"name": "New Delhi", "latitude": 28.6139, "longitude": 77.2090}
    loc, ctx, switched, gps = await detect_target_location("Can I hang laundry today?", cur)
    assert switched is False
    assert gps is False
    assert loc is None

