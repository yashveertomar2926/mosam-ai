export type LanguageCode = "en" | "hi" | "te" | "ta" | "mr" | "bn" | "ml";

export interface BulletinTranslation {
  deptTitle: string;
  validityLabel: string;
  allClearTitle: string;
  allClearDesc: string;
  alertGreen: string;
  alertYellow: string;
  alertOrange: string;
  alertRed: string;
}

export interface MosamLensTranslation {
  title: string;
  liveBadge: string;
  subtitle: string;
  memberPerk: string;
  guestTitle: string;
  guestDesc: string;
  guestUnlock: string;
  question: (city: string) => string;
  verifiedReports: (count: number) => string;
  verifiedFeedback: string;
  options: {
    clear: { label: string; desc: string };
    gusty: { label: string; desc: string };
    drizzle: { label: string; desc: string };
    downpour: { label: string; desc: string };
    fog: { label: string; desc: string };
  };
  consensusTitle: string;
  alignment: string;
  alignmentValue: string;
  dopplerProjection: string;
  rainRisk: (pct: number) => string;
  communityGroundTruth: string;
  clearSkyConsensus: string;
  rainConsensus: string;
  validationTitle: string;
  validationDesc: string;
}

export interface PhysicsLabTranslation {
  title: string;
  badge: string;
  subtitle: string;
  memberPerk: string;
  guestTitle: string;
  guestDesc: string;
  guestUnlock: string;
  tabs: {
    laundry: string;
    chai: string;
    windshield: string;
    mosquitoes: string;
    sweat: string;
  };
  laundry: {
    engineTitle: string;
    heading: string;
    formulaDesc: (hum: number, temp: number, wind: number) => string;
    selectWeight: string;
    synthetics: string;
    cotton: string;
    denim: string;
    estimatedTime: string;
    outdoorClothesline: string;
    hoursUntilDry: (hrs: string) => string;
    bestWindow: string;
    solarCover: (deck: number) => string;
  };
  chai: {
    engineTitle: string;
    heading: string;
    formulaDesc: string;
    drinkingVessel: string;
    ceramic: string;
    steel: string;
    kulhad: string;
    sippingWindow: string;
    targetTemp: string;
    minsFromBoiling: (mins: string) => string;
    breezeExp: string;
    calmExp: string;
  };
  windshield: {
    engineTitle: string;
    heading: string;
    formulaDesc: (dew: number, delta: string) => string;
    imminentRisk: string;
    moderateRisk: string;
    clearRisk: string;
    protocolTitle: string;
    acRule: string;
    recircRule: string;
    windowRule: string;
  };
  mosquito: {
    engineTitle: string;
    heading: string;
    formulaDesc: (wind: number, hum: number) => string;
    peakSwarm: string;
    moderateFlight: string;
    lowThreat: string;
    flightIndex: (score: number) => string;
    guidanceTitle: string;
    peakWindow: string;
    breezeMosquito: string;
    calmMosquito: string;
  };
  sweat: {
    engineTitle: string;
    heading: string;
    formulaDesc: string;
    selectExertion: string;
    light: string;
    moderate: string;
    heavy: string;
    replacementTarget: string;
    evapEfficiency: (eff: number) => string;
    ratePerHour: (ml: number) => string;
    humidSweat: string;
    drySweat: string;
  };
}

export interface TimeMachineTranslation {
  title: string;
  badge: string;
  subtitle: string;
  memberPerk: string;
  guestTitle: string;
  guestDesc: string;
  guestUnlock: string;
  yesterdayLabel: string;
  livePresent: string;
  todayLive: string;
  retrospectPercent: (pct: number) => string;
  retrospective24h: string;
  yesterdayPrefix: string;
  scrubPositionPrefix: string;
  todayPrefix: string;
  thermalDiff: string;
  warmerSensory: string;
  coolerSensory: string;
  rainAccumTitle: string;
  highRainSensory: string;
  lowRainSensory: string;
  pressureTendencyTitle: string;
  risingPressure: string;
  fallingPressure: string;
  steadyPressure: string;
  skinFeelTitle: string;
  stickierAir: string;
  crisperAir: string;
  dewPointSensory: (dew: number) => string;
  narrativeTitle: string;
}

export interface FeatureDeckTranslation {
  hubTitle: string;
  hubSubtitle: string;
  clickToMaximize: string;
  clickToMinimize: string;
  maximizedStatus: string;
  expandAll: string;
  collapseAll: string;
  backToDeck: string;
}

export interface TranslationDict {
  tagline: string;
  guestBadge: string;
  loginText: string;
  continueAsGuest: string;
  searchPlaceholder: string;
  useGps: string;
  searchingGrids: string;
  noLocationFound: string;
  signOut: string;
  personalizedAlerts: string;
  pinnedWatchlist: string;
  radarTitle: string;
  radarSubtitle: string;
  radarPlay: string;
  radarPause: string;
  decisionTitle: string;
  decisionSubtitle: string;
  viewAll: string;
  showLess: string;
  calibrationTitle: string;
  customProfileActive: string;
  calibrationDesc: string;
  roleGeneral: string;
  roleFarmer: string;
  roleAthlete: string;
  roleLogistics: string;
  rolePlanner: string;
  hourlyTitle: string;
  dailyTitle: string;
  confidenceTitle: string;
  pastComparisonTitle: string;
  askMosamAi: string;
  chatPlaceholder: string;
  micListening: string;
  authorityAlert: string;
  spraySafety: string;
  cpcbAqi: string;
  safeToSpray: string;
  holdSpray: string;
  cautionSpray: string;
  recWindow: string;
  fieldDrainage: string;
  maskRecommended: string;
  validUntil: string;
  temperature: string;
  feelsLike: string;
  humidity: string;
  pressure: string;
  wind: string;
  uvIndex: string;
  dewPoint: string;
  cloudCover: string;
  visibility: string;
  watchlist: string;
  pinLocation: string;
  pinned: string;
  alertRules: string;
  exportCsv: string;
  ensemble: string;
  confidence: string;
  thermalAnomaly24h: string;
  pastRain72h: string;
  pressureTendency: string;
  today: string;
  rain: string;
  filterAll: string;
  filterOutdoor: string;
  filterAgri: string;
  filterTravel: string;
  filterFitness: string;
  filterLifestyle: string;
  radioTitle: string;
  radioSubtitle: string;
  radioTag: string;
  toneLocalFriend: string;
  toneMeteorologist: string;
  toneStoryteller: string;
  radioPlayPrompt: string;
  radioBroadcasting: string;
  ambientSoundscape: string;
  raindropResonator: string;
  clearSkyDrone: string;
  scriptPreview: string;

  bulletin?: BulletinTranslation;
  mosamLens?: MosamLensTranslation;
  physicsLab?: PhysicsLabTranslation;
  timeMachine?: TimeMachineTranslation;
  featureDeck?: FeatureDeckTranslation;
}

import {
  bulletinTranslations,
  mosamLensTranslations,
  physicsLabTranslations,
  timeMachineTranslations,
  featureDeckTranslations,
} from "./sensoryTranslations";

export {
  bulletinTranslations,
  mosamLensTranslations,
  physicsLabTranslations,
  timeMachineTranslations,
  featureDeckTranslations,
};

