"use client";

import { useState, useCallback } from "react";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getLocale = (language: string) => {
    switch (language) {
      case "hi":
        return "hi-IN";
      case "te":
        return "te-IN";
      case "ta":
        return "ta-IN";
      case "mr":
        return "mr-IN";
      case "bn":
        return "bn-IN";
      case "ml":
        return "ml-IN";
      default:
        return "en-IN";
    }
  };

  const speak = useCallback((text: string, language: string = "en", onEnd?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("SpeechSynthesis not available");
      onEnd?.();
      return;
    }

    // Cancel any active speech
    window.speechSynthesis.cancel();

    // Clean markdown formatting before speaking
    const cleanText = text
      .replace(/[*#_`]/g, "")
      .replace(/🏛️|🍃|🌾|🫁|🎉|👔|🚗|👕|🏃|📊|🌤️|💡|🎯/g, "")
      .replace(/\n+/g, " ")
      .trim();

    const targetLocale = getLocale(language);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = targetLocale;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick a regional voice if available
    const voices = window.speechSynthesis.getVoices?.() || [];
    const matchedVoice = voices.find(
      (v) => v.lang.toLowerCase() === targetLocale.toLowerCase() || v.lang.toLowerCase().startsWith(language.toLowerCase())
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    speak,
    stop,
  };
}
