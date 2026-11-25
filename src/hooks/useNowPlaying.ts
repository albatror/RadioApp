import { useEffect, useState } from 'react';
import { AzuracastNowPlayingResponse } from '../types';
import { AZURACAST_API_URL, API_POLL_INTERVAL_MS, API_TIMEOUT_MS } from '../constants';

function isValidResponse(d: unknown): d is AzuracastNowPlayingResponse {
  const r = d as Partial<AzuracastNowPlayingResponse> | null;
  return !!r && typeof r === 'object' && !!r.now_playing?.song && typeof r.now_playing.song.id === 'string';
}

export interface NowPlayingState {
  data: AzuracastNowPlayingResponse | null;
  /** Timestamp (ms) at which `data` was received — used to extrapolate elapsed time. */
  receivedAt: number;
  error: string | null;
}

export function useNowPlaying(): NowPlayingState {
  const [state, setState] = useState<NowPlayingState>({ data: null, receivedAt: 0, error: null });

  useEffect(() => {
    let cancelled = false;
    let ctrl: AbortController | null = null;

    const load = async () => {
      ctrl?.abort();
      const current = new AbortController();
      ctrl = current;
      const timeout = setTimeout(() => current.abort(), API_TIMEOUT_MS);
      try {
        const res = await fetch(AZURACAST_API_URL, { signal: current.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: unknown = await res.json();
        if (!isValidResponse(json)) throw new Error('Invalid response');
        if (!cancelled) setState({ data: json, receivedAt: Date.now(), error: null });
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof DOMException && err.name === 'AbortError'
            ? 'Timeout'
            : err instanceof Error
              ? err.message
              : 'Connection error';
        setState(prev => ({ ...prev, error: message }));
      } finally {
        clearTimeout(timeout);
      }
    };

    load();
    const interval = setInterval(() => {
      if (!document.hidden) load();
    }, API_POLL_INTERVAL_MS);
    const onVisible = () => {
      if (!document.hidden) load();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      ctrl?.abort();
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return state;
}
