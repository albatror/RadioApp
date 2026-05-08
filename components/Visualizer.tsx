import React, { useMemo, useEffect, useState, useRef } from 'react';

interface VisualizerProps {
  playing: boolean;
  paused: boolean;
  analyser?: AnalyserNode | null;
}

export const Visualizer: React.FC<VisualizerProps> = ({ playing, paused, analyser }) => {
  const BARS = 64;
  const containerRef = useRef<HTMLDivElement>(null);
  const phases = useMemo(() => Array.from({ length: BARS }, (_, i) => Math.random() * Math.PI * 2 + i * 0.13), []);

  useEffect(() => {
    let raf: number;

    const update = () => {
      if (!containerRef.current) return;
      const bars = containerRef.current.children;
      const t = performance.now() / 600;

      if (analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const step = Math.floor(bufferLength / BARS);
        for (let i = 0; i < BARS; i++) {
          let sum = 0;
          for (let j = 0; j < step; j++) {
            sum += dataArray[i * step + j];
          }
          const v = sum / step / 255;
          (bars[i] as HTMLElement).style.height = `${Math.max(6, v * 100)}%`;
        }
      } else {
        // Fallback animation
        for (let i = 0; i < BARS; i++) {
          const ph = phases[i];
          const x = (i / BARS) * 2 - 1;
          const env = Math.exp(-Math.pow(x * 1.5, 2)) * 0.6 + 0.4;
          const v = playing
            ? (0.55 + 0.45 * Math.abs(Math.sin(t + ph) * 0.7 + Math.sin(t * 1.7 + ph * 1.3) * 0.3)) * env
            : 0.18 + 0.05 * Math.sin(ph + t * 0.05);
          (bars[i] as HTMLElement).style.height = `${Math.max(6, v * 100)}%`;
        }
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [playing, analyser, phases]);

  return (
    <div ref={containerRef} className={"visualizer" + (paused ? " paused" : "")}>
      {phases.map((_, i) => (
        <div key={i} className="bar" style={{ height: '6%' }} />
      ))}
    </div>
  );
};
