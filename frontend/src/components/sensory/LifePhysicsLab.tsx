"use client";

import React, { useState } from "react";
import { useWeatherStore } from "@/store/useWeatherStore";
import { translations } from "@/lib/translations";
import {
  Shirt,
  Coffee,
  Car,
  Bug,
  Droplet,
  Lock,
  Sparkles,
  ArrowRight,
  Clock,
  Wind,
  Sun,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";

export const LifePhysicsLab: React.FC = () => {
  const { weatherData, language, isGuest, setUpgradeModal } = useWeatherStore();
  const t = translations[language] || translations.en;
  const pl = t.physicsLab || translations.en.physicsLab!;

  // Calculator states
  const [activeTab, setActiveTab] = useState<"laundry" | "chai" | "fog" | "mosquito" | "hydration">("laundry");
  const [fabricType, setFabricType] = useState<"synthetic" | "cotton" | "denim">("cotton");
  const [mugType, setMugType] = useState<"ceramic" | "steel" | "kulhad">("ceramic");
  const [activityIntensity, setActivityIntensity] = useState<"light" | "moderate" | "heavy">("moderate");

  if (!weatherData) return null;

  const current = weatherData.current || {};
  const temp = current.temperature ?? 28;
  const humidity = current.humidity ?? 60;
  const wind = current.windSpeed ?? 10;
  const dewPoint = current.dewPoint ?? 19;
  const cloudCover = current.cloudCover ?? 30;

  // 1. Laundry Drying Physics Formula
  const fabricMultiplier = fabricType === "synthetic" ? 0.6 : fabricType === "cotton" ? 1.0 : 1.8;
  const solarFactor = Math.max(0.2, 1 - (Math.min(100, Math.max(0, cloudCover)) / 100) * 0.4);
  const safeTemp = Math.max(Number(temp) || 28, 5);
  const safeHumidity = Math.max(Number(humidity) || 50, 5);
  const safeWind = Math.max(Number(wind) || 10, 0);

  const rawDryingHours = Math.max(
    0.8,
    ((safeHumidity / 28) * (26 / Math.max(safeTemp, 12)) * (14 / Math.max(safeWind + 6, 6)) * fabricMultiplier) / solarFactor
  );
  const dryingHoursFormatted = !isFinite(rawDryingHours) || isNaN(rawDryingHours)
    ? "2.0 hrs"
    : rawDryingHours < 1
    ? `${Math.round(rawDryingHours * 60)} mins`
    : `${rawDryingHours.toFixed(1)} hrs`;

  // 2. Newton's Law of Cooling for Chai (from 95°C to 60°C)
  const mugK = mugType === "steel" ? 0.075 : mugType === "kulhad" ? 0.06 : 0.045;
  const windCooling = Math.max(1, 1 + (safeWind / 35));
  const ambientClamped = Math.min(50, Math.max(safeTemp, 5));
  const ratio = Math.max(0.05, Math.min(0.95, (60 - ambientClamped) / (95 - ambientClamped)));
  const calculatedMinutes = -Math.log(ratio) / (mugK * windCooling);
  const coolingMinutes = !isFinite(calculatedMinutes) || isNaN(calculatedMinutes)
    ? 8
    : Math.max(2.5, Math.round(calculatedMinutes * 10) / 10);

  // 3. Windshield Fogging Guide
  const tempDewDelta = temp - dewPoint;
  const fogRisk = tempDewDelta < 2.5 ? pl.windshield.imminentRisk : tempDewDelta < 5 ? pl.windshield.moderateRisk : pl.windshield.clearRisk;
  const fogColor = tempDewDelta < 2.5 ? "text-rose-500 bg-rose-500/10 border-rose-500/30" : tempDewDelta < 5 ? "text-amber-500 bg-amber-500/10 border-amber-500/30" : "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";

  // 4. Twilight Mosquito Gauge
  // Peak activity when temp 18-28°C, humidity > 60%, wind < 12 km/h
  const tempIdeal = temp >= 18 && temp <= 29;
  const humidityIdeal = humidity >= 60;
  const windCalm = wind < 12;
  const mosquitoScore = (tempIdeal ? 40 : 15) + (humidityIdeal ? 40 : 15) + (windCalm ? 20 : 5);
  const mosquitoRisk = mosquitoScore >= 75 ? pl.mosquito.peakSwarm : mosquitoScore >= 50 ? pl.mosquito.moderateFlight : pl.mosquito.lowThreat;

  // 5. Sweat & Hydration Rate
  // Evaporation efficiency inversely related to humidity
  const evapEfficiency = Math.max(20, Math.round(100 - humidity * 0.85));
  const baseWaterRate = activityIntensity === "light" ? 350 : activityIntensity === "moderate" ? 600 : 950;
  const heatWaterBonus = Math.max(0, (temp - 24) * 35);
  const totalWaterRate = Math.round(baseWaterRate + heatWaterBonus);

  const handleActionClick = (e: React.MouseEvent) => {
    if (isGuest) {
      e.preventDefault();
      setUpgradeModal(
        true,
        pl.guestDesc
      );
    }
  };

  return (
    <section className="relative w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white/95 via-slate-50/90 to-sky-50/50 border border-slate-200/80 shadow-lg backdrop-blur-xl overflow-hidden my-8">
      {/* Glow Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {pl.title}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                {pl.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {pl.subtitle}
            </p>
          </div>
        </div>

        {/* Guest Lock Indicator */}
        {isGuest && (
          <button
            onClick={() =>
              setUpgradeModal(
                true,
                pl.guestDesc
              )
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-600 hover:bg-amber-500/20 transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{pl.memberPerk}</span>
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-4 border-b border-slate-200/60">
        <button
          onClick={() => setActiveTab("laundry")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
            activeTab === "laundry"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
              : "bg-white/90 text-slate-700 border border-slate-200 hover:bg-sky-50"
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span>{pl.tabs.laundry}</span>
        </button>

        <button
          onClick={() => setActiveTab("chai")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
            activeTab === "chai"
              ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
              : "bg-white/90 text-slate-700 border border-slate-200 hover:bg-amber-50"
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>{pl.tabs.chai}</span>
        </button>

        <button
          onClick={() => setActiveTab("fog")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
            activeTab === "fog"
              ? "bg-teal-500 text-white shadow-md shadow-teal-500/25"
              : "bg-white/90 text-slate-700 border border-slate-200 hover:bg-teal-50"
          }`}
        >
          <Car className="w-4 h-4" />
          <span>{pl.tabs.windshield}</span>
        </button>

        <button
          onClick={() => setActiveTab("mosquito")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
            activeTab === "mosquito"
              ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
              : "bg-white/90 text-slate-700 border border-slate-200 hover:bg-rose-50"
          }`}
        >
          <Bug className="w-4 h-4" />
          <span>{pl.tabs.mosquitoes}</span>
        </button>

        <button
          onClick={() => setActiveTab("hydration")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
            activeTab === "hydration"
              ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/25"
              : "bg-white/90 text-slate-700 border border-slate-200 hover:bg-indigo-50"
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>{pl.tabs.sweat}</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="relative pt-5">
        {/* Guest Lock Overlay Teaser */}
        {isGuest && (
          <div className="absolute inset-0 z-20 backdrop-blur-[4px] bg-white/65 rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fade-in border border-sky-500/20">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/30 mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              {pl.guestTitle}
            </h3>
            <p className="text-xs text-slate-600 max-w-md mt-1 mb-4">
              {pl.guestDesc}
            </p>
            <button
              onClick={handleActionClick}
              className="py-2.5 px-6 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/25 flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>{pl.guestUnlock}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 1. Laundry Drying */}
        {activeTab === "laundry" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                  {pl.laundry.engineTitle}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                  {pl.laundry.heading}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {pl.laundry.formulaDesc(humidity, temp, wind)}
                </p>
              </div>

              {/* Fabric Selectors */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">
                  {pl.laundry.selectWeight}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFabricType("synthetic")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      fabricType === "synthetic"
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pl.laundry.synthetics}
                  </button>
                  <button
                    onClick={() => setFabricType("cotton")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      fabricType === "cotton"
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pl.laundry.cotton}
                  </button>
                  <button
                    onClick={() => setFabricType("denim")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      fabricType === "denim"
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pl.laundry.denim}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl p-5 bg-white/90 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{pl.laundry.estimatedTime}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                  {pl.laundry.outdoorClothesline}
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-black text-slate-900 flex items-baseline gap-2">
                <span>{pl.laundry.hoursUntilDry(dryingHoursFormatted)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  <span>{pl.laundry.bestWindow}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>{pl.laundry.solarCover(cloudCover)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Chai Cooling */}
        {activeTab === "chai" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  {pl.chai.engineTitle}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                  {pl.chai.heading}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {pl.chai.formulaDesc}
                </p>
              </div>

              {/* Mug Vessel Selectors */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">
                  {pl.chai.drinkingVessel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setMugType("ceramic")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      mugType === "ceramic"
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pl.chai.ceramic}
                  </button>
                  <button
                    onClick={() => setMugType("steel")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      mugType === "steel"
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pl.chai.steel}
                  </button>
                  <button
                    onClick={() => setMugType("kulhad")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      mugType === "kulhad"
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pl.chai.kulhad}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl p-5 bg-white/90 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{pl.chai.sippingWindow}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold">
                  {pl.chai.targetTemp}
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-black text-slate-900 flex items-baseline gap-2">
                <span>{pl.chai.minsFromBoiling(coolingMinutes.toFixed(1))}</span>
              </div>

              <p className="text-xs text-slate-600 leading-normal border-t border-slate-200/60 pt-3">
                {wind > 15
                  ? pl.chai.breezeExp
                  : pl.chai.calmExp}
              </p>
            </div>
          </div>
        )}

        {/* 3. Windshield Fogging */}
        {activeTab === "fog" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 space-y-3">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                {pl.windshield.engineTitle}
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                {pl.windshield.heading}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {pl.windshield.formulaDesc(dewPoint, tempDewDelta.toFixed(1))}
              </p>
              <div className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${fogColor}`}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{fogRisk}</span>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl p-5 bg-white/90 border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {pl.windshield.protocolTitle}
              </span>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{pl.windshield.acRule}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{pl.windshield.recircRule}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{pl.windshield.windowRule}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Mosquito Gauge */}
        {activeTab === "mosquito" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 space-y-3">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                {pl.mosquito.engineTitle}
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                {pl.mosquito.heading}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {pl.mosquito.formulaDesc(wind, humidity)}
              </p>
              <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-700 text-xs font-bold flex items-center gap-2">
                <Bug className="w-4 h-4 flex-shrink-0" />
                <span>{mosquitoRisk} ({pl.mosquito.flightIndex(mosquitoScore)})</span>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl p-5 bg-white/90 border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {pl.mosquito.guidanceTitle}
              </span>
              <div className="space-y-2 text-xs text-slate-700">
                <p>
                  {pl.mosquito.peakWindow}
                </p>
                <p>
                  {wind > 15
                    ? pl.mosquito.breezeMosquito
                    : pl.mosquito.calmMosquito}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 5. Hydration Meter */}
        {activeTab === "hydration" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {pl.sweat.engineTitle}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                  {pl.sweat.heading}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {pl.sweat.formulaDesc}
                </p>
              </div>

              {/* Activity Level Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">
                  {pl.sweat.selectExertion}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setActivityIntensity("light")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      activityIntensity === "light"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pl.sweat.light}
                  </button>
                  <button
                    onClick={() => setActivityIntensity("moderate")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      activityIntensity === "moderate"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pl.sweat.moderate}
                  </button>
                  <button
                    onClick={() => setActivityIntensity("heavy")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      activityIntensity === "heavy"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pl.sweat.heavy}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl p-5 bg-white/90 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{pl.sweat.replacementTarget}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                  {pl.sweat.evapEfficiency(evapEfficiency)}
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-black text-slate-900 flex items-baseline gap-2">
                <span>{pl.sweat.ratePerHour(totalWaterRate)}</span>
              </div>

              <p className="text-xs text-slate-600 leading-normal border-t border-slate-200/60 pt-3">
                {humidity > 75
                  ? pl.sweat.humidSweat
                  : pl.sweat.drySweat}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
