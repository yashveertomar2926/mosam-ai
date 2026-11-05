from pydantic import BaseModel
from typing import List, Optional

class WeatherDecisionWindow(BaseModel):
    id: str
    title: str
    category: str  # outdoor, agriculture, travel, fitness, lifestyle
    status: str    # Optimal, Moderate, Caution, Unfavorable
    statusColor: str  # emerald, amber, orange, rose
    suitabilityScore: int  # 0 to 100
    bestTimeWindow: str
    description: str
    atmosphericFactors: List[str]
    icon: str
