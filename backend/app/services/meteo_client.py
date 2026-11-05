import httpx
import time
import math
from typing import Dict, Any, Optional

CACHE: Dict[str, Dict[str, Any]] = {}
CACHE_TTL = 300  # 5 minutes

WMO_DESCRIPTIONS = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    62: "Moderate rain",
    63: "Heavy rain",
    65: "Violent rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
}

def get_wmo_description(code: int) -> str:
    return WMO_DESCRIPTIONS.get(code, "Variable conditions")

def calculate_dew_point(temp_c: Optional[float], humidity_pct: Optional[float]) -> float:
    """Magnus formula approximation for dew point with safe fallbacks"""
    t = float(temp_c) if temp_c is not None else 25.0
    h = float(humidity_pct) if humidity_pct is not None else 50.0
    try:
        a = 17.27
        b = 237.7
        alpha = ((a * t) / (b + t)) + math.log(max(h, 1.0) / 100.0)
        dew_point = (b * alpha) / (a - alpha)
        return round(dew_point, 1)
    except Exception:
        return round(t - ((100.0 - h) / 5.0), 1)

async def fetch_weather_raw(lat: float, lon: float) -> Dict[str, Any]:
    cache_key = f"weather_{round(lat, 3)}_{round(lon, 3)}"
    now = time.time()
    if cache_key in CACHE:
        entry = CACHE[cache_key]
        if now - entry["timestamp"] < CACHE_TTL:
            return entry["data"]

    forecast_url = "https://api.open-meteo.com/v1/forecast"
    forecast_params = {
        "latitude": lat,
        "longitude": lon,
        "past_days": 3,
        "hourly": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index",
        "daily": "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset",
        "current": "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m",
        "timezone": "auto"
    }

    air_quality_url = "https://air-quality-api.open-meteo.com/v1/air-quality"
    air_quality_params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi,us_aqi",
        "current": "european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone",
        "timezone": "auto"
    }

    headers = {"User-Agent": "mosam.AI/1.0 (Atmospheric Intelligence System)"}

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            fc_resp, aq_resp = await client.get(forecast_url, params=forecast_params, headers=headers), await client.get(air_quality_url, params=air_quality_params, headers=headers)
            forecast_data = fc_resp.json() if fc_resp.status_code == 200 else {}
            air_data = aq_resp.json() if aq_resp.status_code == 200 else {}
        except Exception as e:
            # Resilient fallback if connection problem
            forecast_data = {}
            air_data = {}

    result = {
        "forecast": forecast_data,
        "air_quality": air_data
    }

    if forecast_data:
        CACHE[cache_key] = {
            "timestamp": now,
            "data": result
        }

    return result
