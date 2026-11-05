"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWeatherStore, ChatMessage } from "@/store/useWeatherStore";
import { translations } from "@/lib/translations";
import { sendChatMessage, reverseGeocode } from "@/lib/api";
import { ChatMessageList } from "@/components/ai/ChatMessageList";
import { useSpeechRecognition } from "@/components/speech/useSpeechRecognition";
import { AtmosphericCanvas } from "@/components/canvas/AtmosphericCanvas";
import {
  ArrowLeft,
  Bot,
  Sparkles,
  Send,
  Mic,
  MicOff,
  ShieldCheck,
  Sprout,
  HeartPulse,
  History,
  Loader2,
  Trash2,
  Compass,
  MapPin,
  BrainCircuit,
  Lock,
  Zap,
} from "lucide-react";

export default function FullscreenChatPage() {
  const {
    chatMessages,
    addChatMessage,
    clearChatMessages,
    selectedLocation,
    setSelectedLocation,
    weatherData,
    language,
    setLanguage,
    authStatus,
    userProfile,
    setUpgradeModal,
  } = useWeatherStore();

  const t = translations[language] || translations.en;
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLocatingGps, setIsLocatingGps] = useState(false);

  const { isListening, startListening, stopListening, isSupported } =
    useSpeechRecognition(language, (recognizedText) => {
      setInputValue(recognizedText);
      handleSend(recognizedText);
    });

  const promptCategories = [
    {
      title: "Check Another City",
      icon: <MapPin className="w-4 h-4 text-sky-500" />,
      questions: [
        "What is the weather in Meerut today?",
        "मेरठ का मौसम कैसा है",
        "How is the weather in Jaipur right now?",
        "Will it rain in Mumbai tomorrow?",
        "హైదరాబాద్ లో వాతావరణం",
      ],
    },
    {
      title: "Agricultural & Agromet",
      icon: <Sprout className="w-4 h-4 text-emerald-500" />,
      questions: [
        "Can I spray pesticide or fertilizer today based on IMD Agromet?",
        "Is soil drainage required given the recent and forecasted rainfall?",
        "What crop management precautions are needed for today's temperature?",
      ],
    },
    {
      title: "Events & Attire",
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      questions: [
        "Is the weather suitable for an outdoor evening wedding celebration?",
        "What should I wear today for thermal comfort and UV protection?",
        "Is today a good day for outdoor laundry drying?",
      ],
    },
    {
      title: "Health & Asthma",
      icon: <HeartPulse className="w-4 h-4 text-rose-500" />,
      questions: [
        "What is the CPCB AQI and respiratory risk for sensitive individuals?",
        "Is it safe to do high-intensity outdoor running or cardio today?",
        "Do atmospheric inversion conditions exist that trap particulate pollutants?",
      ],
    },
    {
      title: "Retrospective Analysis",
      icon: <History className="w-4 h-4 text-indigo-500" />,
      questions: [
        "How does today's temperature compare to yesterday at this exact hour?",
        "What was the total rain accumulation in the past 72 hours?",
        "What does the barometric pressure tendency tell us about upcoming weather?",
      ],
    },
  ];

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

  const bulletin = weatherData?.governmentBulletin;
  const cpcb = bulletin?.cpcbNaqi;

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      <AtmosphericCanvas />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-slate-200/80 px-4 sm:px-6 h-16 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900">
                mosam.AI Assistant
              </h1>
              <p className="text-[10px] text-slate-500">
                Active Dashboard: <strong className="text-sky-600">{selectedLocation.name}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Right Controls: Auth Status, Clear & Language */}
        <div className="flex items-center gap-2">
          {authStatus === "authenticated" && userProfile ? (
            <div className="hidden md:flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-semibold">
              <BrainCircuit className="w-3.5 h-3.5 text-purple-500" />
              <span>Memory: {userProfile.role}</span>
            </div>
          ) : (
            <button
              onClick={() =>
                setUpgradeModal(
                  true,
                  "Sign in to save chat history and enable persistent AI memory across sessions."
                )
              }
              className="hidden sm:flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold shadow-xs"
            >
              <Zap className="w-3 h-3" />
              <span>Save Chat</span>
            </button>
          )}

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer"
          >
            <option value="en">English (EN)</option>
            <option value="hi">हिन्दी (HI)</option>
            <option value="te">తెలుగు (TE)</option>
            <option value="ta">தமிழ் (TA)</option>
            <option value="mr">मराठी (MR)</option>
            <option value="bn">বাংলা (BN)</option>
            <option value="ml">മലയാളം (ML)</option>
          </select>

          <button
            onClick={clearChatMessages}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace (Split Grid on Desktop) */}
      <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-4rem)]">
        {/* Left Sidebar: Meteorological Summary & Memory */}
        <aside className="hidden lg:flex lg:col-span-4 flex-col gap-4 overflow-y-auto pr-1">
          {/* Active Synoptic Snapshot Card */}
          <div className="rounded-2xl p-4 bg-white/90 border border-slate-200/80 backdrop-blur-md shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Current Dashboard
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                {selectedLocation.name}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {weatherData?.current?.temperature ?? 25}°C
              </span>
              <span className="text-xs text-sky-600 font-semibold">
                {weatherData?.current?.weatherDescription || "Fair"}
              </span>
            </div>

            <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">IMD Agromet Spray:</span>
                <span className="font-bold text-slate-800">
                  {bulletin?.agromet?.spraySafetyStatus || "SAFE"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CPCB NAQI Air Quality:</span>
                <span className="font-bold text-slate-800">
                  {cpcb?.index || 60} ({cpcb?.category || "Satisfactory"})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Atmospheric Humidity:</span>
                <span className="font-bold text-slate-800">
                  {weatherData?.current?.humidity ?? 55}%
                </span>
              </div>
            </div>
          </div>

          {/* Persistent AI Memory Profile Card (for Authenticated Users) */}
          {authStatus === "authenticated" && userProfile ? (
            <div className="rounded-2xl p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                <BrainCircuit className="w-4 h-4 text-purple-600" />
                <span>Persistent Memory Profile</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                mosam.AI remembers your specific agronomic or lifestyle context across conversations:
              </p>
              <ul className="text-[10px] text-slate-600 space-y-1 list-disc list-inside">
                {userProfile.memoryNotes.map((note, idx) => (
                  <li key={idx} className="leading-snug">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Session-Only AI Memory</span>
              </div>
              <p className="text-[11px] text-slate-500">
                You are chatting as a guest. Questions and conversation history will disappear when the browser is closed.
              </p>
              <button
                onClick={() =>
                  setUpgradeModal(
                    true,
                    "Sign in to persist your AI consultation memory across all devices."
                  )
                }
                className="text-xs font-bold text-sky-600 hover:underline block pt-1"
              >
                Sign in to save memory →
              </button>
            </div>
          )}

          {/* Categorized Inquiry Scenarios */}
          <div className="flex-1 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
              Explore Atmospheric Scenarios
            </span>
            {promptCategories.map((cat, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-3 bg-white/90 border border-slate-200/80 backdrop-blur-sm space-y-1.5 shadow-xs"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  {cat.icon}
                  <span>{cat.title}</span>
                </div>
                <div className="space-y-1 pt-1">
                  {cat.questions.map((q, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => handleSend(q)}
                      className="w-full text-left text-[11px] p-1.5 rounded-lg text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-colors line-clamp-1"
                    >
                      • {q}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Chat Column */}
        <main className="lg:col-span-8 flex flex-col h-full rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl overflow-hidden">
          {/* Chat Messages */}
          <ChatMessageList messages={chatMessages} language={language} />

          {/* Input & Voice & GPS Bar */}
          <div className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={t.chatPlaceholder}
              disabled={isSending}
              className="flex-1 py-2.5 px-4 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />

            {/* GPS Locator Button */}
            <button
              onClick={handleGpsClick}
              disabled={isLocatingGps || isSending}
              className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-colors"
              title="Check Live GPS Location"
            >
              {isLocatingGps ? (
                <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
              ) : (
                <Compass className="w-5 h-5 text-sky-500" />
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
                className={`p-3 rounded-xl border transition-all ${
                  isListening
                    ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                    : "border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
                title={isListening ? "Stop Listening" : "Voice Input (Web Speech)"}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={isSending || !inputValue.trim()}
              className="p-3 rounded-xl bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              title="Send Message"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
