"use client";

import React, { useState } from "react";
import { useWeatherStore, PinnedLocation } from "@/store/useWeatherStore";
import { translations, getLocalizedWmoDescription, LanguageCode } from "@/lib/translations";
import { exportSynopticCsv } from "@/lib/exportData";
import {
  Wind,
  Droplets,
  Gauge,
  Sun,
  Eye,
  ArrowUp,
  ArrowDown,
  Compass,
  History,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  CloudRain,
  Bookmark,
  BookmarkCheck,
  Bell,
  FileSpreadsheet,
  Plus,
  X,
} from "lucide-react";

export const HeroOverview: React.FC = () => {
  const {
    weatherData,
    selectedLocation,
    setSelectedLocation,
    unitSystem,
    language,
    authStatus,
    pinnedLocations,
    addPinnedLocation,
    removePinnedLocation,
    setUpgradeModal,
    setAlertModalOpen,
  } = useWeatherStore();

  const t = translations[language] || translations.en;
  const [isPinning, setIsPinning] = useState(false);
  const [pinLabelInput, setPinLabelInput] = useState("");

  if (!weatherData) return null;

  const current = weatherData.current || {};
  const retrospective = weatherData.retrospective || {};
  const daily = weatherData.daily || [];
  const todayDaily = daily[0] || {};

  // Unit conversion helpers
  const toFahrenheit = (c: number) => (c * 9) / 5 + 32;
  const formatTemp = (c: number | undefined) => {
    if (c === undefined || isNaN(c)) return "--";
    const val = unitSystem === "imperial" ? toFahrenheit(c) : c;
    return `${Math.round(val)}°`;
  };

  const formatWind = (kmh: number | undefined) => {
    if (kmh === undefined || isNaN(kmh)) return "--";
    if (unitSystem === "imperial") {
      return `${(kmh * 0.621371).toFixed(1)} mph`;
    }
    return `${kmh.toFixed(1)} km/h`;
  };

  const getWindDirectionLabel = (deg: number = 0) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(deg / 45) % 8];
  };

  const getUvLevel = (uv: number = 0, lang: LanguageCode = "en") => {
    const UV_MAP: Record<string, Record<LanguageCode, string>> = {
      low: { en: "Low Risk", hi: "कम जोखिम", te: "తక్కువ ముప్పు", ta: "குறைந்த ஆபத்து", mr: "कमी धोका", bn: "কম ঝুঁকি", ml: "കുറഞ്ഞ അപകടസാധ്യത" },
      mod: { en: "Moderate", hi: "मध्यम", te: "మోస్తరు", ta: "மிதமானது", mr: "मध्यम", bn: "মাঝারি", ml: "മിതമായത്" },
      high: { en: "High", hi: "उच्च जोखिम", te: "ఎక్కువ ముప్పు", ta: "அதிக ஆபத்து", mr: "जास्त धोका", bn: "উচ্চ ঝুঁকি", ml: "ഉയർന്ന അപകടസാധ്യത" },
      vhigh: { en: "Very High", hi: "अत्यधिक जोखिम", te: "అత్యధిక ముప్పు", ta: "மிக அதிக ஆபத்து", mr: "खूप जास्त धोका", bn: "খুব উচ্চ ঝুঁকি", ml: "വളരെ ഉയർന്നത്" },
      ext: { en: "Extreme", hi: "अत्यंत घातक", te: "తీవ్ర ముప్పు", ta: "தீவிர ஆபத்து", mr: "तीव्र धोका", bn: "চরম ঝুঁকি", ml: "അതിതീവ്രം" }
    };
    if (uv <= 2) return { text: UV_MAP.low[lang] || UV_MAP.low.en, color: "text-emerald-700 bg-emerald-50 border border-emerald-200" };
    if (uv <= 5) return { text: UV_MAP.mod[lang] || UV_MAP.mod.en, color: "text-amber-700 bg-amber-50 border border-amber-200" };
    if (uv <= 7) return { text: UV_MAP.high[lang] || UV_MAP.high.en, color: "text-orange-700 bg-orange-50 border border-orange-200" };
    if (uv <= 10) return { text: UV_MAP.vhigh[lang] || UV_MAP.vhigh.en, color: "text-rose-700 bg-rose-50 border border-rose-200" };
    return { text: UV_MAP.ext[lang] || UV_MAP.ext.en, color: "text-purple-700 bg-purple-50 border border-purple-200" };
  };

  const uvLevel = getUvLevel(current.uvIndex, language);

  // Check if current location is already pinned
  const isCurrentPinned = pinnedLocations.some(
    (p) =>
      Math.abs(p.location.latitude - selectedLocation.latitude) < 0.05 &&
      Math.abs(p.location.longitude - selectedLocation.longitude) < 0.05
  );

  const handlePinClick = () => {
    if (authStatus !== "authenticated") {
      setUpgradeModal(
        true,
        "Sign in to save this location and manage a multi-station pinned watchlist."
      );
      return;
    }
    setPinLabelInput(selectedLocation.name);
    setIsPinning(true);
  };

  const handleSavePin = () => {
    if (!pinLabelInput.trim()) return;
    addPinnedLocation(pinLabelInput.trim(), selectedLocation);
    setIsPinning(false);
  };

  const handleAlertsClick = () => {
    if (authStatus !== "authenticated") {
      setUpgradeModal(
        true,
        "Sign in to configure autonomous rain, spray wind, and air quality alert dispatches."
      );
      return;
    }
    setAlertModalOpen(true);
  };

  const handleExportClick = () => {
    if (authStatus !== "authenticated") {
      setUpgradeModal(
        true,
        "Sign in to export 72-hour retrospective synoptic observations and 7-day forecasts to CSV."
      );
      return;
    }
    exportSynopticCsv(weatherData, selectedLocation);
  };

  return (
    <div className="w-full rounded-3xl p-6 sm:p-8 bg-white/85 border border-slate-200/80 shadow-md backdrop-blur-md transition-all">
      {/* 1. Multi-Location Pinned Watchlist Bar */}
      <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-200/60 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 flex-nowrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
            <Bookmark className="w-3.5 h-3.5 text-sky-500" />
            {t.watchlist}
          </span>

          {pinnedLocations.length > 0 ? (
            pinnedLocations.map((pin) => {
              const isActive =
                Math.abs(pin.location.latitude - selectedLocation.latitude) < 0.05 &&
                Math.abs(pin.location.longitude - selectedLocation.longitude) < 0.05;

              return (
                <div
                  key={pin.id}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all flex-shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-sky-50"
                  }`}
                  onClick={() => setSelectedLocation(pin.location)}
                >
                  <span>{pin.label}</span>
                  {authStatus === "authenticated" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePinnedLocation(pin.id);
                      }}
                      className="p-0.5 rounded-full hover:bg-black/10 transition-colors ml-0.5"
                      title="Remove pin"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <span className="text-xs text-slate-400 italic">
              {authStatus === "authenticated"
                ? "No locations pinned yet"
                : "Sign in to pin farm & home locations"}
            </span>
          )}
        </div>

        {/* Pin Current Button / Popover */}
        <div className="flex-shrink-0">
          {!isPinning ? (
            <button
              onClick={handlePinClick}
              disabled={isCurrentPinned}
              className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-bold transition-all ${
                isCurrentPinned
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-600 border border-slate-200"
              }`}
            >
              {isCurrentPinned ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.pinned}</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.pinLocation}</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-1.5 animate-fade-in">
              <input
                type="text"
                value={pinLabelInput}
                onChange={(e) => setPinLabelInput(e.target.value)}
                placeholder="Label (e.g. Wheat Farm)"
                className="px-2.5 py-0.5 text-xs rounded-lg border border-sky-400 bg-white text-slate-900 focus:outline-none shadow-xs"
                autoFocus
              />
              <button
                onClick={handleSavePin}
                className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 shadow-xs"
              >
                Save
              </button>
              <button
                onClick={() => setIsPinning(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top Banner: Location Metadata & Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
              {selectedLocation.country || "Global Station"}
            </span>
            <span className="text-xs text-slate-400">
              Lat {Number(selectedLocation?.latitude ?? 28.61).toFixed(2)}°, Lon {Number(selectedLocation?.longitude ?? 77.21).toFixed(2)}°
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            {selectedLocation.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 line-clamp-1">
            {selectedLocation.formattedAddress}
          </p>
        </div>

        {/* Right Controls: Model Consensus + Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Custom Alerts Button */}
          <button
            onClick={handleAlertsClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-sky-600 hover:bg-sky-50 transition-colors shadow-xs"
            title="Configure Alert Thresholds (Push/SMS/Email)"
          >
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">{t.alertRules}</span>
          </button>

          {/* Export Synoptic Data Button */}
          <button
            onClick={handleExportClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors shadow-xs"
            title="Export 72h Retrospective & 7d Forecast to CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">{t.exportCsv}</span>
          </button>

          {/* Model Consensus Badge */}
          {weatherData.confidence && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-indigo-50 border border-indigo-200/80 shadow-xs">
              <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0 animate-pulse" />
              <div>
                <div className="text-[11px] font-semibold text-indigo-700 flex items-center gap-1">
                  <span>{t.ensemble}</span>
                  <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 font-bold">
                    {weatherData.confidence.score}%
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 hidden sm:block">
                  {weatherData.confidence.level} {t.confidence}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Temperature & Primary Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
        <div className="lg:col-span-5 flex items-center gap-6">
          <div className="text-6xl sm:text-8xl font-black tracking-tighter text-slate-900">
            {formatTemp(current.temperature)}
          </div>
          <div className="space-y-1">
            <div className="text-lg sm:text-xl font-bold text-sky-600 capitalize">
              {getLocalizedWmoDescription(current.weatherCode, language) || current.weatherDescription}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <span>{t.feelsLike}:</span>
              <span className="font-semibold text-slate-700">
                {formatTemp(current.feelsLike)}
              </span>
            </div>
            {todayDaily.tempMax !== undefined && (
              <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                <span className="flex items-center text-rose-500">
                  <ArrowUp className="w-3 h-3 mr-0.5" />
                  {formatTemp(todayDaily.tempMax)}
                </span>
                <span className="flex items-center text-sky-500">
                  <ArrowDown className="w-3 h-3 mr-0.5" />
                  {formatTemp(todayDaily.tempMin)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Retrospective 3-Day Synoptic Delta Card */}
        <div className="lg:col-span-7 rounded-2xl p-4 bg-slate-50/90 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
            <History className="w-4 h-4 text-amber-500" />
            <span>{t.pastComparisonTitle}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {retrospective.atmosphericSummary || "Synoptic atmospheric parameters in equilibrium."}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200/60 text-[11px]">
            <div>
              <span className="text-slate-400 block">{t.thermalAnomaly24h}</span>
              <span className="font-semibold text-slate-800">
                {retrospective.tempDelta24h > 0 ? `+${retrospective.tempDelta24h}°C` : `${retrospective.tempDelta24h}°C`}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">{t.pastRain72h}</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <CloudRain className="w-3 h-3 text-sky-500" />
                {retrospective.rainAccumulationPast72h} mm
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 block">{t.pressureTendency}</span>
              <span className="font-semibold text-slate-800">
                {retrospective.pressureTendency || "Steady"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Key Atmospheric Parameters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-5 border-t border-slate-200/60">
        {/* Humidity */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">{t.humidity}</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">
            {current.humidity}%
          </div>
          <div className="text-[10px] text-slate-500">
            {current.humidity > 70 ? "High Moisture" : current.humidity < 35 ? "Dry Air" : "Optimal Comfort"}
          </div>
        </div>

        {/* Pressure */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">{t.pressure}</span>
            <Gauge className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">
            {current.pressure} <span className="text-xs font-normal text-slate-400">hPa</span>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            {retrospective.pressureTendency?.includes("Rising") ? (
              <TrendingUp className="w-3 h-3 text-emerald-500" />
            ) : retrospective.pressureTendency?.includes("Falling") ? (
              <TrendingDown className="w-3 h-3 text-rose-500" />
            ) : (
              <Minus className="w-3 h-3 text-slate-400" />
            )}
            <span>{retrospective.pressureTendency?.split(" ")[0] || "Stable"}</span>
          </div>
        </div>

        {/* Tropospheric Wind */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">{t.wind}</span>
            <Wind className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">
            {formatWind(current.windSpeed)}
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <Compass
              className="w-3 h-3 text-slate-400"
              style={{ transform: `rotate(${current.windDirection}deg)` }}
            />
            <span>
              {getWindDirectionLabel(current.windDirection)} ({current.windDirection}°)
            </span>
          </div>
        </div>

        {/* UV Index */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">{t.uvIndex}</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">
            {current.uvIndex ?? 0}
          </div>
          <div className="text-[10px]">
            <span className={`px-1.5 py-0.5 rounded font-semibold ${uvLevel.color}`}>
              {uvLevel.text}
            </span>
          </div>
        </div>

        {/* Dew Point */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">{t.dewPoint}</span>
            <Eye className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">
            {formatTemp(current.dewPoint)}
          </div>
          <div className="text-[10px] text-slate-500">
            {current.dewPoint && current.dewPoint > 22 ? "Muggy / Oppressive" : "Crisp Equilibrium"}
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">{t.cloudCover}</span>
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold text-slate-900">
            {current.cloudCover}%
          </div>
          <div className="text-[10px] text-slate-500">
            {current.cloudCover < 20 ? "Clear Horizons" : current.cloudCover < 70 ? "Partly Broken" : "Overcast Deck"}
          </div>
        </div>
      </div>
    </div>
  );
};