export const translations: Record<LanguageCode, TranslationDict> = {
  en: {
    tagline: "Don’t just see the weather. Understand it.",
    guestBadge: "Guest Access • Active",
    loginText: "Sign In / Profile",
    continueAsGuest: "Continue as Guest",
    searchPlaceholder: "Search any city, village, or coordinates...",
    useGps: "Locate Me",
    searchingGrids: "Searching meteorologic grids...",
    noLocationFound: "No atmospheric station found",
    signOut: "Sign Out",
    personalizedAlerts: "Personalized Alerts",
    pinnedWatchlist: "Pinned Watchlist",
    radarTitle: "Atmospheric Doppler Radar & Google Maps",
    radarSubtitle: "Live precipitation reflectance loop with draggable satellite locator",
    radarPlay: "Play",
    radarPause: "Pause",
    decisionTitle: "Weather Decision Windows",
    decisionSubtitle: "Atmospheric feasibility indices across 20 real-world activities",
    viewAll: "View All 20 Activities",
    showLess: "Show Top 3 Priority",
    calibrationTitle: "Decision Weight Calibration",
    customProfileActive: "Custom Profile Active",
    calibrationDesc: "Re-weights all 20 activity models against specialized atmospheric safety thresholds.",
    roleGeneral: "General Public",
    roleFarmer: "Farmer / Agronomist",
    roleAthlete: "Outdoor Athlete",
    roleLogistics: "Logistics",
    rolePlanner: "Event Planner",
    hourlyTitle: "48-Hour Microclimate Outlook",
    dailyTitle: "7-Day Synoptic Forecast",
    confidenceTitle: "Model Consensus & Reliability",
    pastComparisonTitle: "Retrospective 3-Day Synoptic Delta",
    askMosamAi: "Ask mosam.AI",
    chatPlaceholder: "Ask about farm spraying, weddings, health, attire...",
    micListening: "Listening... Speak naturally in your language",
    authorityAlert: "Official Government Bulletin",
    spraySafety: "IMD Agromet Spray Guidance",
    cpcbAqi: "CPCB National Air Quality Index",
    safeToSpray: "SAFE TO SPRAY",
    holdSpray: "HOLD SPRAY",
    cautionSpray: "CAUTION TO SPRAY",
    recWindow: "Recommended Window:",
    fieldDrainage: "Field Drainage:",
    maskRecommended: "N95 Mask Recommended",
    validUntil: "Valid:",
    temperature: "Temperature",
    feelsLike: "Feels Like",
    humidity: "Relative Humidity",
    pressure: "Atmospheric Pressure",
    wind: "Tropospheric Wind",
    uvIndex: "UV Radiation",
    dewPoint: "Dew Point",
    cloudCover: "Cloud Cover",
    visibility: "Visibility",
    watchlist: "Watchlist:",
    pinLocation: "Pin Location",
    pinned: "Pinned",
    alertRules: "Alert Rules",
    exportCsv: "Export CSV",
    ensemble: "Ensemble",
    confidence: "Confidence",
    thermalAnomaly24h: "24h Thermal Anomaly",
    pastRain72h: "Past 72h Rain",
    pressureTendency: "Pressure Tendency",
    today: "Today",
    rain: "rain",
    filterAll: "All Activities",
    filterOutdoor: "Outdoor & Labour",
    filterAgri: "Agriculture & Farming",
    filterTravel: "Transit & Travel",
    filterFitness: "Sports & Cardio",
    filterLifestyle: "Lifestyle & Events",
    radioTitle: "mosam.FM Radio",
    radioSubtitle: "45-second conversational AI weather dispatch with ambient sky soundscape",
    radioTag: "104.2 MHz • Live Briefing",
    toneLocalFriend: "Local Friend",
    toneMeteorologist: "Meteorologist",
    toneStoryteller: "Storyteller",
    radioPlayPrompt: "Tap to Play Daily Atmospheric Briefing",
    radioBroadcasting: "Broadcasting live audio...",
    ambientSoundscape: "Ambient Sky Soundscape",
    raindropResonator: "Raindrop Resonator",
    clearSkyDrone: "Clear Sky Harmonic Drone",
    scriptPreview: "Live Broadcast Script Preview",

    bulletin: bulletinTranslations.en,
    mosamLens: mosamLensTranslations.en,
    physicsLab: physicsLabTranslations.en,
    timeMachine: timeMachineTranslations.en,
    featureDeck: featureDeckTranslations.en,
  },
  hi: {
    tagline: "मौसम केवल देखें नहीं। उसके विज्ञान को समझें।",
    guestBadge: "अतिथि मोड • सक्रिय",
    loginText: "साइन इन / प्रोफाइल",
    continueAsGuest: "अतिथि के रूप में जारी रखें",
    searchPlaceholder: "शहर, गाँव या स्थान खोजें...",
    useGps: "मेरी वर्तमान स्थिति",
    searchingGrids: "मौसम उपग्रह ग्रिड खोज रहे हैं...",
    noLocationFound: "कोई मौसम केंद्र नहीं मिला",
    signOut: "साइन आउट",
    personalizedAlerts: "व्यक्तिगत मौसम अलर्ट",
    pinnedWatchlist: "पिन की गई निगरानी सूची",
    radarTitle: "डॉपलर रडार और गूगल मैप्स",
    radarSubtitle: "सजीव वर्षा रडार लूप और मौसम उपग्रह मानचित्र",
    radarPlay: "चलाएं",
    radarPause: "रोकें",
    decisionTitle: "मौसम निर्णय खिड़कियां (Decision Windows)",
    decisionSubtitle: "20 दैनिक और कृषि गतिविधियों के लिए वैज्ञानिक अनुकूलता सूचकांक",
    viewAll: "सभी 20 गतिविधियाँ देखें",
    showLess: "शीर्ष 3 प्रमुख दिखाएं",
    calibrationTitle: "निर्णय सूचकांक अंशांकन",
    customProfileActive: "कस्टम प्रोफ़ाइल सक्रिय",
    calibrationDesc: "विशेष मौसम सुरक्षा सीमा के अनुसार 20 गतिविधियों का पुनः मूल्यांकन।",
    roleGeneral: "आम नागरिक",
    roleFarmer: "किसान / कृषि विज्ञानी",
    roleAthlete: "खिलाड़ी / धावक",
    roleLogistics: "परिवहन व रसद",
    rolePlanner: "समारोह आयोजक",
    hourlyTitle: "48-घंटे का सूक्ष्म-मौसम पूर्वानुमान",
    dailyTitle: "7-दिवसीय विस्तृत मौसम दृष्टिकोण",
    confidenceTitle: "मॉडल सहमति एवं विश्वसनीयता",
    pastComparisonTitle: "पिछले 3 दिनों से तुलनात्मक विश्लेषण",
    askMosamAi: "मौसम.AI से पूछें",
    chatPlaceholder: "कीटनाशक छिड़काव, शादी, स्वास्थ्य या कपड़ों के बारे में पूछें...",
    micListening: "सुन रहा हूँ... अपनी भाषा में बोलें",
    authorityAlert: "आधिकारिक सरकारी बुलेटिन (IMD)",
    spraySafety: "आईएमडी कृषि छिड़काव परामर्श",
    cpcbAqi: "सीपीसीबी राष्ट्रीय वायु गुणवत्ता सूचकांक",
    safeToSpray: "छिड़काव के लिए सुरक्षित",
    holdSpray: "छिड़काव स्थगित रखें",
    cautionSpray: "सावधानीपूर्वक छिड़काव",
    recWindow: "सुझाया गया समय:",
    fieldDrainage: "खेत से जल निकासी:",
    maskRecommended: "N95 मास्क अनुशंसित",
    validUntil: "वैधता:",
    temperature: "तापमान",
    feelsLike: "महसूस होता है",
    humidity: "सापेक्ष आर्द्रता",
    pressure: "वायुमंडलीय दबाव",
    wind: "हवा की गति व दिशा",
    uvIndex: "पराबैंगनी (UV) विकिरण",
    dewPoint: "ओस बिंदु (Dew Point)",
    cloudCover: "बादलों का आवरण",
    visibility: "दृश्यता",
    watchlist: "निगरानी सूची:",
    pinLocation: "स्थान पिन करें",
    pinned: "पिन किया गया",
    alertRules: "चेतावनी नियम",
    exportCsv: "CSV निर्यात",
    ensemble: "मॉडल सर्वसम्मति",
    confidence: "विश्वसनीयता",
    thermalAnomaly24h: "24 घंटे में तापीय बदलाव",
    pastRain72h: "पिछले 72 घंटे की वर्षा",
    pressureTendency: "दबाव की प्रवृत्ति",
    today: "आज",
    rain: "बारिश",
    filterAll: "सभी गतिविधियाँ",
    filterOutdoor: "खुले स्थान व श्रम",
    filterAgri: "कृषि व खेती",
    filterTravel: "यात्रा व हाईवे",
    filterFitness: "खेल व व्यायाम",
    filterLifestyle: "दैनिक जीवन व आयोजन",
    radioTitle: "मौसम.FM रेडियो",
    radioSubtitle: "45-सेकंड का आत्मीय मौसम बुलेटिन और प्राकृतिक ध्वनि",
    radioTag: "104.2 MHz • सजीव बुलेटिन",
    toneLocalFriend: "स्थानीय मित्र",
    toneMeteorologist: "मौसम वैज्ञानिक",
    toneStoryteller: "कथावाचक",
    radioPlayPrompt: "दैनिक मौसम बुलेटिन सुनने के लिए टैप करें",
    radioBroadcasting: "सजीव प्रसारण जारी है...",
    ambientSoundscape: "प्राकृतिक आकाशीय ध्वनि",
    raindropResonator: "वर्षा ध्वनि अनुनादक",
    clearSkyDrone: "शांत आकाश मधुर ध्वनि",
    scriptPreview: "सजीव प्रसारण प्रतिलेख पूर्वावलोकन",

    bulletin: bulletinTranslations.hi,
    mosamLens: mosamLensTranslations.hi,
    physicsLab: physicsLabTranslations.hi,
    timeMachine: timeMachineTranslations.hi,
    featureDeck: featureDeckTranslations.hi,
  },
  te: {
    tagline: "వాతావరణాన్ని చూడటమే కాదు. విజ్ఞానాన్ని అర్థం చేసుకోండి.",
    guestBadge: "అతిథి మోడ్ • సక్రియం",
    loginText: "సైన్ ఇన్ / ప్రొఫైల్",
    continueAsGuest: "అతిథిగా కొనసాగండి",
    searchPlaceholder: "నగరం, గ్రామం లేదా ప్రాంతాన్ని శోధించండి...",
    useGps: "నా లొకేషన్",
    searchingGrids: "వాతావరణ గ్రిడ్‌లను శోధిస్తోంది...",
    noLocationFound: "వాతావరణ కేంద్రం కనుగొనబడలేదు",
    signOut: "సైన్ అవుట్",
    personalizedAlerts: "వ్యక్తిగత హెచ్చరికలు",
    pinnedWatchlist: "పిన్ చేసిన వాచ్‌లిస్ట్",
    radarTitle: "డాప్లర్ రాడార్ & గూగుల్ మ్యాప్స్",
    radarSubtitle: "ప్రత్యక్ష వర్షపాత రాడార్ మరియు ఉపగ్రహ లూప్",
    radarPlay: "ప్లే చేయండి",
    radarPause: "ఆపండి",
    decisionTitle: "వాతావరణ నిర్ణయ విండోలు",
    decisionSubtitle: "20 కార్యకలాపాల కోసం వాతావరణ అనుకూలత సూచిక",
    viewAll: "మొత్తం 20 కార్యకలాపాలు చూడండి",
    showLess: "ముఖ్యమైన 3 మాత్రమే చూడండి",
    calibrationTitle: "నిర్ణయ ప్రాధాన్యత సర్దుబాటు",
    customProfileActive: "ప్రత్యేక ప్రొఫైల్ సక్రియం",
    calibrationDesc: "నిర్దిష్ట వాతావరణ భద్రతా ప్రమాణాల ప్రకారం 20 కార్యకలాపాల సూచికలు.",
    roleGeneral: "సాధారణ పౌరులు",
    roleFarmer: "రైతు / వ్యవసాయ నిపుణుడు",
    roleAthlete: "క్రీడాకారుడు",
    roleLogistics: "రవాణా & సరుకులు",
    rolePlanner: "వేడుకల నిర్వాహకుడు",
    hourlyTitle: "48-గంటల వాతావరణ సమాచారం",
    dailyTitle: "7-రోజుల సమగ్ర సూచన",
    confidenceTitle: "మోడల్ విశ్వసనీయత స్థాయి",
    pastComparisonTitle: "గత 3 రోజుల పోలిక",
    askMosamAi: "mosam.AI ని అడగండి",
    chatPlaceholder: "మందుల పిచికారీ, వేడుకలు, దుస్తుల గురించి అడగండి...",
    micListening: "వింటోంది... మీ భాషలో మాట్లాడండి",
    authorityAlert: "అధికారిక ప్రభుత్వ సమాచారం (IMD)",
    spraySafety: "IMD వ్యవసాయ పిచికారీ మార్గదర్శకం",
    cpcbAqi: "CPCB గాలి నాణ్యత సూచిక",
    safeToSpray: "పిచికారీకి అనుకూలం",
    holdSpray: "పిచికారీ నిలిపివేయండి",
    cautionSpray: "జాగ్రత్తగా పిచికారీ చేయండి",
    recWindow: "సిఫార్సు చేసిన సమయం:",
    fieldDrainage: "పొలంలో నీటి పారుదల:",
    maskRecommended: "N95 మాస్క్ ధరించండి",
    validUntil: "చెల్లుబాటు:",
    temperature: "ఉష్ణోగ్రత",
    feelsLike: "అనిపించే ఉష్ణోగ్రత",
    humidity: "గాలిలో తేమ",
    pressure: "పీడనం",
    wind: "గాలి వేగం",
    uvIndex: "UV సూచిక",
    dewPoint: "మంచు బిందువు",
    cloudCover: "మేఘాల కవరేజ్",
    visibility: "దృశ్యత",
    watchlist: "వాచ్‌లిస్ట్:",
    pinLocation: "లొకేషన్ పిన్ చేయండి",
    pinned: "పిన్ చేయబడింది",
    alertRules: "హెచ్చరిక నియమాలు",
    exportCsv: "CSV ఎగుమతి",
    ensemble: "మోడల్ సమ్మతి",
    confidence: "విశ్వసనీయత",
    thermalAnomaly24h: "24 గంటల ఉష్ణోగ్రత మార్పు",
    pastRain72h: "గత 72 గంటల వర్షపాతం",
    pressureTendency: "పీడన ధోరణి",
    today: "నేడు",
    rain: "వర్షం",
    filterAll: "అన్ని కార్యకలాపాలు",
    filterOutdoor: "బహిరంగ & శ్రమ",
    filterAgri: "వ్యవసాయం & సాగు",
    filterTravel: "రవాణా & ప్రయాణం",
    filterFitness: "క్రీడలు & వ్యాయామం",
    filterLifestyle: "జీవనశైలి & వేడుకలు",
    radioTitle: "mosam.FM రేడియో",
    radioSubtitle: "45-సెకన్ల సంభాషణాత్మక వాతావరణ సమాచారం & ఆకాశ ధ్వనులు",
    radioTag: "104.2 MHz • ప్రత్యక్ష బులెటిన్",
    toneLocalFriend: "ఆప్తమిత్రుడు",
    toneMeteorologist: "వాతావరణ నిపుణుడు",
    toneStoryteller: "కథకుడు",
    radioPlayPrompt: "రోజువారీ వాతావరణ బులెటిన్ వినండి",
    radioBroadcasting: "ప్రత్యక్ష ప్రసారం సాగుతోంది...",
    ambientSoundscape: "ప్రకృతి వాతావరణ శబ్దాలు",
    raindropResonator: "వాన చినుకుల ప్రతిధ్వని",
    clearSkyDrone: "ప్రశాంత ఆకాశ నాదం",
    scriptPreview: "ప్రత్యక్ష ప్రసార స్క్రిప్ట్ ముందస్తు వీక్షణ",

    bulletin: bulletinTranslations.te,
    mosamLens: mosamLensTranslations.te,
    physicsLab: physicsLabTranslations.te,
    timeMachine: timeMachineTranslations.te,
    featureDeck: featureDeckTranslations.te,
  },
  ta: {
    tagline: "வானிலையை வெறும் பார்ப்பதோடு அல்லாமல், அதன் அறிவியலைப் புரிந்து கொள்ளுங்கள்.",
    guestBadge: "விருந்தினர் பயன்முறை • செயலில்",
    loginText: "உள்நுழைக / சுயவிவரம்",
    continueAsGuest: "விருந்தினராகத் தொடர்க",
    searchPlaceholder: "நகரம், கிராமம் அல்லது இடத்தை தேடுங்கள்...",
    useGps: "என் இருப்பிடம்",
    searchingGrids: "வானிலை நிலையங்களைத் தேடுகிறது...",
    noLocationFound: "வானிலை நிலையம் ஏதும் கிடைக்கவில்லை",
    signOut: "வெளியேறு",
    personalizedAlerts: "தனிப்பயன் எச்சரிக்கைகள்",
    pinnedWatchlist: "பின் செய்யப்பட்ட பட்டியல்",
    radarTitle: "டாப்ளர் ரேடார் & கூகிள் வரைபடம்",
    radarSubtitle: "நேரலை மழைப்பொழிவு ரேடார் மற்றும் செயற்கைக்கோள் வரைபடம்",
    radarPlay: "இயக்குக",
    radarPause: "நிறுத்துக",
    decisionTitle: "வானிலை முடிவு சாளரங்கள்",
    decisionSubtitle: "20 அன்றாட மற்றும் விவசாய பணிகளுக்கான வானிலை தகுதி குறியீடுகள்",
    viewAll: "20 செயல்பாடுகளையும் காண்க",
    showLess: "முக்கிய 3 மட்டும் காண்க",
    calibrationTitle: "முடிவு மதிப்பீட்டு அளவுத்திருத்தம்",
    customProfileActive: "தனிப்பயன் விவரக்குறிப்பு செயலில்",
    calibrationDesc: "சிறப்பு வானிலை பாதுகாப்பு வரம்புகளின்படி 20 செயல்பாடுகளின் மறுமதிப்பீடு.",
    roleGeneral: "பொது மக்கள்",
    roleFarmer: "விவசாயி / வேளாண் வல்லுநர்",
    roleAthlete: "விளையாட்டு வீரர்",
    roleLogistics: "போக்குவரத்து & சரக்கு",
    rolePlanner: "நிகழ்வு அமைப்பாளர்",
    hourlyTitle: "48 மணிநேர நுண்-வானிலை முன்னறிவிப்பு",
    dailyTitle: "7-நாள் விரிவான வானிலை கண்ணோட்டம்",
    confidenceTitle: "மாதிரி ஒருமித்த கருத்து & நம்பகத்தன்மை",
    pastComparisonTitle: "கடந்த 3 நாட்களுடன் ஒப்பீட்டு பகுப்பாய்வு",
    askMosamAi: "mosam.AI-யிடம் கேளுங்கள்",
    chatPlaceholder: "விவசாய தெளிப்பு, திருமணம், உடை, உடல்நலம் பற்றி கேளுங்கள்...",
    micListening: "கேட்கிறது... உங்கள் மொழியில் பேசுங்கள்",
    authorityAlert: "அதிகாரப்பூர்வ அரசு அறிவிப்பு (IMD)",
    spraySafety: "வானிலை வேளாண்மை தெளிப்பு வழிகாட்டுதல்",
    cpcbAqi: "சிபிசிபி தேசிய காற்று தரக் குறியீடு",
    safeToSpray: "தெளிப்பதற்கு பாதுகாப்பானது",
    holdSpray: "தெளிப்பதை நிறுத்தி வைக்கவும்",
    cautionSpray: "எச்சரிக்கையுடன் தெளிக்கவும்",
    recWindow: "பரிந்துரைக்கப்பட்ட நேரம்:",
    fieldDrainage: "வயல் வடிகால் நிலை:",
    maskRecommended: "N95 முகக்கவசம் பரிந்துரைக்கப்படுகிறது",
    validUntil: "செல்லுபடியாகும் காலம்:",
    temperature: "வெப்பநிலை",
    feelsLike: "உணரப்படும் வெப்பநிலை",
    humidity: "ஒப்பீட்டு ஈரப்பதம்",
    pressure: "வளிமண்டல அழுத்தம்",
    wind: "காற்றின் வேகம்",
    uvIndex: "UV கதிர்வீச்சு குறியீடு",
    dewPoint: "பனி நிலை (Dew Point)",
    cloudCover: "மேக மூட்டம்",
    visibility: "பார்வைத்திறன்",
    watchlist: "கண்காணிப்புப் பட்டியல்:",
    pinLocation: "இருப்பிடத்தைப் பின் செய்க",
    pinned: "பின் செய்யப்பட்டது",
    alertRules: "எச்சரிக்கை விதிகள்",
    exportCsv: "CSV ஏற்றுமதி",
    ensemble: "மாதிரி ஒருமிப்பு",
    confidence: "நம்பகத்தன்மை",
    thermalAnomaly24h: "24 மணிநேர வெப்பநிலை மாற்றம்",
    pastRain72h: "கடந்த 72 மணிநேர மழை",
    pressureTendency: "அழுத்தப் போக்கு",
    today: "இன்று",
    rain: "மழை",
    filterAll: "அனைத்து செயல்பாடுகள்",
    filterOutdoor: "திறந்தவெளி & உழைப்பு",
    filterAgri: "விவசாயம் & பயிர்",
    filterTravel: "பயணம் & நெடுஞ்சாலை",
    filterFitness: "விளையாட்டு & உடற்பயிற்சி",
    filterLifestyle: "வாழ்க்கை முறை & நிகழ்வுகள்",
    radioTitle: "mosam.FM வானொலி",
    radioSubtitle: "45-விநாடி உரையாடல் வானிலை தகவல் மற்றும் இயற்கை ஒலி அமைப்பு",
    radioTag: "104.2 MHz • நேரலை அறிவிப்பு",
    toneLocalFriend: "உள்ளூர் நண்பர்",
    toneMeteorologist: "வானிலை ஆய்வாளர்",
    toneStoryteller: "கதை சொல்லி",
    radioPlayPrompt: "தினசரி வானிலை அறிவிப்பைக் கேட்க தட்டவும்",
    radioBroadcasting: "நேரலை ஒலிபரப்பாகிறது...",
    ambientSoundscape: "இயற்கை வானொலி பின்னணி ஒலி",
    raindropResonator: "மழைத்துளி அதிர்வு",
    clearSkyDrone: "தெளிவான வான இனிமை ஒலி",
    scriptPreview: "நேரலை ஒளிபரப்பு உரை முன்னோட்டம்",

    bulletin: bulletinTranslations.ta,
    mosamLens: mosamLensTranslations.ta,
    physicsLab: physicsLabTranslations.ta,
    timeMachine: timeMachineTranslations.ta,
    featureDeck: featureDeckTranslations.ta,
  },
  mr: {
    tagline: "हवामान केवळ पाहू नका. त्याचे विज्ञान समजून घ्या.",
    guestBadge: "अतिथी मोड • सक्रिय",
    loginText: "साइन इन / प्रोफाइल",
    continueAsGuest: "अतिथी म्हणून सुरू ठेवा",
    searchPlaceholder: "शहर, गाव किंवा ठिकाण शोधा...",
    useGps: "माझे स्थान",
    searchingGrids: "हवामान ग्रिड शोधत आहे...",
    noLocationFound: "कोणतेही हवामान केंद्र सापडले नाही",
    signOut: "साइन आउट",
    personalizedAlerts: "वैयक्तिकृत हवामान सूचना",
    pinnedWatchlist: "पिन केलेली यादी",
    radarTitle: "डॉपलर रडार आणि गुगल मॅप्स",
    radarSubtitle: "थेट पाऊस रडार लूप आणि उपग्रह नकाशा",
    radarPlay: "सुरू करा",
    radarPause: "थांबवा",
    decisionTitle: "हवामान निर्णय खिडक्या (Decision Windows)",
    decisionSubtitle: "20 दैनंदिन आणि कृषी कामांसाठी वैज्ञानिक अनुकूलता निर्देशांक",
    viewAll: "सर्व 20 कामे पहा",
    showLess: "शीर्ष 3 प्रमुख दाखवा",
    calibrationTitle: "निर्णय प्राधान्य कॅलिब्रेशन",
    customProfileActive: "कस्टम प्रोफाइल सक्रिय",
    calibrationDesc: "विशिष्ट हवामान सुरक्षा मर्यादेनुसार 20 कामांचे फेरमूल्यांकन.",
    roleGeneral: "सामान्य नागरिक",
    roleFarmer: "शेतकरी / कृषी तज्ज्ञ",
    roleAthlete: "खेळाडू / धावपटू",
    roleLogistics: "वाहतूक व पुरवठा",
    rolePlanner: "कार्यक्रम आयोजक",
    hourlyTitle: "48-तासांचा सूक्ष्म-हवामान अंदाज",
    dailyTitle: "7-दिवसीय सविस्तर हवामान अंदाज",
    confidenceTitle: "मॉडेल एकमत आणि विश्वासार्हता",
    pastComparisonTitle: "मागील 3 दिवसांशी तुलना",
    askMosamAi: "mosam.AI ला विचारा",
    chatPlaceholder: "फवारणी, लग्नसोहळा, कपडे, आरोग्य याबद्दल विचारा...",
    micListening: "ऐकत आहे... आपल्या भाषेत बोला",
    authorityAlert: "अधिकृत सरकारी बुलेटिन (IMD)",
    spraySafety: "आयएमडी कृषी फवारणी मार्गदर्शन",
    cpcbAqi: "सीपीसीबी राष्ट्रीय हवा गुणवत्ता निर्देशांक",
    safeToSpray: "फवारणीसाठी सुरक्षित",
    holdSpray: "फवारणी पुढे ढकला",
    cautionSpray: "सावधगिरीने फवारणी करा",
    recWindow: "शिफारस केलेली वेळ:",
    fieldDrainage: "शेतातील पाण्याचा निचरा:",
    maskRecommended: "N95 मास्क वापरण्याचा सल्ला",
    validUntil: "वैधता:",
    temperature: "तापमान",
    feelsLike: "जाणवणारे तापमान",
    humidity: "सापेक्ष आर्द्रता",
    pressure: "हवेचा दाब",
    wind: "वाऱ्याचा वेग",
    uvIndex: "अतिनील (UV) किरणोत्सर्ग",
    dewPoint: "दवबिंदू (Dew Point)",
    cloudCover: "ढगांचे प्रमाण",
    visibility: "दृश्यमानता",
    watchlist: "निगरानी यादी:",
    pinLocation: "ठिकाण पिन करा",
    pinned: "पिन केले",
    alertRules: "सूचना नियम",
    exportCsv: "CSV निर्यात",
    ensemble: "मॉडेल सहमती",
    confidence: "विश्वासार्हता",
    thermalAnomaly24h: "24 तासांतील तापमान बदल",
    pastRain72h: "मागील 72 तासांतील पाऊस",
    pressureTendency: "दाबाचा कल",
    today: "आज",
    rain: "पाऊस",
    filterAll: "सर्व उपक्रम",
    filterOutdoor: "खुली जागा व श्रम",
    filterAgri: "शेती व बागायती",
    filterTravel: "प्रवास व महामार्ग",
    filterFitness: "खेळ व व्यायाम",
    filterLifestyle: "जीवनशैली व समारंभ",
    radioTitle: "mosam.FM रेडिओ",
    radioSubtitle: "45-सेकंदांचे संवादरूपी हवामान बुलेटिन आणि नैसर्गिक ध्वनी",
    radioTag: "104.2 MHz • थेट बुलेटिन",
    toneLocalFriend: "स्थानिक मित्र",
    toneMeteorologist: "हवामान शास्त्रज्ञ",
    toneStoryteller: "कथाकार",
    radioPlayPrompt: "दैनिक हवामान बुलेटिन ऐकण्यासाठी टॅप करा",
    radioBroadcasting: "थेट प्रक्षेपण सुरू आहे...",
    ambientSoundscape: "नैसर्गिक आकाशीय ध्वनी",
    raindropResonator: "पावसाचा नाद",
    clearSkyDrone: "शांत आकाशाची सुरावट",
    scriptPreview: "थेट प्रक्षेपण स्क्रिप्ट पूर्वावलोकन",

    bulletin: bulletinTranslations.mr,
    mosamLens: mosamLensTranslations.mr,
    physicsLab: physicsLabTranslations.mr,
    timeMachine: timeMachineTranslations.mr,
    featureDeck: featureDeckTranslations.mr,
  },
  bn: {
    tagline: "আবহাওয়া কেবল দেখবেন না। এর বিজ্ঞানকে উপলব্ধি করুন।",
    guestBadge: "অতিথি মোড • সক্রিয়",
    loginText: "সাইন ইন / প্রোফাইল",
    continueAsGuest: "অতিথি হিসেবে চালিয়ে যান",
    searchPlaceholder: "শহর, গ্রাম বা অবস্থান খুঁজুন...",
    useGps: "আমার অবস্থান",
    searchingGrids: "আবহাওয়া স্টেশন অনুসন্ধান করা হচ্ছে...",
    noLocationFound: "কোনো আবহাওয়া স্টেশন পাওয়া যায়নি",
    signOut: "সাইন আউট",
    personalizedAlerts: "ব্যক্তিগত আবহাওয়া সতর্কতা",
    pinnedWatchlist: "পিন করা তালিকা",
    radarTitle: "ডপলার রাডার ও গুগল ম্যাপস",
    radarSubtitle: "লাইভ বৃষ্টিপাত রাডার লুপ এবং উপগ্রহ মানচিত্র",
    radarPlay: "চালান",
    radarPause: "থামান",
    decisionTitle: "আবহাওয়া সিদ্ধান্ত উইন্ডো (Decision Windows)",
    decisionSubtitle: "২০টি দৈনন্দিন ও কৃষি কাজের জন্য বৈজ্ঞানিক অনুকূলতা সূচক",
    viewAll: "সব ২০টি কাজ দেখুন",
    showLess: "শীর্ষ ৩টি প্রধান কাজ দেখুন",
    calibrationTitle: "সিদ্ধান্ত গুরুত্ব ক্যালিব্রেশন",
    customProfileActive: "কাস্টম প্রোফাইল সক্রিয়",
    calibrationDesc: "বিশেষ আবহাওয়া সুরক্ষা সীমার ভিত্তিতে ২০টি কাজের সূচক পুনঃমূল্যায়ন।",
    roleGeneral: "সাধারণ নাগরিক",
    roleFarmer: "কৃষক / কৃষি বিশেষজ্ঞ",
    roleAthlete: "ক্রীড়াবিদ / দৌড়বিদ",
    roleLogistics: "পরিবহন ও সরবরাহ",
    rolePlanner: "অনুষ্ঠান পরিকল্পনাকারী",
    hourlyTitle: "৪৮ ঘণ্টার মাইক্রোক্লাইমেট পূর্বাভাস",
    dailyTitle: "৭ দিনের সামগ্রিক আবহাওয়া পূর্বাভাস",
    confidenceTitle: "মডেল সম্মতি ও নির্ভরযোগ্যতা",
    pastComparisonTitle: "গত ৩ দিনের তুলনামূলক বিশ্লেষণ",
    askMosamAi: "mosam.AI-কে জিজ্ঞাসা করুন",
    chatPlaceholder: "কীটনাশক স্প্রে, বিয়ে, স্বাস্থ্য বা পোশাক সম্পর্কে জিজ্ঞাসা করুন...",
    micListening: "শুনছি... আপনার নিজের ভাষায় বলুন",
    authorityAlert: "সরকারি আবহাওয়া বুলেটিন (IMD)",
    spraySafety: "আইএমডি কৃষি স্প্রে নির্দেশিকা",
    cpcbAqi: "সিপিসিবি জাতীয় বায়ু গুণমান সূচক",
    safeToSpray: "স্প্রে করার জন্য নিরাপদ",
    holdSpray: "স্প্রে করা স্থগিত রাখুন",
    cautionSpray: "সতর্কতার সাথে স্প্রে করুন",
    recWindow: "প্রস্তাবিত সময়:",
    fieldDrainage: "জমির জল নিষ্কাশন:",
    maskRecommended: "N95 মাস্ক ব্যবহারের পরামর্শ",
    validUntil: "মেয়াদ:",
    temperature: "তাপমাত্রা",
    feelsLike: "অনুভূত তাপমাত্রা",
    humidity: "আপেক্ষিক আর্দ্রতা",
    pressure: "বায়ুমণ্ডলীয় চাপ",
    wind: "বাতাসের গতিবেগ",
    uvIndex: "অতিবেগুনি (UV) সূচক",
    dewPoint: "শিশিরাঙ্ক (Dew Point)",
    cloudCover: "মেঘের আবরণ",
    visibility: "দৃশ্যমানতা",
    watchlist: "নজরদারি তালিকা:",
    pinLocation: "স্থান পিন করুন",
    pinned: "পিন করা হয়েছে",
    alertRules: "সতর্কবার্তা নিয়ম",
    exportCsv: "CSV এক্সপোর্ট",
    ensemble: "মডেল ঐক্যমত",
    confidence: "নির্ভরযোগ্যতা",
    thermalAnomaly24h: "২৪ ঘণ্টায় তাপমাত্রার পরিবর্তন",
    pastRain72h: "গত ৭২ ঘণ্টার বৃষ্টিপাত",
    pressureTendency: "চাপের প্রবণতা",
    today: "আজ",
    rain: "বৃষ্টি",
    filterAll: "সমস্ত কাজ",
    filterOutdoor: "খোলা জায়গা ও শ্রম",
    filterAgri: "কৃষি ও চাষাবাদ",
    filterTravel: "ভ্রমণ ও হাইওয়ে",
    filterFitness: "খেলাধুলা ও শরীরচর্চা",
    filterLifestyle: "জীবনযাত্রা ও অনুষ্ঠান",
    radioTitle: "mosam.FM রেডিও",
    radioSubtitle: "৪৫-সেকেন্ডের আন্তরিক আবহাওয়া বুলেটিন ও প্রাকৃতিক আকাশধ্বনি",
    radioTag: "১০৪.২ MHz • লাইভ বুলেটিন",
    toneLocalFriend: "ঘরের বন্ধু",
    toneMeteorologist: "আবহাওয়াবিদ",
    toneStoryteller: "গল্পকার",
    radioPlayPrompt: "দৈনিক আবহাওয়া বুলেটিন শুনতে ট্যাপ করুন",
    radioBroadcasting: "লাইভ সম্প্রচার চলছে...",
    ambientSoundscape: "প্রাকৃতিক আবহাওয়া সুর",
    raindropResonator: "বৃষ্টির ফোঁটার অনুরণন",
    clearSkyDrone: "নির্মল আকাশের সুর",
    scriptPreview: "লাইভ সম্প্রচার স্ক্রিপ্ট প্রিভিউ",

    bulletin: bulletinTranslations.bn,
    mosamLens: mosamLensTranslations.bn,
    physicsLab: physicsLabTranslations.bn,
    timeMachine: timeMachineTranslations.bn,
    featureDeck: featureDeckTranslations.bn,
  },
  ml: {
    tagline: "കാലാവസ്ഥ കാണുക മാത്രമല്ല, മനസ്സിലാക്കുക കൂടി ചെയ്യുക.",
    guestBadge: "ഗസ്റ്റ് ആക്സസ് • സജീവം",
    loginText: "ലോഗിൻ / പ്രൊഫൈൽ",
    continueAsGuest: "ഗസ്റ്റായി തുടരുക",
    searchPlaceholder: "നഗരമോ സ്ഥലമോ തിരയുക...",
    useGps: "എന്റെ സ്ഥാനം",
    searchingGrids: "കാലാവസ്ഥാ വിവരങ്ങൾ തിരയുന്നു...",
    noLocationFound: "കാലാവസ്ഥാ കേന്ദ്രം കണ്ടെത്താനായില്ല",
    signOut: "സൈൻ ഔട്ട്",
    personalizedAlerts: "വ്യക്തിഗത അറിയിപ്പുകൾ",
    pinnedWatchlist: "പിൻ ചെയ്തവ",
    radarTitle: "ഡോപ്ലർ റഡാർ & ഗൂഗിൾ മാപ്സ്",
    radarSubtitle: "തത്സമയ മഴ റഡാർ ദൃശ്യം",
    radarPlay: "പ്ലേ ചെയ്യുക",
    radarPause: "പോസ് ചെയ്യുക",
    decisionTitle: "കാലാവസ്ഥാ തീരുമാനങ്ങൾ",
    decisionSubtitle: "20 ദൈനംദിന കാര്യങ്ങൾക്കുള്ള കാലാവസ്ഥാ അനുയോജ്യത",
    viewAll: "എല്ലാ 20 പ്രവർത്തനങ്ങളും കാണുക",
    showLess: "പ്രധാനപ്പെട്ട 3 എണ്ണം കാണുക",
    calibrationTitle: "തീരുമാന ഭാര ക്രമീകരണം",
    customProfileActive: "കസ്റ്റം പ്രൊഫൈൽ സജീവം",
    calibrationDesc: "പ്രത്യേക സുരക്ഷാ മാനദണ്ഡങ്ങൾക്കനുസരിച്ച് 20 പ്രവർത്തനങ്ങളുടെ പുനർമൂല്യനിർണ്ണയം.",
    roleGeneral: "പൊതുജനം",
    roleFarmer: "കർഷകൻ / കൃഷി വിദഗ്ദ്ധൻ",
    roleAthlete: "കായികതാരം",
    roleLogistics: "ചരക്കുഗതാഗതം",
    rolePlanner: "പരിപാടി ആസൂത്രകൻ",
    hourlyTitle: "48 മണിക്കൂർ കാലാവസ്ഥ",
    dailyTitle: "7 ദിവസത്തെ പ്രവചനം",
    confidenceTitle: "മോഡൽ കൃത്യതയും വിശ്വാസ്യതയും",
    pastComparisonTitle: "കഴിഞ്ഞ 3 ദിവസത്തെ താരതമ്യം",
    askMosamAi: "mosam.AI-യോട് ചോദിക്കൂ",
    chatPlaceholder: "കീടനാശിനി പ്രയോഗം, ചടങ്ങുകൾ, യാത്ര എന്നിവ ചോദിക്കൂ...",
    micListening: "കേൾക്കുന്നു... സംസാരിക്കൂ",
    authorityAlert: "ഔദ്യോഗിക കാലാവസ്ഥാ ബുള്ളറ്റിൻ (IMD)",
    spraySafety: "കാർഷിക സ്പ്രേ നിർദ്ദേശങ്ങൾ",
    cpcbAqi: "CPCB വായു ഗുണനിലവാര സൂചിക",
    safeToSpray: "സ്പ്രേ ചെയ്യാൻ അനുയോജ്യം",
    holdSpray: "സ്പ്രേ ചെയ്യുന്നത് മാറ്റിവെക്കുക",
    cautionSpray: "ജാഗ്രതയോടെ സ്പ്രേ ചെയ്യുക",
    recWindow: "ശുപാർശ ചെയ്യുന്ന സമയം:",
    fieldDrainage: "പാടത്തെ നീരൊഴുക്ക്:",
    maskRecommended: "N95 മാസ്ക് ധരിക്കുക",
    validUntil: "കാലാവധി:",
    temperature: "താപനില",
    feelsLike: "തോന്നിക്കുന്ന താപനില",
    humidity: "ഈർപ്പം",
    pressure: "മർദ്ദം",
    wind: "കാറ്റിന്റെ വേഗത",
    uvIndex: "യുവി സൂചിക",
    dewPoint: "ഡ്യൂ പോയിന്റ്",
    cloudCover: "മേഘാവൃതത",
    visibility: "കാഴ്ചപരിധി",
    watchlist: "നിരീക്ഷണ പട്ടിക:",
    pinLocation: "ലൊക്കേഷൻ പിൻ ചെയ്യുക",
    pinned: "പിൻ ചെയ്തു",
    alertRules: "മുന്നറിയിപ്പ് ക്രമീകരണങ്ങൾ",
    exportCsv: "CSV ഡൗൺലോഡ്",
    ensemble: "മോഡൽ ഐക്യം",
    confidence: "വിശ്വാസ്യത",
    thermalAnomaly24h: "24 മണിക്കൂറിലെ താപ വ്യതിയാനം",
    pastRain72h: "കഴിഞ്ഞ 72 മണിക്കൂറിലെ മഴ",
    pressureTendency: "മർദ്ദ ഗതി",
    today: "ഇന്ന്",
    rain: "മഴ",
    filterAll: "എല്ലാം",
    filterOutdoor: "പുറംവേദികൾ",
    filterAgri: "കൃഷി",
    filterTravel: "യാത്ര",
    filterFitness: "വ്യായാമം",
    filterLifestyle: "ജീവിതശൈലി",
    radioTitle: "mosam.FM റേഡിയോ",
    radioSubtitle: "45 സെക്കൻഡ് കാലാവസ്ഥാ സംഭാഷണവും പ്രകൃതി ശബ്ദങ്ങളും",
    radioTag: "104.2 MHz • ലൈവ് ബുള്ളറ്റിൻ",
    toneLocalFriend: "പ്രിയ സുഹൃത്ത്",
    toneMeteorologist: "കാലാവസ്ഥാ ശാസ്ത്രജ്ഞൻ",
    toneStoryteller: "കഥാകാരൻ",
    radioPlayPrompt: "ദൈനംദിന കാലാവസ്ഥാ വിവരങ്ങൾ കേൾക്കാൻ ടാപ്പ് ചെയ്യുക",
    radioBroadcasting: "തത്സമയ പ്രക്ഷേപണം നടക്കുന്നു...",
    ambientSoundscape: "പ്രകൃതിദത്ത ആകാശ ശബ്ദം",
    raindropResonator: "മഴത്തുള്ളി സംഗീതം",
    clearSkyDrone: "പ്രശാന്ത ആകാശ നാദം",
    scriptPreview: "തത്സമയ പ്രക്ഷേപണ സ്ക്രിപ്റ്റ് പ്രിവ്യൂ",

    bulletin: bulletinTranslations.ml,
    mosamLens: mosamLensTranslations.ml,
    physicsLab: physicsLabTranslations.ml,
    timeMachine: timeMachineTranslations.ml,
    featureDeck: featureDeckTranslations.ml,
  }
};

