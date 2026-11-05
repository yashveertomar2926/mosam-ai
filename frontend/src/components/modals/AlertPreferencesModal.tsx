"use client";

import React, { useState } from "react";
import { useWeatherStore } from "@/store/useWeatherStore";
import {
  X,
  Bell,
  CloudRain,
  Wind,
  ShieldAlert,
  Smartphone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Radio,
} from "lucide-react";

export const AlertPreferencesModal: React.FC = () => {
  const {
    alertModalOpen,
    setAlertModalOpen,
    alertPreferences,
    updateAlertPreferences,
    authStatus,
    setUpgradeModal,
  } = useWeatherStore();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [rainVal, setRainVal] = useState(alertPreferences.rainThreshold);
  const [windVal, setWindVal] = useState(alertPreferences.windThreshold);
  const [aqiVal, setAqiVal] = useState(alertPreferences.aqiThreshold);
  const [pushEnabled, setPushEnabled] = useState(alertPreferences.enableWebPush);
  const [emailEnabled, setEmailEnabled] = useState(alertPreferences.enableEmail);
  const [smsEnabled, setSmsEnabled] = useState(alertPreferences.enableSms);
  const [emailInput, setEmailInput] = useState(alertPreferences.emailAddress || "");
  const [phoneInput, setPhoneInput] = useState(alertPreferences.phoneNumber || "");

  if (!alertModalOpen) return null;

  // If user is guest, redirect to upgrade modal
  if (authStatus !== "authenticated") {
    setAlertModalOpen(false);
    setUpgradeModal(
      true,
      "Sign in to configure custom rain, spray wind, and air quality alert dispatches."
    );
    return null;
  }

  const handleSave = () => {
    updateAlertPreferences({
      rainThreshold: rainVal,
      windThreshold: windVal,
      aqiThreshold: aqiVal,
      enableWebPush: pushEnabled,
      enableEmail: emailEnabled,
      enableSms: smsEnabled,
      emailAddress: emailInput,
      phoneNumber: phoneInput,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setAlertModalOpen(false);
    }, 1200);
  };

  const handleRequestPush = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setPushEnabled(true);
        new Notification("mosam.AI Alerts Active", {
          body: `Atmospheric alert triggers configured for rain >${rainVal}% and wind >${windVal} km/h.`,
          icon: "/favicon.ico",
        });
      } else {
        alert("Push notifications were not granted by browser.");
        setPushEnabled(false);
      }
    } else {
      setPushEnabled(!pushEnabled);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-white/95 border border-slate-200 shadow-2xl backdrop-blur-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setAlertModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/30">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Personalized Agromet & Severe Weather Alerts
            </h2>
            <p className="text-xs text-slate-500">
              Set autonomous thresholds for immediate push, email, or SMS dispatches
            </p>
          </div>
        </div>

        {/* Threshold Sliders */}
        <div className="space-y-4">
          {/* 1. Rain Risk */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-sky-500" />
                Rain Probability Threshold
              </span>
              <span className="px-2 py-0.5 rounded-md font-extrabold bg-sky-100 text-sky-700">
                &gt; {rainVal}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={rainVal}
              onChange={(e) => setRainVal(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <p className="text-[10px] text-slate-500">
              Alert fires when convective or frontal rain risk crosses {rainVal}%. Recommended for outdoor work & events.
            </p>
          </div>

          {/* 2. Wind Gust (Spray Hold) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-teal-500" />
                IMD Agromet Wind Spray Hold
              </span>
              <span className="px-2 py-0.5 rounded-md font-extrabold bg-teal-100 text-teal-700">
                &gt; {windVal} km/h
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={windVal}
              onChange={(e) => setWindVal(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <p className="text-[10px] text-slate-500">
              Warns farmers when chemical drift risks damage neighboring crops or outdoor structures ({windVal} km/h).
            </p>
          </div>

          {/* 3. AQI / PM2.5 Hazard */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                CPCB NAQI Air Quality Hazard
              </span>
              <span className="px-2 py-0.5 rounded-md font-extrabold bg-rose-100 text-rose-700">
                &gt; {aqiVal} AQI
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="400"
              step="25"
              value={aqiVal}
              onChange={(e) => setAqiVal(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <p className="text-[10px] text-slate-500">
              Dispatches asthma & outdoor athletic caution when particulate pollution crosses {aqiVal} (Poor / Severe).
            </p>
          </div>
        </div>

        {/* Delivery Channels */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider">
            Dispatch Channels
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleRequestPush}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-colors ${
                pushEnabled
                  ? "border-sky-500 bg-sky-50 text-sky-800 font-bold"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Radio className="w-4 h-4 text-sky-500" />
              <div className="text-xs">
                <div>Web Push</div>
                <div className="text-[10px] opacity-75">{pushEnabled ? "Active" : "Disabled"}</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setEmailEnabled(!emailEnabled)}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-colors ${
                emailEnabled
                  ? "border-indigo-500 bg-indigo-50 text-indigo-800 font-bold"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Mail className="w-4 h-4 text-indigo-500" />
              <div className="text-xs">
                <div>Email Dispatch</div>
                <div className="text-[10px] opacity-75">{emailEnabled ? "Active" : "Disabled"}</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSmsEnabled(!smsEnabled)}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-colors ${
                smsEnabled
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <div className="text-xs">
                <div>SMS Alerts</div>
                <div className="text-[10px] opacity-75">{smsEnabled ? "Active" : "Disabled"}</div>
              </div>
            </button>
          </div>

          {/* Conditional Email / Phone Inputs */}
          {emailEnabled && (
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="alert-dispatch@example.com"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          )}

          {smsEnabled && (
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          )}
        </div>

        {/* Save CTA */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={savedSuccess}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Alert Preferences Saved!</span>
              </>
            ) : (
              <span>Save Alert Configuration</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
