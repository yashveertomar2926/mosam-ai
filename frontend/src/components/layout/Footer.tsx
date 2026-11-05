"use client";

import React from "react";
import { ShieldCheck, Database, Globe, Compass } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-8 mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-slate-800">
              mosam<span className="text-amber-500">.AI</span>
            </span>
            <span className="text-slate-400">•</span>
            <span>Don’t just see the weather. Understand it.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1">
              <Database className="w-3 h-3 text-sky-500" />
              Open-Meteo (ECMWF & GFS)
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              IMD Agromet & CPCB NAQI
            </span>
            <span className="inline-flex items-center gap-1">
              <Globe className="w-3 h-3 text-indigo-500" />
              @vis.gl/react-google-maps
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} mosam.AI Atmospheric Intelligence Systems. Guest-first, open meteorology.
          </p>
          <p className="text-center md:text-right">
            Google Maps Platform integration with attribution ID: <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded border border-slate-200">gmp_git_agentskills_v1</code>.
            Subject to the <a href="https://cloud.google.com/maps-platform/terms?utm_campaign=gmp_git_agentskills_v1" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">Google Maps Platform Terms of Service</a>.
          </p>
        </div>
      </div>
    </footer>
  );
};
