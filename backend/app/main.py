from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.weather import router as weather_router
from app.api.geocode import router as geocode_router
from app.api.chat import router as chat_router
from app.config import settings

app = FastAPI(
    title="mosam.AI Meteorological Engine",
    description="Atmospheric Intelligence Backend with Government Bulletins & Conversational Engine",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(weather_router, prefix="/api", tags=["Weather Intelligence"])
app.include_router(geocode_router, prefix="/api", tags=["Geocoding"])
app.include_router(chat_router, prefix="/api", tags=["Conversational AI"])

@app.get("/")
def read_root():
    return {
        "app": "mosam.AI",
        "tagline": "Don’t just see the weather. Understand it.",
        "status": "operational",
        "endpoints": ["/api/weather", "/api/geocode", "/api/reverse-geocode", "/api/chat", "/api/health"]
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "geminiConfigured": bool(settings.GEMINI_API_KEY.strip()),
        "engine": "gemini-2.5-flash + built-in-nlg-fallback",
        "governmentSources": ["India Meteorological Department (IMD)", "CPCB NAQI", "ECMWF", "GFS"]
    }
