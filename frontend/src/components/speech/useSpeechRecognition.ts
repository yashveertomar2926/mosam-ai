"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useSpeechRecognition(lang: string = "en", onResult?: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        const recognizer = new SpeechRecognition();
        recognizer.continuous = false;
        recognizer.interimResults = false;
        recognizer.lang = getLocale(lang);

        recognizer.onresult = (event: any) => {
          const currentText = event.results[0][0].transcript;
          setTranscript(currentText);
          setIsListening(false);
          if (onResult) {
            onResult(currentText);
          }
        };

        recognizer.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognizer.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognizer;
      }
    }
  }, [lang, onResult]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.lang = getLocale(lang);
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript("");
    } catch (e) {
      console.warn("Recognition already active or failed", e);
    }
  }, [lang]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (e) {
      console.warn("Stop error", e);
    }
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
  };
}
