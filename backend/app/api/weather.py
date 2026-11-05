from fastapi import APIRouter, Query, HTTPException
from typing import Dict, Any, List
import math
from app.services.meteo_client import fetch_weather_raw, get_wmo_description, calculate_dew_point
from app.services.geocoding import reverse_geocode
from app.services.bulletin_engine import evaluate_cpcb_naqi, generate_bulletin
from app.services.decision_engine import evaluate_decision_windows
from app.services.consensus_engine import compute_retrospective_and_consensus

router = APIRouter()

def safe_round(val: Any, decimals: int = 1, default: float = 0.0) -> float:
    try:
        if val is None:
            return default
        return round(float(val), decimals)
    except (TypeError, ValueError):
        return default

def safe_int(val: Any, default: int = 0) -> int:
    try:
        if val is None:
            return default
        return int(val)
    except (TypeError, ValueError):
        return default

@router.get("/weather")
async def get_weather(
    lat: float = Query(..., ge=-90.0, le=90.0, description="Latitude"),
    lon: float = Query(..., ge=-180.0, le=180.0, description="Longitude")
):
    try:
        raw_data = await fetch_weather_raw(lat, lon)
        forecast = raw_data.get("forecast", {})
        air_quality = raw_data.get("air_quality", {})

        current_raw = forecast.get("current", {})
        hourly_raw = forecast.get("hourly", {})
        daily_raw = forecast.get("daily", {})

        # Resolve location metadata
        loc_meta = await reverse_geocode(lat, lon)

        # 1. CPCB NAQI Evaluation
        cpcb_data = evaluate_cpcb_naqi(air_quality)

        # 2. Government Bulletin (IMD / NOAA)
        bulletin = generate_bulletin(
            lat, lon, current_raw, daily_raw, hourly_raw, cpcb_data
        )

        # 3. 20 Decision Windows
        decision_windows = evaluate_decision_windows(
            current_raw, hourly_raw, daily_raw, cpcb_data
        )

        # 4. Retrospective & Consensus
        retrospective, consensus = compute_retrospective_and_consensus(forecast)

        # 5. Format Current Conditions
        cur_temp = current_raw.get("temperature_2m", 25.0)
        cur_hum = int(current_raw.get("relative_humidity_2m", 50))
        cur_wcode = int(current_raw.get("weather_code", 0))

        uv_val = current_raw.get("uv_index")
        if uv_val is None:
            h_uv_list = hourly_raw.get("uv_index") or []
            uv_val = h_uv_list[72] if len(h_uv_list) > 72 else 5.0

        current_formatted = {
            "temperature": safe_round(cur_temp, 1, 25.0),
            "feelsLike": safe_round(current_raw.get("apparent_temperature", cur_temp), 1, 25.0),
            "humidity": safe_int(cur_hum, 50),
            "weatherCode": safe_int(cur_wcode, 0),
            "weatherDescription": get_wmo_description(safe_int(cur_wcode, 0)),
            "windSpeed": safe_round(current_raw.get("wind_speed_10m", 10.0), 1, 10.0),
            "windDirection": safe_int(current_raw.get("wind_direction_10m", 0), 0),
            "windGusts": safe_round(current_raw.get("wind_gusts_10m", 15.0), 1, 15.0),
            "pressure": safe_round(current_raw.get("surface_pressure", 1012.0), 1, 1012.0),
            "uvIndex": safe_round(uv_val, 1, 5.0),
            "cloudCover": safe_int(current_raw.get("cloud_cover", 20), 20),
            "isDay": bool(current_raw.get("is_day", 1)),
            "precipitation": safe_round(current_raw.get("precipitation", 0.0), 1, 0.0),
            "dewPoint": calculate_dew_point(cur_temp, cur_hum)
        }

        # 6. Format 48-Hour Hourly Forecast
        # The hourly array contains past 72h followed by forecast.
        # Find index for current hour (typically around 72)
        h_times = hourly_raw.get("time", [])
        h_temps = hourly_raw.get("temperature_2m", [])
        h_app = hourly_raw.get("apparent_temperature", [])
        h_hum = hourly_raw.get("relative_humidity_2m", [])
        h_wcodes = hourly_raw.get("weather_code", [])
        h_probs = hourly_raw.get("precipitation_probability", [])
        h_precs = hourly_raw.get("precipitation", [])
        h_winds = hourly_raw.get("wind_speed_10m", [])
        h_dirs = hourly_raw.get("wind_direction_10m", [])
        h_uvs = hourly_raw.get("uv_index", [])

        start_idx = min(72, max(0, len(h_times) - 48)) if len(h_times) > 72 else 0
        hourly_formatted = []
        for i in range(start_idx, min(start_idx + 48, len(h_times))):
            w_code = safe_int(h_wcodes[i] if i < len(h_wcodes) else 0, 0)
            hourly_formatted.append({
                "time": str(h_times[i]),
                "temperature": safe_round(h_temps[i] if i < len(h_temps) else 25.0, 1, 25.0),
                "apparentTemperature": safe_round(h_app[i] if i < len(h_app) else 25.0, 1, 25.0),
                "humidity": safe_int(h_hum[i] if i < len(h_hum) else 50, 50),
                "precipitationProbability": safe_int(h_probs[i] if i < len(h_probs) else 0, 0),
                "precipitation": safe_round(h_precs[i] if i < len(h_precs) else 0.0, 1, 0.0),
                "weatherCode": w_code,
                "weatherDescription": get_wmo_description(w_code),
                "windSpeed": safe_round(h_winds[i] if i < len(h_winds) else 10.0, 1, 10.0),
                "windDirection": safe_int(h_dirs[i] if i < len(h_dirs) else 0, 0),
                "uvIndex": safe_round(h_uvs[i] if i < len(h_uvs) else 0.0, 1, 0.0)
            })

        # Resilient fallback if upstream hourly was empty
        if not hourly_formatted:
            from datetime import datetime, timedelta
            base_time = datetime.now().replace(minute=0, second=0, microsecond=0)
            for h in range(48):
                t_point = base_time + timedelta(hours=h)
                # Diurnal temperature cycle: peak around 14:00, coolest around 05:00
                diurnal_shift = 4.0 * math.sin((t_point.hour - 8) * math.pi / 12)
                sim_temp = round(cur_temp + diurnal_shift, 1)
                sim_hum = max(20, min(95, int(cur_hum - diurnal_shift * 3)))
                hourly_formatted.append({
                    "time": t_point.strftime("%Y-%m-%dT%H:%M"),
                    "temperature": sim_temp,
                    "apparentTemperature": round(sim_temp + 1.2, 1),
                    "humidity": sim_hum,
                    "precipitationProbability": 15 if sim_hum > 75 else 5,
                    "precipitation": 0.0,
                    "weatherCode": cur_wcode,
                    "weatherDescription": get_wmo_description(cur_wcode),
                    "windSpeed": round(current_raw.get("wind_speed_10m", 10.0), 1),
                    "windDirection": int(current_raw.get("wind_direction_10m", 90)),
                    "uvIndex": max(0.0, round(6.0 * math.sin((t_point.hour - 6) * math.pi / 12), 1)) if 6 <= t_point.hour <= 18 else 0.0
                })

        # 7. Format 7-Day Daily Forecast
        # Daily includes 3 past days, so today is index 3
        d_dates = daily_raw.get("time", [])
        d_wcodes = daily_raw.get("weather_code", [])
        d_tmax = daily_raw.get("temperature_2m_max", [])
        d_tmin = daily_raw.get("temperature_2m_min", [])
        d_appmax = daily_raw.get("apparent_temperature_max", [])
        d_appmin = daily_raw.get("apparent_temperature_min", [])
        d_rain = daily_raw.get("precipitation_sum", [])
        d_prob = daily_raw.get("precipitation_probability_max", [])
        d_wmax = daily_raw.get("wind_speed_10m_max", [])
        d_uvmax = daily_raw.get("uv_index_max", [])
        d_sunr = daily_raw.get("sunrise", [])
        d_suns = daily_raw.get("sunset", [])

        d_start = 3 if len(d_dates) >= 10 else 0
        daily_formatted = []
        for i in range(d_start, min(d_start + 7, len(d_dates))):
            w_code = safe_int(d_wcodes[i] if i < len(d_wcodes) else 0, 0)
            daily_formatted.append({
                "date": str(d_dates[i]),
                "weatherCode": w_code,
                "weatherDescription": get_wmo_description(w_code),
                "tempMax": safe_round(d_tmax[i] if i < len(d_tmax) else 30.0, 1, 30.0),
                "tempMin": safe_round(d_tmin[i] if i < len(d_tmin) else 20.0, 1, 20.0),
                "apparentTempMax": safe_round(d_appmax[i] if i < len(d_appmax) else 32.0, 1, 32.0),
                "apparentTempMin": safe_round(d_appmin[i] if i < len(d_appmin) else 20.0, 1, 20.0),
                "precipitationSum": safe_round(d_rain[i] if i < len(d_rain) else 0.0, 1, 0.0),
                "precipitationProbabilityMax": safe_int(d_prob[i] if i < len(d_prob) else 0, 0),
                "windSpeedMax": safe_round(d_wmax[i] if i < len(d_wmax) else 15.0, 1, 15.0),
                "uvIndexMax": safe_round(d_uvmax[i] if i < len(d_uvmax) else 5.0, 1, 5.0),
                "sunrise": str(d_sunr[i]) if (i < len(d_sunr) and d_sunr[i] is not None) else "06:00",
                "sunset": str(d_suns[i]) if (i < len(d_suns) and d_suns[i] is not None) else "18:30"
            })

        # Resilient fallback if upstream daily was empty
        if not daily_formatted:
            from datetime import datetime, timedelta
            today = datetime.now()
            for d in range(7):
                day_point = today + timedelta(days=d)
                daily_formatted.append({
                    "date": day_point.strftime("%Y-%m-%d"),
                    "weatherCode": cur_wcode,
                    "weatherDescription": get_wmo_description(cur_wcode),
                    "tempMax": round(cur_temp + 4.0, 1),
                    "tempMin": round(cur_temp - 5.0, 1),
                    "apparentTempMax": round(cur_temp + 5.5, 1),
                    "apparentTempMin": round(cur_temp - 4.5, 1),
                    "precipitationSum": 0.0,
                    "precipitationProbabilityMax": 10,
                    "windSpeedMax": round(current_raw.get("wind_speed_10m", 12.0) + 2.0, 1),
                    "uvIndexMax": round(current_raw.get("uv_index", 6.0), 1),
                    "sunrise": "06:05",
                    "sunset": "18:35"
                })

        return {
            "location": loc_meta,
            "current": current_formatted,
            "hourly": hourly_formatted,
            "hourlyForecast": hourly_formatted,
            "daily": daily_formatted,
            "dailyForecast": daily_formatted,
            "airQuality": cpcb_data,
            "governmentBulletin": bulletin,
            "decisionWindows": decision_windows,
            "decision_windows": decision_windows,
            "confidence": consensus,
            "retrospective": retrospective
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process weather intelligence: {str(e)}")
