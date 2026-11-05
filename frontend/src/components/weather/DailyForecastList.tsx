"use client";

import React from "react";
import { useWeatherStore } from "@/store/useWeatherStore";
import {
  translations,
  getLocalizedWmoDescription,
  formatLocalizedWeekday,
  formatLocalizedDate
} from "@/lib/translations";
import {
  CalendarDays,
  Droplets,
  Wind,
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
} from "lucide-react";

function getDailyIcon(code: number) {
  if (code === 0) return <Sun className="w-5 h-5 text-amber-500" />;
  if (code === 1 || code === 2) return <CloudSun className="w-5 h-5 text-amber-500" />;
  if (code === 3) return <Cloud className="w-5 h-5 text-slate-400" />;
  if (code === 45 || code === 48) return <CloudFog className="w-5 h-5 text-slate-400" />;
  if ([51, 53, 55, 56, 57].includes(code)) return <CloudDrizzle className="w-5 h-5 text-sky-400" />;
  if ([61, 62, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className="w-5 h-5 text-sky-500" />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow className="w-5 h-5 text-blue-300" />;
  if ([95, 96, 99].includes(code)) return <CloudLightning className="w-5 h-5 text-amber-400" />;
  return <CloudSun className="w-5 h-5 text-amber-500" />;
}

export const DailyForecastList: React.FC = () => {
  const { weatherData, unitSystem, language } = useWeatherStore();
  const t = translations[language] || translations.en;

  const daily: any[] = weatherData?.daily || weatherData?.dailyForecast || [];
  if (!daily || daily.length === 0) return null;

  const toFahrenheit = (c: number) => (c * 9) / 5 + 32;
  const formatTemp = (c: number) => {
    const val = unitSystem === "imperial" ? toFahrenheit(c) : c;
    return `${Math.round(val)}°`;
  };

  return (
    <section className="w-full my-8 space-y-3">
      <div className="flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-indigo-500" />
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t.dailyTitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {daily.map((item, idx) => {
          const dayName = formatLocalizedWeekday(item.date, language, idx === 0);
          const dateFormatted = formatLocalizedDate(item.date, language);
          const localizedDesc = getLocalizedWmoDescription(item.weatherCode, language) || item.weatherDescription;

          return (
            <div
              key={idx}
              className="rounded-2xl p-4 bg-white/90 border border-slate-200/80 shadow-xs backdrop-blur-md flex flex-col justify-between gap-3 hover:border-indigo-400/50 hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    {dayName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {dateFormatted}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 my-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-amber-500 flex-shrink-0">
                    {getDailyIcon(item.weatherCode)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {localizedDesc}
                    </div>
                    <div className="text-[10px] text-sky-500 flex items-center gap-1">
                      <Droplets className="w-3 h-3" />
                      <span>{item.precipitationProbabilityMax}% {t.rain}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Temperature Min-Max Span */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span className="text-sky-500">{formatTemp(item.tempMin)}</span>
                  <span className="text-rose-500">{formatTemp(item.tempMax)}</span>
                </div>
                {/* Horizontal Gradient Range Bar */}
                <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500 opacity-80" />
              </div>

              {/* Day Extras: Wind & Sun */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span className="flex items-center gap-0.5">
                  <Wind className="w-3 h-3" />
                  {Math.round(item.windSpeedMax)} km/h
                </span>
                <span className="flex items-center gap-0.5">
                  <Sun className="w-3 h-3" />
                  UV {Math.round(item.uvIndexMax)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
