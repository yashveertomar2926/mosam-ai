"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useWeatherStore, LocationItem } from "@/store/useWeatherStore";
import { translations } from "@/lib/translations";
import { searchGeocode, reverseGeocode } from "@/lib/api";
import {
  CloudSun,
  Search,
  MapPin,
  Compass,
  Languages,
  UserCheck,
  Loader2,
  Sparkles,
  Zap,
  User,
  LogOut,
  Bell,
  Bookmark,
  ChevronDown,
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    selectedLocation,
    setSelectedLocation,
    language,
    setLanguage,
    unitSystem,
    toggleUnitSystem,
    authStatus,
    userProfile,
    pinnedLocations,
    logout,
    setUpgradeModal,
    setAlertModalOpen,
  } = useWeatherStore();

  const t = translations[language] || translations.en;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isGpsLocating, setIsGpsLocating] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // Debounced Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsOpenDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchGeocode(searchQuery.trim());
        setSearchResults(results);
        setIsOpenDropdown(true);
      } catch (e) {
        console.error("Geocoding failed", e);
      } finally {
        setIsSearching(false);
      }
    }, 320);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsOpenDropdown(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLocation = (loc: LocationItem) => {
    setSelectedLocation(loc);
    setSearchQuery("");
    setIsOpenDropdown(false);
  };

  const handleGpsClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsGpsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const loc = await reverseGeocode(lat, lon);
          setSelectedLocation(loc);
        } catch (e) {
          console.error("Reverse geocoding failed", e);
        } finally {
          setIsGpsLocating(false);
        }
      },
      (err) => {
        console.warn("GPS location denied or timed out", err);
        setIsGpsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-slate-200/80 shadow-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
            <CloudSun className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-sky-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              mosam<span className="text-amber-500 font-extrabold">.AI</span>
            </span>
            <span className="text-[10px] text-slate-500 hidden sm:block -mt-1 font-medium">
              {t.tagline}
            </span>
          </div>
        </Link>

        {/* Search Bar & GPS Trigger */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md mx-2">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setIsOpenDropdown(true)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-24 py-1.5 text-sm rounded-full border border-slate-200 bg-slate-50/80 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all shadow-inner"
            />

            {/* GPS Button inside search */}
            <button
              onClick={handleGpsClick}
              disabled={isGpsLocating}
              title={t.useGps}
              className="absolute right-1.5 flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors"
            >
              {isGpsLocating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Compass className="w-3.5 h-3.5" />
              )}
              <span className="hidden md:inline">{t.useGps}</span>
            </button>
          </div>

          {/* Search Dropdown */}
          {isOpenDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1.5 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-xl z-50 divide-y divide-slate-100">
              {isSearching ? (
                <div className="p-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                  {t.searchingGrids}
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <button
                    key={`${item.latitude}-${item.longitude}-${idx}`}
                    onClick={() => handleSelectLocation(item)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-sky-50/80 flex items-start gap-2.5 transition-colors group"
                  >
                    <MapPin className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800 truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {item.formattedAddress}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-400">
                  {t.noLocationFound}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Language Selector */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-sky-500" />
              <span className="uppercase">{language}</span>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block w-36 rounded-xl border border-slate-200 bg-white shadow-lg py-1 z-50">
              <button
                onClick={() => setLanguage("en")}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                  language === "en" ? "font-bold text-sky-600 bg-sky-50/80" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>English</span>
                <span className="text-[10px] text-slate-400">EN</span>
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                  language === "hi" ? "font-bold text-sky-600 bg-sky-50/80" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>हिन्दी</span>
                <span className="text-[10px] text-slate-400">HI</span>
              </button>
              <button
                onClick={() => setLanguage("te")}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                  language === "te" ? "font-bold text-sky-600 bg-sky-50/80" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>తెలుగు</span>
                <span className="text-[10px] text-slate-400">TE</span>
              </button>
              <button
                onClick={() => setLanguage("ta")}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                  language === "ta" ? "font-bold text-sky-600 bg-sky-50/80" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>தமிழ்</span>
                <span className="text-[10px] text-slate-400">TA</span>
              </button>
              <button
                onClick={() => setLanguage("mr")}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                  language === "mr" ? "font-bold text-sky-600 bg-sky-50/80" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>मराठी</span>
                <span className="text-[10px] text-slate-400">MR</span>
              </button>
              <button
                onClick={() => setLanguage("bn")}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                  language === "bn" ? "font-bold text-sky-600 bg-sky-50/80" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>বাংলা</span>
                <span className="text-[10px] text-slate-400">BN</span>
              </button>
              <button
                onClick={() => setLanguage("ml")}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                  language === "ml" ? "font-bold text-sky-600 bg-sky-50/80" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>മലയാളം</span>
                <span className="text-[10px] text-slate-400">ML</span>
              </button>
            </div>
          </div>

          {/* Unit Toggle °C / °F */}
          <button
            onClick={toggleUnitSystem}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            title={`Switch to ${unitSystem === "metric" ? "Fahrenheit" : "Celsius"}`}
          >
            {unitSystem === "metric" ? "°C" : "°F"}
          </button>

          {/* GUEST VS AUTHENTICATED USER BADGE */}
          {authStatus === "authenticated" && userProfile ? (
            /* Logged-In User Profile Pill with Dropdown */
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-bold bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/30 text-slate-800 hover:bg-sky-50 transition-colors shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-[10px]">
                  {userProfile.name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[110px] truncate">{userProfile.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-100 text-sky-600 hidden md:inline">
                  {userProfile.role}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl p-2 z-50 space-y-1 animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-extrabold text-slate-900 truncate">
                      {userProfile.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {userProfile.email}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                      {userProfile.roleLabel}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setAlertModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.personalizedAlerts}</span>
                  </button>

                  <div className="px-3 py-1.5 text-[11px] text-slate-500 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Bookmark className="w-3 h-3 text-sky-500" />
                      {t.pinnedWatchlist}
                    </span>
                    <span className="font-bold">{pinnedLocations.length}</span>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-rose-50 text-rose-600 flex items-center gap-2 transition-colors font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.signOut}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Guest Session Pill + Upgrade CTA */
            <div className="flex items-center gap-1.5">
              <span
                className="hidden sm:flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                title={t.guestBadge}
              >
                <UserCheck className="w-3 h-3 text-emerald-500" />
                <span>{t.guestBadge.split("•")[0]?.trim() || "Guest"}</span>
              </span>

              <button
                onClick={() =>
                  setUpgradeModal(
                    true,
                    "Sign in to unlock multi-location watchlist, alert dispatches, and persistent AI memory."
                  )
                }
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-bold bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm hover:scale-105 transition-transform"
                title="Unlock Full Features (Sign In)"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{t.loginText.split("/")[0]?.trim() || "Sign In"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
