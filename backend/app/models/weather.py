from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Location(BaseModel):
    name: str
    formattedAddress: str
    latitude: float
    longitude: float
    timezone: str = "UTC"
    placeId: Optional[str] = None
    country: Optional[str] = None
    countryCode: Optional[str] = None
    state: Optional[str] = None

class CurrentWeather(BaseModel):
    temperature: float
    feelsLike: float
    humidity: int
    weatherCode: int
    weatherDescription: str
    windSpeed: float
    windDirection: int
    windGusts: Optional[float] = 0.0
    pressure: float
    uvIndex: float
    cloudCover: int
    isDay: bool
    precipitation: float
    dewPoint: Optional[float] = None

class HourlyForecastItem(BaseModel):
    time: str
    temperature: float
    apparentTemperature: float
    humidity: int
    precipitationProbability: int
    precipitation: float
    weatherCode: int
    weatherDescription: str
    windSpeed: float
    windDirection: int
    uvIndex: float

class DailyForecastItem(BaseModel):
    date: str
    weatherCode: int
    weatherDescription: str
    tempMax: float
    tempMin: float
    apparentTempMax: float
    apparentTempMin: float
    precipitationSum: float
    precipitationProbabilityMax: int
    windSpeedMax: float
    uvIndexMax: float
    sunrise: str
    sunset: str

class AirQualityData(BaseModel):
    aqi: int
    category: str  # Good, Satisfactory, Moderate, Poor, Very Poor, Severe
    color: str     # Hex or Tailwind color
    pm2_5: float
    pm10: float
    co: Optional[float] = None
    no2: Optional[float] = None
    so2: Optional[float] = None
    o3: Optional[float] = None
    respiratoryHealthAdvice: str
    maskRecommended: bool

class RetrospectiveComparison(BaseModel):
    tempDelta24h: float
    tempComparisonText: str
    rainAccumulationPast72h: float
    rainForecastNext48h: float
    pressureTendency: str  # Rising, Steady, Falling
    atmosphericSummary: str

class ConfidenceConsensus(BaseModel):
    score: int  # 0 - 100
    level: str  # Very High, High, Moderate, Low
    modelAgreement: str
    atmosphericDrivers: str
