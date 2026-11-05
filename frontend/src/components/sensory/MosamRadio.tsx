"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWeatherStore } from "@/store/useWeatherStore";
import { useSpeechSynthesis } from "@/components/speech/useSpeechSynthesis";
import { translations, getLocalizedWmoDescription } from "@/lib/translations";
import {
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Lock,
  ArrowRight,
  Disc,
  Headphones,
  Sliders,
} from "lucide-react";

export const MosamRadio: React.FC = () => {
  const { weatherData, selectedLocation, language, isGuest, setUpgradeModal } = useWeatherStore();
  const { isSpeaking, speak, stop } = useSpeechSynthesis();

  const [isPlaying, setIsPlaying] = useState(false);
  const [tone, setTone] = useState<"casual" | "scientific" | "poetic">("casual");
  const [progress, setProgress] = useState(0);
  const [ambientMuted, setAmbientMuted] = useState(false);
  const [ambientVolume, setAmbientVolume] = useState(0.3);

  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientNodeRef = useRef<any>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const progressTimerRef = useRef<any>(null);

  if (!weatherData) return null;

  const current = weatherData.current || {};
  const retrospective = weatherData.retrospective || {};
  const daily = weatherData.daily || [];
  const today = daily[0] || {};
  const cpcb = weatherData.governmentBulletin?.cpcbNaqi;

  const t = translations[language] || translations.en;

  // Generate dynamic 45s conversational script based on selected tone
  const getBriefingScript = () => {
    const locName = selectedLocation.name;
    const temp = Math.round(current.temperature ?? 26);
    const feelsLike = Math.round(current.feelsLike ?? temp);
    const desc = getLocalizedWmoDescription(current.weatherCode ?? 0, language);
    const rainProb = today.precipitationProbability ?? 10;
    const humidity = current.humidity ?? 60;
    const wind = Math.round(current.windSpeed ?? 12);
    const delta = retrospective.tempDelta24h ?? 0;
    const pressure = current.pressure ?? 1012;
    const dewPoint = current.dewPoint ?? 18;
    const aqi = cpcb?.index ?? 65;
    const cloud = current.cloudCover ?? 30;

    if (language === "hi") {
      if (tone === "scientific") {
        return `मौसम रेडियो सिनॉप्टिक बुलेटिन में आपका स्वागत है। ${locName} का सतही तापमान ${temp} डिग्री सेल्सियस दर्ज किया गया है। वायुमंडलीय दबाव ${pressure} हेक्टोपास्कल है और आर्द्रता ${humidity} प्रतिशत पर है, जिससे प्रभावी ओसांक ${dewPoint} डिग्री है। ईसीएमडब्ल्यूएफ और जीएफएस मॉडल के अनुसार वर्षा की संभावना ${rainProb} प्रतिशत है। हवा की गति ${wind} किलोमीटर प्रति घंटा है तथा एक्यूआई सूचकांक ${aqi} है। मौसम संबंधी स्थितियां स्थिर बनी हुई हैं।`;
      }
      if (tone === "poetic") {
        return `मौसम रेडियो से सुहावनी नमस्ते। आज ${locName} का आसमान ${desc} के साथ खिल उठा है। हवा में ${temp} डिग्री की नर्मी है, जो बदन पर ${feelsLike} डिग्री जैसी महसूस होती है। बादलों की चादर ${cloud} प्रतिशत छाई हुई है और ${wind} किलोमीटर प्रति घंटे की धीमी बयार बह रही है। प्रकृति की इस खूबसूरत लय का आनंद लें और अपना दिन खुशियों से भरें।`;
      }
      return `नमस्ते! यह मौसम रेडियो है, ${locName} के लिए आपका लाइव मौसम अपडेट। बाहर का तापमान अभी ${temp} डिग्री सेल्सियस है, लेकिन ${humidity} प्रतिशत नमी के कारण यह ${feelsLike} डिग्री जैसा महसूस हो रहा है। कल के मुकाबले आज तापमान लगभग ${Math.abs(delta)} डिग्री ${delta >= 0 ? "ज्यादा" : "कम"} है। आज बारिश की संभावना करीब ${rainProb} प्रतिशत है, इसलिए ${rainProb > 40 ? "बाहर जाते समय छाता जरूर साथ रखें" : "आप बिना छाते के आराम से बाहर निकल सकते हैं"}। आपका दिन शुभ और सुखद रहे!`;
    }

    if (language === "te") {
      if (tone === "scientific") {
        return `మోసం రేడియో సినాప్టిక్ స్టేషన్‌కు స్వాగతం. ${locName} వద్ద ప్రస్తుత ఉష్ణోగ్రత ${temp} డిగ్రీల సెల్సియస్, బారోమెట్రిక్ పీడనం ${pressure} హెక్టోపాస్కల్స్. గాలిలో సాపేక్ష తేమ ${humidity} శాతంగా ఉండి, మంచు బిందువు ${dewPoint} డిగ్రీలుగా ఉంది. ఉపగ్రహ నమూనాల విశ్లేషణ ప్రకారం వర్షపాత సంభావ్యత ${rainProb} శాతం. గాలులు గంటకు ${wind} కిలోమీటర్ల వేగంతో వీస్తున్నాయి మరియు ఎయిర్ క్వాలిటీ ఇండెక్స్ ${aqi} వద్ద నమోదైంది.`;
      }
      if (tone === "poetic") {
        return `మోసం రేడియో నుండి శుభోదయం. ఈ రోజు ${locName} ఆకాశం ${desc} తో అందంగా పరుచుకుంది. గాలిలో ${temp} డిగ్రీల చల్లదనం అలరిస్తోంది, శరీరంపై ${feelsLike} డిగ్రీలలా తాకుతోంది. ఆకాశంలో మేఘాలు ${cloud} శాతం కప్పి ఉండి, గంటకు ${wind} కిలోమీటర్ల పిల్లగాలులు వీస్తున్నాయి. ప్రకృతి ప్రశాంతతను ఆస్వాదిస్తూ మీ దినచర్యను కొనసాగించండి.`;
      }
      return `నమస్కారం! ఇది మోసం రేడియో, ${locName} కోసం మీ ప్రత్యక్ష వాతావరణ సమాచారం. ప్రస్తుతం ఉష్ణోగ్రత ${temp} డిగ్రీల సెల్సియస్, తేమ ${humidity} శాతం ఉండటంతో ఇది ${feelsLike} డిగ్రీలలా అనిపిస్తుంది. నిన్నటితో పోలిస్తే ఉష్ణోగ్రత సుమారు ${Math.abs(delta)} డిగ్రీలు ${delta >= 0 ? "ఎక్కువగా" : "తక్కువగా"} ఉంది. ఈరోజు వర్షం పడే అవకాశం ${rainProb} శాతం ఉంది, కాబట్టి ${rainProb > 40 ? "బయటకు వెళ్లేటప్పుడు గొడుగు తప్పక వెంట తీసుకెళ్లండి" : "గొడుగు లేకుండానే నిశ్చింతగా బయటకు వెళ్లవచ్చు"}. ఈ రోజు మీకు ఎంతో శుభకరంగా ఉండాలని కోరుకుంటున్నాము!`;
    }

    if (language === "ta") {
      if (tone === "scientific") {
        return `மோசம் ரேடியோ சினாப்டிக் மையத்திற்கு நல்வரவு. ${locName} பகுதியில் தரைமட்ட வெப்பநிலை ${temp} டிகிரி செல்சியஸ் ஆகவும், காற்றழுத்தம் ${pressure} ஹெக்டோபாஸ்கல் ஆகவும் பதிவாகியுள்ளது. ஈரப்பதம் ${humidity} சதவீதம் மற்றும் பனிப்புள்ளி ${dewPoint} டிகிரி செல்சியஸ் ஆகும். இ.சி.எம்.டபிள்யூ.எஃப் முன்னறிவிப்பின்படி மழை வாய்ப்பு ${rainProb} சதவீதம். காற்றின் வேகம் மணிக்கு ${wind} கி.மீ மற்றும் காற்றுத் தரக் குறியீடு ${aqi} ஆக உள்ளது.`;
      }
      if (tone === "poetic") {
        return `மோசம் ரேடியோவின் இனிய வணக்கம். இன்று ${locName} வானில் ${desc} நிலவுகிறது. காற்றின் தட்பவெப்பம் ${temp} டிகிரியாக மென்மையாகத் தழுவுகிறது, தோலில் ${feelsLike} டிகிரி போல் இதமளிக்கிறது. மேகங்கள் ${cloud} சதவீதம் சூழ்ந்து, மணிக்கு ${wind} கி.மீ வேகத்தில் தென்றல் காற்று வீசுகிறது. இயற்கையின் இந்த அழகிய பொழுதை மகிழ்வோடு அனுபவியுங்கள்.`;
      }
      return `வணக்கம்! இது மோசம் ரேடியோ, ${locName} பகுதிக்கான உங்கள் நேரலை வானிலை அறிக்கை. தற்போது வெப்பநிலை ${temp} டிகிரி செல்சியஸ், ஈரப்பதம் ${humidity} சதவீதமாக இருப்பதால் ${feelsLike} டிகிரி போல் உணரப்படுகிறது. நேற்றைய நிலவரத்துடன் ஒப்பிடும்போது சுமார் ${Math.abs(delta)} டிகிரி ${delta >= 0 ? "அதிகமாக" : "குறைவாக"} உள்ளது. இன்று மழைக்கான வாய்ப்பு ${rainProb} சதவீதம், எனவே ${rainProb > 40 ? "வெளியே செல்லும்போது குடை எடுத்துச் செல்வது நல்லது" : "மழை பயமின்றி நிம்மதியாக வெளியே செல்லலாம்"}. உங்கள் நாள் இனிதாக அமையட்டும்!`;
    }

    if (language === "mr") {
      if (tone === "scientific") {
        return `मौसम रेडिओ सिनॉप्टिक बुलेटिनमध्ये आपले स्वागत आहे. ${locName} चे भूपृष्ठ तापमान ${temp} अंश सेल्सिअस नोंदवले गेले आहे. वातावरणीय दाब ${pressure} हेक्टोपास्कल असून आर्द्रता ${humidity} टक्के आहे, ज्यामुळे प्रभावी दवबिंदू ${dewPoint} अंश आहे. ईसीएमडब्ल्यूएफ आणि जीएफएस मॉडेलनुसार पावसाची शक्यता ${rainProb} टक्के आहे. वाऱ्याचा वेग ताशी ${wind} किमी असून एक्युआय निर्देशांक ${aqi} आहे.`;
      }
      if (tone === "poetic") {
        return `मौसम रेडिओवरून सस्नेह नमस्कार. आज ${locName} चे आकाश ${desc} ने बहरले आहे. हवेमध्ये ${temp} अंशांचा सुखद गारवा असून तो अंगावर ${feelsLike} अंशांसारखा जाणवतो. आकाशात ढगांचे प्रमाण ${cloud} टक्के असून ताशी ${wind} किमी वेगाने मंद झुळूक वाहत आहे. निसर्गाच्या या सुंदर लयीचा आनंद घ्या आणि आपला दिवस प्रसन्न करा.`;
      }
      return `नमस्कार! हे आहे मौसम रेडिओ, ${locName} साठी तुमचे थेट हवामान अपडेट. बाहेरचे तापमान सध्या ${temp} अंश सेल्सिअस आहे, पण ${humidity} टक्के आर्द्रतेमुळे ते ${feelsLike} अंशांसारखे जाणवत आहे. कालच्या तुलनेत आज तापमान सुमारे ${Math.abs(delta)} अंशांनी ${delta >= 0 ? "जास्त" : "कमी"} आहे. आज पाऊस पडण्याची शक्यता सुमारे ${rainProb} टक्के आहे, त्यामुळे ${rainProb > 40 ? "घराबाहेर पडताना छत्री नक्की सोबत ठेवा" : "तुम्ही छत्रीशिवाय बिनधास्त बाहेर पडू शकता"}. तुमचा आजचा दिवस छान आणि आनंदी जावो!`;
    }

    if (language === "bn") {
      if (tone === "scientific") {
        return `মৌসম রেডিও সিনপটিক স্টেশনে স্বাগতম। ${locName}-এর বর্তমান ভূপৃষ্ঠ তাপমাত্রা ${temp} ডিগ্রি সেলসিয়াস এবং বায়ুমণ্ডলীয় চাপ ${pressure} হেক্টোপাস্কাল। আপেক্ষিক আর্দ্রতা ${humidity} শতাংশ এবং শিশিরাঙ্ক ${dewPoint} ডিগ্রি। ইসিএমডব্লিউএফ এবং জিএফএস মডেল অনুসারে বৃষ্টিপাতের সম্ভাবনা ${rainProb} শতাংশ। বাতাসের গতিবেগ ঘণ্টায় ${wind} কিমি এবং বায়ুর গুণমান সূচক ${aqi}। আবহাওয়া বর্তমানে স্থিতিশীল রয়েছে।`;
      }
      if (tone === "poetic") {
        return `মৌসম রেডিও থেকে মিষ্টি শুভেচ্ছা। আজ ${locName}-এর আকাশ ${desc} নিয়ে সেজে উঠেছে। বাতাসে ${temp} ডিগ্রির মৃদু ছোঁয়া, যা গায়ে ${feelsLike} ডিগ্রির মতো মধুর পরশ দিচ্ছে। আকাশে মেঘের চাদর ${cloud} শতাংশ এবং ঘণ্টায় ${wind} কিমি বেগে স্নিগ্ধ বাতাস বইছে। প্রকৃতির এই অপরূপ ছন্দকে সঙ্গে নিয়ে আপনার দিনটি আনন্দময় হোক।`;
      }
      return `নমস্কার! এটি মৌসম রেডিও, ${locName}-এর জন্য আপনার লাইভ আবহাওয়া বার্তা। এখন বাইরের তাপমাত্রা ${temp} ডিগ্রি সেলসিয়াস, তবে ${humidity} শতাংশ আর্দ্রতার কারণে এটি ${feelsLike} ডিগ্রির মতো অনুভূত হচ্ছে। গতকালের তুলনায় আজ তাপমাত্রা প্রায় ${Math.abs(delta)} ডিগ্রি ${delta >= 0 ? "বেশি" : "কম"}। আজ বৃষ্টির সম্ভাবনা প্রায় ${rainProb} শতাংশ, তাই ${rainProb > 40 ? "বাইরে বেরোনোর সময় সাথে ছাতা অবশ্যই রাখুন" : "ছাতা ছাড়াই নিশ্চিন্তে বাইরে যেতে পারেন"}। আপনার আজকের দিনটি খুব সুন্দর কাটুক!`;
    }

    if (language === "ml") {
      if (tone === "scientific") {
        return `മോസം റേഡിയോ സിനോപ്റ്റിക് സ്റ്റേഷനിലേക്ക് സ്വാഗതം. ${locName}-ലെ നിലവിലെ ഉപരിതല താപനില ${temp} ഡിഗ്രി സെൽഷ്യസും അന്തരീക്ഷ മർദ്ദം ${pressure} ഹെക്ടോപാസ്കലുമാണ്. ആപേക്ഷിക ആർദ്രത ${humidity} ശതമാനവും മഞ്ഞുബിന്ദു ${dewPoint} ഡിഗ്രിയുമാണ്. കാലാവസ്ഥാ മോഡലുകൾ പ്രകാരം മഴയ്ക്കുള്ള സാധ്യത ${rainProb} ശതമാനം. കാറ്റിന്റെ വേഗത മണിക്കൂറിൽ ${wind} കിലോമീറ്ററും എയർ ക്വാളിറ്റി ഇൻഡക്സ് ${aqi} യുമാണ്.`;
      }
      if (tone === "poetic") {
        return `മോസം റേഡിയോയിൽ നിന്നുള്ള പ്രഭാത വന്ദനം. ഇന്ന് ${locName}-ലെ ആകാശം ${desc} വിടർന്നുനിൽക്കുന്നു. വായുവിൽ ${temp} ഡിഗ്രിയുടെ ഇളം തണുപ്പുണ്ട്, ശരീരത്തിൽ ${feelsLike} ഡിഗ്രിയായി തൊട്ടുണർത്തുന്നു. ആകാശത്ത് മേഘങ്ങൾ ${cloud} ശതമാനവും മണിക്കൂറിൽ ${wind} കി.മീ വേഗത്തിൽ കുളിർകാറ്റും വീശുന്നു. പ്രകൃതിയുടെ ഈ താളത്തിനൊപ്പം നിങ്ങളുടെ ദിനം സമാധാനപൂർണ്ണമാകട്ടെ.`;
      }
      return `നമസ്കാരം! ഇത് മോസം റേഡിയോ, ${locName}-ലെ നിങ്ങളുടെ തത്സമയ കാലാവസ്ഥാ വിവരങ്ങൾ. നിലവിലെ താപനില ${temp} ഡിഗ്രി സെൽഷ്യസാണ്, എന്നാൽ ${humidity} ശതമാനം ഈർപ്പം കാരണം ഇത് ${feelsLike} ഡിഗ്രിയായി അനുഭവപ്പെടുന്നു. ഇന്നലെയേക്കാൾ താപനില ഏകദേശം ${Math.abs(delta)} ഡിഗ്രി ${delta >= 0 ? "കൂടുതലാണ്" : "കുറവാണ്"}. ഇന്ന് മഴയ്ക്കുള്ള സാധ്യത ${rainProb} ശതമാനമാണ്, അതിനാൽ ${rainProb > 40 ? "പുറത്തിറങ്ങുമ്പോൾ ഒരു കുട കരുതുന്നത് നന്നായിരിക്കും" : "കുടയില്ലാതെ തന്നെ ധൈര്യമായി പുറത്തിറങ്ങാം"}. നിങ്ങളുടെ ദിനം സന്തോഷകരമായിരിക്കട്ടെ!`;
    }

    // Default "en" (English)
    if (tone === "scientific") {
      return `Welcome to Mosam Radio Synoptic Station for ${locName}. Current ground surface observations report ${temp} degrees Celsius, with barometric pressure trending ${retrospective.pressureTendency || "steady"} at ${pressure} hectopascals. Relative humidity stands at ${humidity} percent, yielding an effective dew point of ${dewPoint} degrees. Numerical consensus across ECMWF and GFS ensemble grids projects a ${rainProb} percent precipitation probability. Tropospheric wind vectors are sustained at ${wind} kilometers per hour. Atmospheric particulate quality reflects an AQI index of ${aqi}. Safe atmospheric transit conditions persist.`;
    }

    if (tone === "poetic") {
      return `Good day from Mosam Radio. Today, the sky over ${locName} unfolds with ${desc}. The air rests softly at ${temp} degrees, feeling like ${feelsLike} upon the skin. Yesterday's warmth has shifted by ${delta > 0 ? `plus ${delta}` : `${delta}`} degrees, carrying a subtle ${wind} kilometer breeze from the horizon. Look up—the cloud deck covers ${cloud} percent of the canopy, offering gentle respite from the sun. Breathe deeply, carry a warm beverage or a light shawl, and let the atmospheric rhythm guide your day.`;
    }

    return `Hey there! This is Mosam Radio with your live atmospheric check-in for ${locName}. Stepping outside right now, the air sits at ${temp} degrees, though with ${humidity} percent humidity, it feels more like ${feelsLike}. If you're comparing to yesterday at this exact time, we're running about ${Math.abs(delta)} degrees ${delta >= 0 ? "warmer" : "cooler"}. Your rain risk today is around ${rainProb} percent, so ${rainProb > 40 ? "definitely grab an umbrella just in case an afternoon shower rolls in" : "you're clear to leave the raincoat at home"}. Have a wonderful day out there!`;
  };

  // Start synthesized ambient sky soundscape via Web Audio API
  const startAmbientSound = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(ambientMuted ? 0 : ambientVolume * 0.15, ctx.currentTime);
      gainNode.connect(ctx.destination);
      gainNodeRef.current = gainNode;

      // Generate pink noise / rain & wind synthesis buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.15;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter based on rain vs wind
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(current.humidity > 70 ? 800 : 350, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      whiteNoise.start();
      ambientNodeRef.current = whiteNoise;
    } catch (e) {
      console.warn("Ambient audio context error", e);
    }
  };

  const stopAmbientSound = () => {
    if (ambientNodeRef.current) {
      try {
        ambientNodeRef.current.stop();
        ambientNodeRef.current.disconnect();
      } catch (e) {}
      ambientNodeRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
  };

  const handlePlayToggle = () => {
    if (isGuest) {
      setUpgradeModal(
        true,
        "Sign in to unlock Mosam Radio, 45-second live conversational briefings, and ambient sky soundscapes."
      );
      return;
    }

    if (isPlaying) {
      stop();
      stopAmbientSound();
      setIsPlaying(false);
      clearInterval(progressTimerRef.current);
      setProgress(0);
    } else {
      setIsPlaying(true);
      setProgress(0);
      const script = getBriefingScript();
      
      const handleSpeechComplete = () => {
        setIsPlaying(false);
        stopAmbientSound();
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
          progressTimerRef.current = null;
        }
        setProgress(0);
      };

      speak(script, language, handleSpeechComplete);
      startAmbientSound();

      // Progress bar simulation (45 seconds duration)
      const start = Date.now();
      const durationMs = 45000;
      progressTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
        setProgress(pct);
        if (pct >= 100) {
          handleSpeechComplete();
        }
      }, 500);
    }
  };

  // Toggle ambient mute
  const handleToggleAmbientMute = () => {
    const nextMuted = !ambientMuted;
    setAmbientMuted(nextMuted);
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        nextMuted ? 0 : ambientVolume * 0.15,
        audioContextRef.current.currentTime
      );
    }
  };

  useEffect(() => {
    return () => {
      stop();
      stopAmbientSound();
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [stop]);

  return (
    <section className="relative w-full rounded-3xl p-6 sm:p-8 bg-white/90 text-slate-800 border border-slate-200/80 shadow-md backdrop-blur-md overflow-hidden my-8">
      {/* Background Radio Grid Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header & Station Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-amber-500/25 animate-pulse-glow">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{t.radioTitle}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                104.2 MHz • {t.radioTag}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.radioSubtitle}
            </p>
          </div>
        </div>

        {/* Tone Selector */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
          <button
            onClick={() => setTone("casual")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              tone === "casual"
                ? "bg-amber-500 text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.toneLocalFriend}
          </button>
          <button
            onClick={() => setTone("scientific")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              tone === "scientific"
                ? "bg-amber-500 text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.toneMeteorologist}
          </button>
          <button
            onClick={() => setTone("poetic")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              tone === "poetic"
                ? "bg-amber-500 text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.toneStoryteller}
          </button>
        </div>
      </div>

      {/* Main Broadcast Player Console */}
      <div className="relative pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center z-10">
        {/* Guest Lock Overlay Teaser */}
        {isGuest && (
          <div className="absolute inset-0 z-20 backdrop-blur-[3px] bg-white/70 rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fade-in border border-amber-500/20">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/30 mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Mosam Radio is Exclusively for Members
            </h3>
            <p className="text-xs text-slate-600 max-w-md mt-1 mb-4">
              Sign in to listen to 45-second conversational AI weather briefings, soundscapes tailored to current rainfall & wind, and natural speech synthesis.
            </p>
            <button
              onClick={() =>
                setUpgradeModal(
                  true,
                  "Sign in to unlock Mosam Radio and personalized conversational weather audio broadcasts."
                )
              }
              className="py-2.5 px-6 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Unlock Mosam Radio with Free Sign-In</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        )}

        {/* Left Column: Player Controls & Equalizer */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
          {/* Animated Equalizer Waveform */}
          <div className="flex items-end justify-center gap-1.5 h-16 w-full px-4">
            {[40, 65, 85, 30, 95, 55, 75, 45, 90, 60, 35, 80, 50, 70, 85, 45].map((h, idx) => (
              <div
                key={idx}
                className="w-1.5 rounded-full bg-gradient-to-t from-amber-500 to-rose-500 transition-all duration-300"
                style={{
                  height: isPlaying ? `${Math.max(15, (h * (0.6 + Math.random() * 0.7)))}%` : "15%",
                  opacity: isPlaying ? 1 : 0.35,
                }}
              />
            ))}
          </div>

          {/* Big Play / Pause Button */}
          <button
            onClick={handlePlayToggle}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
            title={isPlaying ? "Pause Briefing" : "Play Briefing"}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-slate-950 text-slate-950" />
            ) : (
              <Play className="w-7 h-7 fill-slate-950 text-slate-950 ml-1" />
            )}
          </button>

          <div className="text-center">
            <span className="text-xs font-bold text-slate-800">
              {isPlaying ? t.radioBroadcasting : t.radioPlayPrompt}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Station: {selectedLocation.name} • Dual-Engine Synthesis
            </span>
          </div>
        </div>

        {/* Right Column: Scrub Bar, Script Preview & Ambient Controls */}
        <div className="lg:col-span-7 space-y-4">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>{isPlaying ? `0:${Math.min(45, Math.round((progress / 100) * 45)).toString().padStart(2, "0")}` : "0:00"}</span>
              <span className="text-amber-600 font-bold">0:45 Duration</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Script Closed Captions / Teaser Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5" />
                {t.scriptPreview}
              </span>
              <span className="text-[10px] text-slate-400">Tone: {tone}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic line-clamp-3">
              "{getBriefingScript()}"
            </p>
          </div>

          {/* Ambient Soundscape Toolbar */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleAmbientMute}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs transition-colors"
                title={ambientMuted ? "Unmute Sky Soundscape" : "Mute Sky Soundscape"}
              >
                {ambientMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-amber-500" />}
              </button>
              <div className="text-[11px]">
                <span className="font-bold text-slate-800 block">{t.ambientSoundscape}</span>
                <span className="text-[10px] text-slate-500">
                  {current.humidity > 70 ? t.raindropResonator : t.clearSkyDrone}
                </span>
              </div>
            </div>

            <span className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
              Web Audio Synthesizer
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
