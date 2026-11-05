import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "mosam.AI - Don’t just see the weather. Understand it.",
  description:
    "Production-ready atmospheric intelligence platform with official IMD and CPCB bulletins, Agromet spray advisories, Google Maps Doppler radar, and conversational AI.",
  keywords: [
    "mosam.AI",
    "weather intelligence",
    "IMD weather bulletin",
    "CPCB NAQI",
    "Agromet spray safety",
    "atmospheric radar",
    "multilingual weather AI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col relative selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
