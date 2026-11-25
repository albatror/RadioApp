export function fmtTime(s: number): string {
  const safe = Number.isFinite(s) && s > 0 ? s : 0;
  const m = Math.floor(safe / 60);
  const ss = Math.floor(safe % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}

/** Percentage (0-100) of progress, clamped. */
export function progressPct(elapsed: number, duration: number): number {
  if (!duration || duration <= 0) return 0;
  return Math.max(0, Math.min(100, (elapsed / duration) * 100));
}

/** Safe CSS url() value for untrusted URLs. */
export function cssUrl(u: string | undefined): string {
  if (!u) return 'none';
  return `url("${encodeURI(u).replace(/"/g, '%22').replace(/\(/g, '%28').replace(/\)/g, '%29')}")`;
}

/** Share via the Web Share API, falling back to the clipboard. */
export async function shareText(text: string, url: string): Promise<'shared' | 'copied' | 'failed'> {
  try {
    if (navigator.share) {
      await navigator.share({ text, url });
      return 'shared';
    }
    await navigator.clipboard.writeText(text + ' ' + url);
    return 'copied';
  } catch {
    return 'failed';
  }
}
