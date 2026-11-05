from fastapi import APIRouter
from app.models.chat import ChatRequest, ChatResponse
from app.services.gemini_client import generate_gemini_response
from app.services.nlg_engine import generate_nlg_response
from app.services.location_detector import detect_target_location
from app.services.meteo_client import fetch_weather_raw
from app.services.bulletin_engine import evaluate_cpcb_naqi, generate_bulletin
from app.services.consensus_engine import compute_retrospective_and_consensus

router = APIRouter()

SUGGESTIONS_BY_LANG = {
    "en": [
        "Can I spray pesticide/fertilizer today?",
        "Is it safe for an outdoor wedding?",
        "What should I wear for comfort today?",
        "How is the asthma & air quality risk?",
        "Compare today's weather with yesterday"
    ],
    "hi": [
        "क्या आज फसलों पर कीटनाशक छिड़कना सुरक्षित है?",
        "क्या आज बाहर शादी या पार्टी का आयोजन हो सकता है?",
        "आज के मौसम में क्या पहनना ठीक रहेगा?",
        "दमा (अस्थमा) और वायु प्रदूषण का क्या स्तर है?",
        "कल की तुलना में आज मौसम कैसा है?"
    ],
    "te": [
        "ఈ రోజు పురుగుమందులు పిచికారీ చేయవచ్చా?",
        "బహిరంగ వివాహ వేడుకలకు వాతావరణం అనుకూలమా?",
        "ఆస్తమా రోగులకు గాలి నాణ్యత ఎలా ఉంది?",
        "నిన్నటితో పోలిస్తే నేటి వాతావరణం ఎలా ఉంది?"
    ],
    "ta": [
        "இன்று பயிர்களுக்கு பூச்சிக்கொல்லி மருந்து தெளிக்கலாமா?",
        "திறந்தவெளியில் சுபநிகழ்ச்சி நடத்த வானிலை சாதகமா?",
        "இன்று அணிய வேண்டிய ஆடை பரிந்துரை என்ன?",
        "ஆஸ்துமா மற்றும் காற்றுத் தரம் எவ்வாறு உள்ளது?"
    ],
    "mr": [
        "आज पिकांवर कीटकनाशक फवारणी सुरक्षित आहे का?",
        "आज मैदानी लग्नसमारंभासाठी हवामान योग्य आहे का?",
        "दमा आणि हवेच्या प्रदूषणाचा काय धोका आहे?",
        "कालच्या तुलनेत आजच्या हवामानात काय फरक आहे?"
    ],
    "bn": [
        "আজ জমিতে কীটনাশক বা সার স্প্রে করা কি নিরাপদ?",
        "বাইরে বিয়ের অনুষ্ঠানের জন্য আবহাওয়া কেমন থাকবে?",
        "অ্যাজমা ও বায়ুর গুণমান সূচকের ঝুঁকি কেমন?",
        "গতকালের তুলনায় আজকের আবহাওয়া কেমন?"
    ],
    "ml": [
        "ഇന്ന് കീടനാശിനി പ്രയോഗം സുരക്ഷിതമാണോ?",
        "പുറംവേദിയിലെ പരിപാടികൾക്ക് കാലാവസ്ഥ അനുകൂലമാണോ?",
        "വായു മലിനീകരണവും ആസ്ത്മ മുന്നറിയിപ്പും എങ്ങനെ?",
        "ഇന്നലെയുമായി താരതമ്യം ചെയ്യുമ്പോൾ ഇന്നത്തെ അവസ്ഥ എന്താണ്?"
    ]
}

@router.post("/chat", response_model=ChatResponse)
async def chat_weather(req: ChatRequest):
    default_location_name = req.location.get("name", "Current Location")
    lat = float(req.location.get("latitude", 28.6139))
    lon = float(req.location.get("longitude", 77.2090))
    lang = req.language if req.language in ["en", "hi", "te", "ta", "mr", "bn", "ml"] else "en"

    # 1. Inspect user query for dynamic target location or GPS
    target_loc, target_ctx, is_switched, is_gps = await detect_target_location(req.message, req.location)

    if is_switched and target_loc and target_ctx:
        active_location_name = target_loc["name"]
        active_weather_ctx = target_ctx
        asked_location = target_loc
    else:
        active_location_name = default_location_name
        asked_location = None

        # Build default context if not provided
        weather_ctx = req.weatherContext
        if not weather_ctx:
            raw = await fetch_weather_raw(lat, lon)
            forecast = raw.get("forecast", {})
            air = raw.get("air_quality", {})
            cpcb = evaluate_cpcb_naqi(air)
            bulletin = generate_bulletin(lat, lon, forecast.get("current", {}), forecast.get("daily", {}), forecast.get("hourly", {}), cpcb)
            retro, consensus = compute_retrospective_and_consensus(forecast)
            weather_ctx = {
                "current": forecast.get("current", {}),
                "daily": forecast.get("daily", {}),
                "hourly": forecast.get("hourly", {}),
                "governmentBulletin": bulletin,
                "retrospective": retro,
                "airQuality": cpcb,
                "confidence": consensus
            }
        active_weather_ctx = weather_ctx

    # 2. Attempt Gemini 2.5 Flash
    gemini_reply = await generate_gemini_response(
        user_message=req.message,
        location_name=active_location_name,
        weather_ctx=active_weather_ctx,
        language=lang,
        history=req.history,
        is_location_switched=is_switched,
        target_location=asked_location,
        requested_gps=is_gps
    )

    if gemini_reply:
        bulletin = active_weather_ctx.get("governmentBulletin", {})
        cpcb = bulletin.get("cpcbNaqi", {})
        badge = f"🏛️ IMD Alert: {bulletin.get('alertLevel', 'Green')} • 🍃 CPCB AQI: {cpcb.get('index', 60)}"
        return ChatResponse(
            reply=gemini_reply,
            language=lang,
            engine="gemini-2.5-flash",
            authorityBadge=badge,
            suggestedQuestions=SUGGESTIONS_BY_LANG.get(lang, SUGGESTIONS_BY_LANG["en"]),
            askedLocation=asked_location,
            isLocationSwitched=is_switched,
            requestedGps=is_gps
        )

    # 3. Resilient Built-in NLG Engine
    nlg_reply, badge = generate_nlg_response(
        query=req.message,
        location_name=active_location_name,
        weather_ctx=active_weather_ctx,
        language=lang,
        is_location_switched=is_switched,
        target_location=asked_location,
        requested_gps=is_gps
    )

    return ChatResponse(
        reply=nlg_reply,
        language=lang,
        engine="built-in-nlg",
        authorityBadge=badge,
        suggestedQuestions=SUGGESTIONS_BY_LANG.get(lang, SUGGESTIONS_BY_LANG["en"]),
        askedLocation=asked_location,
        isLocationSwitched=is_switched,
        requestedGps=is_gps
    )
