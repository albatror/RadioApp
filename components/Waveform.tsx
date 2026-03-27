import React, { useState, useEffect, useRef } from "react";

interface WaveGlowProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  haloOff?: boolean;
}

export const WaveGlow: React.FC<WaveGlowProps> = ({ analyser, isPlaying, haloOff }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const light1Ref = useRef<HTMLDivElement>(null);
  const light2Ref = useRef<HTMLDivElement>(null);
  
  const light1 = useRef({ x: 40, y: 50, size: 120 });
  const light2 = useRef({ x: 60, y: 50, size: 90 });
  const animFrame = useRef<number>();

  useEffect(() => {
    if (haloOff || !analyser || !isPlaying) {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
      return;
    }

    analyser.fftSize = 512;
    const data = new Uint8Array(analyser.frequencyBinCount);

    const render = () => {
      animFrame.current = requestAnimationFrame(render);

      analyser.getByteFrequencyData(data);

      const bass = data.slice(0, 24);
      const mids = data.slice(24, 96);

      const bassAvg = bass.reduce((a, b) => a + b, 0) / bass.length / 255;
      const midsAvg = mids.reduce((a, b) => a + b, 0) / mids.length / 255;

      // Couleur globale (unifiée et légère)
      const r = 200 * bassAvg + 60;
      const g = 140 * midsAvg + 40;
      const b = 60 * midsAvg;

      // ⚡ Réaction aux basses : lumière 1
      light1.current.size = 120 + bassAvg * 180;

      // ⚡ Réaction aux médiums : lumière 2
      light2.current.size = 90 + midsAvg * 140;

      // Petit drift (mouvement subtil, presque gratuit)
      light1.current.x += (Math.random() - 0.5) * 0.15;
      light1.current.y += (Math.random() - 0.5) * 0.15;

      light2.current.x += (Math.random() - 0.5) * 0.12;
      light2.current.y += (Math.random() - 0.5) * 0.12;

      // Update DOM directly for performance
      if (containerRef.current) {
        containerRef.current.style.background = `radial-gradient(
          circle at 50% 60%,
          rgba(${r}, ${g}, ${b}, 0.25),
          rgba(${r}, ${g}, ${b}, 0.05) 70%
        )`;
      }

      if (light1Ref.current) {
        light1Ref.current.style.width = `${light1.current.size}px`;
        light1Ref.current.style.height = `${light1.current.size}px`;
        light1Ref.current.style.background = `rgba(${r}, ${g}, ${b}, 0.45)`;
        light1Ref.current.style.transform = `translate(${light1.current.x}%, ${light1.current.y}%)`;
      }

      if (light2Ref.current) {
        light2Ref.current.style.width = `${light2.current.size}px`;
        light2Ref.current.style.height = `${light2.current.size}px`;
        light2Ref.current.style.background = `rgba(${r}, ${g}, ${b}, 0.35)`;
        light2Ref.current.style.transform = `translate(${light2.current.x}%, ${light2.current.y}%)`;
      }
    };

    render();
    return () => {
        if (animFrame.current) cancelAnimationFrame(animFrame.current);
    }
  }, [analyser, isPlaying, haloOff]);

  // Désactive totalement le halo
  if (haloOff) return null;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "160px",
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        background: `radial-gradient(
          circle at 50% 60%,
          rgba(255, 120, 0, 0.25),
          rgba(255, 120, 0, 0.05) 70%
        )`,
        filter: "blur(2px)",
      }}
    >
      {/* Lumière 1 (BASS) */}
      <div
        ref={light1Ref}
        style={{
          position: "absolute",
          width: `120px`,
          height: `120px`,
          borderRadius: "50%",
          background: `rgba(255, 120, 0, 0.45)`,
          filter: "blur(60px)",
          transform: `translate(40%, 50%)`,
        }}
      />

      {/* Lumière 2 (MIDS) */}
      <div
        ref={light2Ref}
        style={{
          position: "absolute",
          width: `90px`,
          height: `90px`,
          borderRadius: "50%",
          background: `rgba(255, 120, 0, 0.35)`,
          filter: "blur(40px)",
          transform: `translate(60%, 50%)`,
        }}
      />
    </div>
  );
};
