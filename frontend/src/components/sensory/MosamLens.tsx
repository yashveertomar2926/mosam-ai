"use client";

import React, { useState } from "react";
import { useWeatherStore } from "@/store/useWeatherStore";
import { translations } from "@/lib/translations";
import {
  Eye,
  CheckCircle2,
  Radio,
  Users,
  Sparkles,
  Lock,
  ArrowRight,
  Sun,
  Wind,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  ShieldCheck,
} from "lucide-react";

export const MosamLens: React.FC = () => {
  const {
    weatherData,
    selectedLocation,
    language,
    isGuest,
    crowdVote,
    setCrowdVote,
    setUpgradeModal,
  } = useWeatherStore();

  const t = translations[language] || translations.en;
  const ml = t.mosamLens || translations.en.mosamLens!;

  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({
    clear: 48,
    gusty: 19,
    drizzle: 8,
    downpour: 3,
    fog: 12,
  });

  if (!weatherData) return null;

  const current = weatherData.current || {};
  const rainProb = weatherData.daily?.[0]?.precipitationProbability ?? 15;

  const voteOptions = [
    { id: "clear", label: ml.options.clear.label, icon: <Sun className="w-5 h-5 text-amber-500" />, desc: ml.options.clear.desc },
    { id: "gusty", label: ml.options.gusty.label, icon: <Wind className="w-5 h-5 text-teal-500" />, desc: ml.options.gusty.desc },
    { id: "drizzle", label: ml.options.drizzle.label, icon: <CloudDrizzle className="w-5 h-5 text-sky-500" />, desc: ml.options.drizzle.desc },
    { id: "downpour", label: ml.options.downpour.label, icon: <CloudLightning className="w-5 h-5 text-indigo-500" />, desc: ml.options.downpour.desc },
    { id: "fog", label: ml.options.fog.label, icon: <CloudFog className="w-5 h-5 text-slate-400" />, desc: ml.options.fog.desc },
  ];

  const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);

  const handleVote = (voteId: string) => {
    if (isGuest) {
      setUpgradeModal(
        true,
        ml.guestDesc
      );
      return;
    }

    if (crowdVote === voteId) {
      // Toggle off
      setCrowdVote(null);
      setVoteCounts((prev) => ({ ...prev, [voteId]: Math.max(0, prev[voteId] - 1) }));
    } else {
      // Cast vote
      setCrowdVote(voteId);
      setVoteCounts((prev) => ({
        ...prev,
        [voteId]: prev[voteId] + 1,
        ...(crowdVote ? { [crowdVote]: Math.max(0, prev[crowdVote] - 1) } : {}),
      }));
    }
  };

  return (
    <section className="relative w-full rounded-3xl p-6 sm:p-8 bg-white/90 border border-slate-200/80 shadow-md backdrop-blur-md overflow-hidden my-8">
      {/* Glow Accent */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/60 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-sky-600 flex items-center justify-center text-white shadow-md shadow-teal-500/25">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {ml.title}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
                {ml.liveBadge}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {ml.subtitle}
            </p>
          </div>
        </div>

        {/* Guest Lock Indicator */}
        {isGuest && (
          <button
            onClick={() =>
              setUpgradeModal(
                true,
                ml.guestDesc
              )
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{ml.memberPerk}</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="relative pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center z-10">
        {/* Guest Lock Overlay Teaser */}
        {isGuest && (
          <div className="absolute inset-0 z-20 backdrop-blur-[3px] bg-white/70 rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fade-in border border-teal-500/20">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-sky-600 flex items-center justify-center text-white shadow-xl shadow-teal-500/30 mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              {ml.guestTitle}
            </h3>
            <p className="text-xs text-slate-600 max-w-md mt-1 mb-4">
              {ml.guestDesc}
            </p>
            <button
              onClick={() =>
                setUpgradeModal(
                  true,
                  ml.guestDesc
                )
              }
              className="py-2.5 px-6 rounded-xl font-bold text-xs bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>{ml.guestUnlock}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Left Column: 1-Tap Voting Buttons */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              {ml.question(selectedLocation.name)}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {ml.verifiedReports(totalVotes)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {voteOptions.map((opt) => {
              const isSelected = crowdVote === opt.id;
              const pct = Math.round(((voteCounts[opt.id] || 0) / totalVotes) * 100);

              return (
                <button
                  key={opt.id}
                  onClick={() => handleVote(opt.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 group ${
                    isSelected
                      ? "border-teal-500 bg-teal-50 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-teal-50/50 shadow-xs"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    {opt.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {opt.label}
                      </span>
                      <span className="text-[10px] font-extrabold text-slate-400">
                        {pct}%
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {crowdVote && (
            <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
              <span>{ml.verifiedFeedback}</span>
            </div>
          )}
        </div>

        {/* Right Column: Radar vs. Reality Consensus Meter */}
        <div className="lg:col-span-6 rounded-2xl p-5 bg-slate-50 border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-sky-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700">
                {ml.consensusTitle}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700 border border-sky-200">
              {ml.alignmentValue}
            </span>
          </div>

          {/* Consensus Meter Visual */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>{ml.dopplerProjection}</span>
              <strong className="text-sky-600">{ml.rainRisk(rainProb)}</strong>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>{ml.communityGroundTruth}</span>
              <strong className="text-teal-600">
                {voteCounts.clear > 30 ? ml.clearSkyConsensus : ml.rainConsensus}
              </strong>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-500 via-sky-500 to-indigo-500 w-[92%]" />
            </div>
          </div>

          {/* Scientific Validation Note */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1 shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{ml.validationTitle}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {ml.validationDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