// ==========================================
// 1. WMO WEATHER CODES TRANSLATIONS (0 - 99)
// ==========================================
export const WMO_TRANSLATIONS: Record<number, Record<LanguageCode, string>> = {
  0: {
    en: "Clear sky",
    hi: "साफ़ आसमान",
    te: "నిర్మలమైన ఆకాశం",
    ta: "தெளிவான வானம்",
    mr: "निरभ्र आकाश",
    bn: "পরিষ্কার আকাশ",
    ml: "തെളിഞ്ഞ ആകാശം"
  },
  1: {
    en: "Mainly clear",
    hi: "मुख्यतः साफ़",
    te: "సాధారణంగా నిర్మలం",
    ta: "பெரும்பாலும் தெளிவானது",
    mr: "मुख्यतः स्वच्छ",
    bn: "মূলত পরিষ্কার",
    ml: "മിക്കവാറും തെളിഞ്ഞത്"
  },
  2: {
    en: "Partly cloudy",
    hi: "आंशिक बादल",
    te: "పాక్షికంగా మేఘావృతం",
    ta: "பகுதி மேகமூட்டம்",
    mr: "अंशतः ढगाळ",
    bn: "আংশিক মেঘলা",
    ml: "ഭാഗികമായി മേഘാവൃതം"
  },
  3: {
    en: "Overcast",
    hi: "घने बादल",
    te: "దట్టమైన మేఘాలు",
    ta: "அடர்ந்த மேகமூட்டம்",
    mr: "दाट ढगाळ",
    bn: "মেঘাচ্ছন্ন",
    ml: "മൂടിക്കെട്ടിയ ആകാശം"
  },
  45: {
    en: "Fog",
    hi: "कोहरा",
    te: "పొగమంచు",
    ta: "மூடுபனி",
    mr: "धुके",
    bn: "কুয়াশা",
    ml: "മൂടൽമഞ്ഞ്"
  },
  48: {
    en: "Depositing rime fog",
    hi: "जमा देने वाला कोहरा",
    te: "గడ్డకట్టే పొగమంచు",
    ta: "உறைபனி மூட்டம்",
    mr: "गोठवणारे धुके",
    bn: "জমাট কুয়াশা",
    ml: "കഠിന മൂടൽമഞ്ഞ്"
  },
  51: {
    en: "Light drizzle",
    hi: "हल्की बूंदाबांदी",
    te: "తేలికపాటి జల్లులు",
    ta: "லேசான தூறல்",
    mr: "हलकी रिमझिम",
    bn: "হালকা গুঁড়ি গুঁড়ি বৃষ্টি",
    ml: "നേരിയ ചാറ്റൽമഴ"
  },
  53: {
    en: "Moderate drizzle",
    hi: "मध्यम बूंदाबांदी",
    te: "మధ్యస్థ జల్లులు",
    ta: "மிதமான தூறல்",
    mr: "मध्यम रिमझिम",
    bn: "মাঝারি গুঁড়ি গুঁড়ি বৃষ্টি",
    ml: "മിതമായ ചാറ്റൽമഴ"
  },
  55: {
    en: "Dense drizzle",
    hi: "सघन बूंदाबांदी",
    te: "దట్టమైన జల్లులు",
    ta: "அடர்ந்த தூறல்",
    mr: "दाट रिमझिम",
    bn: "ঘন গুঁড়ি গুঁড়ি বৃষ্টি",
    ml: "കനത്ത ചാറ്റൽമഴ"
  },
  56: {
    en: "Light freezing drizzle",
    hi: "शीतल हल्की बूंदाबांदी",
    te: "శీతల తేలికపాటి జల్లులు",
    ta: "குளிர்ந்த லேசான தூறல்",
    mr: "थंड हलकी रिमझिम",
    bn: "শীতল হালকা গুঁড়ি গুঁড়ি বৃষ্টি",
    ml: "തണുത്തുറഞ്ഞ നേരിയ ചാറ്റൽമഴ"
  },
  57: {
    en: "Dense freezing drizzle",
    hi: "शीतल सघन बूंदाबांदी",
    te: "శీతల దట్టమైన జల్లులు",
    ta: "குளிர்ந்த அடர்ந்த தூறல்",
    mr: "थंड दाट रिमझिम",
    bn: "শীতল ঘন গুঁড়ি গুঁড়ি বৃষ্টি",
    ml: "തണുത്തുറഞ്ഞ കനത്ത ചാറ്റൽമഴ"
  },
  61: {
    en: "Slight rain",
    hi: "हल्की बारिश",
    te: "తేలికపాటి వర్షం",
    ta: "லேசான மழை",
    mr: "हलका पाऊस",
    bn: "হালকা বৃষ্টি",
    ml: "നേരിയ മഴ"
  },
  63: {
    en: "Moderate rain",
    hi: "मध्यम बारिश",
    te: "మోస్తరు వర్షం",
    ta: "மிதமான மழை",
    mr: "मध्यम पाऊस",
    bn: "মাঝারি বৃষ্টি",
    ml: "മിതമായ മഴ"
  },
  65: {
    en: "Heavy rain",
    hi: "भारी बारिश",
    te: "భారీ వర్షం",
    ta: "பலத்த மழை",
    mr: "मुसळधार पाऊस",
    bn: "ভারী বৃষ্টি",
    ml: "കനത്ത മഴ"
  },
  66: {
    en: "Light freezing rain",
    hi: "बर्फीली हल्की बारिश",
    te: "మంచుతో కూడిన వర్షం",
    ta: "குளிர்ந்த லேசான மழை",
    mr: "गोठवणारा हलका पाऊस",
    bn: "হিমশীতল হালকা বৃষ্টি",
    ml: "തണുത്തുറഞ്ഞ നേരിയ മഴ"
  },
  67: {
    en: "Heavy freezing rain",
    hi: "बर्फीली भारी बारिश",
    te: "మంచుతో కూడిన భారీ వర్షం",
    ta: "குளிர்ந்த பலத்த மழை",
    mr: "गोठवणारा मुसळधार पाऊस",
    bn: "হিমশীতল ভারী বৃষ্টি",
    ml: "തണുത്തുറഞ്ഞ കനത്ത മഴ"
  },
  71: {
    en: "Slight snow fall",
    hi: "हल्की बर्फबारी",
    te: "తేలికపాటి హిమపాతం",
    ta: "லேசான பனிப்பொழிவு",
    mr: "हलकी हिमवृष्टी",
    bn: "হালকা তুষারপাত",
    ml: "നേരിയ മഞ്ഞുവീഴ്ച"
  },
  73: {
    en: "Moderate snow fall",
    hi: "मध्यम बर्फबारी",
    te: "మోస్తరు హిమపాతం",
    ta: "மிதமான பனிப்பொழிவு",
    mr: "मध्यम हिमवृष्टी",
    bn: "মাঝারি তুষারপাত",
    ml: "മിതമായ മഞ്ഞുവീഴ്ച"
  },
  75: {
    en: "Heavy snow fall",
    hi: "भारी बर्फबारी",
    te: "భారీ హిమపాతం",
    ta: "கடுமையான பனிப்பொழிவு",
    mr: "जोरदार हिमवृष्टी",
    bn: "ভারী তুষারপাত",
    ml: "കനത്ത മഞ്ഞുവീഴ്ച"
  },
  77: {
    en: "Snow grains",
    hi: "बर्फ के कण",
    te: "మంచు రేణువులు",
    ta: "பனித்துகள்கள்",
    mr: "हिमकण",
    bn: "তুষারকণা",
    ml: "മഞ്ഞുതരികൾ"
  },
  80: {
    en: "Slight rain showers",
    hi: "हल्की वर्षा बौछारें",
    te: "తేలికపాటి వర్షపు జల్లులు",
    ta: "லேசான மழைச்சாரல்",
    mr: "हलक्या पावसाच्या सरी",
    bn: "হালকা বৃষ্টিঝরনা",
    ml: "നേരിയ മഴക്കാറ്റ്"
  },
  81: {
    en: "Moderate rain showers",
    hi: "मध्यम वर्षा बौछारें",
    te: "మోస్తరు వర్షపు జల్లులు",
    ta: "மிதமான மழைச்சாரல்",
    mr: "मध्यम पावसाच्या सरी",
    bn: "মাঝারি বৃষ্টিঝরনা",
    ml: "മിതമായ മഴക്കാറ്റ്"
  },
  82: {
    en: "Violent rain showers",
    hi: "मूसलाधार वर्षा",
    te: "అతి భారీ వర్షపు జల్లులు",
    ta: "கொட்டும் கனமழை",
    mr: "मुसळधार पाऊस",
    bn: "প্রবল বৃষ্টিঝরনা",
    ml: "അതിശക്തമായ മഴ"
  },
  85: {
    en: "Slight snow showers",
    hi: "हल्की बर्फीली बौछारें",
    te: "తేలికపాటి మంచు జల్లులు",
    ta: "லேசான பனிச்சாரல்",
    mr: "हलक्या बर्फाच्या सरी",
    bn: "হালকা তুষারঝরনা",
    ml: "നേരിയ മഞ്ഞുചാറൽ"
  },
  86: {
    en: "Heavy snow showers",
    hi: "भारी बर्फीली बौछारें",
    te: "భారీ మంచు జల్లులు",
    ta: "கடுமையான பனிச்சாரல்",
    mr: "जोरदार बर्फाच्या सरी",
    bn: "ভারী তুষারঝরনা",
    ml: "കനത്ത മഞ്ഞുചാറൽ"
  },
  95: {
    en: "Thunderstorm",
    hi: "गरज के साथ तूफ़ान",
    te: "ఉరుములతో కూడిన తుఫాను",
    ta: "இடியுடன் கூடிய புயல்",
    mr: "वादळी पाऊस",
    bn: "বজ্রবিদ্যুৎসহ ঝড়",
    ml: "ഇടിമിന്നലോടുകൂടിയ കൊടുങ്കാറ്റ്"
  },
  96: {
    en: "Thunderstorm with slight hail",
    hi: "ओलावृष्टि के साथ तूफ़ान",
    te: "వడగండ్లతో కూడిన తుఫాను",
    ta: "ஆலங்கட்டி இடிமழை",
    mr: "गारपिटीसह वादळ",
    bn: "শিলাবৃষ্টিসহ ঝড়",
    ml: "ആലിപ്പഴത്തോടുകൂടിയ ഇടിമിന്നൽ"
  },
  99: {
    en: "Thunderstorm with heavy hail",
    hi: "भयंकर ओलावृष्टि तूफ़ान",
    te: "తీవ్ర వడగండ్ల తుఫాను",
    ta: "தீவிர ஆலங்கட்டி புயல்",
    mr: "तीव्र गारपिटीचे वादळ",
    bn: "তীব্র শিলাবৃষ্টিসহ ঝড়",
    ml: "അതിശക്തമായ ആലിപ്പഴ കൊടുങ്കാറ്റ്"
  }
};

