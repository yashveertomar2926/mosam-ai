# mosam.AI (मौसम.AI)
> *"Don’t just see the weather. Understand it."*

mosam.AI is a production-ready, responsive, multilingual atmospheric intelligence platform engineered with a **Guest-First architecture**. It combines Open-Meteo Global Seamless forecasting (ECMWF & GFS), historical 3-day retrospective analysis, Open-Meteo Air Quality, official India Meteorological Department (IMD) 4-tier alert bulletins, IMD Agromet agricultural spray advisories, CPCB NAQI air quality assessments, and a dual-engine conversational AI assistant in English, Hindi (हिन्दी), Telugu (తెలుగు), and Malayalam (മലയാളം).

---

## 🌟 Core Features

### 1. Guest-First Architecture
- **Zero Friction**: Visitors land directly on the complete meteorological dashboard with no login or registration requirement.
- **100% Feature Availability**: Radar, 48h/7d forecasts, 20 decision windows, confidence gauges, and AI chat are instantly usable.
- **Optional Profile**: An optional `/login` route provides account management with a guaranteed 1-click **"Continue as Guest"** button.

### 2. Government Meteorological Intelligence
- **Authority Detection**: Dynamically applies **India Meteorological Department (IMD)** standards across India (6°–38°N, 68°–98°E) or National Weather Agency (NOAA / ECMWF) globally.
- **4-Tier Color Alerts**: Official Green (Normal), Yellow (Watch), Orange (Alert), and Red (Warning) alerts.
- **IMD Agromet Advisory**: Explicitly computes pesticide and foliar fertilizer spray safety (holding applications if rain probability $>35\%$ or wind speed $>15\text{ km/h}$) and alerts on soil drainage requirements.
- **CPCB National Air Quality Index (NAQI)**: Standard Indian calculations for $\text{PM}_{2.5}$ and $\text{PM}_{10}$ with categories (Good, Satisfactory, Moderate, Poor, Very Poor, Severe) and clinical respiratory health guidance.

### 3. Weather Decision Windows (20 Activities)
- Evaluates atmospheric feasibility for:
  1. Outdoor Wedding / Gala
  2. Agricultural Pesticide & Fertilizer Spraying
  3. Field Irrigation & Drainage
  4. Daily Commute & Transit
  5. Outdoor Laundry Drying
  6. Morning Jogging & Cardio
  7. Road Cycling & Biking
  8. Construction & Outdoor Labor
  9. Photovoltaic Solar Power Generation
  10. Night Sky Stargazing & Astronomy
  11. Drone Flight & Aerial Filming
  12. Open-Air Dining & Terrace BBQ
  13. Asthma & Respiratory Outdoor Safety
  14. Commercial Flight & Express Transit
  15. Outdoor Swimming & Pool Time
  16. Pet & Dog Walking
  17. Vehicle Washing & Detailing
  18. Inland Boating & Kayaking
  19. Senior Citizen Promenade
  20. Golden Hour Photography
- **Glitch Protections**: Responsive CSS Grid (1 col mobile, 2 col tablet, 3 col desktop), `min-w-0` overflow protection, separate rows for title and status badge (never overlapping), 2-line title wrapping, `line-clamp-2` descriptions, suitability progress bars (0–100), and top-3 expandable toggle.

### 4. Dynamic Atmospheric Canvas VFX
- High-DPI scaling (`window.devicePixelRatio`) with hardware-accelerated particle systems:
  - **Thunderstorms**: Ambient sheet lightning flashes with branching discharges.
  - **Rain & Drizzle**: Angled raindrops hitting baseline with expanding splash ripples.
  - **Overcast & Clouds**: Multi-layered drifting organic cloud masses.
  - **Sunny Days**: Pulsating solar corona with golden flare beams.
  - **Clear Nights**: Twinkling multi-magnitude stars with periodic shooting stars.
  - **Contrast**: Optimized for dark mode (`#080c16`) and light mode (`#f8fafc`).

### 5. Dual-Engine Conversational AI Assistant
- **Online Engine**: Asynchronously invokes Google Gemini 2.5 Flash via REST (`httpx`) when `GEMINI_API_KEY` is provided.
- **Offline NLG Engine**: Built-in 20+ scenario natural language generation engine explaining the atmospheric "why" rather than raw numbers.
- **Multilingual**: Speaks fluent English, Hindi (Devanagari), Telugu (తెలుగు), and Malayalam (മലയാളം).
- **Web Speech Integration**: Voice input (`SpeechRecognition`) and audio read-aloud TTS (`SpeechSynthesis`).
- **Authority Badge**: Appends `🏛️ IMD Alert: [Level] • 🍃 CPCB AQI: [Value]` to every response.
- **Dedicated Route**: Available both as a collapsible floating widget and as a fullscreen experience at `/chat`.

---

## 🚀 Running the Application

### Backend (FastAPI)
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation available at: `http://127.0.0.1:8000/docs`

### Frontend (Next.js 14)
```bash
cd frontend
npm run dev
```
Web Application accessible at: `http://localhost:3000`
