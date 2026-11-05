import { create } from "zustand";
import { LanguageCode } from "@/lib/translations";

export interface LocationItem {
  name: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  timezone: string;
  placeId?: string;
  country?: string;
  countryCode?: string;
  state?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  engine?: string;
  authorityBadge?: string;
  askedLocation?: LocationItem;
  isLocationSwitched?: boolean;
  requestedGps?: boolean;
}

export type AuthStatus = "uninitialized" | "guest" | "authenticated";
export type UserRole = "general" | "farmer" | "athlete" | "logistics" | "planner";

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  memoryNotes: string[];
  avatarUrl?: string;
}

export interface PinnedLocation {
  id: string;
  label: string;
  category?: "farm" | "home" | "work" | "transit" | "other";
  location: LocationItem;
}

export interface AlertPreferences {
  rainThreshold: number; // % (default 40)
  windThreshold: number; // km/h (default 25)
  aqiThreshold: number; // NAQI (default 250)
  enableWebPush: boolean;
  enableEmail: boolean;
  enableSms: boolean;
  emailAddress?: string;
  phoneNumber?: string;
}

export const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  general: {
    name: "Aaditya Varma",
    email: "aaditya.v@example.com",
    role: "general",
    roleLabel: "General Resident",
    memoryNotes: ["Daily commuter in Delhi NCR; interested in weekend outdoor plans and air quality."],
  },
  farmer: {
    name: "Devendra Patel",
    email: "devendra.patel@kisan.in",
    role: "farmer",
    roleLabel: "Agronomist / Farmer",
    memoryNotes: [
      "Cultivates 18 acres of wheat and mustard in Meerut, Western UP.",
      "Strict adherence to IMD Agromet spray guidelines (hold if rain > 35% or wind > 15 km/h).",
      "Tracks soil moisture saturation & standing water drainage to prevent fungal blight.",
    ],
  },
  athlete: {
    name: "Aarav Sharma",
    email: "aarav.runner@fit.org",
    role: "athlete",
    roleLabel: "Endurance Runner & Athlete",
    memoryNotes: [
      "Marathon runner and road cyclist based in NCR.",
      "Sensitive to high PM2.5 particulate matter (CPCB NAQI > 150 warrants treadmill session).",
      "Monitors midday UV Index and heat stress index to prevent thermal exhaustion.",
    ],
  },
  logistics: {
    name: "Capt. Vikram Malhotra",
    email: "vikram@expresslogistics.in",
    role: "logistics",
    roleLabel: "Fleet & Supply Chain Manager",
    memoryNotes: [
      "Operates cold-chain freight carriers along NH48, Yamuna Expressway, and Eastern Peripheral.",
      "Requires advance warnings for dense winter radiation fog (<200m visibility) and flash flood inundations.",
    ],
  },
  planner: {
    name: "Priya Sundaram",
    email: "priya@royalweddings.in",
    role: "planner",
    roleLabel: "Luxury Destination Event Planner",
    memoryNotes: [
      "Plans open-air lawns, weddings, and cultural festivals.",
      "Crucial window: 4:00 PM to 11:00 PM evening outdoor banquets; sensitive to gusts > 20 km/h that damage canopies.",
    ],
  },
};

