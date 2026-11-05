from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ChatMessage(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str

class ChatRequest(BaseModel):
    message: str
    location: Dict[str, Any]
    weatherContext: Optional[Dict[str, Any]] = None
    language: str = "en"  # "en", "hi", "te", "ml"
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str
    language: str
    engine: str  # "gemini-2.5-flash" | "built-in-nlg"
    authorityBadge: str
    suggestedQuestions: List[str]
    askedLocation: Optional[Dict[str, Any]] = None
    isLocationSwitched: bool = False
    requestedGps: bool = False

