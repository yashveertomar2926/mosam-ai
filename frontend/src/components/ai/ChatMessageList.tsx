"use client";

import React from "react";
import { useWeatherStore, ChatMessage, LocationItem } from "@/store/useWeatherStore";
import { useSpeechSynthesis } from "@/components/speech/useSpeechSynthesis";
import {
  Bot,
  User,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Check,
} from "lucide-react";

interface ChatMessageListProps {
  messages: ChatMessage[];
  language: string;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  language,
}) => {
  const { isSpeaking, speak, stop } = useSpeechSynthesis();
  const { selectedLocation, setSelectedLocation } = useWeatherStore();

  // Helper to extract target location from metadata tag if present
  const extractTargetLocation = (msg: ChatMessage): LocationItem | null => {
    if (!msg) return null;
    if (msg.askedLocation) {
      return msg.askedLocation;
    }
    if (typeof msg.content !== "string") return null;
    const match = msg.content.match(/\[TARGET_LOCATION:\s*(\{.*?\})\]/);
    if (match) {
      try {
        const parsed = JSON.parse(match[1]);
        if (!parsed || typeof parsed !== "object" || !parsed.name) return null;
        return {
          name: String(parsed.name),
          formattedAddress: `${parsed.name}${parsed.state ? `, ${parsed.state}` : ""}${parsed.country ? `, ${parsed.country}` : ""}`,
          latitude: Number(parsed.latitude) || selectedLocation.latitude,
          longitude: Number(parsed.longitude) || selectedLocation.longitude,
          timezone: "auto",
          country: parsed.country ? String(parsed.country) : undefined,
          state: parsed.state ? String(parsed.state) : undefined,
        };
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const getCleanContent = (content: string | undefined | null) => {
    if (!content || typeof content !== "string") return "";
    return content.replace(/\[TARGET_LOCATION:\s*\{.*?\}\]/g, "").trim();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => {
        const isUser = msg.role === "user";
        const targetLoc = !isUser ? extractTargetLocation(msg) : null;
        const isDifferentCity =
          targetLoc &&
          targetLoc.name.toLowerCase() !== selectedLocation.name.toLowerCase();
        const isCurrentCityActive =
          targetLoc &&
          targetLoc.name.toLowerCase() === selectedLocation.name.toLowerCase();

        const cleanText = getCleanContent(msg.content);

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              isUser ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
                isUser
                  ? "bg-slate-700"
                  : "bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-sky-500/20"
              }`}
            >
              {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                isUser
                  ? "bg-sky-600 text-white rounded-tr-none shadow-md shadow-sky-600/20"
                  : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs"
              }`}
            >
              {/* Content text */}
              <div className="whitespace-pre-line space-y-1.5 font-normal">
                {cleanText}
              </div>

              {/* Interactive Target Location Switch Chip */}
              {isDifferentCity && targetLoc && (
                <div className="mt-3 pt-2.5 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setSelectedLocation(targetLoc);
                    }}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-all shadow-xs group text-left"
                    title={`Update main dashboard to ${targetLoc.name}`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-sky-500 flex-shrink-0 animate-bounce" />
                      <span className="truncate">Answered for {targetLoc.name}</span>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-sky-600 font-extrabold flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
                      Switch Dashboard <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                </div>
              )}

              {isCurrentCityActive && targetLoc && (
                <div className="mt-2 text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" /> Active on Dashboard ({targetLoc.name})
                </div>
              )}

              {/* Authority Badge Footer */}
              {msg.authorityBadge && !isUser && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-[10px] text-slate-500">
                  <div className="flex items-center gap-1 font-semibold text-sky-600">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{msg.authorityBadge}</span>
                  </div>

                  {/* Read-Aloud TTS Button */}
                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        stop();
                      } else {
                        speak(cleanText, language);
                      }
                    }}
                    className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-sky-500 transition-colors"
                    title={isSpeaking ? "Stop Speaking" : "Read Aloud"}
                  >
                    {isSpeaking ? (
                      <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}

              {/* Timestamp */}
              <div
                className={`text-[9px] mt-1 ${
                  isUser ? "text-sky-200 text-right" : "text-slate-400 text-left"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
