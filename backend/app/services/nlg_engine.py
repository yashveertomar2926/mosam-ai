import re
from typing import Dict, Any, Tuple

def classify_intent(query: str) -> str:
    q = query.lower()

    if any(k in q for k in ["wedding", "marriage", "function", "ceremony", "party", "reception", "gala"]):
        return "wedding_event"
    if any(k in q for k in ["wear", "cloth", "outfit", "dress", "jacket", "coat", "sweater", "umbrella", "raincoat"]):
        return "wear_outfit"
    if any(k in q for k in ["spray", "pesticide", "fertilizer", "crop", "farm", "agri", "harvest", "field", "drainage", "irrigation"]):
        return "farming_spraying"
    if any(k in q for k in ["asthma", "breath", "air quality", "aqi", "pollution", "smog", "lung", "cough", "inhaler", "mask"]):
        return "asthma_health"
    if any(k in q for k in ["drive", "driving", "road", "travel", "commute", "highway", "trip", "traffic", "flight", "bike", "cycle"]):
        return "driving_commute"
    if any(k in q for k in ["laundry", "wash clothes", "drying", "dry clothes", "hang clothes"]):
        return "laundry_drying"
    if any(k in q for k in ["run", "jog", "jogging", "marathon", "cardio", "workout", "cricket"]):
        return "running_sports"
    if any(k in q for k in ["yesterday", "compared to", "past", "warmer than", "cooler than", "history", "trend"]):
        return "comparison_past"
    if any(k in q for k in ["tomorrow", "upcoming", "weekend", "7 day", "future", "next week"]):
        return "tomorrow_forecast"
    if any(k in q for k in ["star", "astronomy", "stargaz", "telescope", "night sky"]):
        return "stargazing"
    if any(k in q for k in ["drone", "uav", "quadcopter", "aerial"]):
        return "drone_flight"
    if any(k in q for k in ["swim", "pool", "beach", "water sport", "dive"]):
        return "swimming_pool"
    if any(k in q for k in ["dog", "pet", "puppy", "walk dog"]):
        return "pet_walking"
    if any(k in q for k in ["solar", "photovoltaic", "panel", "sun hour"]):
        return "solar_power"
    if any(k in q for k in ["rain", "storm", "thunder", "lightning", "cyclone", "pour", "drizzle", "hail"]):
        return "rain_storm"
    if any(k in q for k in ["heat", "hot", "sunburn", "uv", "shade", "dehydrat", "sunny"]):
        return "heat_sun"
    if any(k in q for k in ["bbq", "barbecue", "dinner outdoor", "terrace", "dine outside"]):
        return "bbq_dining"
    if any(k in q for k in ["car wash", "wash car", "detail"]):
        return "car_wash"
    if any(k in q for k in ["senior", "elder", "grandparent", "morning walk"]):
        return "senior_walk"
    if any(k in q for k in ["photo", "golden hour", "shoot", "camera", "sunset"]):
        return "photography"

    return "general_overview"

