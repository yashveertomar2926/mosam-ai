"use client";

import React, { useRef } from "react";
import { useWeatherStore } from "@/store/useWeatherStore";
import {
  translations,
  formatLocalizedTime,
  formatLocalizedWeekday
} from "@/lib/translations";
import {
  Clock,
  Droplets,
  Wind,
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function getHourlyIcon(code: number, timeStr: string) {
  const hour = new Date(timeStr).getHours();
  const isNight = hour < 6 || hour >= 19;

  if (code === 0) return isNight ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />;
  if (code === 1 || code === 2) return isNight ? <CloudMoon className="w-5 h-5 text-indigo-300" /> : <CloudSun className="w-5 h-5 text-amber-500" />;
  if (code === 3) return <Cloud className="w-5 h-5 text-slate-400" />;
  if (code === 45 || code === 48) return <CloudFog className="w-5 h-5 text-slate-400" />;
  if ([51, 53, 55, 56, 57].includes(code)) return <CloudDrizzle className="w-5 h-5 text-sky-400" />;
  if ([61, 62, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className="w-5 h-5 text-sky-500" />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow className="w-5 h-5 text-blue-300" />;
  if ([95, 96, 99].includes(code)) return <CloudLightning className="w-5 h-5 text-amber-400" />;
  return isNight ? <CloudMoon className="w-5 h-5 text-indigo-300" /> : <CloudSun className="w-5 h-5 text-amber-500" />;
}

export const HourlyForecastChart: React.FC = () => {
  const { weatherData, unitSystem, language } = useWeatherStore();
  const t = translations[language] || translations.en;
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const hourly: any[] = weatherData?.hourly || weatherData?.hourlyForecast || [];

  if (!hourly || hourly.length === 0) return null;

  const toFahrenheit = (c: number) => (c * 9) / 5 + 32;
  const formatTemp = (c: number) => {
    const val = unitSystem === "imperial" ? toFahrenheit(c) : c;
    return `${Math.round(val)}°`;
  };

  const formatWind = (kmh: number) => {
    if (unitSystem === "imperial") {
      return `${(kmh * 0.621371).toFixed(0)} mph`;
    }
    return `${kmh.toFixed(0)} km/h`;
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -360 : 360;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full my-8 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-500" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.hourlyTitle}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-300 scroll-smooth"
      >
        {hourly.map((item, idx) => {
          const timeStr = formatLocalizedTime(item.time, language);
          const dayLabel = idx % 24 === 0 || idx === 0
            ? formatLocalizedWeekday(item.time, language, idx === 0)
            : "";

          return (
            <div
              key={idx}
              className="flex-shrink-0 w-28 rounded-2xl p-3.5 bg-white/90 border border-slate-200/80 shadow-xs backdrop-blur-md flex flex-col items-center justify-between gap-2.5 transition-transform hover:-translate-y-1"
            >
              <div className="text-center">
                {dayLabel ? (
                  <span className="text-[10px] uppercase font-bold text-sky-600 block -mb-0.5">
                    {dayLabel}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 block -mb-0.5">
                    •
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-700">
                  {timeStr}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-amber-500">
                {getHourlyIcon(item.weatherCode, item.time)}
              </div>

              <div className="text-lg font-extrabold text-slate-900">
                {formatTemp(item.temperature)}
              </div>

              {/* Rain Probability Bar */}
              <div className="w-full flex flex-col items-center gap-0.5">
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${item.precipitationProbability}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-sky-600">
                  {item.precipitationProbability}% {t.rain}
                </span>
              </div>

              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Wind className="w-3 h-3" />
                <span>{formatWind(item.windSpeed)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
