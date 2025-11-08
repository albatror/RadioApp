import React, { useState, useEffect, useRef, useMemo } from 'react';

const BAR_COUNT = 150;

interface WaveformProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

export const Waveform: React.FC<WaveformProps> = ({ analyser, isPlaying }) => {
  const [dataArray, setDataArray] = useState<Uint8Array>(new Uint8Array(0));
  const animationFrameId = useRef<number | null>(null);
  const previousHeights = useRef<number[]>(Array(BAR_COUNT).fill(0));
  const [glowColor, setGlowColor] = useState({ r: 0, g: 255, b: 255 }); // couleur glow dynamique

  const staticWave = useMemo(() => {
    return Array.from({ length: BAR_COUNT }, () => Math.random() * 0.2 + 0.05);
  }, []);

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
      setDataArray(new Uint8Array(ampData));

      // Couleur glow selon fréquence dominante
      const bass = ampData.slice(0, bufferLength / 4); // basses
      const mids = ampData.slice(bufferLength / 4, bufferLength / 2); // médiums
      const highs = ampData.slice(bufferLength / 2); // aigus

      const bassAvg = bass.reduce((a, b) => a + b, 0) / bass.length / 255;
      const midsAvg = mids.reduce((a, b) => a + b, 0) / mids.length / 255;
      const highsAvg = highs.reduce((a, b) => a + b, 0) / highs.length / 255;

      // R,G,B : bass -> bleu, mids -> violet, highs -> cyan
      const r = Math.min(138 * midsAvg + 0, 255);
      const g = Math.min(43 * highsAvg + 200 * bassAvg, 255);
      const b = Math.min(226 * highsAvg + 255 * bassAvg, 255);

      setGlowColor({ r, g, b });
    };

    draw();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [analyser, isPlaying]);

  const barHeights = useMemo(() => {
    if (!isPlaying || !dataArray.length) return staticWave;

    const bars = [];
    const step = Math.floor(dataArray.length / BAR_COUNT);
    for (let i = 0; i < BAR_COUNT; i++) {
      const slice = dataArray.slice(i * step, (i + 1) * step);
      const avg = slice.reduce((sum, val) => sum + val, 0) / (slice.length || 1);
      const height = Math.pow(avg / 255, 1.5) * 0.95 + 0.05;
      const smoothed = Math.max(height, previousHeights.current[i] * 0.8);
      bars.push(smoothed);
      previousHeights.current[i] = smoothed;
    }
    return bars;
  }, [dataArray, isPlaying, staticWave]);

  return (
    <div className="w-full h-32 flex items-end justify-center gap-[0.5px] px-4 -mt-16 bg-black/90 rounded-xl">
      {barHeights.map((height, index) => (
        <div
          key={index}
          className="transition-all duration-80 ease-out rounded-t-full"
          style={{
            width: `calc(100% / ${BAR_COUNT} - 0.5px)`,
            height: `${height * 100}%`,
            maxHeight: '100px',
            background: `linear-gradient(to top, rgba(${glowColor.r},${glowColor.g},${glowColor.b},0.7), rgba(${glowColor.r},${glowColor.g},${glowColor.b},1))`,
            boxShadow: `0 0 ${10 + height * 20}px rgba(${glowColor.r},${glowColor.g},${glowColor.b},${0.5 + height * 0.5}),
                        0 0 ${15 + height * 30}px rgba(${glowColor.r},${glowColor.g},${glowColor.b},${0.3 + height * 0.4})`,
          }}
        />
      ))}
    </div>
  );
};
