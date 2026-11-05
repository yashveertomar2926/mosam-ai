from typing import Dict, Any, List, Tuple
from datetime import datetime, timezone

def is_within_india(lat: float, lon: float) -> bool:
    """India geographical bounding box approximate: 6°N - 38°N, 68°E - 98°E"""
    return 6.0 <= lat <= 38.0 and 68.0 <= lon <= 98.0

def calculate_cpcb_pm25_subindex(pm25: float) -> int:
    """CPCB NAQI breakpoints for PM2.5 (ug/m3)"""
    if pm25 <= 30:
        return int((50 / 30) * pm25)
    elif pm25 <= 60:
        return int(50 + ((100 - 50) / (60 - 30)) * (pm25 - 30))
    elif pm25 <= 90:
        return int(100 + ((200 - 100) / (90 - 60)) * (pm25 - 60))
    elif pm25 <= 120:
        return int(200 + ((300 - 200) / (120 - 90)) * (pm25 - 90))
    elif pm25 <= 250:
        return int(300 + ((400 - 300) / (250 - 120)) * (pm25 - 120))
    else:
        return int(min(500, 400 + ((500 - 400) / (380 - 250)) * (pm25 - 250)))

def calculate_cpcb_pm10_subindex(pm10: float) -> int:
    """CPCB NAQI breakpoints for PM10 (ug/m3)"""
    if pm10 <= 50:
        return int(pm10)
    elif pm10 <= 100:
        return int(pm10)
    elif pm10 <= 250:
        return int(100 + ((200 - 100) / (250 - 100)) * (pm10 - 100))
    elif pm10 <= 350:
        return int(200 + ((300 - 200) / (350 - 250)) * (pm10 - 250))
    elif pm10 <= 430:
        return int(300 + ((400 - 300) / (430 - 350)) * (pm10 - 350))
    else:
        return int(min(500, 400 + ((500 - 400) / (500 - 430)) * (pm10 - 430)))

def evaluate_cpcb_naqi(air_data: Dict[str, Any]) -> Dict[str, Any]:
    current_aq = air_data.get("current") or {}
    hourly_aq = air_data.get("hourly") or {}

    pm25_val = current_aq.get("pm2_5")
    if pm25_val is None:
        h_pm25 = hourly_aq.get("pm2_5") or [25.0]
        pm25_val = h_pm25[-1] if h_pm25 and h_pm25[-1] is not None else 25.0

    pm10_val = current_aq.get("pm10")
    if pm10_val is None:
        h_pm10 = hourly_aq.get("pm10") or [45.0]
        pm10_val = h_pm10[-1] if h_pm10 and h_pm10[-1] is not None else 45.0

    try:
        pm25 = float(pm25_val)
    except (TypeError, ValueError):
        pm25 = 25.0

    try:
        pm10 = float(pm10_val)
    except (TypeError, ValueError):
        pm10 = 45.0
    
    sub_pm25 = calculate_cpcb_pm25_subindex(pm25)
    sub_pm10 = calculate_cpcb_pm10_subindex(pm10)
    
    overall_aqi = max(sub_pm25, sub_pm10)
    primary_pollutant = "PM2.5" if sub_pm25 >= sub_pm10 else "PM10"

    if overall_aqi <= 50:
        category = "Good"
        color = "#10b981"
        health_advisory = "Minimal health impact. Air quality is ideal for all outdoor activities and exercises."
        mask_needed = False
        cardio = True
        sensitive = "Safe for sensitive individuals and children."
    elif overall_aqi <= 100:
        category = "Satisfactory"
        color = "#84cc16"
        health_advisory = "Minor breathing discomfort to sensitive people with existing respiratory ailments."
        mask_needed = False
        cardio = True
        sensitive = "Individuals with asthma should carry reliever inhalers."
    elif overall_aqi <= 200:
        category = "Moderate"
        color = "#eab308"
        health_advisory = "Breathing discomfort to people with lung disease, asthma, and heart conditions upon prolonged exposure."
        mask_needed = False
        cardio = True
        sensitive = "Children, elderly, and asthmatic patients should limit prolonged outdoor exertion."
    elif overall_aqi <= 300:
        category = "Poor"
        color = "#f97316"
        health_advisory = "Breathing discomfort to most people on prolonged exposure. High particulate load."
        mask_needed = True
        cardio = False
        sensitive = "Avoid intense outdoor workouts. Wear N95 masks in high traffic zones."
    elif overall_aqi <= 400:
        category = "Very Poor"
        color = "#ef4444"
        health_advisory = "Respiratory illness on prolonged exposure. Pronounced effect on vulnerable groups."
        mask_needed = True
        cardio = False
        sensitive = "Keep windows closed. Air purifiers recommended indoors. Wear N95 outdoors."
    else:
        category = "Severe"
        color = "#7f1d1d"
        health_advisory = "Health emergency warning. Affects healthy individuals and severely impacts those with existing diseases."
        mask_needed = True
        cardio = False
        sensitive = "Avoid all outdoor physical exertion. Immediate respiratory protection necessary."

    return {
        "index": overall_aqi,
        "category": category,
        "color": color,
        "pm2_5": round(float(pm25), 1),
        "pm10": round(float(pm10), 1),
        "co": current_aq.get("carbon_monoxide"),
        "no2": current_aq.get("nitrogen_dioxide"),
        "so2": current_aq.get("sulphur_dioxide"),
        "o3": current_aq.get("ozone"),
        "primaryPollutant": primary_pollutant,
        "healthAdvisory": health_advisory,
        "outdoorCardioPermitted": cardio,
        "maskRecommended": mask_needed,
        "sensitiveGroupNotice": sensitive
    }