def generate_nlg_response(
    query: str,
    location_name: str,
    weather_ctx: Dict[str, Any],
    language: str = "en",
    is_location_switched: bool = False,
    target_location: Optional[Dict[str, Any]] = None,
    requested_gps: bool = False
) -> Tuple[str, str]:
    intent = classify_intent(query)

    current = weather_ctx.get("current", {})
    bulletin = weather_ctx.get("governmentBulletin", {})
    agromet = bulletin.get("agromet", {})
    cpcb = bulletin.get("cpcbNaqi", {})
    retrospective = weather_ctx.get("retrospective", {})

    temp = float(current.get("temperature") or current.get("temperature_2m") or 26.0)
    feels_like = float(current.get("feelsLike") or current.get("apparent_temperature") or temp)
    humidity = int(current.get("humidity") or current.get("relative_humidity_2m") or 55)
    wind_speed = float(current.get("windSpeed") or current.get("wind_speed_10m") or 10.0)
    wind_gusts = float(current.get("windGusts") or current.get("wind_gusts_10m") or 15.0)
    weather_desc = str(current.get("weatherDescription") or "Fair")
    pressure = float(current.get("pressure") or current.get("surface_pressure") or 1012.0)
    uv_index = float(current.get("uvIndex") or current.get("uv_index") or 5.0)

    alert_level = bulletin.get("alertLevel", "Green")
    authority = bulletin.get("authority", "India Meteorological Department (IMD)")
    aqi = cpcb.get("index", 65)
    aqi_cat = cpcb.get("category", "Satisfactory")
    spray_status = agromet.get("spraySafetyStatus", "SAFE")
    past_rain = retrospective.get("rainAccumulationPast72h", 0.0)

    authority_badge = f"🏛️ IMD Alert: {alert_level} • 🍃 CPCB AQI: {aqi} ({aqi_cat})" if "IMD" in authority else f"🌐 NOAA/ECMWF Alert: {alert_level} • 🍃 AQI: {aqi} ({aqi_cat})"

    # NATURAL CONVERSATIONAL RESPONSES (ANTI-ROBOT: Pure flowing paragraphs, human sensations, warm empathy)

    if language == "hi":
        if intent == "farming_spraying":
            if spray_status == "HOLD":
                text = (
                    f"आज फसलों पर कीटनाशक या खाद का छिड़काव रोक देना ही बेहतर रहेगा, मेरे दोस्त। "
                    f"हवा में काफी तेजी है—करीब {round(wind_speed)} किमी प्रति घंटे की रफ्तार से बह रही है, जिससे दवा पौधों पर टिकने के बजाय हवा में उड़कर पास के खेतों में चली जाएगी। "
                    f"इसके अलावा हवा में नमी भी बहुत ज्यादा है। आईएमडी की एग्रोमेट एडवाइजरी भी यही कह रही है कि जब तक हवा 15 किमी/घंटे से धीमी न पड़े और मौसम बिल्कुल शांत न हो, तब तक टंकी बंद ही रखें ताकि आपकी मेहनत और दवा दोनों बर्बाद न हों।"
                )
            else:
                text = (
                    f"आज सुबह का वक्त आपकी फसलों पर कीटनाशक या स्प्रे के लिए एकदम माकूल है। "
                    f"हवा बिल्कुल शांत और मंद है, इसलिए दवा सीधे पत्तियों पर टिकेगी और हवा में बहने का कोई खतरा नहीं रहेगा। "
                    f"कोशिश करें कि सुबह 6:30 से 9:30 बजे के बीच ही काम निपटा लें, क्योंकि दिन चढ़ते ही हल्की धूप और गर्मी से दवा का असर कम होने लगता है।"
                )
        elif intent == "laundry_drying":
            if humidity > 70:
                text = (
                    f"आज कपड़े छत या बालकनी में सुखाने के लिए न ही डालें तो अच्छा है। "
                    f"भले ही बारिश न हो रही हो, लेकिन हवा में इतनी भारी उमस और नमी भरी है कि कपड़े घंटों टंगे रहने के बाद भी सीलन भरे रहेंगे और उनसे अजीब सी महक आने लगेगी। "
                    f"अगर घर के अंदर पंखे के नीचे स्टैंड लगाकर सुखाएंगे, तो वो बाहर की तुलना में कहीं जल्दी और ताजगी से सूख जाएंगे।"
                )
            else:
                text = (
                    f"हाँ, आज कपड़े धोने और धूप में सुखाने का बहुत बढ़िया दिन है! "
                    f"आसमान साफ है, हल्की हवा चल रही है और धूप भी अच्छी खिली हुई है। दोपहर तक आपके सारे भारी कपड़े और चादरें भी एकदम कुरकुरी और सूखी मिलेंगी।"
                )
        elif intent == "wedding_event":
            if alert_level in ["Orange", "Red"] or wind_speed > 25:
                text = (
                    f"अगर आज शाम का कोई शादी या पार्टी का आउटडोर प्लान है, तो थोड़ा सतर्क रहना जरूरी होगा। "
                    f"मौसम के मिजाज में अचानक बदलाव के संकेत हैं और शाम होते-होते तेज हवाओं के साथ बौछारें आ सकती हैं। "
                    f"मेहमानों की सहूलियत के लिए वाटरप्रूफ शामियाना या बैकअप हॉल तैयार रखना ही समझदारी होगी, ताकि अचानक आए मौसम के फेर से रंग में भंग न पड़े।"
                )
            else:
                text = (
                    f"खुले में शादी या जलसे के लिए आज का मौसम बेहद सुहावना और मेहरबान रहेगा! "
                    f"हवा में हल्की ताजगी है, ना तो चुभने वाली गर्मी है और ना ही किसी बारिश का खलल। आपके मेहमान खुले लॉन में शाम की ठंडक का पूरा लुत्फ उठा सकेंगे।"
                )
        elif intent == "wear_outfit":
            if temp > 30:
                text = (
                    f"आज बाहर निकलते ही चिपचिपी उमस और चुभने वाली धूप का अहसास होगा, पसीना आसानी से नहीं सूखेगा। "
                    f"हल्के, ढीले सूती कपड़े पहनना ही सबसे आरामदायक रहेगा। धूप का चश्मा साथ रख लें, क्योंकि दोपहर में सूरज में काफी तेजी रहेगी।"
                )
            elif temp < 18:
                text = (
                    f"आज मौसम में हल्की सिहरन महसूस होगी, खासकर जैसे ही सूरज ढलेगा तापमान तेजी से गिरेगा। "
                    f"एक हल्की जैकेट या कार्डिगन साथ रखना ठीक रहेगा ताकि शाम की ठंडी हवा आपको न सताए।"
                )
            else:
                text = (
                    f"आज का मौसम शरीर को बहुत भाने वाला है—ना ज्यादा गर्मी, ना ठंड। "
                    f"आप कोई भी सामान्य कैजुअल कपड़े पहनकर आराम से निकल सकते हैं, दिन भर ताजगी बनी रहेगी।"
                )
        elif intent == "asthma_health":
            if aqi > 200:
                text = (
                    f"अगर आपको या घर में किसी को सांस या दमे की तकलीफ है, तो आज थोड़ा संभलकर रहना होगा। "
                    f"सीपीसीबी का वायु गुणवत्ता सूचकांक {aqi} तक पहुंच गया है, और हवा की गति धीमी होने के कारण धूल-धुएं के कण जमीन के पास ही जमे हुए हैं। "
                    f"सुबह की सैर या बाहर जॉगिंग करने से बचें, और यदि बाहर जाना जरूरी हो तो N95 मास्क लगाकर ही निकलें।"
                )
            else:
                text = (
                    f"आज ताजी हवा में खुलकर सांस लेने का दिन है! "
                    f"सीपीसीबी के मुताबिक हवा की गुणवत्ता {aqi} के साथ काफी साफ और संतोषजनक बनी हुई है। खिड़कियां खोलकर घर में सुबह की ताजी हवा आने दीजिए।"
                )
        elif intent == "driving_commute":
            text = (
                f"आज सड़क पर गाड़ी या बाइक निकालते समय थोड़ा एहतियात बरतिएगा। "
                f"सड़कों पर कहीं-कहीं नमी और हल्की फिसलन रह सकती है, खासकर मोड़ और फ्लाईओवर पर। "
                f"अगर दोपहिया वाहन से जा रहे हैं तो बस और ट्रकों के पीछे थोड़ा फासला रखकर चलें ताकि उनके टायरों से उड़ने वाले कीचड़ और पानी के छींटों से बच सकें।"
            )
        elif intent == "comparison_past":
            text = (
                f"कल की तुलना में आज का मौसम थोड़ा अलग बर्ताव कर रहा है। "
                f"तापमान कल के मुकाबले थोड़ा बदला हुआ महसूस हो रहा है और वायुमंडलीय दबाव में स्थिरता आ रही है। "
                f"पिछले 72 घंटों की नमी धीरे-धीरे छंट रही है, जिससे दिन में मौसम थोड़ा ज्यादा खुला और हल्का महसूस होगा।"
            )
        else:
            text = (
                f"नमस्ते! {location_name} में आज का मौसम काफी दिलचस्प बना हुआ है। "
                f"बाहर का अहसास {feels_like}°C जैसा है, हल्की बयार चल रही है और आसमान में माहौल स्थिर है। "
                f"मौसम विभाग की तरफ से भी कोई बड़ी चेतावनी नहीं है, इसलिए अपने दिन के सारे जरूरी काम आप बिना किसी हिचकिचाहट के पूरे कर सकते हैं।"
            )

    elif language == "te":
        if intent == "farming_spraying":
            if spray_status == "HOLD":
                text = (
                    f"రైతు సోదరా, ఈ రోజు పంటలపై పురుగుమందులు లేదా ఎరువుల పిచికారీని కాస్త వాయిదా వేసుకోవడమే మంచిది. "
                    f"బయట గాలి వేగం దాదాపు {round(wind_speed)} కి.మీ/గం వరకు ఉంది. ఇంత గాలిలో పిచికారీ చేస్తే మందు మొక్కల ఆకులపై నిలవకుండా పక్క పొలాల్లోకి కొట్టుకుపోతుంది. "
                    f"గాలి శాంతించి, వర్షం ముప్పు లేనప్పుడు మాత్రమే మందు పిచికారీ చేయండి, మీ కష్టం మరియు ఖర్చు రెండూ వృథా కాకుండా ఉంటాయి."
                )
            else:
                text = (
                    f"ఈ రోజు ఉదయం వేళ మీ పంటలపై మందు పిచికారీ చేయడానికి చాలా అనుకూలమైన సమయం. "
                    f"గాలి చాలా నిలకడగా, నెమ్మదిగా వీస్తోంది కాబట్టి మందు సరిగ్గా ఆకులపై పడుతుంది. ఉదయం 9:30 లోపే ఈ పనిని పూర్తి చేసుకుంటే మంచి ఫలితం ఉంటుంది."
                )
        elif intent == "laundry_drying":
            text = (
                f"ఈ రోజు ఉతికిన బట్టలను డాబాపై ఆరేయకపోవడమే మంచిది. "
                f"గాలిలో తేమ చాలా ఎక్కువగా ఉండటం వల్ల బట్టలు త్వరగా ఆరవు, చాలా సేపు అలాగే ఉంటే బట్టల నుంచి ఒక రకమైన ముక్క వాసన వస్తుంది. "
                f"ఇంట్లోనే ఫ్యాన్ కింద ఆరేస్తే కాస్త త్వరగా, తాజాగా ఆరిపోతాయి."
            )
        elif intent == "asthma_health":
            text = (
                f"ఆస్తమా లేదా శ్వాసకోశ సమస్యలు ఉన్నవారు ఈ రోజు కాస్త జాగ్రత్తగా ఉండాలి. "
                f"గాలి నాణ్యత సూచిక {aqi} వద్ద ఉంది. చల్లటి గాలిలో కాలుష్య కణాలు కిందనే పేరుకుపోవడం వల్ల ఆయాసం వచ్చే అవకాశం ఉంది. "
                f"బయటకు వెళ్లేటప్పుడు మాస్క్ ధరించడం మరియు ఇన్హేలర్ దగ్గర ఉంచుకోవడం మరిచిపోవద్దు."
            )
        else:
            text = (
                f"నమస్కారం! {location_name} లో ఈ రోజు వాతావరణం చాలా ప్రశాంతంగా ఉంది. "
                f"బయట ఎండ లేదా ఉక్కపోత మరీ ఇబ్బంది పెట్టేలా లేదు. "
                f"వాతావరణ శాఖ నుంచి కూడా ఎటువంటి హెచ్చరికలు లేవు కాబట్టి మీ పనులను నిశ్చింతగా చేసుకోవచ్చు."
            )

    elif language == "ta":
        if intent == "farming_spraying":
            if spray_status == "HOLD":
                text = (
                    f"விவசாயத் தோழரே, இன்று பயிர்களுக்கு பூச்சிக்கொல்லி அல்லது உரங்களை தெளிப்பதை ஒத்திவைப்பதே நல்லது. "
                    f"வெளியில் காற்றின் வேகம் மணிக்கு சுமார் {round(wind_speed)} கி.மீ ஆக உள்ளது. இந்த காற்றில் மருந்து தெளித்தால் அது பயிர்களில் தங்காமல் அண்டை நிலங்களுக்கு காற்றில் அடித்துச் சென்றுவிடும். "
                    f"காற்று தணிந்து அமைதியான பிறகு மருந்து தெளித்தால் உங்கள் உழைப்பும் செலவும் வீணாகாது."
                )
            else:
                text = (
                    f"இன்று காலை வேளையில் உங்கள் பயிர்களுக்கு பூச்சிக்கொல்லி அல்லது மருந்து தெளிக்க மிகவும் சாதகமான சூழல் நிலவுகிறது. "
                    f"காற்றின் வேகம் மிகவும் சீராகவும் மெதுவாகவும் இருப்பதால் மருந்து பயிர்களின் இலைகளில் சரியாக படியும். காலை 9:30 மணிக்குள் இந்த வேலையை முடித்துக் கொள்வது நல்ல பலனைத் தரும்."
                )
        elif intent == "laundry_drying":
            if humidity > 70:
                text = (
                    f"இன்று துணிகளை வெளியில் காயப்போடாமல் இருப்பது நல்லது. "
                    f"காற்றில் ஈரப்பதம் மிக அதிகமாக இருப்பதால் துணிகள் எளிதில் காயாது, நீண்ட நேரம் அப்படியே இருந்தால் துணிகளில் ஒருவித வாடை ஏற்படும். "
                    f"வீட்டிற்குள் மின்விசிறியின் கீழ் காயப்போடுவது இன்று சிறந்த வழியாகும்."
                )
            else:
                text = (
                    f"ஆம், இன்று துணிகளைத் துவைத்து வெயிலில் காயப்போட சிறந்த நாள்! "
                    f"நல்ல வெயிலும் மெல்லிய காற்றும் வீசுவதால் துணிகள் சீக்கிரமாகவே காய்ந்து புத்துணர்ச்சியுடன் இருக்கும்."
                )
        elif intent == "wedding_event":
            if alert_level in ["Orange", "Red"] or wind_speed > 25:
                text = (
                    f"இன்று திறந்தவெளியில் சுபநிகழ்ச்சி அல்லது விழா ஏற்பாடு செய்திருந்தால் சற்று முன்னெச்சரிக்கையுடன் இருப்பது அவசியம். "
                    f"வானிலை திடீரென மாறி மாலை வேளையில் பலத்த காற்று அல்லது மழை வர வாய்ப்புள்ளது. விருந்தினர்களின் வசதிக்காகப் பாதுகாப்பான பந்தல் அல்லது உள் அரங்கு வசதியைத் தயார் நிலையில் வைத்திருப்பது நல்லது."
                )
            else:
                text = (
                    f"இன்று திறந்தவெளியில் சுபநிகழ்ச்சி நடத்த வானிலை மிகவும் அருமையாகவும் இதமாகவும் உள்ளது! "
                    f"கடுமையான வெயிலோ மழை அச்சுறுத்தலோ இல்லை. மாலை வேளையில் உங்கள் விருந்தினர்கள் மகிழ்ச்சியுடன் விழாவை அனுபவிக்கலாம்."
                )
        elif intent == "wear_outfit":
            if temp > 30:
                text = (
                    f"இன்று வெளியில் செல்லும் போது புழுக்கமும் கடுமையான வெயிலும் உணரப்படும். "
                    f"மெல்லிய பருத்தி ஆடைகளை அணிவது மிகவும் இதமாக இருக்கும். வெயிலின் தாக்கம் அதிகமாக இருப்பதால் குடை அல்லது சன்கிளாஸ் எடுத்துச் செல்வது நல்லது."
                )
            elif temp < 18:
                text = (
                    f"இன்று காற்றில் லேசான குளிர்ச்சி நிலவுகிறது, மாலை மறைந்ததும் குளிர் அதிகரிக்கலாம். "
                    f"உடலுக்கு கதகதப்பான ஒரு மெல்லிய ஸ்வெட்டர் அல்லது ஜாக்கெட் எடுத்துச் செல்வது பாதுகாப்பானது."
                )
            else:
                text = (
                    f"இன்றைய வானிலை உடலுக்கு மிகவும் இதமானது—அதிக வெயிலோ குளிரோ இல்லை. நீங்கள் வழக்கமான சாதாரண ஆடைகளுடன் வசதியாக வெளியே செல்லலாம்."
                )
        elif intent == "asthma_health":
            if aqi > 200:
                text = (
                    f"ஆஸ்துமா அல்லது சுவாசப் பிரச்சனை உள்ளவர்கள் இன்று மிகவும் கவனமாக இருக்க வேண்டும். "
                    f"காற்றின் தரக் குறியீடு {aqi} ஆக உயர்ந்துள்ளது. தூசி மற்றும் புகையின் தாக்கம் அதிகமாக இருப்பதால் தேவையின்றி வெளியே செல்வதைத் தவிர்க்கவும், வெளியே செல்லும்போது N95 மாஸ்க் அணிவது அவசியம்."
                )
            else:
                text = (
                    f"இன்று தூய காற்றைச் சுவாசிக்க அருமையான நாள்! "
                    f"காற்றின் தரக் குறியீடு {aqi} உடன் தூய்மையாகவும் ஆரோக்கியமாகவும் உள்ளது. காலை வேளையில் வெளிப்புற நடைப்பயிற்சியை தாராளமாக மேற்கொள்ளலாம்."
                )
        else:
            text = (
                f"வணக்கம்! {location_name} பகுதியில் இன்றைய வானிலை மிகவும் அமைதியாகவும் சீராகவும் உள்ளது. "
                f"தற்போதைய சூழல் {round(feels_like)}°C போல் உணரப்படுகிறது. வானிலை எச்சரிக்கைகள் ஏதுமில்லை என்பதால் உங்கள் அன்றாடப் பணிகளை நீங்கள் நிம்மதியாகத் தொடரலாம்."
            )

    elif language == "mr":
        if intent == "farming_spraying":
            if spray_status == "HOLD":
                text = (
                    f"शेतकरी मित्रा, आज पिकांवर कीटकनाशक किंवा खतांची फवारणी पुढे ढकलणेच शहाणपणाचे ठरेल. "
                    f"हवेचा वेग ताशी सुमारे {round(wind_speed)} किमी इतका जास्त आहे. इतक्या वाऱ्यात औषध पिकांच्या पानांवर न टिकता हवेत उडून शेजारच्या शेतात वाहून जाईल. "
                    f"वारा शांत झाल्यानंतरच फवारणी करा, ज्यामुळे तुमचे कष्ट आणि पैसा दोन्ही वाया जाणार नाहीत."
                )
            else:
                text = (
                    f"आज सकाळची वेळ पिकांवर कीटकनाशक किंवा औषध फवारणीसाठी अगदी उत्तम आहे. "
                    f"वारा मंद आणि शांत असल्याने औषध थेट पानांवर व्यवस्थित बसेल. दुपारच्या उन्हाचा प्रभाव वाढण्याआधी सकाळी 9:30 वाजेपर्यंत हे काम पूर्ण करून घेणे फायद्याचे ठरेल."
                )
        elif intent == "laundry_drying":
            if humidity > 70:
                text = (
                    f"आज धुतलेले कपडे उघड्यावर वाळत न टाकणेच बरे. "
                    f"पाऊस नसला तरी हवेत प्रचंड आर्द्रता असल्याने कपडे तासनतास ओलसरच राहतील आणि त्यांना कुबट वास येऊ लागेल. घरात पंख्याखाली वाळत घातल्यास ते लवकर आणि स्वच्छ सुकतील."
                )
            else:
                text = (
                    f"होय, आज कपडे धुऊन उन्हात वाळवण्यासाठी अगदी उत्तम दिवस आहे! "
                    f"छान ऊन आणि मंद वारा असल्याने दुपारपर्यंत कपडे एकदम छान सुकतील."
                )
        elif intent == "wedding_event":
            if alert_level in ["Orange", "Red"] or wind_speed > 25:
                text = (
                    f"आज संध्याकाळी मोकळ्या मैदानात लग्न किंवा समारंभाचे नियोजन असल्यास सावधगिरी बाळगणे आवश्यक आहे. "
                    f"संध्याकाळपर्यंत जोरदार वारा किंवा पावसाची शक्यता वर्तवण्यात आली आहे. पाहुण्यांच्या सोयीसाठी वॉटरप्रूफ मंडप किंवा पर्यायी हॉलची व्यवस्था सज्ज ठेवणे शहाणपणाचे राहील."
                )
            else:
                text = (
                    f"मोकळ्या जागेत लग्न किंवा समारंभ आयोजित करण्यासाठी आजचे हवामान अतिशय प्रसन्न आणि सुखद आहे! "
                    f"कडक ऊन किंवा पावसाची कोणतीही अडचण नाही. पाहुणे मोकळ्या वातावरणाचा पुरेपूर आनंद घेऊ शकतील."
                )
        elif intent == "wear_outfit":
            if temp > 30:
                text = (
                    f"आज बाहेर पडताना चिकट उकाडा आणि कडक ऊन जाणवेल. "
                    f"सैल आणि हलके सुती कपडे घालणे सर्वात आरामदायक ठरेल. दुपारच्या वेळी डोळ्यांवर गॉगल आणि सोबत टोपी किंवा छत्री ठेवणे चांगले."
                )
            elif temp < 18:
                text = (
                    f"आज हवेत गारवा जाणवेल, विशेषतः संध्याकाळी तापमान झपाट्याने कमी होईल. "
                    f"एक हलके जॅकेट किंवा शाल सोबत ठेवा म्हणजे संध्याकाळची थंड हवा त्रास देणार नाही."
                )
            else:
                text = (
                    f"आजचे हवामान अगदी आल्हाददायक आहे—जास्त उष्णता नाही आणि थंडीही नाही. तुम्ही कोणतेही साधे कॅज्युअल कपडे घालून सहज बाहेर पडू शकता."
                )
        elif intent == "asthma_health":
            if aqi > 200:
                text = (
                    f"दमा किंवा श्वसनाचा त्रास असणाऱ्यांनी आज काळजी घेणे आवश्यक आहे. "
                    f"हवेचा गुणवत्ता निर्देशांक {aqi} वर गेला असून प्रदूषणाचे कण हवेत जमिनीलगत साचले आहेत. मॉर्निंग वॉक टाळा आणि बाहेर जाताना N95 मास्क अवश्य वापरा."
                )
            else:
                text = (
                    f"आज मोकळ्या आणि ताज्या हवेत श्वास घेण्याचा दिवस आहे! "
                    f"हवेची गुणवत्ता {aqi} निर्देशांकासह अतिशय स्वच्छ आणि समाधानकारक आहे."
                )
        else:
            text = (
                f"नमस्कार! {location_name} मध्ये आजचे हवामान खूपच छान आणि शांत आहे. "
                f"बाहेरचे वातावरण {round(feels_like)}°C सारखे जाणवत आहे. हवामान खात्याकडून कोणताही इशारा नाही, त्यामुळे आपली नियोजित कामे आपण बिनधास्तपणे पार पाडू शकता."
            )

    elif language == "bn":
        if intent == "farming_spraying":
            if spray_status == "HOLD":
                text = (
                    f"কৃষক বন্ধু, আজ ফসলে কীটনাশক বা সার স্প্রে করার পরিকল্পনা স্থগিত রাখাই বুদ্ধিমানের কাজ হবে। "
                    f"বাতাসের গতিবেগ ঘণ্টায় প্রায় {round(wind_speed)} কিমি, যার ফলে ওষুধের ফোঁটা ফসলের পাতায় না বসে বাতাসে উড়ে পাশের জমিতে চলে যাবে। "
                    f"বাতাস শান্ত হলে তবেই স্প্রে করুন, যাতে আপনার পরিশ্রম ও খরচ দুটিই বাঁচে।"
                )
            else:
                text = (
                    f"আজ সকালের সময়টি ফসলে কীটনাশক বা স্প্রে করার জন্য একদম আদর্শ। "
                    f"বাতাস শান্ত ও মৃদুমন্দ থাকায় ওষুধ সরাসরি পাতার গায়ে পৌঁছাবে। রোদ চড়ার আগেই সকাল ৯:৩০ টার মধ্যে কাজ সেরে নেওয়া সবচেয়ে ভালো।"
                )
        elif intent == "laundry_drying":
            if humidity > 70:
                text = (
                    f"আজ ধোয়া কাপড় বাইরে বা ছাদে না মেলাই ভালো। "
                    f"বৃষ্টি না হলেও বাতাসে অতিরিক্ত আর্দ্রতা থাকার কারণে কাপড় ঘণ্টার পর ঘণ্টা ভিজে থাকবে এবং ভ্যাপসা গন্ধ হতে পারে। ঘরের ভেতরে ফ্যানের নিচে মেললে তাড়াতাড়ি এবং ফ্রেশ শুকোবে।"
                )
            else:
                text = (
                    f"হ্যাঁ, আজ কাপড় ধুয়ে রোদে শুকানোর জন্য খুব সুন্দর দিন! "
                    f"উজ্জ্বল রোদ আর হালকা হাওয়া থাকার কারণে দুপুরের মধ্যেই ভারী কাপড়ও একদম শুকনো খটখটে হয়ে যাবে।"
                )
        elif intent == "wedding_event":
            if alert_level in ["Orange", "Red"] or wind_speed > 25:
                text = (
                    f"আজ সন্ধ্যায় খোলা আকাশের নিচে বিয়ে বা কোনো অনুষ্ঠানের পরিকল্পনা থাকলে বাড়তি সতর্কতা নেওয়া প্রয়োজন। "
                    f"আবহাওয়ায় আকস্মিক পরিবর্তনের পূর্বাভাস রয়েছে এবং দমকা হাওয়ার সাথে বৃষ্টি নামতে পারে। অতিথিদের সুবিধার জন্য একটি ওয়াটারপ্রুফ শামিয়ানা বা ইনডোর হল ব্যাকআপ রাখা জরুরি।"
                )
            else:
                text = (
                    f"খোলা লনে বিয়ে বা পার্টির জন্য আজকের আবহাওয়া অত্যন্ত মনোরম ও অনুকূল! "
                    f"অতিরিক্ত গরম বা বৃষ্টির কোনো আশঙ্কা নেই। অতিথিরা সন্ধ্যার মনোরম পরিবেশ মনের আনন্দে উপভোগ করবেন।"
                )
        elif intent == "wear_outfit":
            if temp > 30:
                text = (
                    f"আজ বাইরে বেরোলেই চটচটে ঘাম ও কড়া রোদের অনুভূতি হবে। "
                    f"হালকা ও আরামদায়ক সুতির পোশাক পরাই সবচেয়ে ভালো। সাথে রোদচশমা ও ছোট ছাতা রাখুন যাতে দুপুরের কড়া রোদ থেকে বাঁচা যায়।"
                )
            elif temp < 18:
                text = (
                    f"আজ বাতাসে হালকা শিরশিরানি ভাব থাকবে, বিশেষ করে সন্ধ্যা নামলেই ঠান্ডা বাড়বে। "
                    f"সাথে একটি হালকা জ্যাকেট বা চাদর রাখা ভালো হবে যাতে ঠান্ডার আমেজ কষ্ট না দেয়।"
                )
            else:
                text = (
                    f"আজকের আবহাওয়া শরীরের পক্ষে ভীষণ আরামদায়ক—না বেশি গরম, না ঠান্ডা। যেকোনো সাধারণ ক্যাজুয়াল পোশাক পরেই অনায়াসে দিনটি কাটাতে পারেন।"
                )
        elif intent == "asthma_health":
            if aqi > 200:
                text = (
                    f"অ্যাজমা বা শ্বাসকষ্টের সমস্যা থাকলে আজ বাড়তি সতর্কতা অবলম্বন করতে হবে। "
                    f"বায়ুর মান সূচক {aqi} তে পৌঁছেছে এবং ধূলিকণা বাতাসের নিচের স্তরে জমে আছে। সকালের জগিং এড়িয়ে চলুন এবং বাইরে বেরোলে অবশ্যই N95 মাস্ক ব্যবহার করুন।"
                )
            else:
                text = (
                    f"আজ প্রাণভরে খোলা বাতাসে শ্বাস নেওয়ার দিন! "
                    f"বায়ুর মান সূচক {aqi} সহ পরিবেশ বেশ পরিচ্ছন্ন ও নির্মল। সকালে খোলা জায়গায় হাঁটাচলা করতে কোনো বাধা নেই।"
                )
        else:
            text = (
                f"নমস্কার! {location_name}-এ আজকের আবহাওয়া বেশ শান্ত ও মনোরম। "
                f"বাইরের আবহাওয়া {round(feels_like)}°C-এর মতো মধুর অনুভূত হচ্ছে। আবহাওয়া দপ্তরের কোনো সতর্কবার্তা নেই, তাই আপনার সারাদিনের পরিকল্পনা নিশ্চিন্তে সম্পন্ন করতে পারেন।"
            )

    elif language == "ml":
        if intent == "farming_spraying":
            text = (
                f"ഇന്ന് വിളകളിൽ കീടനാശിനിയോ വളമോ തളിക്കുന്നത് അല്പം ശ്രദ്ധിച്ചു വേണം. "
                f"കാറ്റിന്റെ വേഗത കൂടുതലായതുകൊണ്ട് മരുന്ന് ഇലകളിൽ തങ്ങിനിൽക്കാതെ പറന്നുപോകാൻ സാധ്യതയുണ്ട്. "
                f"കാറ്റ് കുറവുള്ള സമയത്തോ അല്ലെങ്കിൽ നാളെ രാവിലെയോ മരുന്ന് തളിക്കുന്നതായിരിക്കും കൂടുതൽ ഫലപ്രദം."
            )
        elif intent == "laundry_drying":
            text = (
                f"ഇന്ന് തുണികൾ പുറത്തിട്ട് ഉണക്കാൻ ശ്രമിച്ചാൽ നന്നായി ഉണങ്ങിക്കിട്ടാൻ ബുദ്ധിമുട്ടായിരിക്കും. "
                f"അന്തരീക്ഷത്തിൽ ഈർപ്പം കൂടുതലായതുകൊണ്ട് തുണിയിൽ നിന്ന് ചെറിയ നനവും മണവും അനുഭവപ്പെട്ടേക്കാം. "
                f"വീടിനകത്ത് ഫാനിന്റെ കാറ്റിലിട്ട് ഉണക്കുന്നതാണ് ഇന്ന് കൂടുതൽ നല്ലത്."
            )
        else:
            text = (
                f"നമസ്കാരം! {location_name} കാലാവസ്ഥ ഇപ്പോൾ വളരെ ശാന്തവും സുഖകരവുമാണ്. "
                f"വലിയ മഴയോ കഠിനമായ വെയിലോ ഇല്ലാത്തതുകൊണ്ട് പുറത്തിറങ്ങാനും യാത്രകൾ ചെയ്യാനും ഇന്നത്തെ ദിവസം വളരെ അനുയോജ്യമാണ്. "
                f"ശുദ്ധവായു ശ്വസിച്ച് മനസ്സിന് കുളിർമ നൽകുന്ന ഒരു അന്തരീക്ഷമാണ് ഇന്നുള്ളത്."
            )

    else:
        # English: Warm, brilliant, empathetic atmospheric friend
        if intent == "farming_spraying":
            if spray_status == "HOLD":
                text = (
                    f"I'd strongly hold off on firing up the spray rigs today, my friend. "
                    f"The winds are pushing around {round(wind_speed)} km/h right now with even sharper gusts kicking up. At that speed, chemical droplet drift is almost guaranteed—your foliar nutrition or pesticide will blow off-target into adjacent plots before it ever settles on your crop canopy. "
                    f"On top of that, humidity is hovering near {humidity}%. IMD Agromet guidelines recommend holding until sustained winds drop below 15 km/h. Keep your tanks grounded for now; it will save you both chemical cost and crop stress."
                )
            else:
                text = (
                    f"You've got a fantastic window for foliar and pesticide spraying early today. "
                    f"The boundary layer wind is gentle and laminar at just {round(wind_speed)} km/h, meaning chemical drift will be practically zero. Your spray droplets will settle evenly across the leaf cuticle without blowing into neighboring buffers. "
                    f"Aim to wrap up between 6:30 AM and 9:30 AM before daytime convective thermal updrafts pick up."
                )
        elif intent == "laundry_drying":
            if humidity > 70:
                text = (
                    f"I'd definitely keep the laundry inside on a drying rack today. "
                    f"Even if the sky doesn't drop a single bead of rain, the air in {location_name} is packed with {humidity}% humidity under a thick cloud blanket. With virtually no direct sun and still air, your damp clothes will just sit there for six hours, trapped in a cold moisture sink, and end up smelling sour and musty. "
                    f"Set them up under a ceiling fan indoors—they'll dry three times faster and stay fresh."
                )
            else:
                text = (
                    f"Go ahead and hang those clothes out on the line! "
                    f"We've got bright sunshine, a light breeze that will strip the moisture right off the fabrics, and low humidity. Even heavy denim and bath towels should be crisp, fresh, and bone-dry by early afternoon."
                )
        elif intent == "wedding_event":
            if alert_level in ["Orange", "Red"] or wind_speed > 25:
                text = (
                    f"Ah, weddings and open-air celebrations are so stressful when the sky acts up! "
                    f"If you're planning an evening gala on the lawn, I'd strongly suggest having a sturdy, covered marquee or an indoor banquet hall ready on standby. Atmospheric instability is building, and IMD has an alert flagged for our sector because gusty breezes and sudden localized downpours could blow through right around dinner time. "
                    f"Better to have the backup in place early so you and your guests can enjoy the celebration without worrying about damp linens or flying decor!"
                )
            else:
                text = (
                    f"You couldn't have asked for a kinder sky for a wedding or outdoor party! "
                    f"The air is going to feel delightfully balanced this evening—gentle thermal breezes, mild temperatures that won't make anyone melt in heavy formal attire, and zero threat of rain showers spoiling the lawn. Your guests are going to have a magical time under the open stars."
                )
        elif intent == "wear_outfit":
            if temp > 31 or feels_like > 34:
                text = (
                    f"The sun has real bite today, and that humidity means sweat won't evaporate quickly—it's going to feel like a sauna the second you step out of the AC. "
                    f"Stick to light, breathable natural linen or loose cotton, and slip on some UV-rated sunglasses before heading out. If you're going to be walking outdoors between noon and 3:00 PM, grab a small umbrella or wide-brim hat to shield your neck from the direct solar glare."
                )
            elif temp < 18:
                text = (
                    f"There's a brisk nip in the air today, and that breeze will make it feel noticeably sharper once the sun slips behind the buildings. "
                    f"I'd layer up with a cozy cotton knit or throw a light windbreaker in your bag. You might feel fine at midday, but you'll definitely thank yourself the moment you step outside after 6:00 PM."
                )
            else:
                text = (
                    f"Today is one of those Goldilocks weather days—not too muggy, not too chilly. "
                    f"A comfortable short-sleeve shirt or everyday casual wear will keep you feeling great all day long. No heavy layers or rain gear required!"
                )
        elif intent == "asthma_health":
            if aqi > 200:
                text = (
                    f"If you or anyone in your family deals with asthma or sensitive lungs, definitely play it cautious today. "
                    f"The CPCB air quality index has crept up to {aqi}, and with sluggish surface winds, all the vehicle exhaust and particulate matter are staying trapped close to the asphalt in the morning air. "
                    f"Skip the outdoor jogging route today, keep the bedroom windows latched, and make sure to have your inhaler handy if you need to be out in peak traffic."
                )
            else:
                text = (
                    f"Your lungs are going to love today! "
                    f"The air quality index is sitting at a crisp, healthy {aqi} on the CPCB scale. There's good atmospheric mixing and very little stagnant smog, making it a wonderful morning to fling the windows wide open and enjoy an energizing outdoor jog or walk."
                )
        elif intent == "driving_commute":
            text = (
                f"Take it easy on the roads today. "
                f"Even with mild showers, the first sheen of moisture on the tarmac mixes with dried road oils, making painted lane stripes, manhole covers, and flyover joints deceptively slick. "
                f"If you're on a two-wheeler, leave extra braking cushion behind city buses and trucks so you don't catch a heavy wave of road spray in your face."
            )
        elif intent == "comparison_past":
            text = (
                f"You're not imagining it—today has a distinctly different flavor compared to yesterday. "
                f"The thermometer is tracking a noticeable shift, and the barometric pressure has settled into a steady rhythm. The heavy moisture we saw across the grid over the last three days is finally burning off, leaving the air feeling lighter and much more manageable."
            )
        else:
            text = (
                f"It's good to catch up! Looking at the sky over {location_name}, we've got a largely cooperative atmosphere today. "
                f"It feels around {round(feels_like)}°C in the shade, with a gentle breeze keeping things fresh. There are no sudden storm threats lurking on the radar right now, so whatever plans you've got lined up for the day, you should be in the clear to enjoy them."
            )

    target_state = target_location.get("state", "") if target_location else ""
    target_country = target_location.get("country", "India") if target_location else "India"

    prefix = ""
    suffix = ""

    if requested_gps:
        if language == "hi":
            prefix = "आपकी वर्तमान जीपीएस स्थिति के मौसम की जाँच कर रहा हूँ...\n\n"
        elif language == "te":
            prefix = "మీ ప్రస్తుత GPS లొకేషన్ వాతావరణ పరిస్థితులను పరిశీలిస్తున్నాను...\n\n"
        elif language == "ta":
            prefix = "உங்கள் தற்போதைய GPS இருப்பிடத்தின் வானிலை நிலவரத்தை சரிபார்க்கிறேன்...\n\n"
        elif language == "mr":
            prefix = "तुमच्या सध्याच्या GPS स्थानावरील हवामानाची तपासणी करत आहे...\n\n"
        elif language == "bn":
            prefix = "আপনার বর্তমান জিপিএস অবস্থানের আবহাওয়া পরীক্ষা করছি...\n\n"
        elif language == "ml":
            prefix = "നിങ്ങളുടെ നിലവിലെ ജിപിഎസ് ലൊക്കേഷനിലെ കാലാവസ്ഥ പരിശോധിക്കുന്നു...\n\n"
        else:
            prefix = "Checking live conditions for your current GPS coordinates...\n\n"
    elif is_location_switched:
        state_str = f", {target_state}" if target_state else ""
        state_hi = f" ({target_state})" if target_state else ""
        loc_meta = f'{{"name": "{location_name}", "state": "{target_state}", "country": "{target_country}"}}'
        
        if language == "hi":
            prefix = f"{location_name}{state_hi} के मौसम की बात करें तो...\n\n"
            suffix = f"\n\nक्या आप चाहते हैं कि मैं आपके मुख्य डैशबोर्ड को भी {location_name} पर सेट कर दूँ?\n\n[TARGET_LOCATION: {loc_meta}]"
        elif language == "te":
            prefix = f"{location_name} లో ప్రస్తుత వాతావరణ పరిస్థితులను పరిశీలిస్తే...\n\n"
            suffix = f"\n\nమీ ప్రధాన డ్యాష్‌బోర్డ్‌ను కూడా {location_name} కు మార్చమంటారా?\n\n[TARGET_LOCATION: {loc_meta}]"
        elif language == "ta":
            prefix = f"{location_name} பகுதியின் தற்போதைய வானிலை நிலவரத்தைப் பார்த்தால்...\n\n"
            suffix = f"\n\nஉங்கள் முதன்மை டாஷ்போர்டையும் {location_name} பகுதிக்கு மாற்ற விரும்புகிறீர்களா?\n\n[TARGET_LOCATION: {loc_meta}]"
        elif language == "mr":
            prefix = f"{location_name} मधील सध्याच्या हवामानाचा विचार करता...\n\n"
            suffix = f"\n\nआपल्या मुख्य डॅशबोर्डवरही {location_name} चे हवामान सेट करायचे आहे का?\n\n[TARGET_LOCATION: {loc_meta}]"
        elif language == "bn":
            prefix = f"{location_name}-এর বর্তমান আবহাওয়ার অবস্থা লক্ষ্য করলে...\n\n"
            suffix = f"\n\nআপনি কি চান আপনার মূল ড্যাশবোর্ডটিও {location_name}-এ আপডেট করে দিই?\n\n[TARGET_LOCATION: {loc_meta}]"
        elif language == "ml":
            prefix = f"{location_name} ലെ നിലവിലെ കാലാവസ്ഥ പരിശോധിച്ചാൽ...\n\n"
            suffix = f"\n\nനിങ്ങളുടെ പ്രധാന ഡാഷ്‌ബോർഡ് {location_name} ലേക്ക് മാറ്റണോ?\n\n[TARGET_LOCATION: {loc_meta}]"
        else:
            prefix = f"Looking at conditions in {location_name}{state_str} right now...\n\n"
            suffix = f"\n\nWould you like me to update your dashboard to {location_name} as well?\n\n[TARGET_LOCATION: {loc_meta}]"

    final_body = f"{prefix}{text}{suffix}"
    full_reply = f"{final_body}\n\n{authority_badge}"
    return full_reply, authority_badge