export function getLocalizedWmoDescription(code: number, lang: LanguageCode): string {
  const codeEntry = WMO_TRANSLATIONS[code];
  if (codeEntry && codeEntry[lang]) {
    return codeEntry[lang];
  }
  if (codeEntry && codeEntry.en) {
    return codeEntry.en;
  }
  return "Fair";
}

// ==========================================
// 2. DECISION WINDOWS TRANSLATIONS (All 20 Activities)
// ==========================================
export const DECISION_TRANSLATIONS: Record<
  string,
  {
    title: Record<LanguageCode, string>;
    category: Record<LanguageCode, string>;
  }
> = {
  wedding: {
    title: {
      en: "Outdoor Wedding & Gala",
      hi: "खुले में शादी व जलसा",
      te: "బహిరంగ వివాహ వేడుక",
      ta: "திறந்தவெளி திருமணம் & விழா",
      mr: "लग्नसोहळा व समारंभ",
      bn: "খোলা প্রাঙ্গণে বিবাহ অনুষ্ঠান",
      ml: "ഔട്ട്ഡോർ കല്യാണവും വിരുന്നും"
    },
    category: {
      en: "Lifestyle & Events",
      hi: "दैनिक जीवन व आयोजन",
      te: "జీవనశైలి & వేడుకలు",
      ta: "வாழ்க்கை முறை & நிகழ்வுகள்",
      mr: "जीवनशैली व समारंभ",
      bn: "জীবনযাত্রা ও অনুষ্ঠান",
      ml: "ജീവിതശൈലി"
    }
  },
  agri_spray: {
    title: {
      en: "Pesticide & Foliar Spray",
      hi: "कीटनाशक व पर्णीय छिड़काव",
      te: "పురుగుమందుల పిచికారీ",
      ta: "பூச்சிக்கொல்லி & இலைவழி தெளிப்பு",
      mr: "कीटकनाशक व खत फवारणी",
      bn: "কীটনাশক ও সার স্প্রে",
      ml: "കീടനാശിനി തളിക്കൽ"
    },
    category: {
      en: "Agriculture & Farming",
      hi: "कृषि व खेती",
      te: "వ్యవసాయం & సాగు",
      ta: "விவசாயம் & பயிர்",
      mr: "शेती व बागायती",
      bn: "কৃষি ও চাষাবাদ",
      ml: "കൃഷി"
    }
  },
  irrigation: {
    title: {
      en: "Irrigation & Drainage Management",
      hi: "सिंचाई व जल निकासी प्रबंधन",
      te: "సాగునీరు & డ్రైనేజీ నిర్వహణ",
      ta: "பாசனம் & வடிகால் மேலாண்மை",
      mr: "सिंचन व निचरा व्यवस्थापन",
      bn: "সেচ ও জল নিষ্কাশন ব্যবস্থাপনা",
      ml: "ജലസേചനവും ഡ്രെയിനേജും"
    },
    category: {
      en: "Agriculture & Farming",
      hi: "कृषि व खेती",
      te: "వ్యవసాయం & సాగు",
      ta: "விவசாயம் & பயிர்",
      mr: "शेती व बागायती",
      bn: "কৃষি ও চাষাবাদ",
      ml: "കൃഷി"
    }
  },
  commute: {
    title: {
      en: "Daily Commute & Highway Transit",
      hi: "दैनिक आवागमन व हाईवे यात्रा",
      te: "రోజువారీ ప్రయాణం & హైవే",
      ta: "தினசரி பயணம் & நெடுஞ்சாலை",
      mr: "दैनंदिन प्रवास व महामार्ग",
      bn: "দৈনন্দিন যাতায়াত ও হাইওয়ে ভ্রমণ",
      ml: "യാത്രയും ഹൈവേ ഡ്രൈവിംഗും"
    },
    category: {
      en: "Transit & Travel",
      hi: "यात्रा व हाईवे",
      te: "రవాణా & ప్రయాణం",
      ta: "பயணம் & நெடுஞ்சாலை",
      mr: "प्रवास व महामार्ग",
      bn: "ভ্রমণ ও হাইওয়ে",
      ml: "യാത്ര"
    }
  },
  laundry: {
    title: {
      en: "Outdoor Laundry & Fabric Drying",
      hi: "कपड़े धोना व धूप में सुखाना",
      te: "బట్టలు ఉతకడం & ఆరేయడం",
      ta: "துணி துவைத்தல் & உலர்த்துதல்",
      mr: "कपडे धुणे व उन्हात वाळवणे",
      bn: "জামাকাপড় ধোয়া ও শুকানো",
      ml: "അലക്കലും തുണി ഉണക്കലും"
    },
    category: {
      en: "Lifestyle & Events",
      hi: "दैनिक जीवन व आयोजन",
      te: "జీవనశైలి & వేడుకలు",
      ta: "வாழ்க்கை முறை & நிகழ்வுகள்",
      mr: "जीवनशैली व समारंभ",
      bn: "জীবনযাত্রা ও অনুষ্ঠান",
      ml: "ജീവിതശൈലി"
    }
  },
  running: {
    title: {
      en: "Morning Jogging & Cardio",
      hi: "सुबह की जॉगिंग व कार्डियो",
      te: "ఉదయపు జాగింగ్ & వ్యాయామం",
      ta: "காலை நடைப்பயிற்சி & ஓட்டம்",
      mr: "सकाळचे धावणे व व्यायाम",
      bn: "সকালের জগিং ও শরীরচর্চা",
      ml: "പ്രഭാത ജോഗിംഗും വ്യായാമവും"
    },
    category: {
      en: "Sports & Cardio",
      hi: "खेल व व्यायाम",
      te: "క్రీడలు & వ్యాయామం",
      ta: "விளையாட்டு & உடற்பயிற்சி",
      mr: "खेळ व व्यायाम",
      bn: "খেলাধুলা ও শরীরচর্চা",
      ml: "വ്യായാമം"
    }
  },
  cycling: {
    title: {
      en: "Road Cycling & Commuter Biking",
      hi: "सड़क पर साइकिलिंग व राइडिंग",
      te: "రోడ్ సైక్లింగ్",
      ta: "சாலை சைக்கிள் பயணம்",
      mr: "सायकल चालवणे",
      bn: "সাইক্লিং ও বাইকিং",
      ml: "സൈക്ലിംഗ്"
    },
    category: {
      en: "Sports & Cardio",
      hi: "खेल व व्यायाम",
      te: "క్రీడలు & వ్యాయామం",
      ta: "விளையாட்டு & உடற்பயிற்சி",
      mr: "खेळ व व्यायाम",
      bn: "খেলাধুলা ও শরীরচর্চা",
      ml: "വ്യായാമം"
    }
  },
  construction: {
    title: {
      en: "Construction & Heavy Outdoor Labor",
      hi: "निर्माण कार्य व भारी शारीरिक श्रम",
      te: "నిర్మాణ పనులు & బహిరంగ శ్రమ",
      ta: "கட்டுமானப் பணி & கடுமையான உழைப்பு",
      mr: "बांधकाम कामे व मैदानी श्रम",
      bn: "নির্মাণ কাজ ও বহিরাঙ্গন পরিশ্রম",
      ml: "നിർമ്മാണ ജോലികളും കഠിനാധ്വാനവും"
    },
    category: {
      en: "Outdoor & Labour",
      hi: "खुले स्थान व श्रम",
      te: "బహిరంగ & శ్రమ",
      ta: "திறந்தவெளி & உழைப்பு",
      mr: "खुली जागा व श्रम",
      bn: "খোলা জায়গা ও শ্রম",
      ml: "പുറംവേദികൾ"
    }
  },
  solar: {
    title: {
      en: "Photovoltaic Solar Generation",
      hi: "सौर ऊर्जा उत्पादन",
      te: "సౌర విద్యుత్ ఉత్పత్తి",
      ta: "சூரிய மின் உற்பத்தி",
      mr: "सौर ऊर्जा निर्मिती",
      bn: "সৌর বিদ্যুৎ উৎপাদন",
      ml: "സൗരോർജ്ജ ഉത്പാദനം"
    },
    category: {
      en: "Lifestyle & Events",
      hi: "दैनिक जीवन व आयोजन",
      te: "జీవనశైలి & వేడుకలు",
      ta: "வாழ்க்கை முறை & நிகழ்வுகள்",
      mr: "जीवनशैली व समारंभ",
      bn: "জীবনযাত্রা ও অনুষ্ঠান",
      ml: "ജീവിതശൈലി"
    }
  },
  stargazing: {
    title: {
      en: "Night Sky Stargazing & Astronomy",
      hi: "रात्रि आकाश दर्शन व खगोल विज्ञान",
      te: "రాత్రి నక్షత్ర దర్శనం",
      ta: "இரவு வானம் & விண்மீன் பார்வை",
      mr: "रात्रकालीन आकाश दर्शन व खगोलशास्त्र",
      bn: "রাতের আকাশ ও তারা পর্যবেক্ষণ",
      ml: "നക്ഷത്ര നിരീക്ഷണം"
    },
    category: {
      en: "Lifestyle & Events",
      hi: "दैनिक जीवन व आयोजन",
      te: "జీవనశైలి & వేడుకలు",
      ta: "வாழ்க்கை முறை & நிகழ்வுகள்",
      mr: "जीवनशैली व समारंभ",
      bn: "জীবনযাত্রা ও অনুষ্ঠান",
      ml: "ജീവിതശൈലി"
    }
  },
  drone: {
    title: {
      en: "UAV Drone Filming & Survey",
      hi: "ड्रोन उड़ान व एरियल वीडियोग्राफी",
      te: "డ్రోన్ ఫ్లైట్ & షూటింగ్",
      ta: "ட்ரோன் படப்பிடிப்பு & கணக்கெடுப்பு",
      mr: "ड्रोन उड्डाण व व्हिडिओग्राफी",
      bn: "ড্রোন উড্ডয়ন ও ভিডিওগ্রাফি",
      ml: "ഡ്രോൺ പറത്തലും സർവേയും"
    },
    category: {
      en: "Outdoor & Labour",
      hi: "खुले स्थान व श्रम",
      te: "బహిరంగ & శ్రమ",
      ta: "திறந்தவெளி & உழைப்பு",
      mr: "खुली जागा व श्रम",
      bn: "খোলা জায়গা ও শ্রম",
      ml: "പുറംവേദികൾ"
    }
  },
  dining: {
    title: {
      en: "Open-Air Dining & Rooftop Cafe",
      hi: "खुली हवा में भोजन व रूफटॉप कैफे",
      te: "ఓపెన్-ఎయిర్ డైనింగ్ & కేఫ్",
      ta: "திறந்தவெளி உணவு & உணவகம்",
      mr: "मोकळ्या हवेत जेवण व कॅफे",
      bn: "উন্মুক্ত স্থানে নৈশভোজ ও রুফটপ ক্যাফে",
      ml: "ഓപ്പൺ എയർ ഡൈനിംഗ്"
    },
    category: {
      en: "Lifestyle & Events",
      hi: "दैनिक जीवन व आयोजन",
      te: "జీవనశైలి & వేడుకలు",
      ta: "வாழ்க்கை முறை & நிகழ்வுகள்",
      mr: "जीवनशैली व समारंभ",
      bn: "জীবনযাত্রা ও অনুষ্ঠান",
      ml: "ജീവിതശൈലി"
    }
  },
  asthma: {
    title: {
      en: "Asthma & Respiratory Safety",
      hi: "दमा व श्वसन सुरक्षा",
      te: "ఆస్తమా & శ్వాసకోశ భద్రత",
      ta: "ஆஸ்துமா & சுவாசப் பாதுகாப்பு",
      mr: "दमा व श्वसन सुरक्षा",
      bn: "হাঁপানি ও শ্বাসযন্ত্রের সুরক্ষা",
      ml: "ആസ്ത്മയും ശ്വാസകോശ സുരക്ഷയും"
    },
    category: {
      en: "Outdoor & Labour",
      hi: "खुले स्थान व श्रम",
      te: "బహిరంగ & శ్రమ",
      ta: "திறந்தவெளி & உழைப்பு",
      mr: "खुली जागा व श्रम",
      bn: "খোলা জায়গা ও শ্রম",
      ml: "പുറംവേദികൾ"
    }
  },
  flight: {
    title: {
      en: "Commercial Flight & Express Rails",
      hi: "वाणिज्यिक उड़ान व एक्सप्रेस ट्रेन",
      te: "విమాన ప్రయాణం & రైలు రవాణా",
      ta: "விமானப் பயணம் & விரைவு ரயில்",
      mr: "विमान प्रवास व एक्सप्रेस रेल्वे",
      bn: "বিমান ও এক্সপ্রেস ট্রেন যাত্রা",
      ml: "വിമാന യാത്രയും എക്സ്പ്രസ് ട്രെയിനും"
    },
    category: {
      en: "Transit & Travel",
      hi: "यात्रा व हाईवे",
      te: "రవాణా & ప్రయాణం",
      ta: "பயணம் & நெடுஞ்சாலை",
      mr: "प्रवास व महामार्ग",
      bn: "ভ্রমণ ও হাইওয়ে",
      ml: "യാത്ര"
    }
  },
  swimming: {
    title: {
      en: "Outdoor Swimming & Pool",
      hi: "तैराकी व आउटडोर पूल",
      te: "ఈత & బహిరంగ పూల్",
      ta: "நீச்சல் & வெளிப்புறக் குளம்",
      mr: "पोहणे व मैदानी तलाव",
      bn: "সাঁতার ও উন্মুক্ত পুল",
      ml: "നീന്തൽ"
    },
    category: {
      en: "Sports & Cardio",
      hi: "खेल व व्यायाम",
      te: "క్రీడలు & వ్యాయామం",
      ta: "விளையாட்டு & உடற்பயிற்சி",
      mr: "खेळ व व्यायाम",
      bn: "খেলাধুলা ও শরীরচর্চা",
      ml: "വ്യായാമം"
    }
  },
  pet_walk: {
    title: {
      en: "Dog & Pet Walking",
      hi: "पालतू जानवरों की सैर",
      te: "పెంపుడు జంతువుల నడక",
      ta: "செல்லப்பிராணிகள் நடைப்பயிற்சி",
      mr: "पाळीव प्राण्यांना फिरायला नेणे",
      bn: "পোষ্য প্রাণীদের হাঁটা",
      ml: "വളർത്തുമൃഗങ്ങളുമൊത്തുള്ള നടത്തം"
    },
    category: {
      en: "Lifestyle & Events",
      hi: "दैनिक जीवन व आयोजन",
      te: "జీవనశైలి & వేడుకలు",
      ta: "வாழ்க்கை முறை & நிகழ்வுகள்",
      mr: "जीवनशैली व समारंभ",
      bn: "জীবনযাত্রা ও অনুষ্ঠান",
      ml: "ജീവിതശൈലി"
    }
  },
  car_wash: {
    title: {
      en: "Vehicle Detailing & Washing",
      hi: "कार धुलाई व वाहन सफाई",
      te: "కారు వాషింగ్",
      ta: "வாகனக் கழுவுதல்",
      mr: "गाडी धुणे व स्वच्छता",
      bn: "গাড়ি ধোয়া ও পরিষ্কার",
      ml: "വാഹനം കഴുകൽ"
    },
    category: {
      en: "Lifestyle & Events",
      hi: "दैनिक जीवन व आयोजन",
      te: "జీవనశైలి & వేడుకలు",
      ta: "வாழ்க்கை முறை & நிகழ்வுகள்",
      mr: "जीवनशैली व समारंभ",
      bn: "জীবনযাত্রা ও অনুষ্ঠান",
      ml: "ജീവിതശൈലി"
    }
  },
  boating: {
    title: {
      en: "Inland Boating & Kayaking",
      hi: "नौका विहार व कायाकिंग",
      te: "బోటింగ్ & కయాకింగ్",
      ta: "படகு சவாரி & கயாக்கிங்",
      mr: "नौकाविहार व कयाकिंग",
      bn: "নৌকা ভ্রমণ ও কায়াকিং",
      ml: "ബോട്ടിംഗും കയാക്കിംഗും"
    },
    category: {
      en: "Outdoor & Labour",
      hi: "खुले स्थान व श्रम",
      te: "బహిరంగ & శ్రమ",
      ta: "திறந்தவெளி & உழைப்பு",
      mr: "खुली जागा व श्रम",
      bn: "খোলা জায়গা ও श्रम",
      ml: "പുറംവേദികൾ"
    }
  },
  senior_walk: {
    title: {
      en: "Senior Citizen Promenade",
      hi: "वरिष्ठ नागरिकों की प्रातः सैर",
      te: "వృద్ధుల ఉదయపు నడక",
      ta: "முதியோர் காலை நடை",
      mr: "ज्येष्ठ नागरिकांची सकाळची फिरणे",
      bn: "প্রবীণ নাগরিকদের প্রাতঃভ্রমণ",
      ml: "മുതിർന്നവരുടെ പ്രഭാത നടത്തം"
    },
    category: {
      en: "Sports & Cardio",
      hi: "खेल व व्यायाम",
      te: "క్రీడలు & వ్యాయామం",
      ta: "விளையாட்டு & உடற்பயிற்சி",
      mr: "खेळ व व्यायाम",
      bn: "খেলাধুলা ও শরীরচর্চা",
      ml: "വ്യായാമം"
    }
  },
  photography: {
    title: {
      en: "Golden Hour Photography",
      hi: "स्वर्णिम प्रहर (Golden Hour) फोटोग्राफी",
      te: "గోల్డెన్ అవర్ ఫోటోగ్రఫీ",
      ta: "கோல்டன் ஹவர் புகைப்படக் கலை",
      mr: "सुवर्ण काळ (Golden Hour) छायाचित्रण",
      bn: "গোল্ডেন আওয়ার ফটোগ্রাফি",
      ml: "ഗോൾഡൻ അവർ ഫോട്ടോഗ്രാഫി"
    },
    category: {
      en: "Lifestyle & Events",
      hi: "दैनिक जीवन व आयोजन",
      te: "జీవనశైలి & వేడుకలు",
      ta: "வாழ்க்கை முறை & நிகழ்வுகள்",
      mr: "जीवनशैली व समारंभ",
      bn: "জীবনযাত্রা ও অনুষ্ঠান",
      ml: "ജീവിതശൈലി"
    }
  }
};

