import httpx
from typing import List, Dict, Any, Optional

POPULAR_CITIES = [
    {"name": "New Delhi", "formattedAddress": "New Delhi, Delhi, India", "latitude": 28.6139, "longitude": 77.2090, "timezone": "Asia/Kolkata", "country": "India", "state": "Delhi"},
    {"name": "Mumbai", "formattedAddress": "Mumbai, Maharashtra, India", "latitude": 19.0760, "longitude": 72.8777, "timezone": "Asia/Kolkata", "country": "India", "state": "Maharashtra"},
    {"name": "Bengaluru", "formattedAddress": "Bengaluru, Karnataka, India", "latitude": 12.9716, "longitude": 77.5946, "timezone": "Asia/Kolkata", "country": "India", "state": "Karnataka"},
    {"name": "Hyderabad", "formattedAddress": "Hyderabad, Telangana, India", "latitude": 17.3850, "longitude": 78.4867, "timezone": "Asia/Kolkata", "country": "India", "state": "Telangana"},
    {"name": "Chennai", "formattedAddress": "Chennai, Tamil Nadu, India", "latitude": 13.0827, "longitude": 80.2707, "timezone": "Asia/Kolkata", "country": "India", "state": "Tamil Nadu"},
    {"name": "Kolkata", "formattedAddress": "Kolkata, West Bengal, India", "latitude": 22.5726, "longitude": 88.3639, "timezone": "Asia/Kolkata", "country": "India", "state": "West Bengal"},
    {"name": "Kochi", "formattedAddress": "Kochi, Kerala, India", "latitude": 9.9312, "longitude": 76.2673, "timezone": "Asia/Kolkata", "country": "India", "state": "Kerala"},
    {"name": "Ahmedabad", "formattedAddress": "Ahmedabad, Gujarat, India", "latitude": 23.0225, "longitude": 72.5714, "timezone": "Asia/Kolkata", "country": "India", "state": "Gujarat"},
    {"name": "Chandigarh", "formattedAddress": "Chandigarh, Punjab/Haryana, India", "latitude": 30.7333, "longitude": 76.7794, "timezone": "Asia/Kolkata", "country": "India", "state": "Chandigarh"},
    {"name": "Pune", "formattedAddress": "Pune, Maharashtra, India", "latitude": 18.5204, "longitude": 73.8567, "timezone": "Asia/Kolkata", "country": "India", "state": "Maharashtra"},
    {"name": "Jaipur", "formattedAddress": "Jaipur, Rajasthan, India", "latitude": 26.9124, "longitude": 75.7873, "timezone": "Asia/Kolkata", "country": "India", "state": "Rajasthan"},
    {"name": "Meerut", "formattedAddress": "Meerut, Uttar Pradesh, India", "latitude": 28.9845, "longitude": 77.7064, "timezone": "Asia/Kolkata", "country": "India", "state": "Uttar Pradesh"},
    {"name": "Lucknow", "formattedAddress": "Lucknow, Uttar Pradesh, India", "latitude": 26.8467, "longitude": 80.9462, "timezone": "Asia/Kolkata", "country": "India", "state": "Uttar Pradesh"},
    {"name": "Varanasi", "formattedAddress": "Varanasi, Uttar Pradesh, India", "latitude": 25.3176, "longitude": 82.9739, "timezone": "Asia/Kolkata", "country": "India", "state": "Uttar Pradesh"},
    {"name": "Agra", "formattedAddress": "Agra, Uttar Pradesh, India", "latitude": 27.1767, "longitude": 78.0081, "timezone": "Asia/Kolkata", "country": "India", "state": "Uttar Pradesh"},
    {"name": "Patna", "formattedAddress": "Patna, Bihar, India", "latitude": 25.5941, "longitude": 85.1376, "timezone": "Asia/Kolkata", "country": "India", "state": "Bihar"},
    {"name": "Bhopal", "formattedAddress": "Bhopal, Madhya Pradesh, India", "latitude": 23.2599, "longitude": 77.4126, "timezone": "Asia/Kolkata", "country": "India", "state": "Madhya Pradesh"},
    {"name": "Indore", "formattedAddress": "Indore, Madhya Pradesh, India", "latitude": 22.7196, "longitude": 75.8577, "timezone": "Asia/Kolkata", "country": "India", "state": "Madhya Pradesh"},
    {"name": "Surat", "formattedAddress": "Surat, Gujarat, India", "latitude": 21.1702, "longitude": 72.8311, "timezone": "Asia/Kolkata", "country": "India", "state": "Gujarat"},
    {"name": "Nagpur", "formattedAddress": "Nagpur, Maharashtra, India", "latitude": 21.1458, "longitude": 79.0882, "timezone": "Asia/Kolkata", "country": "India", "state": "Maharashtra"},
    {"name": "Dehradun", "formattedAddress": "Dehradun, Uttarakhand, India", "latitude": 30.3165, "longitude": 78.0322, "timezone": "Asia/Kolkata", "country": "India", "state": "Uttarakhand"},
    {"name": "Shimla", "formattedAddress": "Shimla, Himachal Pradesh, India", "latitude": 31.1048, "longitude": 77.1734, "timezone": "Asia/Kolkata", "country": "India", "state": "Himachal Pradesh"},
    {"name": "Amritsar", "formattedAddress": "Amritsar, Punjab, India", "latitude": 31.6340, "longitude": 74.8723, "timezone": "Asia/Kolkata", "country": "India", "state": "Punjab"},
    {"name": "Srinagar", "formattedAddress": "Srinagar, Jammu and Kashmir, India", "latitude": 34.0837, "longitude": 74.7973, "timezone": "Asia/Kolkata", "country": "India", "state": "Jammu and Kashmir"},
    {"name": "Guwahati", "formattedAddress": "Guwahati, Assam, India", "latitude": 26.1445, "longitude": 91.7362, "timezone": "Asia/Kolkata", "country": "India", "state": "Assam"},
    {"name": "Goa", "formattedAddress": "Panaji, Goa, India", "latitude": 15.4909, "longitude": 73.8278, "timezone": "Asia/Kolkata", "country": "India", "state": "Goa"},
    {"name": "Noida", "formattedAddress": "Noida, Uttar Pradesh, India", "latitude": 28.5355, "longitude": 77.3910, "timezone": "Asia/Kolkata", "country": "India", "state": "Uttar Pradesh"},
    {"name": "Gurugram", "formattedAddress": "Gurugram, Haryana, India", "latitude": 28.4595, "longitude": 77.0266, "timezone": "Asia/Kolkata", "country": "India", "state": "Haryana"},
    {"name": "London", "formattedAddress": "London, Greater London, United Kingdom", "latitude": 51.5074, "longitude": -0.1278, "timezone": "Europe/London", "country": "United Kingdom", "state": "England"},
    {"name": "New York", "formattedAddress": "New York, NY, United States", "latitude": 40.7128, "longitude": -74.0060, "timezone": "America/New_York", "country": "United States", "state": "New York"},
    {"name": "Tokyo", "formattedAddress": "Tokyo, Japan", "latitude": 35.6762, "longitude": 139.6503, "timezone": "Asia/Tokyo", "country": "Japan", "state": "Tokyo"},
    {"name": "Dubai", "formattedAddress": "Dubai, United Arab Emirates", "latitude": 25.2048, "longitude": 55.2708, "timezone": "Asia/Dubai", "country": "United Arab Emirates", "state": "Dubai"}
]

