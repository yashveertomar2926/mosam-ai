"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWeatherStore } from "@/store/useWeatherStore";
import { translations } from "@/lib/translations";
import { reverseGeocode } from "@/lib/api";
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import {
  Layers,
  Play,
  Pause,
  RotateCcw,
  MapPin,
  Compass,
  CloudRain,
  Info,
} from "lucide-react";

export const WeatherRadarMap: React.FC = () => {
  const { selectedLocation, setSelectedLocation, language } = useWeatherStore();
  const t = translations[language] || translations.en;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const [isPlaying, setIsPlaying] = useState(true);
  const [radarFrame, setRadarFrame] = useState(0);
  const [zoom, setZoom] = useState(7);
  const [isUpdatingCoords, setIsUpdatingCoords] = useState(false);

  // Radar Loop Animation Frames (0 to 9)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setRadarFrame((prev) => (prev + 1) % 10);
    }, 650);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle marker drag end
  const handleMarkerDragEnd = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const newLat = e.latLng.lat();
    const newLon = e.latLng.lng();

    setIsUpdatingCoords(true);
    try {
      const loc = await reverseGeocode(newLat, newLon);
      setSelectedLocation(loc);
    } catch (err) {
      console.error("Geocoding failed for dragged marker", err);
    } finally {
      setIsUpdatingCoords(false);
    }
  };

  const center = {
    lat: selectedLocation.latitude,
    lng: selectedLocation.longitude,
  };

  return (
    <section className="w-full my-8 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-500" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.radarTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.radarSubtitle}
          </p>
        </div>

        {/* Radar Player Controls */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 self-start sm:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-white text-sky-600 shadow-xs hover:bg-sky-50 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>{t.radarPause}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>{t.radarPlay}</span>
              </>
            )}
          </button>

          {/* Timeline indicator (T - 50m to T - 0m) */}
          <div className="flex items-center gap-1 px-2">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === radarFrame
                    ? "bg-sky-500 scale-125 shadow-sm shadow-sky-500/50"
                    : i < radarFrame
                    ? "bg-sky-200"
                    : "bg-slate-300"
                }`}
              />
            ))}
          </div>

          <span className="text-[10px] font-semibold text-slate-500 min-w-10 text-right pr-1">
            -{50 - radarFrame * 5}m
          </span>
        </div>
      </div>

      {/* Map Display Container with explicit height (CF2 compliance) */}
      <div className="relative w-full h-[440px] rounded-3xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-100">
        {apiKey ? (
          <APIProvider apiKey={apiKey}>
            <GoogleMap
              mapId="DEMO_MAP_ID"
              center={center}
              zoom={zoom}
              onZoomChanged={(e) => setZoom(e.detail.zoom)}
              style={{ width: "100%", height: "100%" }}
              gestureHandling="greedy"
              disableDefaultUI={false}
              internalUsageAttributionIds={["gmp_git_agentskills_v1"]}
            >
              <AdvancedMarker
                position={center}
                draggable={true}
                onDragEnd={handleMarkerDragEnd}
                title="Drag to inspect another location"
              />
            </GoogleMap>
          </APIProvider>
        ) : (
          /* Interactive Fallback Radar Canvas when no API Key is configured */
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[#090d19] via-[#0d1424] to-[#080c16] overflow-hidden">
            {/* Grid Coordinates Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Concentric Radar Range Rings */}
            {[100, 180, 260, 340].map((ring, idx) => (
              <div
                key={idx}
                className="absolute rounded-full border border-sky-500/20 pointer-events-none"
                style={{ width: `${ring}px`, height: `${ring}px` }}
              />
            ))}

            {/* Rotating Doppler Radar Sweep Beam */}
            <div
              className={`absolute w-[340px] h-[340px] rounded-full pointer-events-none ${
                isPlaying ? "animate-spin" : ""
              }`}
              style={{
                animationDuration: "4s",
                background:
                  "conic-gradient(from 0deg, rgba(14, 165, 233, 0) 0deg, rgba(14, 165, 233, 0.25) 60deg, transparent 65deg)",
              }}
            />

            {/* Simulated Precipitation Reflectivity Echoes */}
            <div
              className="absolute pointer-events-none transition-all duration-700"
              style={{
                top: `${42 + Math.sin(radarFrame * 0.6) * 6}%`,
                left: `${46 + Math.cos(radarFrame * 0.6) * 8}%`,
                width: "140px",
                height: "90px",
                borderRadius: "45%",
                background:
                  "radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, rgba(245, 158, 11, 0.4) 40%, rgba(239, 68, 68, 0.3) 70%, transparent 100%)",
                filter: "blur(14px)",
              }}
            />

            {/* Center Pin Indicator */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center animate-ping absolute" />
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/50 border-2 border-white">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="mt-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-bold text-white shadow-md">
                {selectedLocation.name} ({selectedLocation.latitude.toFixed(2)}°, {selectedLocation.longitude.toFixed(2)}°)
              </div>
            </div>

            {/* Demo Key Notice Badge */}
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-xs text-slate-300">
              <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span>
                To activate live Google Maps satellite & terrain tiles, add{" "}
                <code className="text-amber-400 font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>.
              </span>
            </div>
          </div>
        )}

        {/* Reflectivity Legend (dBZ Scale) */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 p-2 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-[10px] text-slate-300">
          <span className="font-bold text-slate-400 mb-0.5">Precipitation (dBZ)</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2 rounded bg-emerald-500" />
            <span>Light (15-30)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2 rounded bg-amber-500" />
            <span>Moderate (30-45)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2 rounded bg-rose-500" />
            <span>Heavy (45-60)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
