"use client";

import React, { useState, useMemo } from "react";
import { useWeatherStore, UserRole } from "@/store/useWeatherStore";
import {
  translations,
  getLocalizedDecisionMeta,
  getLocalizedStatus
} from "@/lib/translations";
import {
  PartyPopper,
  Sprout,
  Droplets,
  Car,
  Shirt,
  Footprints,
  Bike,
  HardHat,
  Sun,
  Sparkles,
  Plane,
  Utensils,
  ShieldAlert,
  Compass,
  Waves,
  HeartPulse,
  Sparkle,
  Anchor,
  Smile,
  Camera,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
  Activity,
  Truck,
  SlidersHorizontal,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  PartyPopper: <PartyPopper className="w-5 h-5" />,
  Sprout: <Sprout className="w-5 h-5" />,
  Droplets: <Droplets className="w-5 h-5" />,
  Car: <Car className="w-5 h-5" />,
  Shirt: <Shirt className="w-5 h-5" />,
  Footprints: <Footprints className="w-5 h-5" />,
  Bike: <Bike className="w-5 h-5" />,
  HardHat: <HardHat className="w-5 h-5" />,
  Sun: <Sun className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Plane: <Plane className="w-5 h-5" />,
  Utensils: <Utensils className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Waves: <Waves className="w-5 h-5" />,
  HeartPulse: <HeartPulse className="w-5 h-5" />,
  Sparkle: <Sparkle className="w-5 h-5" />,
  Anchor: <Anchor className="w-5 h-5" />,
  Smile: <Smile className="w-5 h-5" />,
  Camera: <Camera className="w-5 h-5" />,
};