export function getLocalizedDecisionMeta(id: string, lang: LanguageCode): { title?: string; category?: string } {
  const item = DECISION_TRANSLATIONS[id];
  if (!item) return {};
  return {
    title: item.title[lang] || item.title.en,
    category: item.category[lang] || item.category.en,
  };
}

// ==========================================
// 3. SUITABILITY STATUS TRANSLATIONS
// ==========================================
export const STATUS_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  Optimal: {
    en: "Optimal",
    hi: "सर्वोत्तम",
    te: "అనుకూలం",
    ta: "சிறந்தது",
    mr: "सर्वोत्तम",
    bn: "সর্বোত্তম",
    ml: "ഉത്തമം"
  },
  Moderate: {
    en: "Moderate",
    hi: "सामान्य",
    te: "మోస్తరు",
    ta: "மிதமானது",
    mr: "मध्यम",
    bn: "মাঝারি",
    ml: "മിതമായത്"
  },
  Caution: {
    en: "Caution",
    hi: "सावधानी",
    te: "జాగ్రత్త",
    ta: "எச்சரிக்கை",
    mr: "सावधगिरी",
    bn: "সতর্কতা",
    ml: "ജാഗ്രത"
  },
  Hazardous: {
    en: "Hazardous",
    hi: "जोखिमपूर्ण",
    te: "ప్రమాదకరం",
    ta: "ஆபத்தானது",
    mr: "धोकादायक",
    bn: "বিপজ্জনক",
    ml: "അപകടകരം"
  },
  Unfavorable: {
    en: "Unfavorable",
    hi: "प्रतिकूल",
    te: "ప్రతికూలం",
    ta: "சாதகமற்றது",
    mr: "प्रतिकूल",
    bn: "প্রতিকূল",
    ml: "പ്രതികൂലം"
  }
};

