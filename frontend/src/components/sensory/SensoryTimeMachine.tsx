"use client";

import React, { useState } from "react";
import { useWeatherStore } from "@/store/useWeatherStore";
import { translations } from "@/lib/translations";
import {
  History,
  Clock,
  Sparkles,
  Lock,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Sun,
  CloudRain,
  Gauge,
  Droplets,
  Layers,
} from "lucide-react";

export const SensoryTimeMachine: React.FC = () => {
  const { weatherData, language, isGuest, setUpgradeModal } = useWeatherStore();
  const t = translations[language] || translations.en;
  const tm = t.timeMachine || translations.en.timeMachine!;

  const [scrubPosition, setScrubPosition] = useState<number>(100); // 0 = Yesterday, 100 = Today

  if (!weatherData) return null;

  const current = weatherData.current || {};
  const retrospective = weatherData.retrospective || {};
  const temp = Number(current.temperature ?? 27) || 27;
  const delta24h = Number(retrospective.tempDelta24h ?? 1.5) || 1.5;
  const yesterdayTemp = temp - delta24h;
  const rainAccum = Number(retrospective.rainAccumulationPast72h ?? 0) || 0;
  const pressureTendency = retrospective.pressureTendency || "Steady";

  // Interpolated scrub parameters
  const scrubRatio = Math.max(0, Math.min(1, (scrubPosition ?? 100) / 100));
  const calcTemp = yesterdayTemp + delta24h * scrubRatio;
  const displayedTemp = isFinite(calcTemp) && !isNaN(calcTemp) ? calcTemp.toFixed(1) : temp.toFixed(1);
  const isViewingYesterday = scrubPosition < 50;

  const getLocalizedTendency = () => {
    if (language === "hi") {
      return pressureTendency.includes("Rising") ? "दबाव में वृद्धि (Rising)" : pressureTendency.includes("Falling") ? "दबाव में गिरावट (Falling)" : "स्थिर वायुदाब (Steady)";
    }
    if (language === "te") {
      return pressureTendency.includes("Rising") ? "పీడనం పెరుగుతోంది (Rising)" : pressureTendency.includes("Falling") ? "పీడనం తగ్గుతోంది (Falling)" : "స్థిరమైన పీడనం (Steady)";
    }
    if (language === "ta") {
      return pressureTendency.includes("Rising") ? "அழுத்தம் உயர்கிறது (Rising)" : pressureTendency.includes("Falling") ? "அழுத்தம் குறைகிறது (Falling)" : "நிலையான அழுத்தம் (Steady)";
    }
    if (language === "mr") {
      return pressureTendency.includes("Rising") ? "दबाव वाढत आहे (Rising)" : pressureTendency.includes("Falling") ? "दबाव कमी होत आहे (Falling)" : "स्थिर वायुदाब (Steady)";
    }
    if (language === "bn") {
      return pressureTendency.includes("Rising") ? "চাপ বাড়ছে (Rising)" : pressureTendency.includes("Falling") ? "চাপ কমছে (Falling)" : "স্থির বায়ুমণ্ডলীয় চাপ (Steady)";
    }
    if (language === "ml") {
      return pressureTendency.includes("Rising") ? "മർദ്ദം കൂടുന്നു (Rising)" : pressureTendency.includes("Falling") ? "മർദ്ദം കുറയുന്നു (Falling)" : "സ്ഥിരമായ മർദ്ദം (Steady)";
    }
    return pressureTendency;
  };

  const handleActionClick = (e: React.MouseEvent) => {
    if (isGuest) {
      e.preventDefault();
      setUpgradeModal(
        true,
        tm.guestDesc
      );
    }
  };

  return (
    <section className="relative w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white/95 via-slate-50/90 to-amber-50/40 border border-slate-200/80 shadow-lg backdrop-blur-xl overflow-hidden my-8">
      {/* Glow Accent */}
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/60 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-500/25">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {tm.title}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                {tm.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {tm.subtitle}
            </p>
          </div>
        </div>

        {/* Guest Lock Indicator */}
        {isGuest && (
          <button
            onClick={() =>
              setUpgradeModal(
                true,
                tm.guestDesc
              )
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-600 hover:bg-amber-500/20 transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{tm.memberPerk}</span>
          </button>
        )}
      </div>

      {/* Main Time Machine Console */}
      <div className="relative pt-6 space-y-6 z-10">
        {/* Guest Lock Overlay Teaser */}
        {isGuest && (
          <div className="absolute inset-0 z-20 backdrop-blur-[4px] bg-white/65 rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fade-in border border-amber-500/20">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/30 mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              {tm.guestTitle}
            </h3>
            <p className="text-xs text-slate-600 max-w-md mt-1 mb-4">
              {tm.guestDesc}
            </p>
            <button
              onClick={handleActionClick}
              className="py-2.5 px-6 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>{tm.guestUnlock}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Scrub Slider Bar */}
        <div className="p-5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setScrubPosition(0)}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                scrubPosition === 0
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tm.yesterdayLabel}
            </button>

            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {scrubPosition === 100
                  ? tm.livePresent
                  : scrubPosition === 0
                  ? tm.retrospective24h
                  : tm.retrospectPercent(100 - scrubPosition)}
              </span>
            </span>

            <button
              onClick={() => setScrubPosition(100)}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                scrubPosition === 100
                  ? "bg-sky-500 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tm.todayLive}
            </button>
          </div>

          {/* Interactive Scrub Slider */}
          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={scrubPosition}
              onChange={(e) => setScrubPosition(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400">
            <span>{tm.yesterdayPrefix} {yesterdayTemp.toFixed(1)}°C</span>
            <span className="font-bold text-slate-700">
              {tm.scrubPositionPrefix} {displayedTemp}°C
            </span>
            <span>{tm.todayPrefix} {temp}°C</span>
          </div>
        </div>

        {/* Plain-English Sensory Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Thermal Delta */}
          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{tm.thermalDiff}</span>
              {delta24h > 0 ? (
                <TrendingUp className="w-4 h-4 text-rose-500" />
              ) : delta24h < 0 ? (
                <TrendingDown className="w-4 h-4 text-sky-500" />
              ) : (
                <Minus className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div className="text-2xl font-black text-slate-900">
              {delta24h > 0 ? `+${delta24h.toFixed(1)}°C` : `${delta24h.toFixed(1)}°C`}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {delta24h > 0
                ? tm.warmerSensory
                : tm.coolerSensory}
            </p>
          </div>

          {/* Past 72h Rain Accumulation */}
          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{tm.rainAccumTitle}</span>
              <CloudRain className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {rainAccum} mm
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {rainAccum > 10
                ? tm.highRainSensory
                : tm.lowRainSensory}
            </p>
          </div>

          {/* Barometric Pressure Swing */}
          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{tm.pressureTendencyTitle}</span>
              <Gauge className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-xl font-bold text-slate-900 truncate">
              {getLocalizedTendency()}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {pressureTendency.includes("Rising")
                ? tm.risingPressure
                : pressureTendency.includes("Falling")
                ? tm.fallingPressure
                : tm.steadyPressure}
            </p>
          </div>

          {/* Skin Feel & Moisture */}
          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{tm.skinFeelTitle}</span>
              <Droplets className="w-4 h-4 text-teal-500" />
            </div>
            <div className="text-xl font-bold text-slate-900">
              {current.humidity > 65 ? tm.stickierAir : tm.crisperAir}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {tm.dewPointSensory(current.dewPoint ?? 19)}
            </p>
          </div>
        </div>

        {/* Narrative Synthesis */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/60">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{tm.narrativeTitle}</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {language === "en" && retrospective.atmosphericSummary
              ? retrospective.atmosphericSummary
              : `${delta24h >= 0 ? tm.warmerSensory : tm.coolerSensory} ${
                  pressureTendency.includes("Rising")
                    ? tm.risingPressure
                    : pressureTendency.includes("Falling")
                    ? tm.fallingPressure
                    : tm.steadyPressure
                }`}
          </p>
        </div>
      </div>
    </section>
  );
};
