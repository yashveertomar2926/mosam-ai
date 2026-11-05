"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWeatherStore, ChatMessage } from "@/store/useWeatherStore";
import { translations } from "@/lib/translations";
import { sendChatMessage, reverseGeocode } from "@/lib/api";
import { ChatMessageList } from "@/components/ai/ChatMessageList";
import { useSpeechRecognition } from "@/components/speech/useSpeechRecognition";
import {
  X,
  Send,
  Mic,
  MicOff,
  Maximize2,
  Sparkles,
  Bot,
  Loader2,
  Compass,
  BrainCircuit,
  Lock,
} from "lucide-react";

export const FloatingAiWidget: React.FC = () => {
  const {
    isChatDrawerOpen,
    setIsChatDrawerOpen,
    chatMessages,
    addChatMessage,
    selectedLocation,
    setSelectedLocation,
    weatherData,
    language,
    authStatus,
    userProfile,
    setUpgradeModal,
  } = useWeatherStore();

  const t = translations[language] || translations.en;
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLocatingGps, setIsLocatingGps] = useState(false);

  // Speech Recognition hook
  const { isListening, startListening, stopListening, isSupported } =
    useSpeechRecognition(language, (recognizedText) => {
      setInputValue(recognizedText);
      handleSend(recognizedText);
    });

  const getQueryChips = () => {
    switch (language) {
      case "hi":
        return [
          { label: "📍 मेरठ का मौसम", query: "मेरठ में आज मौसम कैसा है?" },
          { label: "📍 जयपुर का मौसम", query: "जयपुर में अभी मौसम कैसा रहेगा?" },
          { label: "🌾 कीटनाशक छिड़काव?", query: "क्या आज फसलों पर कीटनाशक या खाद का छिड़काव सुरक्षित है?" },
          { label: "🎉 आउटडोर शादी?", query: "क्या आज खुले मैदान में शादी या पार्टी रखना ठीक रहेगा?" },
          { label: "🎯 मेरी स्थिति", query: "मेरी वर्तमान लोकेशन पर मौसम कैसा है?" },
        ];
      case "te":
        return [
          { label: "📍 మీరట్ వాతావరణం", query: "మీరట్‌లో ఈరోజు వాతావరణం ఎలా ఉంది?" },
          { label: "📍 జైపూర్ వాతావరణం", query: "జైపూర్‌లో ఇప్పుడు వాతావరణం ఎలా ఉంది?" },
          { label: "🌾 మందుల పిచికారీ?", query: "ఈరోజు పొలంలో పురుగుమందుల పిచికారీ చేయవచ్చా?" },
          { label: "🎉 బహిరంగ వేడుక?", query: "ఈరోజు ఆరుబయట శుభకార్యం నిర్వహించవచ్చా?" },
          { label: "🎯 నా లൊకేషన్", query: "నా ప్రస్తుత ప్రదేశంలో వాతావరణం ఎలా ఉంది?" },
        ];
      case "ta":
        return [
          { label: "📍 மீரட் வானிலை", query: "இன்று மீரட்டில் வானிலை எப்படி உள்ளது?" },
          { label: "📍 ஜெய்ப்பூர் வானிலை", query: "ஜெய்ப்பூரில் இப்போது வானிலை எப்படி இருக்கிறது?" },
          { label: "🌾 மருந்து தெளிக்கலாமா?", query: "இன்று பயிர்களுக்கு பூச்சிக்கொல்லி மருந்து தெளிக்கலாமா?" },
          { label: "🎉 வெளிப்புற நிகழ்ச்சி?", query: "இன்று திறந்தவெளியில் சுபநிகழ்ச்சி நடத்தலாமா?" },
          { label: "🎯 எனது இருப்பிடம்", query: "எனது தற்போதைய இடத்தில் வானிலை எப்படி உள்ளது?" },
        ];
      case "mr":
        return [
          { label: "📍 मेरठचे हवामान", query: "आज मेरठमध्ये हवामान कसे आहे?" },
          { label: "📍 जयपूरचे हवामान", query: "जयपूरमध्ये सध्या हवामान कसे आहे?" },
          { label: "🌾 कीटकनाशक फवारणी?", query: "आज शेतात कीटकनाशक फवारणी करणे सुरक्षित आहे का?" },
          { label: "🎉 मैदानी कार्यक्रम?", query: "आज उघड्यावर लग्न किंवा समारंभ आयोजित करणे योग्य आहे का?" },
          { label: "🎯 माझे स्थान", query: "माझ्या सध्याच्या ठिकाणी हवामान कसे आहे?" },
        ];
      case "bn":
        return [
          { label: "📍 মিরাট আবহাওয়া", query: "আজ মিরাটে আবহাওয়া কেমন?" },
          { label: "📍 জয়পুর আবহাওয়া", query: "জয়পুরে এখন আবহাওয়া কেমন চলছে?" },
          { label: "🌾 কীটনাশক স্প্রে?", query: "আজ জমিতে কীটনাশক বা সার প্রয়োগ করা কি নিরাপদ?" },
          { label: "🎉 বাইরের অনুষ্ঠান?", query: "আজ বাইরে কোনো অনুষ্ঠান বা বিয়ের আয়োজন করা যাবে কি?" },
          { label: "🎯 আমার অবস্থান", query: "আমার বর্তমান অবস্থানে আবহাওয়া কেমন?" },
        ];
      case "ml":
        return [
          { label: "📍 മീററ്റ് കാലാവസ്ഥ", query: "മീററ്റിൽ ഇന്ന് കാലാവസ്ഥ എങ്ങനെയുണ്ട്?" },
          { label: "📍 ജയ്‌പൂർ കാലാവസ്ഥ", query: "ജയ്‌പൂരിൽ ഇപ്പോൾ കാലാവസ്ഥ എങ്ങനെയുണ്ട്?" },
          { label: "🌾 കീടനാശിനി പ്രയോഗം?", query: "ഇന്ന് വിളകൾക്ക് കീടനാശിനി തളിക്കുന്നത് സുരക്ഷിതമാണോ?" },
          { label: "🎉 ഔട്ട്ഡോർ പരിപാടി?", query: "ഇന്ന് വെളിമ്പ്രദേശത്ത് ചടങ്ങുകൾ നടത്താൻ സാധിക്കുമോ?" },
          { label: "🎯 എന്റെ ലൊക്കേഷൻ", query: "എന്റെ ലൊക്കേഷനിലെ കാലാവസ്ഥ എങ്ങനെയുണ്ട്?" },
        ];
      default:
        return [
          { label: "📍 Meerut weather", query: "What is the weather in Meerut today?" },
          { label: "📍 Jaipur weather", query: "How is the weather in Jaipur right now?" },
          { label: "🌾 Spray pesticides today?", query: "Can I spray pesticide or fertilizer today based on IMD Agromet?" },
          { label: "🎉 Outdoor wedding?", query: "Is it safe for an outdoor wedding or lawn event today?" },
          { label: "🎯 My location", query: "What is the weather at my current location?" },
        ];
    }
  };
  const queryChips = getQueryChips();

  const handleGpsClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const loc = await reverseGeocode(lat, lon);
          setSelectedLocation(loc);
          handleSend(`What is the weather right here in ${loc.name}?`);
        } catch (e) {
          console.error("GPS lookup failed", e);
        } finally {
          setIsLocatingGps(false);
        }
      },
      (err) => {
        console.warn("GPS lookup denied or error", err);
        setIsLocatingGps(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    addChatMessage(userMsg);
    setInputValue("");
    setIsSending(true);

    try {
      // Build history, incorporating persistent memory context if authenticated
      const history: Array<{ role: "user" | "assistant"; content: string }> = [];

      if (authStatus === "authenticated" && userProfile?.memoryNotes?.length) {
        history.push({
          role: "user",
          content: `[USER PROFILE & MEMORY CONTEXT: User Name: ${userProfile.name}, Role: ${userProfile.roleLabel}. Specific Memory Notes: ${userProfile.memoryNotes.join(" ")}]`,
        });
        history.push({
          role: "assistant",
          content: `Understood. I will ground my meteorological guidance in your profile as ${userProfile.roleLabel} and consider your specific requirements.`,
        });
      }

      const recentMessages = chatMessages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      history.push(...recentMessages);

      const res = await sendChatMessage(
        text,
        selectedLocation,
        weatherData,
        language,
        history
      );

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        engine: res.engine,
        authorityBadge: res.authorityBadge,
        askedLocation: res.askedLocation,
        isLocationSwitched: res.isLocationSwitched,
        requestedGps: res.requestedGps,
      };

      addChatMessage(botMsg);

      // If user requested GPS and we haven't triggered it yet
      if (res.requestedGps && !isLocatingGps) {
        handleGpsClick();
      }
    } catch (err) {
      console.error("Chat send failed", err);
      addChatMessage({
        id: `bot-err-${Date.now()}`,
        role: "assistant",
        content:
          "Unable to query atmospheric models at this moment. Current meteorological bulletin remains in effect.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        engine: "built-in-nlg",
        authorityBadge: "🏛️ IMD Alert: Active",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!isChatDrawerOpen && (
        <button
          onClick={() => setIsChatDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-sky-500/40 hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse-glow"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <span>{t.askMosamAi}</span>
        </button>
      )}

      {/* Collapsible Drawer Modal */}
      {isChatDrawerOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/90">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>mosam.AI</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-sky-100 text-sky-600">
                    Dual-Engine
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500">
                  Dashboard: <strong className="text-sky-600">{selectedLocation.name}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Expand to Fullscreen Route */}
              <Link
                href="/chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                title="Open Fullscreen Chat"
              >
                <Maximize2 className="w-4 h-4" />
              </Link>
              {/* Close Button */}
              <button
                onClick={() => setIsChatDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Memory / Session Context Sub-Banner */}
          <div className="px-3 py-1.5 bg-slate-100/80 border-b border-slate-200/60 flex items-center justify-between text-[10px]">
            {authStatus === "authenticated" && userProfile ? (
              <div className="flex items-center gap-1 text-purple-700 font-semibold truncate">
                <BrainCircuit className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                <span className="truncate">Memory Active: {userProfile.roleLabel}</span>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-slate-500 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  Guest session (chat resets on refresh)
                </span>
                <button
                  onClick={() =>
                    setUpgradeModal(
                      true,
                      "Sign in to save chat history and enable persistent AI memory."
                    )
                  }
                  className="font-bold text-sky-600 hover:underline"
                >
                  Save Chat
                </button>
              </div>
            )}
          </div>

          {/* Chat Messages */}
          <ChatMessageList messages={chatMessages} language={language} />

          {/* Quick Query Suggestion Chips */}
          <div className="px-3 py-1.5 overflow-x-auto flex gap-1.5 border-t border-slate-100 bg-slate-50/70 scrollbar-none flex-shrink-0">
            {queryChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-sky-50 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input & Voice & GPS Controls */}
          <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={t.chatPlaceholder}
              disabled={isSending}
              className="flex-1 py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />

            {/* GPS Locator Button */}
            <button
              onClick={handleGpsClick}
              disabled={isLocatingGps || isSending}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-colors"
              title="Locate me (GPS)"
            >
              {isLocatingGps ? (
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
              ) : (
                <Compass className="w-4 h-4 text-sky-500" />
              )}
            </button>

            {/* Voice Input Button */}
            {isSupported && (
              <button
                onClick={() => {
                  if (isListening) {
                    stopListening();
                  } else {
                    startListening();
                  }
                }}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening
                    ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                    : "border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
                title={isListening ? "Stop Listening" : "Voice Input (Web Speech)"}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={isSending || !inputValue.trim()}
              className="p-2.5 rounded-xl bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              title="Send Query"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