export const DecisionWindowsGrid: React.FC = () => {
  const {
    weatherData,
    language,
    authStatus,
    userProfile,
    updateUserRole,
    setUpgradeModal,
  } = useWeatherStore();
  const t = translations[language] || translations.en;

  const [expandedAll, setExpandedAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<UserRole>(userProfile?.role || "general");

  const rawDecisions: any[] =
    weatherData?.decisionWindows || weatherData?.decision_windows || [];

  // Dynamic score recalibration based on role profile
  const calibratedDecisions = useMemo(() => {
    return rawDecisions.map((item) => {
      let score = item.suitabilityScore;
      let status = item.status;
      let rationale = item.description;

      const currentRainProb = weatherData?.daily?.[0]?.precipitationProbability || 0;
      const currentWind = weatherData?.current?.windSpeed || 10;
      const currentAqi = weatherData?.governmentBulletin?.cpcbNaqi?.index || 60;

      if (selectedRole === "farmer") {
        if (item.category === "agriculture") {
          // Stricter IMD Agromet rule weights
          if (currentRainProb > 30 || currentWind > 18) {
            score = Math.max(15, score - 20);
            status = score > 60 ? "Moderate" : score > 35 ? "Caution" : "Hazardous";
            rationale = `[Agromet Recalibrated] Sensitive to wind gusts >15 km/h & rain >30%. ${item.description}`;
          } else {
            score = Math.min(100, score + 10);
          }
        }
      } else if (selectedRole === "athlete") {
        if (item.category === "fitness") {
          if (currentAqi > 140 || (weatherData?.current?.temperature || 25) > 33) {
            score = Math.max(10, score - 25);
            status = score > 60 ? "Moderate" : score > 35 ? "Caution" : "Hazardous";
            rationale = `[Cardio Recalibrated] High AQI/Thermal sensitivity penalizes outdoor exertion. ${item.description}`;
          } else {
            score = Math.min(100, score + 8);
          }
        }
      } else if (selectedRole === "logistics") {
        if (item.category === "travel") {
          if (currentRainProb > 40 || currentWind > 30) {
            score = Math.max(20, score - 25);
            status = score > 60 ? "Moderate" : "Caution";
            rationale = `[Freight Recalibrated] Transit safety lowered due to moisture and crosswinds. ${item.description}`;
          } else {
            score = Math.min(100, score + 10);
          }
        }
      } else if (selectedRole === "planner") {
        if (item.id === "wedding" || item.id === "outdoor_wedding" || item.id === "dining" || item.id === "outdoor_dining" || item.id === "lawn_event") {
          if (currentRainProb > 25 || currentWind > 20) {
            score = Math.max(15, score - 30);
            status = score > 60 ? "Moderate" : score > 30 ? "Caution" : "Hazardous";
            rationale = `[Event Recalibrated] Zero tolerance for canopy drift or evening downpours. ${item.description}`;
          } else {
            score = Math.min(100, score + 12);
          }
        }
      }

      return {
        ...item,
        suitabilityScore: score,
        status,
        description: rationale,
      };
    }).sort((a, b) => {
      // Prioritize category matching role
      if (selectedRole === "farmer") {
        if (a.category === "agriculture" && b.category !== "agriculture") return -1;
        if (b.category === "agriculture" && a.category !== "agriculture") return 1;
      } else if (selectedRole === "athlete") {
        if (a.category === "fitness" && b.category !== "fitness") return -1;
        if (b.category === "fitness" && a.category !== "fitness") return 1;
      } else if (selectedRole === "logistics") {
        if (a.category === "travel" && b.category !== "travel") return -1;
        if (b.category === "travel" && a.category !== "travel") return 1;
      } else if (selectedRole === "planner") {
        if (
          (a.id === "outdoor_wedding" || a.id === "lawn_event") &&
          !(b.id === "outdoor_wedding" || b.id === "lawn_event")
        )
          return -1;
        if (
          (b.id === "outdoor_wedding" || b.id === "lawn_event") &&
          !(a.id === "outdoor_wedding" || a.id === "lawn_event")
        )
          return 1;
      }
      return 0;
    });
  }, [rawDecisions, selectedRole, weatherData]);

  const filteredDecisions = calibratedDecisions.filter((d) => {
    if (activeCategory === "all") return true;
    return d.category === activeCategory;
  });

  const displayedDecisions = expandedAll
    ? filteredDecisions
    : filteredDecisions.slice(0, 6);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (authStatus === "authenticated") {
      updateUserRole(role);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Optimal":
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          dot: "bg-emerald-500",
          bar: "bg-emerald-500",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case "Moderate":
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-200",
          dot: "bg-amber-500",
          bar: "bg-amber-500",
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />,
        };
      case "Caution":
        return {
          bg: "bg-orange-50 text-orange-800 border-orange-200",
          dot: "bg-orange-500",
          bar: "bg-orange-500",
          icon: <AlertCircle className="w-3.5 h-3.5 text-orange-600" />,
        };
      default:
        return {
          bg: "bg-rose-50 text-rose-800 border-rose-200",
          dot: "bg-rose-500",
          bar: "bg-rose-500",
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
        };
    }
  };

  return (
    <section className="w-full my-8 space-y-5">
      {/* 1. Role Profile Threshold Calibration Bar */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/50 to-purple-50/30 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>{t.calibrationTitle}</span>
              {selectedRole !== "general" && (
                <span className="px-2 py-0.2 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold border border-sky-200">
                  {t.customProfileActive}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {t.calibrationDesc}
            </p>
          </div>
        </div>

        {/* Role Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => handleRoleChange("general")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedRole === "general"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t.roleGeneral}
          </button>

          <button
            onClick={() => handleRoleChange("farmer")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              selectedRole === "farmer"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50"
            }`}
          >
            <Sprout className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.roleFarmer}</span>
          </button>

          <button
            onClick={() => handleRoleChange("athlete")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              selectedRole === "athlete"
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-sky-50"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-sky-500" />
            <span>{t.roleAthlete}</span>
          </button>

          <button
            onClick={() => handleRoleChange("logistics")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              selectedRole === "logistics"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50"
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t.roleLogistics}</span>
          </button>

          <button
            onClick={() => handleRoleChange("planner")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              selectedRole === "planner"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-amber-50"
            }`}
          >
            <PartyPopper className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.rolePlanner}</span>
          </button>
        </div>
      </div>

      {/* Section Header & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.decisionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.decisionSubtitle}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1 rounded-xl font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-white text-sky-600 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.filterAll}
          </button>
          <button
            onClick={() => setActiveCategory("agriculture")}
            className={`px-3 py-1 rounded-xl font-medium transition-colors ${
              activeCategory === "agriculture"
                ? "bg-white text-sky-600 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.filterAgri}
          </button>
          <button
            onClick={() => setActiveCategory("outdoor")}
            className={`px-3 py-1 rounded-xl font-medium transition-colors ${
              activeCategory === "outdoor"
                ? "bg-white text-sky-600 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.filterOutdoor}
          </button>
          <button
            onClick={() => setActiveCategory("travel")}
            className={`px-3 py-1 rounded-xl font-medium transition-colors ${
              activeCategory === "travel"
                ? "bg-white text-sky-600 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.filterTravel}
          </button>
          <button
            onClick={() => setActiveCategory("fitness")}
            className={`px-3 py-1 rounded-xl font-medium transition-colors ${
              activeCategory === "fitness"
                ? "bg-white text-sky-600 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.filterFitness}
          </button>
          <button
            onClick={() => setActiveCategory("lifestyle")}
            className={`px-3 py-1 rounded-xl font-medium transition-colors ${
              activeCategory === "lifestyle"
                ? "bg-white text-sky-600 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.filterLifestyle}
          </button>
        </div>
      </div>

      {/* Grid of Decision Windows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedDecisions.map((item) => {
          const badgeStyle = getStatusBadge(item.status);
          const iconElem = ICON_MAP[item.icon] || <HelpCircle className="w-5 h-5" />;
          const meta = getLocalizedDecisionMeta(item.id, language);
          const title = meta.title || item.title;
          const category = meta.category || item.category;
          const localizedStatus = getLocalizedStatus(item.status, language);

          return (
            <div
              key={item.id}
              className="min-w-0 rounded-2xl p-5 bg-white/90 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between backdrop-blur-md group"
            >
              <div className="min-w-0">
                {/* Row 1: Icon & Category Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sky-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                    {iconElem}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                    {category}
                  </span>
                </div>

                {/* Row 2: Activity Title */}
                <div className="min-w-0 mb-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {title}
                  </h3>
                </div>

                {/* Row 3: Status Badge & Suitability Progress Score */}
                <div className="min-w-0 flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-3">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${badgeStyle.bg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                    {localizedStatus}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-800">
                      {item.suitabilityScore}
                    </span>
                    <span className="text-[10px] text-slate-400">/100</span>
                  </div>
                </div>

                {/* Suitability Progress Bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full ${badgeStyle.bar} transition-all duration-500`}
                    style={{ width: `${item.suitabilityScore}%` }}
                  />
                </div>

                {/* 2-line clamped atmospheric explanation */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Card Footer: Best Time Window & Primary Drivers */}
              <div className="mt-4 pt-3 border-t border-slate-100 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5 truncate">
                  <Clock className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                  <span className="truncate">{item.bestTimeWindow}</span>
                </div>

                {/* Atmospheric Factor Tags */}
                <div className="flex flex-wrap gap-1">
                  {item.atmosphericFactors?.map((fac: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-medium truncate"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand/Collapse Toggle Button */}
      {filteredDecisions.length > 6 && (
        <div className="text-center pt-2">
          <button
            onClick={() => setExpandedAll(!expandedAll)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-sky-600 bg-sky-50 border border-sky-200 hover:bg-sky-100 transition-colors shadow-xs"
          >
            <span>{expandedAll ? t.showLess : `${t.viewAll} (${filteredDecisions.length})`}</span>
            {expandedAll ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
    </section>
  );
};