GEO_CACHE: Dict[str, Any] = {}

async def search_locations(query: str) -> List[Dict[str, Any]]:
    query_clean = query.strip().lower()
    if not query_clean:
        return POPULAR_CITIES[:6]

    if query_clean in GEO_CACHE:
        return GEO_CACHE[query_clean]

    # Fast-path exact city match from POPULAR_CITIES
    exact_match = [c for c in POPULAR_CITIES if query_clean == c["name"].lower()]
    if exact_match:
        GEO_CACHE[query_clean] = exact_match
        return exact_match

    # Check local city matches for instant fallback
    local_matches = [
        c for c in POPULAR_CITIES 
        if query_clean in c["name"].lower() or query_clean in c["formattedAddress"].lower()
    ]

    try:
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            "q": query,
            "format": "jsonv2",
            "addressdetails": 1,
            "limit": 8
        }
        headers = {"User-Agent": "mosam.AI-Geocoding/1.0 (contact@mosam.ai)"}

        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(url, params=params, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                results = []
                for item in data:
                    addr = item.get("address", {})
                    city_name = addr.get("city") or addr.get("town") or addr.get("village") or addr.get("state_district") or item.get("name", "Unknown")
                    country = addr.get("country", "")
                    state = addr.get("state", "")
                    display_name = item.get("display_name", "")
                    
                    results.append({
                        "name": city_name,
                        "formattedAddress": display_name,
                        "latitude": float(item["lat"]),
                        "longitude": float(item["lon"]),
                        "timezone": "auto",
                        "placeId": str(item.get("place_id", "")),
                        "country": country,
                        "countryCode": addr.get("country_code", "").upper(),
                        "state": state
                    })
                if results:
                    GEO_CACHE[query_clean] = results
                    return results
    except Exception:
        pass

    if local_matches:
        return local_matches
    return POPULAR_CITIES[:5]

async def reverse_geocode(lat: float, lon: float) -> Dict[str, Any]:
    cache_key = f"rev_{round(lat, 4)}_{round(lon, 4)}"
    if cache_key in GEO_CACHE:
        return GEO_CACHE[cache_key]

    try:
        url = "https://nominatim.openstreetmap.org/reverse"
        params = {
            "lat": lat,
            "lon": lon,
            "format": "jsonv2",
            "addressdetails": 1
        }
        headers = {"User-Agent": "mosam.AI-Geocoding/1.0 (contact@mosam.ai)"}
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(url, params=params, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                addr = data.get("address", {})
                city_name = addr.get("city") or addr.get("town") or addr.get("village") or addr.get("state_district") or addr.get("county") or "Local Area"
                res = {
                    "name": city_name,
                    "formattedAddress": data.get("display_name", f"{lat:.2f}, {lon:.2f}"),
                    "latitude": lat,
                    "longitude": lon,
                    "timezone": "auto",
                    "placeId": str(data.get("place_id", "")),
                    "country": addr.get("country", ""),
                    "countryCode": addr.get("country_code", "").upper(),
                    "state": addr.get("state", "")
                }
                GEO_CACHE[cache_key] = res
                return res
    except Exception:
        pass

    # Fallback to closest popular city or coordinate descriptor
    return {
        "name": f"Location ({lat:.2f}°, {lon:.2f}°)",
        "formattedAddress": f"Latitude {lat:.4f}, Longitude {lon:.4f}",
        "latitude": lat,
        "longitude": lon,
        "timezone": "auto",
        "placeId": f"{lat}_{lon}",
        "country": "India" if (6.0 <= lat <= 38.0 and 68.0 <= lon <= 98.0) else "Global"
    }
