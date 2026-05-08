import React, { useState, useEffect, useRef } from 'react';
import { AzuracastNowPlayingResponse } from './types';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import History from './components/History';
import UpNext from './components/UpNext';

const AZURACAST_API_URL = 'https://ethnafrika.org/api/nowplaying/ethnafrika';
const STREAM_URL = 'https://ethnafrika.org/listen/ethnafrika/radio.mp3';
const LIKED_SONGS_KEY = 'ethnafrika_liked_songs';
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
  const isMobile = useIsMobile();
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Load liked songs
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LIKED_SONGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        const cleaned: {[key: string]: number} = {};
        Object.keys(parsed).forEach(id => {
          if (now - parsed[id] < TWENTY_FOUR_HOURS_IN_MS) cleaned[id] = parsed[id];
        });
        setLikedSongs(cleaned);
      }
    } catch (e) {}
  }, []);

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
  }, [nowPlayingData?.now_playing.song.id]);

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
    console.log("Attempting to reconnect to stream...");
    const wasPlaying = isPlaying;
    audioRef.current.src = `${STREAM_URL}?t=${Date.now()}`;
    audioRef.current.load();
    if (wasPlaying) {
      audioRef.current.play().catch(e => console.error("Error playing after reconnect:", e));
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (!audioContextRef.current) setupAudioContext();
    if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();

    if (audioRef.current.paused) {
      audioRef.current.src = `${STREAM_URL}?t=${Date.now()}`;
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle audio element events for better stability
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = (e: any) => {
      console.error("Audio element error:", e);
      if (isPlaying) {
        setTimeout(reconnect, 2000); // Try to reconnect after 2 seconds
      }
    };

    const handleStalled = () => {
      console.warn("Audio stream stalled");
    };

    const handleWaiting = () => {
      console.log("Audio stream waiting for data...");
    };

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

  const rootCls = "app " + (isMobile ? " is-mobile" : " is-desktop");

  return (
    <div className={rootCls}>
      <audio ref={audioRef} crossOrigin="anonymous" />
      {isMobile ? (
        <main className="mobile">
          <header className="mobile-header">
            <img src="https://i.ibb.co/YBntfXQm/logo-digital-K-2.png" alt="EthnAfrika" className="mobile-logo" />
            <div className="lang-switch">
              <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
              <button className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>FR</button>
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
        </main>
      ) : (
        <div className="shell">
          <Sidebar lang={lang} listeners={listeners} />
          <main className="main">
            <TopBar lang={lang} setLang={setLang} />
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
