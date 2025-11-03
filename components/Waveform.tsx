import React, { useState, useEffect, useRef, useMemo } from 'react';

const BAR_COUNT = 80;

interface WaveformProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

export const Waveform: React.FC<WaveformProps> = ({ analyser, isPlaying }) => {
  const [dataArray, setDataArray] = useState<Uint8Array>(new Uint8Array(0));
  // FIX: Initialize useRef with null and update the type to `number | null`.
  // The call `useRef<number>()` is invalid because it specifies a type that doesn't
  // include `undefined` but provides no initial value.
  const animationFrameId = useRef<number | null>(null);

  const staticWave = useMemo(() => {
    return Array.from({ length: BAR_COUNT }, () => Math.random() * 0.4 + 0.1);
  }, []);

  useEffect(() => {
    if (!analyser || !isPlaying) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    analyser.fftSize = 256;
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
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [analyser, isPlaying]);

  const barHeights = useMemo(() => {
    if (!isPlaying || !dataArray.length) {
      return staticWave;
    }

    const bars = [];
    const step = Math.floor(dataArray.length / BAR_COUNT);
    for (let i = 0; i < BAR_COUNT; i++) {
      const slice = dataArray.slice(i * step, (i + 1) * step);
      const avg = slice.reduce((sum, val) => sum + val, 0) / (slice.length || 1);
      const height = (avg / 255) * 0.9 + 0.1; 
      bars.push(Math.min(height, 1.0));
    }
    return bars;
  }, [dataArray, isPlaying, staticWave]);

  return (
    <div className="w-full h-24 flex items-end justify-center gap-[2px] px-4 -mt-12">
      {barHeights.map((height, index) => (
        <div
          key={index}
          className="bg-yellow-600/30 rounded-t-sm transition-height duration-75 ease-out"
          style={{ 
            width: `calc(100% / ${BAR_COUNT})`,
            height: `${height * 100}%`,
            maxHeight: '80px'
          }}
        />
      ))}
    </div>
  );
};
