import React, { useState, useEffect, useRef } from 'react';
import { AzuracastNowPlayingResponse } from './types';
import {
  AZURACAST_API_URL,
  STREAM_URL,
  LIKED_SONGS_KEY,
  THEME_KEY,
  TWENTY_FOUR_HOURS_IN_MS,
  API_POLL_INTERVAL_MS,
  STREAM_RECONNECT_MAX_ATTEMPTS,
  STREAM_RECONNECT_BASE_DELAY_MS,
} from './constants';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import History from './components/History';
import UpNext from './components/UpNext';
import { IconFacebook, IconInstagram, IconTwitter, IconYoutube, IconSun, IconMoon, IconCast } from './components/Icons';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 960);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

const App: React.FC = () => {
  const [nowPlayingData, setNowPlayingData] = useState<AzuracastNowPlayingResponse | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [likedSongs, setLikedSongs] = useState<{[key: string]: number}>({});
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [apiError, setApiError] = useState<string | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
const [volume, setVolume] = useState(1);
const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);
const [sinkId, setSinkId] = useState<string>('');
const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
const isMobile = useIsMobile();

// Network quality and buffering monitoring
const [bufferingHealth, setBufferingHealth] = useState(100); // 0-100 scale
const [networkQuality, setNetworkQuality] = useState<'GOOD' | 'MODERATE' | 'POOR' | 'RECOVERING'>('GOOD');
const [waitingEventCount, setWaitingEventCount] = useState(0);
const [lastWaitingEventTime, setLastWaitingEventTime] = useState(0);
const [isBuffering, setIsBuffering] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const isPlayingRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);

  // Load liked songs and theme
  useEffect(() => {
    try {
      const storedLiked = localStorage.getItem(LIKED_SONGS_KEY);
      if (storedLiked) {
        const parsed = JSON.parse(storedLiked);
        const now = Date.now();
        const cleaned: {[key: string]: number} = {};
        Object.keys(parsed).forEach(id => {
          if (now - parsed[id] < TWENTY_FOUR_HOURS_IN_MS) cleaned[id] = parsed[id];
        });
        setLikedSongs(cleaned);
      }

      const storedTheme = localStorage.getItem(THEME_KEY);
      if (storedTheme === "light" || storedTheme === "dark") {
        setTheme(storedTheme);
      }
      
      // Load last selected audio output device
      const storedDeviceId = localStorage.getItem('ethnafrika_selected_device');
      if (storedDeviceId) {
        setSelectedDeviceId(storedDeviceId);
        // Try to apply it if we have audio output devices
        if (audioOutputDevices.length > 0) {
          const device = audioOutputDevices.find(d => d.deviceId === storedDeviceId);
          if (device && audioRef.current) {
            audioRef.current.setSinkId(device.deviceId).then(() => {
              setSinkId(device.deviceId);
            }).catch(err => {
              console.warn('Could not apply stored device:', err);
            });
          }
        }
      }
    } catch {
      // localStorage unavailable (private browsing restriction etc.) — use defaults
    }
  }, []);

  // Apply volume to the audio element whenever it changes (and once it mounts)
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Enumerate audio output devices for casting
  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const audioOutputs = devices.filter(d => d.kind === 'audiooutput');
        setAudioOutputDevices(audioOutputs);
        
        // Try to apply the stored device if we have one
        if (selectedDeviceId && audioOutputs.length > 0) {
          const device = audioOutputs.find(d => d.deviceId === selectedDeviceId);
          if (device && audioRef.current) {
            audioRef.current.setSinkId(device.deviceId).then(() => {
              setSinkId(device.deviceId);
            }).catch(err => {
              console.warn('Could not apply stored device:', err);
            });
          }
        }
      })
      .catch(err => {
        console.warn('Could not enumerate media devices:', err);
      });
  }, [selectedDeviceId]); // Re-run when selected device changes

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // ignore storage errors
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(AZURACAST_API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: AzuracastNowPlayingResponse = await res.json();
        setNowPlayingData(data);
        setApiError(null);
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Connection error');
      }
    };
    fetchData();
    const interval = setInterval(fetchData, API_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Sync elapsed time
  useEffect(() => {
    if (!nowPlayingData) return;
    setElapsed(nowPlayingData.now_playing.elapsed);
  }, [nowPlayingData?.now_playing.song.id, nowPlayingData?.now_playing.elapsed]);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [isPlaying]);

  const setupAudioContext = () => {
    if (audioContextRef.current || !audioRef.current) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const context = new AudioCtx();
    const analyser = context.createAnalyser();
    const source = context.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(context.destination);
    audioContextRef.current = context;
    analyserRef.current = analyser;
  };

  const reconnect = () => {
    if (!audioRef.current) return;
    const wasPlaying = isPlayingRef.current;
    audioRef.current.src = `${STREAM_URL}?t=${Date.now()}`;
    audioRef.current.load();
    if (wasPlaying) {
      audioRef.current.play().catch(() => {});
    }
  };

  // Enhanced reconnect with adaptive strategy based on network quality
  const reconnectWithStrategy = () => {
    if (!audioRef.current) return;
    const wasPlaying = isPlayingRef.current;
    
    // Get reconnect strategy based on current network quality
    let strategy = RECONNECT_STRATEGIES.GOOD; // Default
    switch (networkQuality) {
      case 'POOR':
        strategy = RECONNECT_STRATEGIES.POOR;
        break;
      case 'MODERATE':
        strategy = RECONNECT_STRATEGIES.MODERATE;
        break;
      case 'RECOVERING':
        strategy = RECONNECT_STRATEGIES.RECOVERING;
        break;
      default:
        strategy = RECONNECT_STRATEGIES.GOOD;
    }
    
    // Use exponential backoff with the strategy's base delay
    const delay = strategy.baseDelay * Math.pow(2, Math.min(reconnectAttemptsRef.current, 6));
    
    // Cap the delay at a reasonable maximum (e.g., 30 seconds)
    const cappedDelay = Math.min(delay, 30000);
    
    // Only attempt reconnect if we haven't exceeded max attempts for this strategy
    if (reconnectAttemptsRef.current < strategy.maxAttempts) {
      setTimeout(() => {
        audioRef.current.src = `${STREAM_URL}?t=${Date.now()}`;
        audioRef.current.load();
        if (wasPlaying) {
          audioRef.current.play().catch(() => {});
        }
      }, cappedDelay);
      
      reconnectAttemptsRef.current += 1;
    } else {
      // Max attempts reached, set error and stop trying
      setStreamError('Unable to reconnect to the stream after multiple attempts');
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (!audioContextRef.current) setupAudioContext();
    if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();

    if (audioRef.current.paused) {
      // Reset reconnect attempts when starting playback
      reconnectAttemptsRef.current = 0;
      setStreamError(null);
      audioRef.current.src = `${STREAM_URL}?t=${Date.now()}`;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => { isPlayingRef.current = true; setIsPlaying(true); })
        .catch(() => {});
    } else {
      audioRef.current.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
  };

  // Handle audio element error for reconnect, with adaptive strategy based on network quality
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleError = () => {
      if (!isPlayingRef.current) return;
      reconnectWithStrategy();
    };
    const handlePlaying = () => {
      reconnectAttemptsRef.current = 0;
      setStreamError(null);
    };
    audio.addEventListener('error', handleError);
    audio.addEventListener('playing', handlePlaying);
    return () => {
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, [networkQuality]); // Re-run effect when network quality changes

  // Buffering monitoring and network quality detection
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const checkBufferingHealth = () => {
      try {
        // Calculate buffering health based on time spent waiting vs playing
        const now = Date.now();
        
        // Reset waiting event count if it's been more than 10 seconds
        if (now - lastWaitingEventTime > 10000) {
          setWaitingEventCount(0);
        }

        // Determine network quality based on waiting event frequency
        if (waitingEventCount >= WAITING_EVENT_THRESHOLD) {
          setNetworkQuality('POOR');
        } else if (waitingEventCount > 0) {
          setNetworkQuality('MODERATE');
        } else {
          // If we were recovering and now have no waiting events, go to GOOD
          if (networkQuality === 'RECOVERING') {
            setNetworkQuality('GOOD');
          } else if (networkQuality !== 'GOOD') {
            setNetworkQuality('RECOVERING');
          }
        }

        // Calculate buffering health percentage (inverse of waiting events)
        const health = Math.max(0, 100 - (waitingEventCount * 20));
        setBufferingHealth(health);

        // Update isBuffering state based on waiting events
        setIsBuffering(waitingEventCount > 0);
      } catch (err) {
        console.error('Error checking buffering health:', err);
      }
    };

    const interval = setInterval(checkBufferingHealth, BUFFERING_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [waitingEventCount, lastWaitingEventTime, networkQuality]);

  // Handle waiting events (buffering)
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const handleWaiting = () => {
      const now = Date.now();
      setWaitingEventCount(prev => prev + 1);
      setLastWaitingEventTime(now);
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      // When playback starts, we might be recovering
      setNetworkQuality('RECOVERING');
    };

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    
    return () => {
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, []);

  const toggleLike = (id: string | number) => {
    const sid = String(id);
    setLikedSongs(prev => {
      const next = { ...prev };
      if (next[sid]) delete next[sid];
      else next[sid] = Date.now();
      try {
        localStorage.setItem(LIKED_SONGS_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const handleCast = () => {
    if (audioOutputDevices.length === 0) {
      alert('No audio output devices found');
      return;
    }
    
    // Create options for the prompt
    const options = audioOutputDevices.map((d, i) => {
      const isSelected = d.deviceId === selectedDeviceId;
      return `${i}: ${d.label || `Audio Output ${i+1}`}${isSelected ? ' (selected)' : ''}`;
    }).join('\n');
    
    const choice = prompt(`Select output device:\n${options}\nEnter number (current selection: ${selectedDeviceId ? audioOutputDevices.findIndex(d => d.deviceId === selectedDeviceId) : 'none'}):`);
    const idx = parseInt(choice ?? '', 10);
    
    if (!isNaN(idx) && audioOutputDevices[idx]) {
      const deviceId = audioOutputDevices[idx].deviceId;
      if (audioRef.current) {
        audioRef.current.setSinkId(deviceId).then(() => {
          setSinkId(deviceId);
          setSelectedDeviceId(deviceId);
          // Save to localStorage
          try {
            localStorage.setItem('ethnafrika_selected_device', deviceId);
          } catch (e) {
            console.warn('Could not save selected device to localStorage:', e);
          }
        }).catch(err => {
          console.error('Failed to set sink ID:', err);
          alert('Failed to set audio output');
        });
      }
    }
  };

  const isSongLiked = (id: string | number) => !!likedSongs[String(id)];

  const now = nowPlayingData?.now_playing;
  const history = nowPlayingData?.song_history?.slice(0, 6) || [];
  const next = nowPlayingData?.playing_next;
  const listeners = nowPlayingData?.listeners.current || 0;

  const rootCls = `app ${theme === "light" ? "theme-light" : ""} ${isMobile ? "is-mobile" : "is-desktop"}`;

  return (
    <div className={rootCls}>
      <audio ref={audioRef} crossOrigin="anonymous" />
      {isMobile ? (
        <main className="mobile">
          <header className="mobile-header">
            <img src="https://i.ibb.co/YBntfXQm/logo-digital-K-2.png" alt="EthnAfrika" className="mobile-logo" />
            <div className="mobile-header-actions">
              <div className="lang-switch">
                <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
                <button className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>FR</button>
              </div>
              <button className="icon-btn" onClick={toggleTheme} aria-label="toggle theme">
                {theme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
              </button>
            </div>
          </header>
          {apiError && (
            <div className="api-error" role="alert">
              {lang === "fr" ? "Erreur de connexion au serveur" : "Unable to reach station"} — {apiError}
            </div>
          )}
          {streamError && (
            <div className="api-error" role="alert">
              {lang === "fr" ? "Flux audio indisponible, réessayez la lecture" : "Stream unavailable, try pressing play again"}
            </div>
          )}
            <Hero
              playing={isPlaying}
              setPlaying={togglePlay}
              elapsed={elapsed}
              liked={now ? isSongLiked(now.song.id) : false}
              toggleLike={() => now && toggleLike(now.song.id)}
              lang={lang}
              nowPlaying={now}
              analyser={analyserRef.current}
              volume={volume}
              setVolume={setVolume}
              onCast={handleCast}
              networkQuality={networkQuality}
            />
          <UpNext lang={lang} next={next} />
          <History lang={lang} history={history} isSongLiked={isSongLiked} toggleLike={toggleLike} />

          <footer className="footer-strip mobile-footer-only">
            <div className="qr">
              <div className="qr-box">
                <img src="https://i.ibb.co/1fZZDz24/radio-ethnafrika-qr-design-CLEAN.png" alt="QR Code EthnAfrika" loading="lazy" />
              </div>
              <div className="qr-text">
                <strong>{lang === "fr" ? "Scanner pour écouter" : "Scan to listen"}</strong>
                <span>{lang === "fr" ? "EthnAfrika sur votre mobile" : "EthnAfrika on your mobile"}</span>
              </div>
            </div>
            <div className="socials">
              <a href="https://facebook.com/ethnafrika" aria-label="facebook" target="_blank" rel="noopener noreferrer"><IconFacebook /></a>
              <a href="https://instagram.com/ethnafrika" aria-label="instagram" target="_blank" rel="noopener noreferrer"><IconInstagram /></a>
              <a href="https://twitter.com/ethnafrika" aria-label="twitter" target="_blank" rel="noopener noreferrer"><IconTwitter /></a>
              <a href="https://youtube.com/@ethnafrika" aria-label="youtube" target="_blank" rel="noopener noreferrer"><IconYoutube /></a>
            </div>
          </footer>

          <div className="sidebar-copy mobile-footer-only">
            <div>EthnAfrika.org</div>
            <div>{lang === "fr" ? "Le son de l'Afrique, partout" : "The Sound of Africa, Worldwide"}</div>
            <div className="sidebar-copy-mark">© {new Date().getFullYear()} EthnAfrika.org<br/>{lang === "fr" ? "Tous droits réservés" : "All rights reserved"}</div>
          </div>
        </main>
      ) : (
        <div className="shell">
          <Sidebar lang={lang} listeners={listeners} />
          <main className="main">
            <TopBar lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} networkQuality={networkQuality} />
            {apiError && (
              <div className="api-error" role="alert">
                {lang === "fr" ? "Erreur de connexion au serveur" : "Unable to reach station"} — {apiError}
              </div>
            )}
            {streamError && (
              <div className="api-error" role="alert">
                {lang === "fr" ? "Flux audio indisponible, réessayez la lecture" : "Stream unavailable, try pressing play again"}
              </div>
            )}
              <Hero
                playing={isPlaying}
                setPlaying={togglePlay}
                elapsed={elapsed}
                liked={now ? isSongLiked(now.song.id) : false}
                toggleLike={() => now && toggleLike(now.song.id)}
                lang={lang}
                nowPlaying={now}
                analyser={analyserRef.current}
                volume={volume}
                setVolume={setVolume}
                onCast={handleCast}
                networkQuality={networkQuality}
              />
            <div className="columns" style={{ marginTop: 28 }}>
              <History lang={lang} history={history} isSongLiked={isSongLiked} toggleLike={toggleLike} />
              <UpNext lang={lang} next={next} />
            </div>
          </main>
        </div>
      )}
    </div>
  );

  // Handle audio device changes (plug/unplug events)
  useEffect(() => {
    if (!navigator.mediaDevices?.addEventListener) return;
    
    const handleDeviceChange = async () => {
      try {
        // Re-enumerate devices when there's a change
        if (navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const audioOutputs = devices.filter(d => d.kind === 'audiooutput');
          setAudioOutputDevices(audioOutputs);
          
          // If the currently selected device is no longer available, clear selection
          if (selectedDeviceId && !audioOutputs.some(d => d.deviceId === selectedDeviceId)) {
            setSelectedDeviceId('');
            setSinkId('');
            // Remove from localStorage
            try {
              localStorage.removeItem('ethnafrika_selected_device');
            } catch (e) {
              console.warn('Could not remove selected device from localStorage:', e);
            }
          }
        }
      } catch (err) {
        console.error('Error handling device change:', err);
      }
    };
    
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [selectedDeviceId]);

}

export default App;
