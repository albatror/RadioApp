import { useCallback, useEffect, useState } from 'react';
import { LIKED_SONGS_KEY, TWENTY_FOUR_HOURS_IN_MS } from '../constants';

type Liked = Record<string, number>;

function load(): Liked {
  try {
    const raw = localStorage.getItem(LIKED_SONGS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    const now = Date.now();
    const cleaned: Liked = {};
    for (const [id, ts] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof ts === 'number' && now - ts < TWENTY_FOUR_HOURS_IN_MS) cleaned[id] = ts;
    }
    return cleaned;
  } catch {
    return {};
  }
}

/** Liked songs, persisted in localStorage with a 24h TTL (deliberate UX choice, see CONTEXT.md). */
export function useLikedSongs() {
  const [liked, setLiked] = useState<Liked>(load);

  // Persist (also writes back the TTL-cleaned state on first run).
  useEffect(() => {
    try {
      localStorage.setItem(LIKED_SONGS_KEY, JSON.stringify(liked));
    } catch {
      // storage unavailable — ignore
    }
  }, [liked]);

  // Keep several tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LIKED_SONGS_KEY) setLiked(load());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleLike = useCallback((id: string | number) => {
    const sid = String(id);
    setLiked(prev => {
      const next = { ...prev };
      if (next[sid]) delete next[sid];
      else next[sid] = Date.now();
      return next;
    });
  }, []);

  const isSongLiked = useCallback((id: string | number) => !!liked[String(id)], [liked]);

  return { isSongLiked, toggleLike };
}
