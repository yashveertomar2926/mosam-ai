"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWeatherStore, UserRole } from "@/store/useWeatherStore";
import { useSpeechSynthesis } from "@/components/speech/useSpeechSynthesis";
import { AtmosphericCanvas } from "@/components/canvas/AtmosphericCanvas";
import {
  CloudSun,
  Sparkles,
  ArrowRight,
  UserCheck,
  Shirt,
  Coffee,
  Radio,
  Play,
  Pause,
  History,
  Eye,
  Sun,
  Wind,
  CloudDrizzle,
  Lock,
  Mail,
  User,
  CheckCircle2,
  ShieldCheck,
  Sliders,
  TrendingUp,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setGuestMode, loginAsRole, loginCustom } = useWeatherStore();
  const { isSpeaking, speak, stop } = useSpeechSynthesis();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("farmer");

  // Micro-demo interactive states
  const [demoFabric, setDemoFabric] = useState<"synthetic" | "cotton">("cotton");
  const [demoRadioPlaying, setDemoRadioPlaying] = useState(false);
  const [demoTimeScrub, setDemoTimeScrub] = useState(75);
  const [demoVote, setDemoVote] = useState<string>("drizzle");

  const handleContinueAsGuest = () => {
    setGuestMode();
    router.push("/");
  };

  const handleQuickRole = (role: UserRole) => {
    loginAsRole(role);
    router.push("/");
  };

  const handleGoogleSignIn = () => {
    loginCustom("Google Member", "user@gmail.com", "general");
    router.push("/");
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginCustom(name || "Atmospheric Analyst", email || "member@mosam.ai", selectedRole);
    router.push("/");
  };

  const handlePlayDemoRadio = () => {
    if (demoRadioPlaying) {
      stop();
      setDemoRadioPlaying(false);
    } else {
      setDemoRadioPlaying(true);
      speak("Welcome to Mosam Radio. Today's air feels remarkably crisp with gentle high-altitude clouds. Have a wonderful day!", "en");
      setTimeout(() => setDemoRadioPlaying(false), 8000);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center p-4 sm:p-6 lg:p-10">
      <AtmosphericCanvas />

      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: HERO SHOWCASE OF THE 4 SENSORY ATMOSPHERIC MODULES          */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header & Tagline */}
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
                <CloudSun className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                mosam<span className="text-amber-500">.AI Pro</span>
              </span>
            </Link>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Don't just see the weather. <br />
              <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500 bg-clip-text text-transparent">
                Feel it with mosam.AI Pro.
              </span>
            </h1>

            <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
              Unlock the four signature Sensory Atmospheric Intelligence modules. Built on thermodynamic equations, biophysical comfort models, and community Doppler verification.
            </p>
          </div>

          {/* 4 Interactive Micro-Demo Showcase Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Everyday Physics Lab Micro-Demo */}
            <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs space-y-3 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-100 text-sky-600">
                    <Shirt className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    Life Physics Lab
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-600">
                  Interactive Demo
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-[10px] text-slate-400 block">Laundry Drying Time</span>
                  <span className="text-lg font-black text-sky-600">
                    {demoFabric === "synthetic" ? "1.2 hrs" : "2.5 hrs"}
                  </span>
                </div>
                <div className="flex gap-1 text-[10px]">
                  <button
                    onClick={() => setDemoFabric("synthetic")}
                    className={`px-2 py-1 rounded-lg font-bold transition-colors ${demoFabric === "synthetic" ? "bg-sky-500 text-white shadow-xs" : "bg-white text-slate-700 border border-slate-200"}`}
                  >
                    Synthetic
                  </button>
                  <button
                    onClick={() => setDemoFabric("cotton")}
                    className={`px-2 py-1 rounded-lg font-bold transition-colors ${demoFabric === "cotton" ? "bg-sky-500 text-white shadow-xs" : "bg-white text-slate-700 border border-slate-200"}`}
                  >
                    Cotton
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-500">
                Calculates evaporative drying rate, windshield fogging risk & chai cooling speed.
              </p>
            </div>

            {/* 2. Mosam Radio Micro-Demo */}
            <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs space-y-3 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
                    <Radio className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    Mosam Radio (104.2 FM)
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
                  Audio Sample
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePlayDemoRadio}
                    className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                  >
                    {demoRadioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {demoRadioPlaying ? "Broadcasting..." : "Tap to Play"}
                    </span>
                    <span className="text-[10px] text-slate-400">45s Conversational Voice</span>
                  </div>
                </div>

                {/* Animated Equalizer Waveform */}
                <div className="flex items-end gap-1 h-6">
                  {[40, 80, 50, 95, 30].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-amber-500 rounded-full transition-all duration-300"
                      style={{ height: demoRadioPlaying ? `${h}%` : "20%" }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-slate-500">
                Plays continuous conversational dispatches with ambient rainfall/wind audio.
              </p>
            </div>

            {/* 3. The Sensory Time Machine Micro-Demo */}
            <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs space-y-3 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600">
                    <History className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    Sensory Time Machine
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600">
                  Scrub Slider
                </span>
              </div>

              <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-slate-500">Yesterday</span>
                  <span className="font-bold text-indigo-600">
                    {demoTimeScrub < 50 ? "24.5°C (Cooler)" : "+2.8°C Warmer Today"}
                  </span>
                  <span className="font-semibold text-slate-500">Today</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={demoTimeScrub}
                  onChange={(e) => setDemoTimeScrub(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <p className="text-[10px] text-slate-500">
                Interactive Yesterday vs Today delta translating dew point & barometric shifts.
              </p>
            </div>

            {/* 4. Mosam Lens Micro-Demo */}
            <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs space-y-3 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-100 text-teal-600">
                    <Eye className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    Mosam Lens
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-600">
                  Live Voting
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                {[
                  { id: "clear", label: "Clear", icon: <Sun className="w-3.5 h-3.5" /> },
                  { id: "gusty", label: "Gusty", icon: <Wind className="w-3.5 h-3.5" /> },
                  { id: "drizzle", label: "Drizzle", icon: <CloudDrizzle className="w-3.5 h-3.5" /> },
                  { id: "rain", label: "Rain", icon: <Sparkles className="w-3.5 h-3.5" /> },
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setDemoVote(v.id)}
                    className={`p-1.5 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-colors ${
                      demoVote === v.id
                        ? "bg-teal-500 text-white shadow-xs"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {v.icon}
                    <span>{v.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500">
                1-tap crowdsourced sky verification with Doppler radar vs. ground-truth consensus.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: HIGH-CONVERTING SIGN-IN & PROFILE SELECTION CARD           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto rounded-3xl p-6 sm:p-8 bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl space-y-5">
          {/* Card Header */}
          <div className="text-center space-y-1 pb-1">
            <h2 className="text-xl font-black text-slate-900">
              Sign In to mosam.AI Pro
            </h2>
            <p className="text-xs text-slate-500">
              Unlock the complete Atmospheric Intelligence suite
            </p>
          </div>

          {/* 1-Click Google Sign-In Demo */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 flex items-center justify-center gap-2.5 shadow-xs transition-all hover:scale-[1.01]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider absolute">
              Or 1-Click Role Profiles
            </span>
          </div>

          {/* 1-Click Role Demo Sign-In */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickRole("farmer")}
              className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-50/70 hover:bg-emerald-100 text-left transition-all hover:scale-[1.01]"
            >
              <div className="text-xs font-extrabold text-emerald-800 flex items-center gap-1">
                <span>🌾 Farmer</span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                Agromet & Spray Windows
              </span>
            </button>

            <button
              onClick={() => handleQuickRole("athlete")}
              className="p-2.5 rounded-xl border border-sky-500/30 bg-sky-50/70 hover:bg-sky-100 text-left transition-all hover:scale-[1.01]"
            >
              <div className="text-xs font-extrabold text-sky-800 flex items-center gap-1">
                <span>🏃 Athlete</span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                Cardio, UV & AQI Limit
              </span>
            </button>

            <button
              onClick={() => handleQuickRole("logistics")}
              className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-50/70 hover:bg-indigo-100 text-left transition-all hover:scale-[1.01]"
            >
              <div className="text-xs font-extrabold text-indigo-800 flex items-center gap-1">
                <span>🚚 Logistics</span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                Fog & Highway Transit
              </span>
            </button>

            <button
              onClick={() => handleQuickRole("planner")}
              className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-50/70 hover:bg-amber-100 text-left transition-all hover:scale-[1.01]"
            >
              <div className="text-xs font-extrabold text-amber-800 flex items-center gap-1">
                <span>🎪 Planner</span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                Lawn Events & Gusts
              </span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider absolute">
              Custom Email Sign In
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@domain.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-md shadow-sky-500/25 transition-all"
            >
              Sign In to Pro Account
            </button>
          </form>

          {/* Guaranteed Continue as Guest Option */}
          <div className="pt-2 border-t border-slate-100 text-center space-y-1">
            <button
              onClick={handleContinueAsGuest}
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Continue as Guest (Limited Dashboard) →</span>
            </button>
            <p className="text-[10px] text-slate-400">
              Access standard forecasts, Doppler radar & basic AI without saving profile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
