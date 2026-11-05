from typing import List, Dict, Any

def evaluate_decision_windows(
    current: Dict[str, Any],
    hourly: Dict[str, Any],
    daily: Dict[str, Any],
    cpcb: Dict[str, Any]
) -> List[Dict[str, Any]]:
    temp = float(current.get("temperature_2m", 25.0) if current.get("temperature_2m") is not None else 25.0)
    feels_like = float(current.get("apparent_temperature", temp) if current.get("apparent_temperature") is not None else temp)
    humidity = int(current.get("relative_humidity_2m", 50) if current.get("relative_humidity_2m") is not None else 50)
    wind_speed = float(current.get("wind_speed_10m", 10.0) if current.get("wind_speed_10m") is not None else 10.0)
    wind_gusts = float(current.get("wind_gusts_10m", 15.0) if current.get("wind_gusts_10m") is not None else 15.0)
    weather_code = int(current.get("weather_code", 0) if current.get("weather_code") is not None else 0)
    uv_index = float(current.get("uv_index", 5.0) if current.get("uv_index") is not None else 5.0)
    cloud_cover = int(current.get("cloud_cover", 20) if current.get("cloud_cover") is not None else 20)
    is_day = current.get("is_day", 1) == 1
    aqi = int(cpcb.get("index", 60) if cpcb.get("index") is not None else 60)
    pm25 = float(cpcb.get("pm2_5", 25.0) if cpcb.get("pm2_5") is not None else 25.0)

    # Precipitation forecast in upcoming 12 hours
    raw_probs = hourly.get("precipitation_probability") or ([0] * 12)
    precip_probs = [int(p) for p in raw_probs[:12] if p is not None]
    raw_amounts = hourly.get("precipitation") or ([0.0] * 12)
    precip_amounts = [float(a) for a in raw_amounts[:12] if a is not None]
    max_rain_prob_12h = max(precip_probs) if precip_probs else 0
    total_rain_12h = sum(precip_amounts) if precip_amounts else 0.0

    decisions = []

    def make_entry(
        act_id: str,
        title: str,
        category: str,
        score: int,
        best_window: str,
        description: str,
        factors: List[str],
        icon: str
    ) -> Dict[str, Any]:
        score = max(5, min(100, score))
        if score >= 80:
            status = "Optimal"
            color = "emerald"
        elif score >= 60:
            status = "Moderate"
            color = "amber"
        elif score >= 40:
            status = "Caution"
            color = "orange"
        else:
            status = "Unfavorable"
            color = "rose"
            
        return {
            "id": act_id,
            "title": title,
            "category": category,
            "status": status,
            "statusColor": color,
            "suitabilityScore": score,
            "bestTimeWindow": best_window,
            "description": description,
            "atmosphericFactors": factors,
            "icon": icon
        }

    # 1. Outdoor Wedding / Event
    score_wedding = 95
    if max_rain_prob_12h > 40: score_wedding -= 40
    elif max_rain_prob_12h > 20: score_wedding -= 20
    if wind_speed > 25: score_wedding -= 25
    if temp > 36 or temp < 12: score_wedding -= 20
    if humidity > 80: score_wedding -= 10
    if aqi > 200: score_wedding -= 15
    decisions.append(make_entry(
        "wedding",
        "Outdoor Wedding & Gala",
        "lifestyle",
        score_wedding,
        "16:30 - 21:00" if score_wedding > 50 else "Indoor Covered Hall Recommended",
        f"Rain risk {max_rain_prob_12h}% with {wind_speed:.1f} km/h breezes. Guest thermal comfort is {'favorable' if 20 <= temp <= 32 else 'strained'} with {humidity}% humidity.",
        [f"Precipitation: {max_rain_prob_12h}%", f"Wind: {wind_speed:.1f} km/h", f"Temp: {temp:.1f}°C"],
        "PartyPopper"
    ))

    # 2. Agricultural Spraying (Pesticide/Fertilizer)
    # IMD Agromet rule: Hold if rain >35% or wind >15 km/h
    score_spray = 95
    if wind_speed > 15: score_spray -= 50
    elif wind_speed > 12: score_spray -= 20
    if max_rain_prob_12h > 35: score_spray -= 50
    elif max_rain_prob_12h > 20: score_spray -= 20
    if temp > 35: score_spray -= 15  # rapid evaporation
    spray_window = "06:00 - 09:00 AM" if score_spray >= 60 else "Spray Hold Active (High Drift/Wash-off)"
    decisions.append(make_entry(
        "agri_spray",
        "Pesticide & Foliar Spray",
        "agriculture",
        score_spray,
        spray_window,
        f"Wind at {wind_speed:.1f} km/h (threshold 15 km/h) and {max_rain_prob_12h}% rain probability dictate chemical adherence and drift containment.",
        [f"Drift Risk: {'Low' if wind_speed <= 12 else 'High'}", f"Washout Risk: {max_rain_prob_12h}%", f"Wind: {wind_speed:.1f} km/h"],
        "Sprout"
    ))

    # 3. Field Irrigation & Drainage
    score_drainage = 85
    if total_rain_12h > 20 or max_rain_prob_12h > 60:
        score_drainage = 30
        drain_desc = f"Excess precipitation ({total_rain_12h:.1f} mm) impending. Cease irrigation and open bund channels for drainage."
        drain_win = "Hold Irrigation • Clear Drains"
    else:
        drain_desc = f"Moderate evapotranspiration rate. Soil moisture depletion manageable with morning furrow irrigation."
        drain_win = "05:30 - 08:30 AM"
    decisions.append(make_entry(
        "irrigation",
        "Irrigation & Drainage Management",
        "agriculture",
        score_drainage,
        drain_win,
        drain_desc,
        [f"Incoming Rain: {total_rain_12h:.1f} mm", f"Evaporative Demand: {'High' if temp > 32 else 'Moderate'}"],
        "Droplets"
    ))

    # 4. Daily Commute & Driving
    score_commute = 90
    if weather_code in [45, 48]: score_commute -= 45 # Fog
    if max_rain_prob_12h > 60 or weather_code in [63, 65, 82]: score_commute -= 35
    if wind_gusts > 50: score_commute -= 25
    decisions.append(make_entry(
        "commute",
        "Daily Commute & Highway Transit",
        "travel",
        score_commute,
        "Off-Peak Hours (10:30 - 15:30)",
        f"Surface visibility and braking friction impacted by {'fog/mist' if weather_code in [45,48] else 'road wetness' if max_rain_prob_12h > 40 else 'dry, clear asphalt'}.",
        [f"Visibility: {'Reduced' if weather_code in [45,48] else 'High'}", f"Traction: {'Wet' if total_rain_12h > 1 else 'Dry'}"],
        "Car"
    ))

    # 5. Laundry Outdoor Drying
    score_laundry = 95
    if max_rain_prob_12h > 30: score_laundry -= 50
    if humidity > 75: score_laundry -= 30
    elif humidity > 60: score_laundry -= 15
    if cloud_cover > 70: score_laundry -= 20
    if temp < 16: score_laundry -= 15
    if wind_speed >= 8 and wind_speed <= 25 and humidity < 65 and max_rain_prob_12h <= 20: score_laundry += 10
    decisions.append(make_entry(
        "laundry",
        "Outdoor Laundry & Fabric Drying",
        "lifestyle",
        score_laundry,
        "10:00 - 15:30" if score_laundry >= 50 else "Indoor Rack Recommended",
        f"Vapor pressure deficit {'promotes rapid drying' if humidity < 60 and cloud_cover < 50 else 'slows evaporation'} with {humidity}% relative humidity and {wind_speed:.1f} km/h breeze.",
        [f"Humidity: {humidity}%", f"Solar Radiation: {'Direct' if cloud_cover < 40 else 'Diffused'}", f"Rain Chance: {max_rain_prob_12h}%"],
        "Shirt"
    ))

    # 6. Morning Jogging / Running
    score_run = 90
    if aqi > 200: score_run -= 45
    elif aqi > 100: score_run -= 20
    if temp > 32 or feels_like > 34: score_run -= 30
    if humidity > 85: score_run -= 20
    if max_rain_prob_12h > 60: score_run -= 35
    decisions.append(make_entry(
        "running",
        "Morning Jogging & Cardio",
        "fitness",
        score_run,
        "05:45 - 07:30 AM",
        f"Cardiorespiratory strain is {'minimal' if score_run >= 75 else 'elevated'} under AQI {aqi} ({cpcb.get('category','Moderate')}) and wet-bulb temperature of {round(temp - ((100-humidity)/5),1)}°C.",
        [f"CPCB AQI: {aqi}", f"Heat Stress: {'Low' if temp < 28 else 'Moderate'}", f"Precipitation: {max_rain_prob_12h}%"],
        "Footprints"
    ))

    # 7. Cycling & Biking
    score_bike = 88
    if wind_speed > 25: score_bike -= 35
    if max_rain_prob_12h > 45: score_bike -= 30
    if aqi > 250: score_bike -= 25
    decisions.append(make_entry(
        "cycling",
        "Road Cycling & Commuter Biking",
        "fitness",
        score_bike,
        "06:30 - 09:00 AM",
        f"Crosswind drag of {wind_speed:.1f} km/h and road surface grip allow {'efficient cadence' if score_bike >= 70 else 'caution on turns'}.",
        [f"Headwind: {wind_speed:.1f} km/h", f"Road Friction: {'Normal' if max_rain_prob_12h < 30 else 'Slick'}"],
        "Bike"
    ))

    # 8. Construction & Outdoor Labor
    score_labor = 85
    if temp > 40: score_labor -= 45
    elif temp > 35: score_labor -= 25
    if total_rain_12h > 15: score_labor -= 40
    if wind_gusts > 45: score_labor -= 30
    decisions.append(make_entry(
        "construction",
        "Construction & Heavy Outdoor Labor",
        "outdoor",
        score_labor,
        "06:00 - 11:30 AM",
        f"Wet bulb globe temperature and solar load dictate {'mandatory hydration cycles' if temp > 34 else 'standard working tempo'}.",
        [f"Thermal Stress: {'High' if temp > 36 else 'Safe'}", f"Rain Interruption: {max_rain_prob_12h}%"],
        "HardHat"
    ))

    # 9. Solar Power Generation
    score_solar = int(max(10, min(100, 100 - (cloud_cover * 0.7) - (30 if max_rain_prob_12h > 50 else 0))))
    decisions.append(make_entry(
        "solar",
        "Photovoltaic Solar Generation",
        "lifestyle",
        score_solar,
        "10:30 - 15:00",
        f"Insolation efficiency at {score_solar}% with {cloud_cover}% cloud optical depth and clean atmospheric transmittance.",
        [f"Cloud Attenuation: {cloud_cover}%", f"Peak Sun Hours: {'4.8h' if cloud_cover < 30 else '2.2h'}"],
        "Sun"
    ))

    # 10. Stargazing & Astronomical Observation
    score_astro = 90
    if cloud_cover > 30: score_astro -= int(cloud_cover * 0.8)
    if humidity > 80: score_astro -= 20
    if aqi > 200: score_astro -= 25
    decisions.append(make_entry(
        "stargazing",
        "Night Sky Stargazing & Astronomy",
        "lifestyle",
        score_astro,
        "21:30 - 02:00",
        f"Atmospheric transparency influenced by {cloud_cover}% cloud cover, particulate haze (AQI {aqi}), and tropospheric moisture scintillation.",
        [f"Sky Clarity: {'Pristine' if cloud_cover < 20 else 'Hazy'}", f"Particulate Scattering: {'Low' if aqi < 100 else 'Elevated'}"],
        "Sparkles"
    ))

    # 11. Drone Flight & Aerial Filming
    score_drone = 92
    if wind_gusts > 30: score_drone -= 50
    elif wind_speed > 20: score_drone -= 25
    if max_rain_prob_12h > 30: score_drone -= 40
    if weather_code in [45, 48]: score_drone -= 35
    decisions.append(make_entry(
        "drone",
        "UAV Drone Filming & Survey",
        "outdoor",
        score_drone,
        "07:00 - 10:30 AM",
        f"Turbulence eddy dissipation and wind shear at {wind_gusts:.1f} km/h gusts provide {'stable gimbal tracking' if score_drone >= 70 else 'reduced battery endurance'}.",
        [f"Max Gusts: {wind_gusts:.1f} km/h", f"Rain Interruption: {max_rain_prob_12h}%"],
        "Plane"
    ))

    # 12. Open-Air Dining & Barbecue
    score_bbq = 90
    if max_rain_prob_12h > 35: score_bbq -= 40
    if wind_speed > 20: score_bbq -= 25
    if temp > 34 or temp < 14: score_bbq -= 20
    decisions.append(make_entry(
        "dining",
        "Open-Air Dining & Rooftop Cafe",
        "lifestyle",
        score_bbq,
        "18:30 - 22:30",
        f"Pleasant ambient temperatures ({temp:.1f}°C) and mild breezes create {'cozy open-air seating' if score_bbq >= 70 else 'need for overhead canopies'}.",
        [f"Temperature: {temp:.1f}°C", f"Wind: {wind_speed:.1f} km/h"],
        "Utensils"
    ))

    # 13. Asthma & Respiratory Outdoor Safety
    score_asthma = 95
    if aqi > 300: score_asthma -= 60
    elif aqi > 200: score_asthma -= 40
    elif aqi > 100: score_asthma -= 20
    if humidity > 85: score_asthma -= 15
    if temp < 10: score_asthma -= 15
    decisions.append(make_entry(
        "asthma",
        "Asthma & Respiratory Safety",
        "outdoor",
        score_asthma,
        "11:00 - 16:00 (Post-Inversion Dispersion)" if score_asthma < 70 else "All Day Safe",
        f"PM2.5 concentration at {pm25} µg/m³ with CPCB NAQI {aqi}. Boundary-layer thermal inversion {'traps pollutants' if aqi > 150 else 'allows clean air circulation'}.",
        [f"NAQI: {aqi} ({cpcb.get('category','Moderate')})", f"Mask: {'Recommended' if aqi > 200 else 'Optional'}"],
        "ShieldAlert"
    ))

    # 14. High-Speed Transit & Flight
    score_flight = 95
    if weather_code in [95, 96, 99]: score_flight -= 60
    if weather_code in [45, 48]: score_flight -= 40
    if wind_gusts > 50: score_flight -= 30
    decisions.append(make_entry(
        "flight",
        "Commercial Flight & Express Rails",
        "travel",
        score_flight,
        "On-Schedule Operations",
        f"No low-level wind shear or severe microburst convective cells detected along primary ascent vectors.",
        [f"Convection: {'Clear' if weather_code < 80 else 'Active'}", f"Crosswinds: {wind_speed:.1f} km/h"],
        "Compass"
    ))

    # 15. Swimming & Pool Time
    score_swim = 85
    if temp < 24: score_swim -= 40
    if weather_code in [95, 96, 99]: score_swim -= 70
    if max_rain_prob_12h > 50: score_swim -= 30
    if uv_index > 9: score_swim -= 15
    decisions.append(make_entry(
        "swimming",
        "Outdoor Swimming & Pool",
        "fitness",
        score_swim,
        "15:00 - 18:00",
        f"Water thermal equilibrium supported by {temp:.1f}°C ambient warmth with {'safe lightning profile' if weather_code < 95 else 'lightning hazard'}.",
        [f"Ambient Temp: {temp:.1f}°C", f"UV Index: {uv_index:.1f}"],
        "Waves"
    ))

    # 16. Pet Walking
    score_pet = 90
    if temp > 35: score_pet -= 45 # hot pavement burns paws
    elif temp > 32: score_pet -= 25
    if max_rain_prob_12h > 60: score_pet -= 30
    if aqi > 250: score_pet -= 20
    decisions.append(make_entry(
        "pet_walk",
        "Dog & Pet Walking",
        "lifestyle",
        score_pet,
        "06:30 - 08:30 AM or 18:00 - 20:00",
        f"Asphalt surface heat is {'safe for paw pads' if temp < 31 else 'elevated - walk on grassy verges'} with {temp:.1f}°C ambient temp.",
        [f"Ground Heat: {'Comfortable' if temp < 30 else 'High'}", f"Puddle Risk: {'Low' if total_rain_12h < 1 else 'Wet'}"],
        "HeartPulse"
    ))

    # 17. Car Washing
    score_carwash = 90
    if max_rain_prob_12h > 35: score_carwash -= 55
    if aqi > 250: score_carwash -= 25 # dust settlement
    decisions.append(make_entry(
        "car_wash",
        "Vehicle Detailing & Washing",
        "lifestyle",
        score_carwash,
        "08:00 - 11:00 AM",
        f"Zero immediate precipitation ensures chemical wax seal will cure without mineral water spotting.",
        [f"Rain Next 24h: {max_rain_prob_12h}%", f"Dust Deposition: {'Low' if aqi < 150 else 'Moderate'}"],
        "Sparkle"
    ))

    # 18. Boating / Water Sports
    score_boat = 88
    if wind_gusts > 35: score_boat -= 45
    if weather_code in [95, 96, 99]: score_boat -= 60
    if total_rain_12h > 10: score_boat -= 30
    decisions.append(make_entry(
        "boating",
        "Inland Boating & Kayaking",
        "outdoor",
        score_boat,
        "07:30 - 11:30 AM",
        f"Surface chop and hydrodynamics governed by {wind_speed:.1f} km/h currents with negligible wave cresting.",
        [f"Wind Waves: {'Calm' if wind_speed < 15 else 'Choppy'}", f"Squall Threat: {'None' if weather_code < 80 else 'Active'}"],
        "Anchor"
    ))

    # 19. Senior Morning Walk
    score_senior = 92
    if aqi > 180: score_senior -= 40
    if temp < 14 or temp > 33: score_senior -= 30
    if weather_code in [45, 48]: score_senior -= 25
    if max_rain_prob_12h > 40: score_senior -= 30
    decisions.append(make_entry(
        "senior_walk",
        "Senior Citizen Promenade",
        "fitness",
        score_senior,
        "06:30 - 08:00 AM",
        f"Gentle thermal profile ({temp:.1f}°C) and stable footpath footing minimize joint stiffness and slip hazards.",
        [f"Air Cleanliness: {'Acceptable' if aqi < 150 else 'Caution'}", f"Footing: {'Dry' if total_rain_12h < 0.5 else 'Slick'}"],
        "Smile"
    ))

    # 20. Golden Hour Photography
    score_photo = 85
    if cloud_cover > 80: score_photo -= 40
    elif cloud_cover < 10: score_photo -= 10 # boring sky
    if weather_code in [63, 65, 82]: score_photo -= 35
    decisions.append(make_entry(
        "photography",
        "Golden Hour Photography",
        "lifestyle",
        score_photo,
        "17:45 - 18:45 (Golden & Blue Hour)",
        f"Rayleigh scattering and light-scattering aerosol depth provide warm, dramatic horizon illumination.",
        [f"Cloud Diffusion: {cloud_cover}%", f"Aerosol Glow: {'Luminous' if 10 <= cloud_cover <= 60 else 'Overcast'}"],
        "Camera"
    ))

    return decisions