def generate_bulletin(
    lat: float, 
    lon: float, 
    current: Dict[str, Any], 
    daily: Dict[str, Any], 
    hourly: Dict[str, Any],
    cpcb: Dict[str, Any]
) -> Dict[str, Any]:
    in_india = is_within_india(lat, lon)
    authority = "India Meteorological Department (IMD)" if in_india else "National Weather Agency (NOAA / ECMWF)"
    
    # Analyze atmospheric triggers safely
    temp = float(current.get("temperature_2m", 25.0) if current.get("temperature_2m") is not None else 25.0)
    wind_speed = float(current.get("wind_speed_10m", 10.0) if current.get("wind_speed_10m") is not None else 10.0)
    wind_gusts = float(current.get("wind_gusts_10m", 15.0) if current.get("wind_gusts_10m") is not None else 15.0)
    weather_code = int(current.get("weather_code", 0) if current.get("weather_code") is not None else 0)
    
    daily_rains = daily.get("precipitation_sum") or [0.0]
    today_rain = float(daily_rains[3] if len(daily_rains) > 3 and daily_rains[3] is not None else (daily_rains[0] if daily_rains and daily_rains[0] is not None else 0.0))
    tomorrow_rain = float(daily_rains[4] if len(daily_rains) > 4 and daily_rains[4] is not None else (daily_rains[1] if len(daily_rains) > 1 and daily_rains[1] is not None else 0.0))
    
    hourly_prob = hourly.get("precipitation_probability") or [0]
    valid_probs = [int(p) for p in hourly_prob[:6] if p is not None]
    next_6h_prob = max(valid_probs) if valid_probs else 0

    # 4-Tier Alert Logic
    alert_level = "Green"
    alert_title = "Normal / All Clear"
    color_hex = "#10b981"
    bulletin_summary = "Atmospheric conditions remain stable with no severe weather warnings in effect."
    detailed_advisory = "Favorable meteorological conditions prevail. Routine agricultural, commuting, and outdoor operations can proceed without weather-induced interruptions."

    if weather_code == 99 or today_rain >= 115.5 or wind_speed >= 65.0 or temp >= 45.0:
        alert_level = "Red"
        alert_title = "Warning (Take Action)"
        color_hex = "#ef4444"
        if weather_code == 99:
            bulletin_summary = "Severe hailstorm and high-velocity squall warning. Life-threatening convective gusts."
        elif today_rain >= 115.5:
            bulletin_summary = "Extremely heavy rainfall warning (>115.5 mm). High risk of flash flooding and inundation."
        elif temp >= 45.0:
            bulletin_summary = "Severe heatwave emergency. Extreme solar radiation and thermal stress."
        else:
            bulletin_summary = "Storm-force wind warning (>65 km/h). Structural danger and falling branches."
        detailed_advisory = "Cease all non-essential outdoor travel. Secure agricultural equipment, reinforce fragile shelters, and ensure open drainage channels are de-silted immediately."

    elif weather_code in [95, 96] or today_rain >= 64.5 or wind_speed >= 50.0 or temp >= 42.0:
        alert_level = "Orange"
        alert_title = "Alert (Be Prepared)"
        color_hex = "#f97316"
        if weather_code in [95, 96]:
            bulletin_summary = "Thunderstorm with convective lightning and localized gusty winds expected."
        elif today_rain >= 64.5:
            bulletin_summary = "Heavy rainfall alert (64.5 - 115.5 mm). Localized waterlogging in low-lying sectors."
        elif temp >= 42.0:
            bulletin_summary = "Heatwave alert. High surface temperature with heightened dehydration risk."
        else:
            bulletin_summary = "Gale wind alert (50 - 65 km/h). Hazardous conditions for elevated and waterborne activities."
        detailed_advisory = "Monitor local civil advisories closely. Farmers are advised to postpone spraying, stake tall standing crops, and avoid sheltering under lone trees during lightning."

    elif today_rain >= 15.6 or wind_speed >= 30.0 or temp >= 38.0 or weather_code in [45, 48, 55, 63, 81] or next_6h_prob >= 50:
        alert_level = "Yellow"
        alert_title = "Watch (Be Updated)"
        color_hex = "#eab308"
        bulletin_summary = "Atmospheric instability detected. Potential localized showers, gusty winds, or elevated temperatures."
        detailed_advisory = "Keep abreast of evolving radar developments. Plan transit with buffer time for wet road conditions and ensure vulnerable field boundaries are checked."

    # IMD Agromet Advisory Formulation
    # Requirement: Agricultural guidance on pesticide/fertilizer spray safety (hold if rain >35% or wind >15 km/h)
    spray_status = "SAFE"
    spray_reasons = []
    
    if next_6h_prob > 35:
        spray_status = "HOLD"
        spray_reasons.append(f"Precipitation probability is {next_6h_prob}% (>35% limit) risking foliar pesticide wash-off")
    if wind_speed > 15.0:
        spray_status = "HOLD"
        spray_reasons.append(f"Surface wind speed of {wind_speed:.1f} km/h (>15 km/h limit) causes aerosol chemical drift")
    
    if spray_status == "SAFE":
        if 12.0 <= wind_speed <= 15.0 or 25 <= next_6h_prob <= 35:
            spray_status = "CAUTION"
            spray_reason = f"Borderline conditions: wind {wind_speed:.1f} km/h, rain chance {next_6h_prob}%. Spray only with low-drift nozzles."
            safe_window = "06:00 - 09:00 AM (Calm early morning thermal inversion)"
        else:
            spray_reason = f"Optimal spray window: gentle breeze ({wind_speed:.1f} km/h) and minimal rain probability ({next_6h_prob}%). Target foliar coverage will adhere safely."
            safe_window = "06:30 - 10:00 AM or 16:30 - 18:30 PM"
    else:
        spray_reason = " • ".join(spray_reasons) + ". Hold chemical and fertilizer applications until conditions settle."
        safe_window = None

    # Drainage status
    cumulative_48h_rain = today_rain + tomorrow_rain
    drainage_needed = cumulative_48h_rain > 40.0 or today_rain > 30.0
    if drainage_needed:
        drainage_status = f"High soil moisture saturation ({cumulative_48h_rain:.1f} mm rain projected). Dig shallow trenches and clear bund drains to prevent root rot."
    else:
        drainage_status = "Soil moisture balance within stable operational thresholds. Normal irrigation schedule may continue."

    crop_tips = [
        "Store harvested produce and seed bags on elevated pallets inside moisture-proof shelters.",
        "Maintain clean bund channels to channel excessive runoff away from root-sensitive crops.",
        "Inspect underside of leaves for post-rain fungal spores and caterpillar emergence."
    ]
    if temp > 36.0:
        crop_tips.append("Apply organic straw mulch around crop basins to minimize soil moisture evaporation.")

    agromet_advisory = {
        "spraySafetyStatus": spray_status,
        "spraySafetyReason": spray_reason,
        "safeWindow": safe_window,
        "fieldDrainageStatus": drainage_status,
        "drainageActionRequired": drainage_needed,
        "cropManagementTips": crop_tips
    }

    return {
        "authority": authority,
        "isImd": in_india,
        "regionName": "National Meteorological Grid",
        "alertLevel": alert_level,
        "alertTitle": alert_title,
        "colorHex": color_hex,
        "bulletinSummary": bulletin_summary,
        "detailedAdvisory": detailed_advisory,
        "validUntil": "Next 24 Hours",
        "agromet": agromet_advisory,
        "cpcbNaqi": {
            "index": cpcb["index"],
            "category": cpcb["category"],
            "primaryPollutant": cpcb["primaryPollutant"],
            "healthAdvisory": cpcb["healthAdvisory"],
            "outdoorCardioPermitted": cpcb["outdoorCardioPermitted"],
            "sensitiveGroupNotice": cpcb["sensitiveGroupNotice"]
        }
    }