export const SAMPLE_PINNED_LOCATIONS: Record<UserRole, PinnedLocation[]> = {
  farmer: [
    {
      id: "pin-meerut-farm",
      label: "🌾 Wheat & Mustard Farm",
      category: "farm",
      location: {
        name: "Meerut",
        formattedAddress: "Meerut, Uttar Pradesh, India",
        latitude: 28.9845,
        longitude: 77.7064,
        timezone: "Asia/Kolkata",
        state: "Uttar Pradesh",
        country: "India",
      },
    },
    {
      id: "pin-home-delhi",
      label: "🏠 Home (Delhi)",
      category: "home",
      location: {
        name: "New Delhi",
        formattedAddress: "New Delhi, Delhi, India",
        latitude: 28.6139,
        longitude: 77.2090,
        timezone: "Asia/Kolkata",
        state: "Delhi",
        country: "India",
      },
    },
    {
      id: "pin-mandi-azadpur",
      label: "🏢 Azadpur Mandi",
      category: "work",
      location: {
        name: "Azadpur, Delhi",
        formattedAddress: "Azadpur, North Delhi, Delhi, India",
        latitude: 28.7041,
        longitude: 77.1758,
        timezone: "Asia/Kolkata",
        state: "Delhi",
        country: "India",
      },
    },
  ],
  athlete: [
    {
      id: "pin-delhi-ridge",
      label: "🏃 Ridge Running Trail",
      category: "other",
      location: {
        name: "New Delhi",
        formattedAddress: "Northern Ridge, Delhi, India",
        latitude: 28.6833,
        longitude: 77.2167,
        timezone: "Asia/Kolkata",
        state: "Delhi",
        country: "India",
      },
    },
    {
      id: "pin-bengaluru-park",
      label: "🚴 Cubbon Park Loop",
      category: "other",
      location: {
        name: "Bengaluru",
        formattedAddress: "Bengaluru, Karnataka, India",
        latitude: 12.9716,
        longitude: 77.5946,
        timezone: "Asia/Kolkata",
        state: "Karnataka",
        country: "India",
      },
    },
  ],
  logistics: [
    {
      id: "pin-nh48-hub",
      label: "🚚 Gurugram Logistics Hub",
      category: "work",
      location: {
        name: "Gurugram",
        formattedAddress: "Gurugram, Haryana, India",
        latitude: 28.4595,
        longitude: 77.0266,
        timezone: "Asia/Kolkata",
        state: "Haryana",
        country: "India",
      },
    },
    {
      id: "pin-mumbai-port",
      label: "⚓ JNPT Port Terminal",
      category: "transit",
      location: {
        name: "Navi Mumbai",
        formattedAddress: "Navi Mumbai, Maharashtra, India",
        latitude: 18.9500,
        longitude: 72.9500,
        timezone: "Asia/Kolkata",
        state: "Maharashtra",
        country: "India",
      },
    },
  ],
  planner: [
    {
      id: "pin-jaipur-palace",
      label: "🎪 Jaipur Palace Lawn",
      category: "work",
      location: {
        name: "Jaipur",
        formattedAddress: "Jaipur, Rajasthan, India",
        latitude: 26.9124,
        longitude: 75.7873,
        timezone: "Asia/Kolkata",
        state: "Rajasthan",
        country: "India",
      },
    },
    {
      id: "pin-udaipur-lake",
      label: "⛵ Lake Pichola Venue",
      category: "other",
      location: {
        name: "Udaipur",
        formattedAddress: "Udaipur, Rajasthan, India",
        latitude: 24.5854,
        longitude: 73.7125,
        timezone: "Asia/Kolkata",
        state: "Rajasthan",
        country: "India",
      },
    },
  ],
  general: [
    {
      id: "pin-delhi",
      label: "🏠 Home (Delhi)",
      category: "home",
      location: {
        name: "New Delhi",
        formattedAddress: "New Delhi, Delhi, India",
        latitude: 28.6139,
        longitude: 77.2090,
        timezone: "Asia/Kolkata",
        state: "Delhi",
        country: "India",
      },
    },
  ],
};

const DEFAULT_GREETING: ChatMessage = {
  id: "initial-greeting",
  role: "assistant",
  content:
    "Namaste! I am mosam.AI — your atmospheric intelligence assistant. Don’t just see the weather, understand the science behind it.\n\nAsk me about farm spraying, weddings, what to wear, asthma risks, or how today compares to yesterday.",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  engine: "built-in-nlg",
  authorityBadge: "🏛️ IMD Alert: Green • 🍃 CPCB AQI: 65 (Satisfactory)",
};

interface WeatherStore {
  // Location & Meteorological state
  selectedLocation: LocationItem;
  setSelectedLocation: (loc: LocationItem) => void;
  weatherData: any | null;
  setWeatherData: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (err: string | null) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  unitSystem: "metric" | "imperial";
  toggleUnitSystem: () => void;

  // Auth & Profile state
  authStatus: AuthStatus;
  userProfile: UserProfile | null;
  user: { name?: string; email?: string } | null;
  isGuest: boolean;
  initAuthFromStorage: () => void;
  setGuestMode: () => void;
  loginAsRole: (role: UserRole) => void;
  loginCustom: (name: string, email: string, role: UserRole) => void;
  logout: () => void;
  updateUserRole: (role: UserRole) => void;
  updateMemoryNotes: (notes: string[]) => void;

