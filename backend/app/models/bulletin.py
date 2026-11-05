from pydantic import BaseModel
from typing import List, Optional

class AgrometAdvisory(BaseModel):
    spraySafetyStatus: str  # "SAFE" | "HOLD" | "CAUTION"
    spraySafetyReason: str
    safeWindow: Optional[str] = None
    fieldDrainageStatus: str
    drainageActionRequired: bool
    cropManagementTips: List[str]

class CpcbNaqi(BaseModel):
    index: int
    category: str  # Good, Satisfactory, Moderate, Poor, Very Poor, Severe
    primaryPollutant: str
    healthAdvisory: str
    outdoorCardioPermitted: bool
    sensitiveGroupNotice: str

class GovernmentBulletin(BaseModel):
    authority: str
    isImd: bool
    regionName: str
    alertLevel: str  # "Green" | "Yellow" | "Orange" | "Red"
    alertTitle: str
    colorHex: str
    bulletinSummary: str
    detailedAdvisory: str
    validUntil: str
    agromet: AgrometAdvisory
    cpcbNaqi: CpcbNaqi
