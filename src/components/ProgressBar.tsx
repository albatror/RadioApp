import React, { useEffect, useState } from 'react';
import { fmtTime, progressPct } from '../utils';

interface ProgressBarProps {
  /** Elapsed seconds reported by the server at `receivedAt`. */
  baseElapsed: number;
  receivedAt: number;
  duration: number;
}

/** Owns the 1s tick so only this small subtree re-renders every second. */
const ProgressBar: React.FC<ProgressBarProps> = ({ baseElapsed, receivedAt, duration }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const raw = baseElapsed + (Date.now() - receivedAt) / 1000;
  const elapsed = duration > 0 ? Math.min(raw, duration) : raw;

  return (
    <div className="progress">
      <span className="time">{fmtTime(elapsed)}</span>
      <div
        className="track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(elapsed)}
        aria-label="Track progress"
      >
        <div className="fill" style={{ width: `${progressPct(elapsed, duration)}%` }} />
      </div>
      <span className="time">{fmtTime(duration)}</span>
    </div>
  );
};

export default React.memo(ProgressBar);
