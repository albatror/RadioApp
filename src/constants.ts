export const AZURACAST_API_URL = 'https://ethnafrika.org/api/nowplaying/ethnafrika';
export const STREAM_URL = 'https://ethnafrika.org/listen/ethnafrika/radio.mp3';
export const LIKED_SONGS_KEY = 'ethnafrika_liked_songs';
export const THEME_KEY = 'ethnafrika_theme';
export const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;
export const API_POLL_INTERVAL_MS = 10_000;
export const STREAM_RECONNECT_MAX_ATTEMPTS = 5;
export const STREAM_RECONNECT_BASE_DELAY_MS = 2_000;

// Network quality detection constants
export const NETWORK_QUALITY_THRESHOLDS = {
  GOOD: 80,    // Buffering health score above this = good
  MODERATE: 50, // Between MODERATE and GOOD = moderate
  // Below MODERATE = poor
};

export const RECONNECT_STRATEGIES = {
  GOOD: { baseDelay: 1500, maxAttempts: 4 },    // Faster recovery when signal is good
  MODERATE: { baseDelay: 2500, maxAttempts: 6 }, // Balanced approach
  POOR: { baseDelay: 4000, maxAttempts: 10 },   // More patience for poor signals
  RECOVERING: { baseDelay: 3000, maxAttempts: 8 } // Transition state
};

export const BUFFERING_CHECK_INTERVAL = 3000; // Check every 3s
export const WAITING_EVENT_THRESHOLD = 3;     // 3 waiting events in 10s = poor signal
