import React, { useState, useEffect, useRef } from "react";

interface WaveGlowProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

export const Waveform: React.FC<WaveGlowProps> = ({ analyser, isPlaying }) => {
  const [glowColor, setGlowColor] = useState({ r: 255, g: 120, b: 0 });
  const light1 = useRef({ x: 40, y: 50, size: 120 });
  const light2 = useRef({ x: 60, y: 50, size: 90 });
  const animFrame = useRef<number>();

  useEffect(() => {
    if (!analyser || !isPlaying) {
      cancelAnimationFrame(animFrame.current!);
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
      setGlowColor({ r, g, b });

      // ⚡ Réaction aux basses : lumière 1
      light1.current.size = 120 + bassAvg * 180;

      // ⚡ Réaction aux médiums : lumière 2
      light2.current.size = 90 + midsAvg * 140;

      // Petit drift (mouvement subtil, presque gratuit)
      light1.current.x += (Math.random() - 0.5) * 0.15;
      light1.current.y += (Math.random() - 0.5) * 0.15;

      light2.current.x += (Math.random() - 0.5) * 0.12;
      light2.current.y += (Math.random() - 0.5) * 0.12;
    };

    render();
    return () => cancelAnimationFrame(animFrame.current!);
  }, [analyser, isPlaying]);

  return (
    <div
      style={{
        width: "100%",
        height: "160px",
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        background: `radial-gradient(
          circle at 50% 60%,
          rgba(${glowColor.r}, ${glowColor.g}, ${glowColor.b}, 0.25),
          rgba(${glowColor.r}, ${glowColor.g}, ${glowColor.b}, 0.05) 70%
        )`,
        filter: "blur(2px)",
      }}
    >
      {/* Lumière 1 (BASS) */}
      <div
        style={{
          position: "absolute",
          width: `${light1.current.size}px`,
          height: `${light1.current.size}px`,
          borderRadius: "50%",
          background: `rgba(${glowColor.r}, ${glowColor.g}, ${glowColor.b}, 0.45)`,
          filter: "blur(60px)",
          transform: `translate(${light1.current.x}%, ${light1.current.y}%)`,
        }}
      />

      {/* Lumière 2 (MIDS) */}
      <div
        style={{
          position: "absolute",
          width: `${light2.current.size}px`,
          height: `${light2.current.size}px`,
          borderRadius: "50%",
          background: `rgba(${glowColor.r}, ${glowColor.g}, ${glowColor.b}, 0.35)`,
          filter: "blur(40px)",
          transform: `translate(${light2.current.x}%, ${light2.current.y}%)`,
        }}
      />
    </div>
  );
};
