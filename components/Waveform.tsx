import React, { useState, useEffect, useRef, useMemo } from 'react';

const BAR_COUNT = 120; // Moins de barres pour plus de fluidité

interface WaveformProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

export const Waveform: React.FC<WaveformProps> = ({ analyser, isPlaying }) => {
  const [dataArray, setDataArray] = useState<Uint8Array>(new Uint8Array(0));
  const animationFrameId = useRef<number | null>(null);
  const previousHeights = useRef<number[]>(Array(BAR_COUNT).fill(0));
  const [glowColor, setGlowColor] = useState({ r: 255, g: 140, b: 0 });
  const [fadeFactor, setFadeFactor] = useState(1);

  // Forme statique pour l’état “pause”
  const staticWave = useMemo(
    () => Array.from({ length: BAR_COUNT }, () => Math.random() * 0.2 + 0.05),
    []
  );

  useEffect(() => {
    if (!analyser || !isPlaying) {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      return;
    }

    analyser.fftSize = 1024;
    const bufferLength = analyser.frequencyBinCount;
    const ampData = new Uint8Array(bufferLength);
    setDataArray(ampData);

    const draw = () => {
      animationFrameId.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(ampData);

      // Ignorer les hautes fréquences pour lisser le rendu visuel
      const cutoff = Math.floor(bufferLength * 0.8); // garder 80% bass/mid
      const filtered = ampData.slice(0, cutoff);

      setDataArray(new Uint8Array(filtered));

      const bass = filtered.slice(0, cutoff / 4);
      const mids = filtered.slice(cutoff / 4, cutoff / 2);
      const highs = filtered.slice(cutoff / 2);

      const bassAvg = bass.reduce((a, b) => a + b, 0) / bass.length / 255;
      const midsAvg = mids.reduce((a, b) => a + b, 0) / mids.length / 255;
      const highsAvg = highs.reduce((a, b) => a + b, 0) / highs.length / 255;

      // Dégradé “soleil rouge-orange”
      const r = Math.min(255 * (0.8 * bassAvg + 0.3 * midsAvg), 255);
      const g = Math.min(200 * midsAvg + 60 * highsAvg, 255);
      const b = Math.min(70 * highsAvg, 255);

      setGlowColor({ r, g, b });
    };

    draw();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [analyser, isPlaying]);

  // Gestion du fondu progressif à l’arrêt
  useEffect(() => {
    if (!isPlaying) {
      let fade = 1;
      const fadeOut = () => {
        fade -= 0.05;
        if (fade <= 0) return;
        setFadeFactor(fade);
        requestAnimationFrame(fadeOut);
      };
      fadeOut();
    } else {
      setFadeFactor(1);
    }
  }, [isPlaying]);

  // Calcul des barres
  const barHeights = useMemo(() => {
    if (!isPlaying || !dataArray.length)
      return staticWave.map(h => h * fadeFactor);

    const bars: number[] = [];
    const dataPerBar = dataArray.length / BAR_COUNT;

    for (let i = 0; i < BAR_COUNT; i++) {
      const start = Math.floor(i * dataPerBar);
      const end = Math.floor((i + 1) * dataPerBar);
      const slice = dataArray.slice(start, end);
      const avg = slice.reduce((sum, val) => sum + val, 0) / (slice.length || 1);
      const height = Math.pow(avg / 255, 1.5) * 0.95 + 0.05;
      const smoothed = Math.max(height, previousHeights.current[i] * 0.8);

      bars.push(smoothed * fadeFactor);
      previousHeights.current[i] = smoothed;
    }

    return bars;
  }, [dataArray, isPlaying, staticWave, fadeFactor]);

  return (
    <div className="w-full h-32 flex items-end justify-center gap-[0.5px] px-4 -mt-16 rounded-xl">
      {barHeights.map((height, index) => (
        <div
          key={index}
          className="transition-all duration-75 ease-out rounded-t-full"
          style={{
            width: `calc(100% / ${BAR_COUNT} - 0.5px)`,
            height: `${height * 100}%`,
            background: `linear-gradient(to top,
              rgba(${glowColor.r}, ${glowColor.g}, ${glowColor.b}, 0.7),
              rgba(${glowColor.r}, ${glowColor.g}, ${glowColor.b}, 1))`,
            boxShadow: `
              0 0 ${8 + height * 20}px rgba(${glowColor.r}, ${glowColor.g}, ${glowColor.b}, ${0.5 + height * 0.5}),
              0 0 ${12 + height * 30}px rgba(${glowColor.r}, ${glowColor.g}, ${glowColor.b}, ${0.3 + height * 0.4})
            `,
          }}
        />
      ))}
    </div>
  );
};
