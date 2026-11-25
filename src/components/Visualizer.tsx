import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  playing: boolean;
  analyser: AnalyserNode | null;
}

const BARS = 48;
const SILENT_FRAMES_BEFORE_FALLBACK = 48;

const PHASES = Array.from({ length: BARS }, (_, i) => Math.random() * Math.PI * 2 + i * 0.13);
const ENVS = Array.from({ length: BARS }, (_, i) => {
  const x = (i / BARS) * 2 - 1;
  return Math.exp(-Math.pow(x * 1.5, 2)) * 0.6 + 0.4;
});

const Visualizer: React.FC<VisualizerProps> = ({ playing, analyser }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const bars = barsRef.current;
    const setScale = (i: number, pct: number) => {
      const bar = bars[i];
      if (bar) bar.style.transform = `scaleY(${Math.max(0.04, Math.min(1, pct / 100))})`;
    };

    if (!playing) {
      for (let i = 0; i < BARS; i++) setScale(i, 10 + ENVS[i] * 8);
      return;
    }

    let raf = 0;
    let last = 0;
    let visible = !document.hidden;
    let onScreen = true;
    let silentFrames = 0;
    const FRAME = 1000 / 24;

    const onVis = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);

    const dataArray = new Uint8Array(analyser ? analyser.frequencyBinCount : 0);

    const drawFallback = (now: number) => {
      const t = now / 600;
      for (let i = 0; i < BARS; i++) {
        const ph = PHASES[i];
        const v = (0.4 + 0.6 * Math.abs(Math.sin(t + ph) * 0.6 + Math.sin(t * 1.7 + ph * 1.3) * 0.4)) * ENVS[i];
        setScale(i, Math.max(8, v * 100));
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || !onScreen || now - last < FRAME) return;
      last = now;

      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        const binCount = dataArray.length;
        let total = 0;
        for (let i = 0; i < binCount; i++) total += dataArray[i];
        // Analyser returns only zeros (e.g. tainted/muted source): fall back to the animation.
        silentFrames = total === 0 ? silentFrames + 1 : 0;
        if (silentFrames > SILENT_FRAMES_BEFORE_FALLBACK) {
          drawFallback(now);
          return;
        }

        const range = Math.max(1, Math.floor(binCount / BARS / 2));
        for (let i = 0; i < BARS; i++) {
          const index = Math.floor(Math.pow(i / BARS, 1.2) * binCount * 0.5);
          let sum = 0;
          let count = 0;
          for (let j = 0; j < range && index + j < binCount; j++) {
            sum += dataArray[index + j];
            count++;
          }
          const v = count ? sum / count / 255 : 0;
          setScale(i, Math.max(6, Math.min(100, Math.pow(v, 0.8) * 180)));
        }
      } else {
        drawFallback(now);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [playing, analyser]);

  return (
    <div ref={rootRef} className={"visualizer" + (playing ? "" : " paused")} aria-hidden="true">
      {Array.from({ length: BARS }).map((_, i) => (
        <div key={i} ref={(el) => { barsRef.current[i] = el; }} className="bar" />
      ))}
    </div>
  );
};

export default Visualizer;