export function getLocalizedStatus(status: string, lang: LanguageCode): string {
  const entry = STATUS_TRANSLATIONS[status];
  if (entry && entry[lang]) return entry[lang];
  return status;
}

// ==========================================
// 4. GOVERNMENT BULLETIN & AQI TRANSLATIONS
// ==========================================
export const ALERT_LEVEL_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  Green: {
    en: "Green Alert (Normal)",
    hi: "हरा अलर्ट (सामान्य)",
    te: "గ్రీన్ అలర్ట్ (సాధారణం)",
    ta: "பச்சை எச்சரிக்கை (இயல்பு)",
    mr: "ग्रीन अलर्ट (सामान्य)",
    bn: "গ্রিন অ্যালার্ট (স্বাভাবিক)",
    ml: "ഗ്രീൻ അലേർട്ട് (സാധാരണം)"
  },
  Yellow: {
    en: "Yellow Alert (Be Aware)",
    hi: "पीला अलर्ट (सतर्क रहें)",
    te: "పసుపు అలర్ట్ (అప్రమత్తంగా ఉండండి)",
    ta: "மஞ்சள் எச்சரிக்கை (கவனமுடன் இருங்கள்)",
    mr: "यलो अलर्ट (सतर्क राहा)",
    bn: "হলুদ অ্যালার্ট (সতর্ক থাকুন)",
    ml: "യെല്ലോ അലേർട്ട് (ജാഗ്രത പാലിക്കുക)"
  },
  Orange: {
    en: "Orange Alert (Be Prepared)",
    hi: "नारंगी अलर्ट (तैयार रहें)",
    te: "ఆరెంజ్ అలర్ట్ (సిద్ధంగా ఉండండి)",
    ta: "ஆரஞ்சு எச்சரிக்கை (தயாராக இருங்கள்)",
    mr: "ऑरेंज अलर्ट (तयार राहा)",
    bn: "কমলা অ্যালার্ট (প্রস্তুত থাকুন)",
    ml: "ഓറഞ്ച് അലേർട്ട് (തയ്യാറെടുക്കുക)"
  },
  Red: {
    en: "Red Alert (Take Action)",
    hi: "रेड अलर्ट (सख्त चेतावनी)",
    te: "రెడ్ అలర్ట్ (తీవ్ర హెచ్చరిక)",
    ta: "சிவப்பு எச்சரிக்கை (அவசர நிலை)",
    mr: "रेड अलर्ट (गंभीर इशारा)",
    bn: "রেড অ্যালার্ট (জরুরি সতর্কবার্তা)",
    ml: "റെഡ് അലേർട്ട് (തീവ്ര മുന്നറിയിപ്പ്)"
  }
};

