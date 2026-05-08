import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  playing: boolean;
  analyser: AnalyserNode | null;
}

const BARS = 48;

const Visualizer: React.FC<VisualizerProps> = ({ playing, analyser }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const phasesRef = useRef<number[] | null>(null);
  const envRef = useRef<number[] | null>(null);

  if (!phasesRef.current) {
    phasesRef.current = Array.from({ length: BARS }, (_, i) => Math.random() * Math.PI * 2 + i * 0.13);
    envRef.current = Array.from({ length: BARS }, (_, i) => {
      const x = (i / BARS) * 2 - 1;
      return Math.exp(-Math.pow(x * 1.5, 2)) * 0.6 + 0.4;
    });
  }

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    let last = 0;
    let visible = true;
    let onScreen = true;
    const FPS = 24;
    const FRAME = 1000 / FPS;

    const onVis = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);

    const phases = phasesRef.current!;
    const envs = envRef.current!;
    const bars = barsRef.current;

    if (!playing) {
      for (let i = 0; i < BARS; i++) {
        if (bars[i]) bars[i]!.style.height = `${10 + envs[i] * 8}%`;
      }
      return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
    }

    const dataArray = new Uint8Array(analyser ? analyser.frequencyBinCount : 0);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || !onScreen) return;
      if (now - last < FRAME) return;
      last = now;

      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        const step = Math.floor(dataArray.length / BARS);
        for (let i = 0; i < BARS; i++) {
          const v = dataArray[i * step] / 255.0;
          const h = Math.max(6, v * 100);
          if (bars[i]) bars[i]!.style.height = h + "%";
        }
      } else {
        const t = now / 600;
        for (let i = 0; i < BARS; i++) {
          const ph = phases[i];
          const v = (0.55 + 0.45 * Math.abs(Math.sin(t + ph) * 0.7 + Math.sin(t * 1.7 + ph * 1.3) * 0.3)) * envs[i];
          const h = Math.max(6, v * 100);
          if (bars[i]) bars[i]!.style.height = h + "%";
        }
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
    <div ref={rootRef} className={"visualizer" + (playing ? "" : " paused")}>
      {Array.from({ length: BARS }).map((_, i) => (
        <div key={i} ref={(el) => (barsRef.current[i] = el)} className="bar" style={{ height: "20%" }} />
      ))}
    </div>
  );
};

export default Visualizer;