  // Community Mosam Lens
  crowdVote: string | null;
  setCrowdVote: (vote: string | null) => void;

  // Saved & Pinned locations
  savedLocations: LocationItem[];
  saveLocation: (loc: LocationItem) => void;
  removeSavedLocation: (name: string) => void;
  pinnedLocations: PinnedLocation[];
  addPinnedLocation: (label: string, loc: LocationItem, category?: PinnedLocation["category"]) => void;
  removePinnedLocation: (id: string) => void;

  // Alert preferences
  alertPreferences: AlertPreferences;
  updateAlertPreferences: (prefs: Partial<AlertPreferences>) => void;

  // Modals & UI controls
  upgradeModalOpen: boolean;
  upgradeModalMessage: string;
  setUpgradeModal: (open: boolean, msg?: string) => void;
  alertModalOpen: boolean;
  setAlertModalOpen: (open: boolean) => void;

  // AI Chat Drawer
  isChatDrawerOpen: boolean;
  setIsChatDrawerOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChatMessages: () => void;
}

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  selectedLocation: {
    name: "New Delhi",
    formattedAddress: "New Delhi, Delhi, India",
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: "Asia/Kolkata",
    placeId: "delhi_in",
    country: "India",
    countryCode: "IN",
    state: "Delhi",
  },
  setSelectedLocation: (loc) => set({ selectedLocation: loc }),
  weatherData: null,
  setWeatherData: (data) => set({ weatherData: data }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (err) => set({ error: err }),
  language: "en",
  setLanguage: (lang) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("mosam_language", lang);
      } catch (e) {}
    }
    set({ language: lang });
  },
  unitSystem: "metric",
  toggleUnitSystem: () =>
    set((state) => ({
      unitSystem: state.unitSystem === "metric" ? "imperial" : "metric",
    })),

  // Auth Status
  authStatus: "uninitialized",
  userProfile: null,
  user: null,
  isGuest: true,
  crowdVote: null,
  setCrowdVote: (vote) => {
    if (typeof window !== "undefined") {
      if (vote) localStorage.setItem("mosam_crowd_vote", vote);
      else localStorage.removeItem("mosam_crowd_vote");
    }
    set({ crowdVote: vote });
  },
  savedLocations: [],
  saveLocation: (loc) => {
    const current = get().savedLocations;
    if (current.some((l) => l.name === loc.name)) return;
    const updated = [loc, ...current];
    if (typeof window !== "undefined" && get().authStatus === "authenticated") {
      localStorage.setItem("mosam_saved_locations", JSON.stringify(updated));
    }
    set({ savedLocations: updated });
  },
  removeSavedLocation: (name) => {
    const updated = get().savedLocations.filter((l) => l.name !== name);
    if (typeof window !== "undefined" && get().authStatus === "authenticated") {
      localStorage.setItem("mosam_saved_locations", JSON.stringify(updated));
    }
    set({ savedLocations: updated });
  },

  initAuthFromStorage: () => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.remove("dark");
    try {
      const savedLang = localStorage.getItem("mosam_language") as LanguageCode | null;
      if (savedLang && ["en", "hi", "te", "ta", "mr", "bn", "ml"].includes(savedLang)) {
        set({ language: savedLang });
      }

      const savedAuth = localStorage.getItem("mosam_auth_status") as AuthStatus | null;
      const hasVisited = localStorage.getItem("mosam_has_visited") === "true";
      const savedProfile = localStorage.getItem("mosam_user_profile");
      const savedPinned = localStorage.getItem("mosam_pinned_locations");
      const savedSaved = localStorage.getItem("mosam_saved_locations");
      const savedAlerts = localStorage.getItem("mosam_alert_preferences");
      const savedChats = localStorage.getItem("mosam_persistent_chats");
      const savedVote = localStorage.getItem("mosam_crowd_vote");

      if (savedAuth === "authenticated" && savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (!profile || typeof profile !== "object") {
          throw new Error("Invalid profile payload");
        }
        const role = (profile.role as UserRole) || "general";
        const rawPinned = savedPinned ? JSON.parse(savedPinned) : SAMPLE_PINNED_LOCATIONS[role] || [];
        const pinned = Array.isArray(rawPinned) ? rawPinned : [];
        const rawSaved = savedSaved ? JSON.parse(savedSaved) : pinned.map((p: any) => p.location);
        const savedLocs = Array.isArray(rawSaved) ? rawSaved : [];
        const alerts = savedAlerts ? JSON.parse(savedAlerts) : {
          rainThreshold: 40,
          windThreshold: 25,
          aqiThreshold: 250,
          enableWebPush: true,
          enableEmail: true,
          enableSms: false,
        };
        const rawChats = savedChats ? JSON.parse(savedChats) : [DEFAULT_GREETING];
        const chats = Array.isArray(rawChats) ? rawChats : [DEFAULT_GREETING];

        set({
          authStatus: "authenticated",
          userProfile: profile,
          user: { name: profile.name || "User", email: profile.email || "" },
          isGuest: false,
          pinnedLocations: pinned,
          savedLocations: savedLocs,
          alertPreferences: alerts,
          chatMessages: chats,
          crowdVote: savedVote || null,
        });
        return;
      }

      if (hasVisited || savedAuth === "guest") {
        set({
          authStatus: "guest",
          isGuest: true,
          userProfile: null,
          user: null,
          pinnedLocations: [],
          savedLocations: [],
          chatMessages: [DEFAULT_GREETING],
          crowdVote: savedVote || null,
        });
        return;
      }

      // First entry, no previous session or visit flag
      set({
        authStatus: "uninitialized",
        isGuest: true,
      });
    } catch (e) {
      console.warn("Storage init failed", e);
      set({ authStatus: "guest", isGuest: true });
    }
  },

  setGuestMode: () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mosam_auth_status", "guest");
      localStorage.setItem("mosam_has_visited", "true");
    }
    set({
      authStatus: "guest",
      isGuest: true,
      userProfile: null,
      pinnedLocations: [],
      chatMessages: [DEFAULT_GREETING],
    });
  },

  loginAsRole: (role: UserRole) => {
    const profile = DEMO_PROFILES[role] || DEMO_PROFILES.farmer;
    const pinned = SAMPLE_PINNED_LOCATIONS[role] || [];
    const alerts: AlertPreferences = {
      rainThreshold: role === "farmer" ? 35 : 40,
      windThreshold: role === "farmer" ? 15 : 25,
      aqiThreshold: role === "athlete" ? 150 : 250,
      enableWebPush: true,
      enableEmail: true,
      enableSms: role === "farmer",
      emailAddress: profile.email,
      phoneNumber: "+91 98765 43210",
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("mosam_auth_status", "authenticated");
      localStorage.setItem("mosam_has_visited", "true");
      localStorage.setItem("mosam_user_profile", JSON.stringify(profile));
      localStorage.setItem("mosam_pinned_locations", JSON.stringify(pinned));
      localStorage.setItem("mosam_alert_preferences", JSON.stringify(alerts));
    }

    set({
      authStatus: "authenticated",
      userProfile: profile,
      user: { name: profile.name, email: profile.email },
      isGuest: false,
      pinnedLocations: pinned,
      savedLocations: pinned.map((p) => p.location),
      alertPreferences: alerts,
    });
  },

  loginCustom: (name: string, email: string, role: UserRole) => {
    const base = DEMO_PROFILES[role] || DEMO_PROFILES.general;
    const profile: UserProfile = {
      name: name || base.name,
      email: email || base.email,
      role,
      roleLabel: base.roleLabel,
      memoryNotes: base.memoryNotes,
    };
    const pinned = SAMPLE_PINNED_LOCATIONS[role] || [];
    const alerts: AlertPreferences = {
      rainThreshold: 40,
      windThreshold: 25,
      aqiThreshold: 250,
      enableWebPush: true,
      enableEmail: true,
      enableSms: false,
      emailAddress: email,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("mosam_auth_status", "authenticated");
      localStorage.setItem("mosam_has_visited", "true");
      localStorage.setItem("mosam_user_profile", JSON.stringify(profile));
      localStorage.setItem("mosam_pinned_locations", JSON.stringify(pinned));
      localStorage.setItem("mosam_alert_preferences", JSON.stringify(alerts));
    }

    set({
      authStatus: "authenticated",
      userProfile: profile,
      user: { name: profile.name, email: profile.email },
      isGuest: false,
      pinnedLocations: pinned,
      savedLocations: pinned.map((p) => p.location),
      alertPreferences: alerts,
    });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mosam_auth_status", "guest");
      localStorage.removeItem("mosam_user_profile");
      localStorage.removeItem("mosam_pinned_locations");
      localStorage.removeItem("mosam_saved_locations");
      localStorage.removeItem("mosam_persistent_chats");
    }
    set({
      authStatus: "guest",
      isGuest: true,
      userProfile: null,
      user: null,
      pinnedLocations: [],
      savedLocations: [],
      chatMessages: [DEFAULT_GREETING],
    });
  },

  updateUserRole: (role: UserRole) => {
    const current = get().userProfile;
    if (!current) return;
    const base = DEMO_PROFILES[role] || DEMO_PROFILES.general;
    const updated: UserProfile = {
      ...current,
      role,
      roleLabel: base.roleLabel,
      memoryNotes: base.memoryNotes,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("mosam_user_profile", JSON.stringify(updated));
    }
    set({ userProfile: updated });
  },

  updateMemoryNotes: (notes: string[]) => {
    const current = get().userProfile;
    if (!current) return;
    const updated: UserProfile = {
      ...current,
      memoryNotes: notes,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("mosam_user_profile", JSON.stringify(updated));
    }
    set({ userProfile: updated });
  },

  // Pinned Watchlist
  pinnedLocations: [],
  addPinnedLocation: (label: string, loc: LocationItem, category: PinnedLocation["category"] = "other") => {
    const current = get().pinnedLocations;
    const newPin: PinnedLocation = {
      id: `pin-${Date.now()}`,
      label: label.trim() || loc.name,
      category,
      location: loc,
    };
    const updated = [newPin, ...current];
    if (typeof window !== "undefined" && get().authStatus === "authenticated") {
      localStorage.setItem("mosam_pinned_locations", JSON.stringify(updated));
    }
    set({ pinnedLocations: updated });
  },
  removePinnedLocation: (id: string) => {
    const updated = get().pinnedLocations.filter((p) => p.id !== id);
    if (typeof window !== "undefined" && get().authStatus === "authenticated") {
      localStorage.setItem("mosam_pinned_locations", JSON.stringify(updated));
    }
    set({ pinnedLocations: updated });
  },

  // Alert Preferences
  alertPreferences: {
    rainThreshold: 40,
    windThreshold: 25,
    aqiThreshold: 250,
    enableWebPush: false,
    enableEmail: false,
    enableSms: false,
  },
  updateAlertPreferences: (prefs) => {
    const updated = { ...get().alertPreferences, ...prefs };
    if (typeof window !== "undefined" && get().authStatus === "authenticated") {
      localStorage.setItem("mosam_alert_preferences", JSON.stringify(updated));
    }
    set({ alertPreferences: updated });
  },

  // Upgrade Modal
  upgradeModalOpen: false,
  upgradeModalMessage: "Sign in to save this location and receive automated alerts.",
  setUpgradeModal: (open, msg) =>
    set({
      upgradeModalOpen: open,
      upgradeModalMessage: msg || "Sign in to save this location and receive automated alerts.",
    }),

  // Alert Modal
  alertModalOpen: false,
  setAlertModalOpen: (open) => set({ alertModalOpen: open }),

  // Chat Drawer & Messages
  isChatDrawerOpen: false,
  setIsChatDrawerOpen: (open) => set({ isChatDrawerOpen: open }),
  chatMessages: [DEFAULT_GREETING],
  addChatMessage: (msg) => {
    const nextMessages = [...get().chatMessages, msg];
    // Persist to localStorage ONLY if user is authenticated
    if (typeof window !== "undefined" && get().authStatus === "authenticated") {
      try {
        localStorage.setItem("mosam_persistent_chats", JSON.stringify(nextMessages.slice(-50)));
      } catch (e) {
        console.warn("Persistent chat save error", e);
      }
    }
    set({ chatMessages: nextMessages });
  },
  clearChatMessages: () => {
    if (typeof window !== "undefined" && get().authStatus === "authenticated") {
      localStorage.removeItem("mosam_persistent_chats");
    }
    set({ chatMessages: [DEFAULT_GREETING] });
  },
}));

if (typeof window !== "undefined") {
  document.documentElement.classList.remove("dark");
}
