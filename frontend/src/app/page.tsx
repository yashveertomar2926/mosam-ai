"use client";

import React, { useEffect } from "react";
import { useWeatherStore } from "@/store/useWeatherStore";
import { fetchWeatherData } from "@/lib/api";
import { AtmosphericCanvas } from "@/components/canvas/AtmosphericCanvas";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroOverview } from "@/components/weather/HeroOverview";
import { GovernmentBulletinBanner } from "@/components/weather/GovernmentBulletinBanner";
import { WeatherRadarMap } from "@/components/weather/WeatherRadarMap";
import { InteractiveFeatureHub } from "@/components/weather/InteractiveFeatureHub";
import { HourlyForecastChart } from "@/components/weather/HourlyForecastChart";
import { DailyForecastList } from "@/components/weather/DailyForecastList";
import { FloatingAiWidget } from "@/components/ai/FloatingAiWidget";
import { WelcomeGateway } from "@/components/gateway/WelcomeGateway";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import { AlertPreferencesModal } from "@/components/modals/AlertPreferencesModal";
import { MosamLens } from "@/components/sensory/MosamLens";
import { Loader2, AlertCircle } from "lucide-react";

export default function HomePage() {
  const {
    selectedLocation,
    weatherData,
    setWeatherData,
    isLoading,
    setIsLoading,
    error,
    setError,
    initAuthFromStorage,
  } = useWeatherStore();

  // Initialize auth / guest status from localStorage
  useEffect(() => {
    initAuthFromStorage();
  }, [initAuthFromStorage]);

  // Fetch meteorological data
  useEffect(() => {
    let isCancelled = false;

    const loadWeather = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchWeatherData(
          selectedLocation.latitude,
          selectedLocation.longitude
        );
        if (!isCancelled) {
          setWeatherData(data);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error("Weather load failed", err);
          setError("Failed to load meteorological data. Please check network connection.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadWeather();

    return () => {
      isCancelled = true;
    };
  }, [selectedLocation.latitude, selectedLocation.longitude, setWeatherData, setIsLoading, setError]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {/* 1. First-Entry Welcome Gateway (shown if uninitialized) */}
      <WelcomeGateway />

      {/* 2. Feature Upgrade / Paywall Teaser Modal */}
      <UpgradeModal />

      {/* 3. Personalized Alert Configuration Modal */}
      <AlertPreferencesModal />

      {/* Dynamic Atmospheric Canvas VFX */}
      <AtmosphericCanvas />

      {/* Persistent Navigation Header */}
      <Header />

      {/* Main Meteorological Dashboard Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Spinner Skeleton if initial state */}
        {isLoading && !weatherData ? (
          <div className="w-full h-96 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            <p className="text-xs font-medium text-slate-500">
              Ingesting Open-Meteo & IMD synoptic grids...
            </p>
          </div>
        ) : (
          weatherData && (
            <>
              {/* 1. Hero Overview with Pinned Watchlist */}
              <HeroOverview />

              {/* 2. Official Government Meteorological Bulletin (IMD / CPCB / Agromet) */}
              <GovernmentBulletinBanner />

              {/* 3. Interactive Feature Deck (mosam.FM Radio, Life Physics Lab, Sensory Time Machine, Decision Windows) */}
              <InteractiveFeatureHub />

              {/* 4. Atmospheric Radar & Google Maps */}
              <WeatherRadarMap />

              {/* 5. SENSORY MODULE: Mosam Lens (1-Tap Community Ground Truth & Radar vs Reality Consensus) */}
              <MosamLens />

              {/* 6. 48-Hour Hourly Microclimate Outlook */}
              <HourlyForecastChart />

              {/* 7. 7-Day Synoptic Forecast */}
              <DailyForecastList />
            </>
          )
        )}
      </main>

      {/* Floating AI Assistant Drawer */}
      <FloatingAiWidget />

      {/* Footer */}
      <Footer />
    </div>
  );
}
