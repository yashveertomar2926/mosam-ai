"use client";

import React from "react";
import { useWeatherStore } from "@/store/useWeatherStore";
import {
  translations,
  getLocalizedAlertLevel,
  getLocalizedCpcbCategory
} from "@/lib/translations";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Sprout,
  Wind,
  Droplets,
  Activity,
  HeartPulse,
  Info,
} from "lucide-react";

export const GovernmentBulletinBanner: React.FC = () => {
  const { weatherData, language } = useWeatherStore();
  const t = translations[language] || translations.en;

  if (!weatherData?.governmentBulletin) return null;

  const bulletin = weatherData.governmentBulletin;
  const agromet = bulletin.agromet || {};
  const cpcb = bulletin.cpcbNaqi || {};

  // Alert Badge Styling
  const getAlertStyle = (level: string) => {
    switch (level) {
      case "Red":
        return {
          badgeBg: "bg-red-500 text-white",
          border: "border-red-500/40",
          cardBg: "bg-red-50/70",
          icon: <Flame className="w-5 h-5 text-red-500" />,
        };
      case "Orange":
        return {
          badgeBg: "bg-orange-500 text-white",
          border: "border-orange-500/40",
          cardBg: "bg-orange-50/70",
          icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
        };
      case "Yellow":
        return {
          badgeBg: "bg-amber-500 text-slate-900 font-bold",
          border: "border-amber-500/40",
          cardBg: "bg-amber-50/70",
          icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        };
      default:
        return {
          badgeBg: "bg-emerald-500 text-white",
          border: "border-emerald-500/40",
          cardBg: "bg-emerald-50/60",
          icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
        };
    }
  };

  const alertStyle = getAlertStyle(bulletin.alertLevel);

  // Spray Safety Badge Style
  const getSprayBadge = (status: string) => {
    switch (status) {
      case "HOLD":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "CAUTION":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
    }
  };

  // CPCB AQI Category color
  const getAqiColor = (index: number) => {
    if (index <= 50) return "bg-emerald-500 text-white";
    if (index <= 100) return "bg-lime-500 text-slate-900 font-bold";
    if (index <= 200) return "bg-yellow-500 text-slate-900 font-bold";
    if (index <= 300) return "bg-orange-500 text-white";
    if (index <= 400) return "bg-rose-600 text-white";
    return "bg-purple-900 text-white";
  };

  return (
    <div className="w-full space-y-4 my-6">
      {/* 1. Official Government Alert Banner */}
      <div
        className={`w-full rounded-2xl p-5 border ${alertStyle.border} ${alertStyle.cardBg} backdrop-blur-md shadow-sm transition-all`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white shadow-xs">
              {alertStyle.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider text-slate-600 uppercase">
                  {t.bulletin?.deptTitle || bulletin.authority}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${alertStyle.badgeBg}`}>
                  {bulletin.alertLevel === "Green" && t.bulletin
                    ? t.bulletin.alertGreen
                    : bulletin.alertLevel === "Yellow" && t.bulletin
                    ? t.bulletin.alertYellow
                    : bulletin.alertLevel === "Orange" && t.bulletin
                    ? t.bulletin.alertOrange
                    : bulletin.alertLevel === "Red" && t.bulletin
                    ? t.bulletin.alertRed
                    : `${getLocalizedAlertLevel(bulletin.alertLevel, language)} • ${bulletin.alertTitle}`}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                {(bulletin.alertLevel === "Green" || bulletin.bulletinSummary.toLowerCase().includes("atmospheric conditions")) && t.bulletin
                  ? t.bulletin.allClearTitle
                  : bulletin.bulletinSummary}
              </h2>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-medium self-end md:self-center">
            {t.bulletin?.validityLabel || `${t.validUntil} ${bulletin.validUntil}`}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 mt-3 pl-1 leading-relaxed border-l-2 border-slate-300 ml-1">
          {(bulletin.alertLevel === "Green" || bulletin.detailedAdvisory.toLowerCase().includes("favorable meteorological")) && t.bulletin
            ? t.bulletin.allClearDesc
            : bulletin.detailedAdvisory}
        </p>
      </div>

      {/* 2. Sub-Grid: IMD Agromet Advisory & CPCB NAQI Air Quality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* IMD Agromet Advisory Card */}
        <div className="rounded-2xl p-5 bg-white/90 border border-slate-200/80 shadow-xs backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {t.spraySafety}
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getSprayBadge(
                  agromet.spraySafetyStatus
                )}`}
              >
                {agromet.spraySafetyStatus === "HOLD"
                  ? t.holdSpray
                  : agromet.spraySafetyStatus === "CAUTION"
                  ? t.cautionSpray
                  : t.safeToSpray}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {agromet.spraySafetyReason}
            </p>

            {agromet.safeWindow && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 font-medium">
                🎯 <strong>{t.recWindow}</strong> {agromet.safeWindow}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
            <Droplets className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
            <span>
              <strong>{t.fieldDrainage}</strong> {agromet.fieldDrainageStatus}
            </span>
          </div>
        </div>

        {/* CPCB NAQI Card */}
        <div className="rounded-2xl p-5 bg-white/90 border border-slate-200/80 shadow-xs backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  {t.cpcbAqi}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400">NAQI</span>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-black ${getAqiColor(
                    cpcb.index
                  )}`}
                >
                  {cpcb.index} • {getLocalizedCpcbCategory(cpcb.category, language)}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {cpcb.healthAdvisory}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">PM2.5 Concentration</span>
                <span className="font-bold text-slate-800">
                  {weatherData.airQuality?.pm2_5} µg/m³
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">PM10 Concentration</span>
                <span className="font-bold text-slate-800">
                  {weatherData.airQuality?.pm10} µg/m³
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="text-slate-600">
              {cpcb.sensitiveGroupNotice}
            </span>
            {weatherData.airQuality?.maskRecommended && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                {t.maskRecommended}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
