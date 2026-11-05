import { LocationItem } from "@/store/useWeatherStore";

export function exportSynopticCsv(weatherData: any, location: LocationItem) {
  if (!weatherData) return;

  const lines: string[] = [];

  // Header metadata
  lines.push(`"MOSAM.AI SYNOPTIC METEOROLOGICAL REPORT"`);
  lines.push(`"Station","${location.name} (${location.formattedAddress})"`);
  lines.push(`"Coordinates","Lat ${location.latitude.toFixed(4)}, Lon ${location.longitude.toFixed(4)}"`);
  lines.push(`"Generated At","${new Date().toISOString()}"`);
  lines.push(`"Ensemble Consensus","${weatherData.confidence?.score || 90}% (${weatherData.confidence?.level || 'High'})"`);
  lines.push(`"IMD Alert Tier","${weatherData.governmentBulletin?.imdAlert?.alertLevel || 'Green'}"`);
  lines.push(`"CPCB Air Quality","AQI ${weatherData.governmentBulletin?.cpcbNaqi?.index || 65} (${weatherData.governmentBulletin?.cpcbNaqi?.category || 'Satisfactory'})"`);
  lines.push("");

  // Retrospective 72-Hour Section
  lines.push(`"--- 72-HOUR RETROSPECTIVE SYNOPTIC OBSERVATIONS ---"`);
  lines.push(`"Parameter","Observed Value","Atmospheric Implication"`);
  lines.push(`"24h Thermal Anomaly","${weatherData.retrospective?.tempDelta24h || 0} °C","${(weatherData.retrospective?.tempDelta24h || 0) > 0 ? 'Warming Trend' : 'Cooling Trend'}"`);
  lines.push(`"Past 72h Rain Accumulation","${weatherData.retrospective?.rainAccumulationPast72h || 0} mm","Soil Moisture Inundation"`);
  lines.push(`"Barometric Pressure Tendency","${weatherData.retrospective?.pressureTendency || 'Steady'}","Synoptic Stability Indicator"`);
  lines.push("");

  // Daily Forecast Section
  lines.push(`"--- 7-DAY SYNOPTIC OUTLOOK (ECMWF & GFS BLEND) ---"`);
  lines.push(`"Date","Weather Description","Max Temp (°C)","Min Temp (°C)","Precipitation Prob (%)","Rain Sum (mm)","Max Wind (km/h)","Max UV Index"`);

  const daily = weatherData.daily || [];
  for (const d of daily) {
    lines.push(
      `"${d.date}","${d.weatherDescription}","${d.tempMax}","${d.tempMin}","${d.precipitationProbability}","${d.precipitationSum}","${d.windSpeedMax}","${d.uvIndexMax}"`
    );
  }

  // Generate CSV Blob and Trigger Download
  const csvContent = lines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const filename = `mosam_synoptic_${location.name.toLowerCase().replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printSynopticReport(weatherData: any, location: LocationItem) {
  if (!weatherData) return;
  window.print();
}
