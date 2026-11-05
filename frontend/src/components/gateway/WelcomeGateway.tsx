"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWeatherStore, UserRole } from "@/store/useWeatherStore";
import {
  CloudSun,
  Sparkles,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  BellRing,
  BookmarkCheck,
  BrainCircuit,
  Sprout,
  Activity,
  Truck,
  PartyPopper,
  Radio,
  FileSpreadsheet,
} from "lucide-react";

export const WelcomeGateway: React.FC = () => {
  const router = useRouter();
  const { authStatus, setGuestMode, loginAsRole } = useWeatherStore();
  const [showRolePicker, setShowRolePicker] = useState(false);

  // If already authenticated or guest, do not display
  if (authStatus !== "uninitialized") {
    return null;
  }

  const handleGuestContinue = () => {
    setGuestMode();
  };

  const handleSelectRole = (role: UserRole) => {
    loginAsRole(role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/40 backdrop-blur-md animate-fade-in">
      {/* Central Glassmorphic Card */}
      <div className="relative w-full max-w-2xl rounded-3xl p-6 sm:p-10 bg-white/95 border border-slate-200 shadow-2xl backdrop-blur-2xl space-y-8 my-auto">
        {/* Glow Accent */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-sky-500/20 blur-3xl pointer-events-none rounded-full" />

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-sky-50 border border-sky-200 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/30">
              <CloudSun className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">
              mosam<span className="text-amber-500 font-extrabold">.AI</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Don’t just see the weather. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500 bg-clip-text text-transparent">
              Understand it.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Atmospheric intelligence powered by ECMWF & GFS ensemble grids, IMD Agromet spray safety, CPCB National Air Quality, and warm conversational AI.
          </p>
        </div>

        {/* Feature Comparison Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
              <Radio className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              Ensemble & Radar
            </h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Doppler precipitation loops & 3-day retrospective synoptic delta.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              Official IMD & CPCB
            </h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              4-tier government color alerts and Agromet pesticide spray guidelines.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              Anti-Robot Mosam AI
            </h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Perceptive weather friend in English, Hindi, Telugu, and Malayalam.
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* OPTION 1: SIGN IN / UPGRADE (PRIMARY CTA) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span className="text-xs font-bold text-slate-900">
                  Atmospheric Intelligence Suite (Full Access)
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-600">
                Recommended
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
              <span className="flex items-center gap-1">
                <BookmarkCheck className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                Pinned Watchlist
              </span>
              <span className="flex items-center gap-1">
                <BellRing className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                SMS / Push Alerts
              </span>
              <span className="flex items-center gap-1">
                <BrainCircuit className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                Persistent AI Memory
              </span>
              <span className="flex items-center gap-1">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                CSV Data Export
              </span>
            </div>

            {!showRolePicker ? (
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <button
                  onClick={() => setShowRolePicker(true)}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>1-Click Role Sign In (Demo)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href="/login"
                  className="w-full sm:w-auto py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors text-center"
                >
                  Custom Email Sign In
                </Link>
              </div>
            ) : (
              <div className="space-y-2 pt-1 animate-fade-in">
                <p className="text-[11px] font-semibold text-slate-600">
                  Select a tailored profile to preview personalized thresholds:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSelectRole("farmer")}
                    className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-50/70 hover:bg-emerald-100 text-left flex items-center gap-2.5 transition-colors"
                  >
                    <Sprout className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-emerald-900">
                        Farmer / Agronomist
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Agromet Spray & Moisture
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectRole("athlete")}
                    className="p-2.5 rounded-xl border border-sky-500/30 bg-sky-50/70 hover:bg-sky-100 text-left flex items-center gap-2.5 transition-colors"
                  >
                    <Activity className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-sky-900">
                        Outdoor Athlete
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Marathon, UV & PM2.5
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectRole("logistics")}
                    className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-50/70 hover:bg-indigo-100 text-left flex items-center gap-2.5 transition-colors"
                  >
                    <Truck className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-indigo-900">
                        Logistics Manager
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Fog, Highway & Rain Risk
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectRole("planner")}
                    className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-50/70 hover:bg-amber-100 text-left flex items-center gap-2.5 transition-colors"
                  >
                    <PartyPopper className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-amber-900">
                        Event Planner
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Lawn Weddings & Gusts
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* OPTION 2: CONTINUE AS GUEST (SECONDARY CTA) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-800">
                  Instant Guest Access
                </span>
                <p className="text-[11px] text-slate-500">
                  No registration or email required. View any live city forecast and chat immediately.
                </p>
              </div>
            </div>

            <button
              onClick={handleGuestContinue}
              className="w-full sm:w-auto py-2 px-4 rounded-xl font-bold text-xs bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              <span>Continue as Guest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[10px] text-slate-400 pt-1">
          100% Free Atmospheric Intelligence • Powered by Open-Meteo & IMD • Google Maps Platform
        </div>
      </div>
    </div>
  );
};
