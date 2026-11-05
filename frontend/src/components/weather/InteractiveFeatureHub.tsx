"use client";

import React, { useState, useRef } from "react";
import { useWeatherStore } from "@/store/useWeatherStore";
import { translations } from "@/lib/translations";
import {
  Radio,
  Sparkles,
  History,
  Compass,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  CheckCircle2,
  X,
} from "lucide-react";

import { MosamRadio } from "@/components/sensory/MosamRadio";
import { LifePhysicsLab } from "@/components/sensory/LifePhysicsLab";
import { SensoryTimeMachine } from "@/components/sensory/SensoryTimeMachine";
import { DecisionWindowsGrid } from "@/components/weather/DecisionWindowsGrid";

type FeatureKey = "radio" | "physics" | "timeMachine" | "decision";

export const InteractiveFeatureHub: React.FC = () => {
  const { language, weatherData } = useWeatherStore();
  const t = translations[language] || translations.en;
  const fd = t.featureDeck || translations.en.featureDeck!;

  const [activeFeature, setActiveFeature] = useState<FeatureKey | "all" | null>(null);
  const maximizedContainerRef = useRef<HTMLDivElement | null>(null);

  if (!weatherData) return null;

  const features: Array<{
    id: FeatureKey;
    title: string;
    badge: string;
    description: string;
    icon: React.ReactNode;
    gradient: string;
    ringColor: string;
    activeBorder: string;
    activeBg: string;
    hoverBorder: string;
  }> = [
    {
      id: "radio",
      title: t.radioTitle || "mosam.FM Radio",
      badge: t.radioTag || "104.2 MHz Live",
      description: t.radioSubtitle || "45-second conversational AI weather dispatch with ambient sky soundscape",
      icon: <Radio className="w-5 h-5 text-white" />,
      gradient: "from-orange-500 via-amber-500 to-rose-500",
      ringColor: "ring-orange-400/40",
      activeBorder: "border-orange-400",
      activeBg: "bg-orange-50/50",
      hoverBorder: "hover:border-orange-300 hover:shadow-orange-500/10",
    },
    {
      id: "physics",
      title: t.physicsLab?.title || "Life Physics Lab",
      badge: t.physicsLab?.badge || "Thermodynamic Model",
      description: t.physicsLab?.subtitle || "Real-world thermodynamics: Laundry drying, chai cooling, windshield fog, mosquitoes & hydration",
      icon: <Sparkles className="w-5 h-5 text-white" />,
      gradient: "from-sky-500 via-blue-600 to-indigo-600",
      ringColor: "ring-sky-400/40",
      activeBorder: "border-sky-400",
      activeBg: "bg-sky-50/50",
      hoverBorder: "hover:border-sky-300 hover:shadow-sky-500/10",
    },
    {
      id: "timeMachine",
      title: t.timeMachine?.title || "Sensory Time Machine",
      badge: t.timeMachine?.badge || "72h Synoptic Delta",
      description: t.timeMachine?.subtitle || "Scrub backwards across synoptic grids to compare how today feels vs. yesterday",
      icon: <History className="w-5 h-5 text-white" />,
      gradient: "from-purple-500 via-indigo-600 to-amber-500",
      ringColor: "ring-purple-400/40",
      activeBorder: "border-purple-400",
      activeBg: "bg-purple-50/50",
      hoverBorder: "hover:border-purple-300 hover:shadow-purple-500/10",
    },
    {
      id: "decision",
      title: t.decisionTitle || "Weather Decision Windows",
      badge: "20 " + (t.filterAll || "Activities"),
      description: t.decisionSubtitle || "Atmospheric feasibility indices calibrated for agriculture, commute, sports & outdoor events",
      icon: <Compass className="w-5 h-5 text-white" />,
      gradient: "from-emerald-500 via-teal-600 to-cyan-600",
      ringColor: "ring-emerald-400/40",
      activeBorder: "border-emerald-400",
      activeBg: "bg-emerald-50/50",
      hoverBorder: "hover:border-emerald-300 hover:shadow-emerald-500/10",
    },
  ];

  const handleToggle = (id: FeatureKey) => {
    if (activeFeature === id) {
      setActiveFeature(null);
    } else {
      setActiveFeature(id);
      setTimeout(() => {
        maximizedContainerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 50);
    }
  };

  const handleMinimize = () => {
    setActiveFeature(null);
  };

  const activeFeatureObj = features.find((f) => f.id === activeFeature);

  return (
    <section className="w-full my-6 space-y-4">
      {/* Deck Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {fd.hubTitle}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700 border border-sky-200">
              4 Labs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {fd.hubSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {activeFeature !== null ? (
            <button
              onClick={handleMinimize}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all shadow-xs"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>{fd.collapseAll}</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveFeature("all")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-all shadow-xs"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{fd.expandAll}</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Compact Interactive Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {features.map((feature) => {
          const isMaximized = activeFeature === feature.id || activeFeature === "all";

          return (
            <div
              key={feature.id}
              onClick={() => handleToggle(feature.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleToggle(feature.id);
                }
              }}
              className={`group relative rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                isMaximized
                  ? `bg-white/95 ${feature.activeBorder} ${feature.activeBg} ring-2 ${feature.ringColor} shadow-md`
                  : `bg-white/85 border-slate-200/80 shadow-xs hover:shadow-md ${feature.hoverBorder} hover:bg-white`
              }`}
            >
              <div>
                {/* Top Row: Icon + Badge / Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div
                    className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${feature.gradient} flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform flex-shrink-0`}
                  >
                    {feature.icon}
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border transition-all ${
                      isMaximized
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-sky-50 group-hover:text-sky-700 group-hover:border-sky-200"
                    }`}
                  >
                    {isMaximized ? (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {fd.maximizedStatus}
                      </span>
                    ) : (
                      feature.badge
                    )}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-sky-700 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1 line-clamp-2">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Interactive Trigger Pill */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                <span
                  className={
                    isMaximized
                      ? "text-slate-800 flex items-center gap-1"
                      : "text-slate-500 group-hover:text-sky-600 flex items-center gap-1 transition-colors"
                  }
                >
                  {isMaximized ? fd.clickToMinimize : fd.clickToMaximize}
                </span>

                <div
                  className={`p-1.5 rounded-lg transition-transform ${
                    isMaximized
                      ? "bg-slate-900 text-white rotate-180"
                      : "bg-slate-100 group-hover:bg-sky-100 text-slate-600 group-hover:text-sky-700 group-hover:translate-x-0.5"
                  }`}
                >
                  {isMaximized ? (
                    <Minimize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Maximized Feature Viewport (Placed Directly in Front of User) */}
      {activeFeature !== null && (
        <div
          ref={maximizedContainerRef}
          className="pt-2 animate-in fade-in zoom-in-95 duration-200 space-y-4"
        >
          {/* Maximized Sticky Control Header */}
          <div className="rounded-2xl p-3 sm:p-4 bg-white/95 border border-slate-200/90 shadow-md backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {fd.maximizedStatus}:
                </span>
                <strong className="text-sm font-black text-slate-900">
                  {activeFeature === "all" ? fd.expandAll : activeFeatureObj?.title}
                </strong>
              </div>
            </div>

            {/* Quick-Switch Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              {features.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFeature(f.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                    activeFeature === f.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                  <span>{f.title}</span>
                </button>
              ))}
            </div>

            {/* Minimize / Close Button */}
            <button
              onClick={handleMinimize}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all ml-auto sm:ml-0 shadow-xs"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>{fd.clickToMinimize}</span>
            </button>
          </div>

          {/* Maximized Feature Body */}
          <div className="space-y-6">
            {(activeFeature === "radio" || activeFeature === "all") && (
              <div className="relative">
                <MosamRadio />
              </div>
            )}

            {(activeFeature === "physics" || activeFeature === "all") && (
              <div className="relative">
                <LifePhysicsLab />
              </div>
            )}

            {(activeFeature === "timeMachine" || activeFeature === "all") && (
              <div className="relative">
                <SensoryTimeMachine />
              </div>
            )}

            {(activeFeature === "decision" || activeFeature === "all") && (
              <div className="relative">
                <DecisionWindowsGrid />
              </div>
            )}
          </div>

          {/* Bottom Return to Deck Bar */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
            <button
              onClick={handleMinimize}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-white border border-slate-200 transition-all shadow-xs"
            >
              <ChevronUp className="w-4 h-4 text-sky-600" />
              <span>{fd.backToDeck}</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