export function getLocalizedAlertLevel(level: string, lang: LanguageCode): string {
  const entry = ALERT_LEVEL_TRANSLATIONS[level];
  if (entry && entry[lang]) return entry[lang];
  return `${level} Alert`;
}

export const CPCB_CATEGORY_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  Good: {
    en: "Good",
    hi: "अच्छा",
    te: "మంచిది",
    ta: "நல்லது",
    mr: "उत्तम",
    bn: "ভালো",
    ml: "നല്ലത്"
  },
  Satisfactory: {
    en: "Satisfactory",
    hi: "संतोषजनक",
    te: "సంతృప్తికరం",
    ta: "திருப்திகரமானது",
    mr: "समाधानकारक",
    bn: "সন্তোষজনক",
    ml: "തൃപ്തികരം"
  },
  Moderate: {
    en: "Moderate",
    hi: "मध्यम",
    te: "మోస్తరు",
    ta: "மிதமானது",
    mr: "मध्यम",
    bn: "মাঝারি",
    ml: "മിതമായത്"
  },
  Poor: {
    en: "Poor",
    hi: "खराब",
    te: "అధ్వాన్నం",
    ta: "மோசம்",
    mr: "खराब",
    bn: "খারাপ",
    ml: "മോശം"
  },
  "Very Poor": {
    en: "Very Poor",
    hi: "बहुत खराब",
    te: "చాలా అధ్వాన్నం",
    ta: "மிகவும் மோசம்",
    mr: "अत्यंत खराब",
    bn: "খুব খারাপ",
    ml: "വളരെ മോശം"
  },
  Severe: {
    en: "Severe",
    hi: "गंभीर",
    te: "అత్యంత తీవ్రం",
    ta: "மிகக் கொடியது",
    mr: "अत्यंत गंभीर",
    bn: "মারাত্মক",
    ml: "ഗുരുതരം"
  }
};

