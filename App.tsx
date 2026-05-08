import React, { useState, useEffect, useRef } from 'react';
import { AzuracastNowPlayingResponse } from './types';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Hero } from './components/Hero';
import { History } from './components/History';
import { UpNext } from './components/UpNext';
import { Schedule } from './components/Schedule';
import { GenreTiles } from './components/GenreTiles';
import { FooterStrip } from './components/FooterStrip';

const AZURACAST_API_URL = 'https://ethnafrika.org/api/nowplaying/ethnafrika';
const STREAM_URL = 'https://ethnafrika.org/listen/ethnafrika/radio.mp3';

// Key for local storage
const LIKED_SONGS_KEY = 'ethnafrika_liked_songs';
const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

// Type for liked songs storage
type LikedSongs = {
  [songId: string]: number; // songId: timestamp
};

const TWEAK_DEFAULTS = {
  "palette": "terracotta",
  "coverShape": "square",
  "showSchedule": true,
  "showGenres": true,
  "showQR": true,
  "showVisualizer": true
};

const App: React.FC = () => {
  const [nowPlayingData, setNowPlayingData] = useState<AzuracastNowPlayingResponse | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [likedSongs, setLikedSongs] = useState<LikedSongs>({});
  const [activeTab, setActiveTab] = useState<string>("live");
  const [lang, setLang] = useState<string>("en");
  const [elapsed, setElapsed] = useState<number>(0);
  const [tweaks] = useState(TWEAK_DEFAULTS); // For now, static tweaks

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  
  // Load liked songs from local storage on initial render
  useEffect(() => {
    try {
      const storedLikes = localStorage.getItem(LIKED_SONGS_KEY);
      if (storedLikes) {
        const parsedLikes: LikedSongs = JSON.parse(storedLikes);
        // Clean up expired likes
        const now = Date.now();
        const updatedLikes = { ...parsedLikes };
        let hasChanges = false;
        Object.keys(updatedLikes).forEach(songId => {
          if (now - updatedLikes[songId] > TWENTY_FOUR_HOURS_IN_MS) {
            delete updatedLikes[songId];
            hasChanges = true;
          }
        });
        setLikedSongs(updatedLikes);
        if (hasChanges) {
          localStorage.setItem(LIKED_SONGS_KEY, JSON.stringify(updatedLikes));
        }
      }
    } catch (error) {
      console.error("Failed to load liked songs from local storage:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(AZURACAST_API_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: AzuracastNowPlayingResponse = await response.json();
        setNowPlayingData(data);

        // Sync elapsed time from API if it's the same song
        if (data.now_playing) {
            setElapsed(data.now_playing.elapsed);
        }
      } catch (error) {
        console.error("Failed to fetch Azuracast data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Smooth progress local timer
  useEffect(() => {
    if (!isPlaying || !nowPlayingData?.now_playing) return;

    const duration = nowPlayingData.now_playing.duration;
    const interval = setInterval(() => {
      setElapsed(prev => {
        if (prev < duration) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, nowPlayingData]);

  const setupAudioContext = () => {
    if (audioContextRef.current || !audioRef.current) return;
    
    try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        const source = context.createMediaElementSource(audioRef.current);

        source.connect(analyser);
        analyser.connect(context.destination);

        audioContextRef.current = context;
        analyserRef.current = analyser;
    } catch (e) {
        console.error("Failed to setup audio context:", e);
    }
  };

  const reconnect = () => {
    if (!audioRef.current) return;

    console.log("Attempting to reconnect to stream...");
    const wasPlaying = isPlaying;

    // Force reload the stream
    const currentSrc = STREAM_URL;
    audioRef.current.src = `${currentSrc}?t=${Date.now()}`;
    audioRef.current.load();

    if (wasPlaying) {
      audioRef.current.play().catch(e => console.error("Error playing after reconnect:", e));
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (!audioContextRef.current) {
      setupAudioContext();
    }
    
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (audioRef.current.paused) {
      const currentSrc = STREAM_URL;
      audioRef.current.src = `${currentSrc}?t=${Date.now()}`;
      audioRef.current.load();

      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = (e: any) => {
      console.error("Audio element error:", e);
      if (isPlaying) {
        setTimeout(reconnect, 2000);
      }
    };

    audio.addEventListener('error', handleError);
    return () => {
      audio.removeEventListener('error', handleError);
    };
  }, [isPlaying]);

  const isSongLiked = (songId: string | number): boolean => {
    return !!likedSongs[String(songId)];
  };

  const handleLikeSong = (songId: string | number) => {
    const id = String(songId);
    setLikedSongs(prevLikes => {
      const newLikes = { ...prevLikes };
      if (newLikes[id]) {
        delete newLikes[id];
      } else {
        newLikes[id] = Date.now();
      }
      try {
        localStorage.setItem(LIKED_SONGS_KEY, JSON.stringify(newLikes));
      } catch (error) {
        console.error("Failed to save liked songs to local storage:", error);
      }
      return newLikes;
    });
  };

  const paletteCls = "palette-" + tweaks.palette;
  const currentSong = nowPlayingData?.now_playing;
  const likedSet = new Set(Object.keys(likedSongs));

  return (
    <div className={"app " + (paletteCls === "palette-terracotta" ? "" : paletteCls)}>
      <audio ref={audioRef} src={STREAM_URL} crossOrigin="anonymous" />
      <div className="shell">
        <Sidebar
          active={activeTab}
          setActive={setActiveTab}
          listeners={nowPlayingData?.listeners.current ?? 0}
          lang={lang}
        />
        <main className="main">
          <TopBar lang={lang} setLang={setLang} />

          {currentSong ? (
            <Hero
              tweaks={tweaks}
              playing={isPlaying}
              onTogglePlay={togglePlay}
              elapsed={elapsed}
              liked={isSongLiked(currentSong.song.id)}
              toggleLike={() => handleLikeSong(currentSong.song.id)}
              lang={lang}
              songInfo={currentSong}
              analyser={analyserRef.current}
            />
          ) : (
            <div className="hero flex items-center justify-center min-h-[320px]">
                <p>Loading EthnAfrika...</p>
            </div>
          )}

          <div className="columns" style={{ marginTop: 28 }}>
            <History
              lang={lang}
              likedSet={likedSet}
              toggleHist={handleLikeSong}
              history={nowPlayingData?.song_history ?? []}
            />
            <UpNext lang={lang} nextSong={nowPlayingData?.playing_next ?? null} />
          </div>

          {tweaks.showSchedule && <Schedule lang={lang} />}
          {tweaks.showGenres && <GenreTiles lang={lang} />}
          {tweaks.showQR && <FooterStrip lang={lang} />}
        </main>
      </div>
    </div>
  );
}

export default App;
