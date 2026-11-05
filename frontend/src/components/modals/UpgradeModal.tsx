"use client";

import React from "react";
import Link from "next/link";
import { useWeatherStore, UserRole } from "@/store/useWeatherStore";
import {
  X,
  Sparkles,
  BookmarkCheck,
  BellRing,
  BrainCircuit,
  FileSpreadsheet,
  Sprout,
  Activity,
  Truck,
  PartyPopper,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const UpgradeModal: React.FC = () => {
  const {
    upgradeModalOpen,
    upgradeModalMessage,
    setUpgradeModal,
    loginAsRole,
  } = useWeatherStore();

  if (!upgradeModalOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    loginAsRole(role);
    setUpgradeModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-white/95 border border-slate-200 shadow-2xl backdrop-blur-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setUpgradeModal(false)}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-sky-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Atmospheric Intelligence Suite
          </h2>
          <p className="text-xs text-sky-600 font-semibold px-2">
            {upgradeModalMessage}
          </p>
        </div>

        {/* Benefits List */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
          <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
            Exclusive to Authenticated Members
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <span>Multi-Location Watchlist</span>
            </div>
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span>Push / SMS / Email Alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <span>Persistent AI Chat Memory</span>
            </div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>72h Synoptic CSV Export</span>
            </div>
          </div>
        </div>

        {/* 1-Click Instant Demo Login */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-600 block">
            Test immediately with a pre-configured role profile:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleRoleSelect("farmer")}
              className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-50/70 hover:bg-emerald-100 text-left flex items-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Sprout className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-emerald-900 truncate">
                  Farmer / Agronomist
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  Spray & Soil Tracking
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("athlete")}
              className="p-2.5 rounded-xl border border-sky-500/30 bg-sky-50/70 hover:bg-sky-100 text-left flex items-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Activity className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-sky-900 truncate">
                  Outdoor Athlete
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  Cardio, UV & AQI
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("logistics")}
              className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-50/70 hover:bg-indigo-100 text-left flex items-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Truck className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-indigo-900 truncate">
                  Logistics Manager
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  Fog & Highway Safety
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("planner")}
              className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-50/70 hover:bg-amber-100 text-left flex items-center gap-2 transition-all hover:scale-[1.01]"
            >
              <PartyPopper className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-amber-900 truncate">
                  Event Planner
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  Lawn Weddings & Wind
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Custom Sign In Link or Continue as Guest */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <Link
            href="/login"
            onClick={() => setUpgradeModal(false)}
            className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
          >
            <span>Or Sign In with Email & Password</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setUpgradeModal(false)}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
