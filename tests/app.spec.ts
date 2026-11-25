import { test, expect, Page } from '@playwright/test';

const API = '**/api/nowplaying/ethnafrika';
const STREAM = '**/listen/ethnafrika/radio.mp3*';
const CORS = { 'access-control-allow-origin': '*' };

const song = (id: string, title: string, artist: string) => ({
  id, text: `${artist} - ${title}`, artist, title, album: '', genre: 'Afrobeat', lyrics: '',
  art: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', custom_fields: [],
});

const payload = {
  station: {}, live: {}, is_online: true, cache: 'hit',
  listeners: { total: 3, unique: 3, current: 3 },
  now_playing: {
    sh_id: 1, played_at: 0, duration: 200, playlist: 'p', streamer: '', is_request: false,
    elapsed: 50, remaining: 150, song: song('s1', 'Test Title', 'Test Artist'),
  },
  playing_next: {
    sh_id: 2, played_at: 0, duration: 180, playlist: 'p', streamer: '', is_request: false,
    song: song('s2', 'Next Title', 'Next Artist'),
  },
  song_history: [
    { sh_id: 3, played_at: 1700000000, duration: 150, playlist: 'p', streamer: '', is_request: false, song: song('s0', 'Old Title', 'Old Artist') },
  ],
};

// 1 second of 8 kHz mono silence (valid WAV).
function silentWav(): Buffer {
  const rate = 8000;
  const n = rate;
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + n, 4); h.write('WAVEfmt ', 8);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate, 28); h.writeUInt16LE(1, 32); h.writeUInt16LE(8, 34);
  h.write('data', 36); h.writeUInt32LE(n, 40);
  return Buffer.concat([h, Buffer.alloc(n, 128)]);
}

async function mockApi(page: Page, status = 200) {
  await page.route(API, r =>
    status === 200
      ? r.fulfill({ json: payload, headers: CORS })
      : r.fulfill({ status, body: 'err', headers: CORS }),
  );
  await page.route(STREAM, r => r.fulfill({ body: silentWav(), contentType: 'audio/wav', headers: CORS }));
}

const likeButton = (page: Page) => page.getByRole('button', { name: /like this track|aimer ce titre/i }).first();

test('shows now playing, next and history from the API', async ({ page }) => {
  await mockApi(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Test Title');
  await expect(page.getByText('Test Artist').first()).toBeVisible();
  await expect(page.getByText('Next Title')).toBeVisible();
  await expect(page.getByText('Old Title')).toBeVisible();
});

test('shows an alert when the API fails', async ({ page }) => {
  await mockApi(page, 500);
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('HTTP 500');
});

test('progress stays within the track duration', async ({ page }) => {
  await mockApi(page);
  await page.goto('/');
  const bar = page.getByRole('progressbar');
  await expect(bar).toHaveAttribute('aria-valuemax', '200');
  const now = Number(await bar.getAttribute('aria-valuenow'));
  expect(now).toBeGreaterThanOrEqual(50);
  expect(now).toBeLessThanOrEqual(200);
});

test('like toggles and persists', async ({ page }) => {
  await mockApi(page);
  await page.goto('/');
  await likeButton(page).click();
  await expect(likeButton(page)).toHaveAttribute('aria-pressed', 'true');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ethnafrika_liked_songs') || '{}'));
  expect(Object.keys(stored)).toContain('s1');
  await page.reload();
  await expect(likeButton(page)).toHaveAttribute('aria-pressed', 'true');
});

test('theme toggle persists', async ({ page }) => {
  await mockApi(page);
  await page.goto('/');
  await page.getByRole('button', { name: /switch to light theme/i }).click();
  await expect(page.locator('.app')).toHaveClass(/theme-light/);
  await page.reload();
  await expect(page.locator('.app')).toHaveClass(/theme-light/);
});

test('language switch translates the UI and sets html lang', async ({ page }) => {
  await mockApi(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'FR' }).click();
  await expect(page.getByText(/À l.antenne/)).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
});

test('play button reflects real playback state and releases the stream on pause', async ({ page }) => {
  await mockApi(page);
  await page.goto('/');
  const play = page.locator('.ctl.play');
  await expect(play).toHaveAttribute('aria-pressed', 'false');
  await play.click();
  await expect(play).toHaveAttribute('aria-pressed', 'true');
  await play.click();
  await expect(play).toHaveAttribute('aria-pressed', 'false');
  expect(await page.evaluate(() => document.querySelector('audio')!.hasAttribute('src'))).toBe(false);
});

test('service worker caches the shell and the app loads offline, without caching the stream', async ({ page, context }) => {
  await mockApi(page);
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  // Reload once so the page is controlled and runtime assets are cached.
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);

  const cached = await page.evaluate(async () => {
    const keys = await caches.keys();
    const urls: string[] = [];
    for (const k of keys) for (const r of await (await caches.open(k)).keys()) urls.push(new URL(r.url).pathname);
    return urls;
  });
  expect(cached).toContain('/images/logo.png');
  expect(cached.some(u => u.startsWith('/assets/'))).toBe(true);
  expect(cached.some(u => u.includes('radio.mp3') || u.includes('nowplaying'))).toBe(false);

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('.hero')).toBeVisible();
  await expect(page.locator('.sidebar .brand-logo')).toBeVisible();
  await context.setOffline(false);
});

test('local images are used (no third-party image host)', async ({ page }) => {
  const external: string[] = [];
  page.on('request', r => { if (r.url().includes('i.ibb.co')) external.push(r.url()); });
  await mockApi(page);
  await page.goto('/');
  await expect(page.locator('.brand-logo')).toBeVisible();
  expect(external).toEqual([]);
});

test('mobile layout renders the hero without the desktop sidebar', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mockApi(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Test Title');
  await expect(page.locator('.sidebar')).toHaveCount(0);
});
