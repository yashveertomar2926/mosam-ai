"use client";

import React, { useEffect, useRef } from "react";
import { useWeatherStore } from "@/store/useWeatherStore";

interface AtmosphericCanvasProps {
  className?: string;
}

export const AtmosphericCanvas: React.FC<AtmosphericCanvasProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { weatherData } = useWeatherStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const weatherCode = weatherData?.current?.weatherCode ?? 0;

    // Detect weather category
    const isThunder = weatherCode >= 95;
    const isRain = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
    const isOvercast = weatherCode === 3 || weatherCode === 2 || weatherCode === 45 || weatherCode === 48;
    const isClear = weatherCode <= 1;

    // High-DPI Canvas Resizing
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Particles & VFX States
    // 1. Raindrops & Splashes (gentle silver-blue raindrops)
    const raindropCount = isThunder ? 160 : isRain ? 95 : 0;
    const raindrops: { x: number; y: number; length: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < raindropCount; i++) {
      raindrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 12 + Math.random() * 16,
        speed: 13 + Math.random() * 7,
        opacity: 0.25 + Math.random() * 0.35,
      });
    }

    const splashes: { x: number; y: number; radius: number; maxRadius: number; opacity: number }[] = [];

    // 2. Daytime Clouds (soft, sunlit translucent clouds)
    const cloudCount = isOvercast ? 7 : isThunder ? 8 : 4;
    const clouds: { x: number; y: number; radius: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < cloudCount; i++) {
      clouds.push({
        x: Math.random() * (width + 400) - 200,
        y: 35 + Math.random() * (height * 0.4),
        radius: 100 + Math.random() * 150,
        speed: 0.12 + Math.random() * 0.28,
        opacity: isThunder ? 0.35 + Math.random() * 0.2 : 0.2 + Math.random() * 0.2,
      });
    }

    // 3. Thunder Lightning
    let lightningFlash = 0;
    let nextLightning = 100 + Math.random() * 160;

    // 4. Sun Corona & Daylight Horizon
    let coronaAngle = 0;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Background Tone Overlay - Crisp Daytime Gradients
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      if (isThunder) {
        bgGradient.addColorStop(0, "#cbd5e1");
        bgGradient.addColorStop(1, "#e2e8f0");
      } else if (isRain) {
        bgGradient.addColorStop(0, "#e2e8f0");
        bgGradient.addColorStop(1, "#f0f9ff");
      } else if (isOvercast) {
        bgGradient.addColorStop(0, "#f1f5f9");
        bgGradient.addColorStop(1, "#e2e8f0");
      } else {
        // Bright clear daylight
        bgGradient.addColorStop(0, "#f8fafc");
        bgGradient.addColorStop(0.5, "#f0f9ff");
        bgGradient.addColorStop(1, "#e0f2fe");
      }
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // DAYLIGHT SUN CORONA (Clear & Mild conditions)
      if (isClear || (!isThunder && !isRain)) {
        coronaAngle += 0.0025;
        const sunX = width * 0.85;
        const sunY = height * 0.16;
        const sunRadius = 46;

        // Radiant Outer Glow
        const coronaGrad = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.5, sunX, sunY, sunRadius * 4);
        coronaGrad.addColorStop(0, "rgba(245, 158, 11, 0.28)");
        coronaGrad.addColorStop(0.5, "rgba(251, 191, 36, 0.12)");
        coronaGrad.addColorStop(1, "rgba(251, 191, 36, 0)");

        ctx.fillStyle = coronaGrad;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Shimmering Golden Solar Rays
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(coronaAngle);
        for (let r = 0; r < 8; r++) {
          ctx.rotate(Math.PI / 4);
          ctx.strokeStyle = "rgba(245, 158, 11, 0.12)";
          ctx.lineWidth = 12;
          ctx.beginPath();
          ctx.moveTo(sunRadius + 6, 0);
          ctx.lineTo(sunRadius + 70 + Math.sin(frame * 0.035 + r) * 10, 0);
          ctx.stroke();
        }
        ctx.restore();

        // Sun Orb Core
        const orbGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
        orbGrad.addColorStop(0, "#ffffff");
        orbGrad.addColorStop(0.4, "#fffbeb");
        orbGrad.addColorStop(0.8, "#fde047");
        orbGrad.addColorStop(1, "#f59e0b");
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // SUNLIT DAYTIME CLOUDS
      if (isOvercast || isThunder || isRain || clouds.length > 0) {
        for (const cloud of clouds) {
          cloud.x += cloud.speed;
          if (cloud.x - cloud.radius > width) {
            cloud.x = -cloud.radius * 1.5;
            cloud.y = 35 + Math.random() * (height * 0.4);
          }

          const cloudGrad = ctx.createRadialGradient(
            cloud.x,
            cloud.y,
            cloud.radius * 0.2,
            cloud.x,
            cloud.y,
            cloud.radius
          );
          const baseC = isThunder ? "148, 163, 184" : "226, 232, 240";
          cloudGrad.addColorStop(0, `rgba(${baseC}, ${cloud.opacity * 1.3})`);
          cloudGrad.addColorStop(0.7, `rgba(255, 255, 255, ${cloud.opacity * 0.8})`);
          cloudGrad.addColorStop(1, `rgba(${baseC}, 0)`);

          ctx.fillStyle = cloudGrad;
          ctx.beginPath();
          ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // THUNDER LIGHTNING FLASH (Daytime)
      if (isThunder) {
        nextLightning--;
        if (nextLightning <= 0) {
          lightningFlash = 1.0;
          nextLightning = 130 + Math.random() * 200;
        }

        if (lightningFlash > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${lightningFlash * 0.4})`;
          ctx.fillRect(0, 0, width, height);

          // Draw lightning bolt
          ctx.strokeStyle = `rgba(224, 242, 254, ${lightningFlash * 0.9})`;
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          let boltX = width * 0.3 + Math.random() * (width * 0.4);
          let boltY = 20;
          ctx.moveTo(boltX, boltY);
          while (boltY < height * 0.65) {
            boltX += (Math.random() - 0.5) * 36;
            boltY += 15 + Math.random() * 25;
            ctx.lineTo(boltX, boltY);
          }
          ctx.stroke();

          lightningFlash -= 0.07;
        }
      }

      // RAINDROPS & GROUND SPLASHES (Crisp Silver-Blue)
      if (isRain || isThunder) {
        const angle = 0.18; // Slight diagonal drift
        ctx.strokeStyle = "rgba(14, 165, 233, 0.4)";
        ctx.lineWidth = 1.3;

        for (const drop of raindrops) {
          drop.y += drop.speed;
          drop.x += drop.speed * angle;

          if (drop.y >= height - 25) {
            // Ground hit -> Create splash ripple
            splashes.push({
              x: drop.x,
              y: height - 15 - Math.random() * 20,
              radius: 1,
              maxRadius: 5 + Math.random() * 7,
              opacity: 0.5,
            });
            drop.y = -20;
            drop.x = Math.random() * width;
          }

          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + drop.length * angle, drop.y + drop.length);
          ctx.stroke();
        }

        // Render Ground Splash Ripples
        for (let i = splashes.length - 1; i >= 0; i--) {
          const splash = splashes[i];
          splash.radius += 0.4;
          splash.opacity -= 0.035;

          if (splash.opacity <= 0) {
            splashes.splice(i, 1);
            continue;
          }

          ctx.strokeStyle = `rgba(56, 189, 248, ${splash.opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(splash.x, splash.y, splash.radius * 2, splash.radius * 0.7, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weatherData]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 ${className}`}
      aria-hidden="true"
    />
  );
};
