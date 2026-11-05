const API_BASE = ""; // Next.js rewrite proxies /api to backend port 8000

export async function fetchWeatherData(lat: number, lon: number) {
  const res = await fetch(`${API_BASE}/api/weather?lat=${lat}&lon=${lon}`);
  if (!res.ok) {
    throw new Error(`Weather fetch failed: ${res.statusText}`);
  }
  return await res.json();
}

export async function searchGeocode(query: string) {
  const res = await fetch(`${API_BASE}/api/geocode?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error(`Geocoding failed: ${res.statusText}`);
  }
  const data = await res.json();
  return data.results || [];
}

export async function reverseGeocode(lat: number, lon: number) {
  const res = await fetch(`${API_BASE}/api/reverse-geocode?lat=${lat}&lon=${lon}`);
  if (!res.ok) {
    throw new Error(`Reverse geocoding failed: ${res.statusText}`);
  }
  return await res.json();
}

export async function sendChatMessage(
  message: string,
  location: any,
  weatherContext: any,
  language: string,
  history: any[] = []
) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      location,
      weatherContext,
      language,
      history,
    }),
  });

  if (!res.ok) {
    throw new Error(`Chat query failed: ${res.statusText}`);
  }
  return await res.json();
}