export function getLocalizedCpcbCategory(category: string, lang: LanguageCode): string {
  const entry = CPCB_CATEGORY_TRANSLATIONS[category];
  if (entry && entry[lang]) return entry[lang];
  return category;
}

// ==========================================
// 5. LOCALIZED DATE, TIME & NUMBER FORMATTING
// ==========================================
export const LOCALE_MAP: Record<LanguageCode, string> = {
  en: "en-IN",
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
  mr: "mr-IN",
  bn: "bn-IN",
  ml: "ml-IN"
};

export function formatLocalizedWeekday(
  dateInput: string | number | Date,
  lang: LanguageCode,
  isToday: boolean = false
): string {
  if (isToday) {
    return translations[lang]?.today || "Today";
  }
  try {
    const d = new Date(dateInput);
    return d.toLocaleDateString(LOCALE_MAP[lang] || "en-IN", { weekday: "short" });
  } catch {
    return "";
  }
}

export function formatLocalizedDate(
  dateInput: string | number | Date,
  lang: LanguageCode
): string {
  try {
    const d = new Date(dateInput);
    return d.toLocaleDateString(LOCALE_MAP[lang] || "en-IN", {
      month: "short",
      day: "numeric"
    });
  } catch {
    return "";
  }
}

export function formatLocalizedTime(
  dateInput: string | number | Date,
  lang: LanguageCode
): string {
  try {
    const d = new Date(dateInput);
    return d.toLocaleTimeString(LOCALE_MAP[lang] || "en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return "";
  }
}

export function formatLocalizedNumber(
  num: number,
  lang: LanguageCode,
  options?: Intl.NumberFormatOptions
): string {
  try {
    return new Intl.NumberFormat(LOCALE_MAP[lang] || "en-IN", options).format(num);
  } catch {
    return num.toString();
  }
}

