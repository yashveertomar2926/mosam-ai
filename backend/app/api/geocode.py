from fastapi import APIRouter, Query
from app.services.geocoding import search_locations, reverse_geocode

router = APIRouter()

@router.get("/geocode")
async def geocode(q: str = Query(..., min_length=1)):
    results = await search_locations(q)
    return {"results": results}

@router.get("/reverse-geocode")
async def rev_geocode(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0)
):
    result = await reverse_geocode(lat, lon)
    return result
