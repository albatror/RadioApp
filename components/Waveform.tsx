import React, { useState, useEffect, useRef, useMemo } from 'react';

const BAR_COUNT = 120; // plus de barres pour une wave plus fine

interface WaveformProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

export const Waveform: React.FC<WaveformProps> = ({ analyser, isPlaying }) => {
  const [dataArray, setDataArray] = useState<Uint8Array>(new Uint8Array(0));
  const animationFrameId = useRef<number | null>(null);

  const staticWave = useMemo(() => {
    return Array.from({ length: BAR_COUNT }, () => Math.random() * 0.3 + 0.05);
  }, []);

  useEffect(() => {
    if (!analyser || !isPlaying) {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      return;
    }

    analyser.fftSize = 512; // plus de précision
    const bufferLength = analyser.frequencyBinCount;
    const ampData = new Uint8Array(bufferLength);
    setDataArray(ampData);

    const draw = () => {
      animationFrameId.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(ampData);
      setDataArray(new Uint8Array(ampData));
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
      const height = Math.pow(avg / 255, 1.5) * 0.9 + 0.05; // effet plus doux et dynamique
      bars.push(Math.min(height, 1.0));
    }
    return bars;
  }, [dataArray, isPlaying, staticWave]);

  return (
    <div className="w-full h-24 flex items-end justify-center gap-[1px] px-4 -mt-12">
      {barHeights.map((height, index) => (
        <div
          key={index}
          className="bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t-full transition-all duration-100 ease-out"
          style={{
            width: `calc(100% / ${BAR_COUNT} - 1px)`,
            height: `${height * 100}%`,
            maxHeight: '80px',
          }}
        />
      ))}
    </div>
  );
};
