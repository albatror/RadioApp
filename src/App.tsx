import React, { useState, useEffect, useRef } from 'react';
import { AzuracastNowPlayingResponse } from './types';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import History from './components/History';
import UpNext from './components/UpNext';
import { IconFacebook, IconInstagram, IconTwitter, IconYoutube } from './components/Icons';

const AZURACAST_API_URL = 'https://ethnafrika.org/api/nowplaying/ethnafrika';
const STREAM_URL = 'https://ethnafrika.org/listen/ethnafrika/radio.mp3';
const LIKED_SONGS_KEY = 'ethnafrika_liked_songs';
const THEME_KEY = 'ethnafrika_theme';
const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 760);
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
  const isMobile = useIsMobile();
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const isPlayingRef = useRef(false);

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
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(AZURACAST_API_URL);
        const data = await res.json();
        setNowPlayingData(data);
      } catch (e) {}
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
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

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (!audioContextRef.current) setupAudioContext();
    if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();

    if (audioRef.current.paused) {
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

  // Handle audio element events for better stability
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = () => {
      if (isPlayingRef.current) {
        setTimeout(reconnect, 2000);
      }
    };

    const handleStalled = () => {};
    const handleWaiting = () => {};

    audio.addEventListener('error', handleError);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('waiting', handleWaiting);

    return () => {
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('waiting', handleWaiting);
    };
  }, [isPlaying]);

  const toggleLike = (id: string | number) => {
    const sid = String(id);
    setLikedSongs(prev => {
      const next = { ...prev };
      if (next[sid]) delete next[sid];
      else next[sid] = Date.now();
      localStorage.setItem(LIKED_SONGS_KEY, JSON.stringify(next));
      return next;
    });
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
                {theme === "dark" ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </button>
            </div>
          </header>
          <Hero
            playing={isPlaying}
            setPlaying={togglePlay}
            elapsed={elapsed}
            liked={now ? isSongLiked(now.song.id) : false}
            toggleLike={() => now && toggleLike(now.song.id)}
            lang={lang}
            nowPlaying={now}
            analyser={analyserRef.current}
          />
          <UpNext lang={lang} next={next} />
          <History lang={lang} history={history} isSongLiked={isSongLiked} toggleLike={toggleLike} />

          <footer className="footer-strip mobile-footer-only">
            <div className="qr">
              <div className="qr-box">
                <img src="https://i.ibb.co/KjZ8CN4n/radio-ethnafrika-qr-design.png" alt="QR Code EthnAfrika" />
              </div>
              <div className="qr-text">
                <strong>{lang === "fr" ? "Scanner pour écouter" : "Scan to listen"}</strong>
                <span>{lang === "fr" ? "EthnAfrika sur votre mobile" : "EthnAfrika on your mobile"}</span>
              </div>
            </div>
            <div className="socials">
              <a href="#" aria-label="facebook" rel="noopener noreferrer"><IconFacebook /></a>
              <a href="#" aria-label="instagram" rel="noopener noreferrer"><IconInstagram /></a>
              <a href="#" aria-label="twitter" rel="noopener noreferrer"><IconTwitter /></a>
              <a href="#" aria-label="youtube" rel="noopener noreferrer"><IconYoutube /></a>
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
            <TopBar lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} />
            <Hero
              playing={isPlaying}
              setPlaying={togglePlay}
              elapsed={elapsed}
              liked={now ? isSongLiked(now.song.id) : false}
              toggleLike={() => now && toggleLike(now.song.id)}
              lang={lang}
              nowPlaying={now}
              analyser={analyserRef.current}
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
}

export default App;
