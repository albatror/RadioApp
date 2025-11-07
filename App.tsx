import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { NowPlaying } from './components/NowPlaying';
import { SongList } from './components/SongList';
import { Footer } from './components/Footer';
import { Waveform } from './components/Waveform';
import { ClockIcon } from './components/icons/ClockIcon';
import { AzuracastNowPlayingResponse, Song } from './types';

const AZURACAST_API_URL = 'https://ethnafrika.org/api/nowplaying/ethnafrika';
const STREAM_URL = 'https://ethnafrika.org/listen/ethnafrika/radio.mp3';

// Key for local storage
const LIKED_SONGS_KEY = 'ethnafrika_liked_songs';
const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;
const HISTORY_SONG_COUNT = 5;

// Type for liked songs storage
type LikedSongs = {
  [songId: string]: number; // songId: timestamp
};

const App: React.FC = () => {
  const [nowPlayingData, setNowPlayingData] = useState<AzuracastNowPlayingResponse | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [likedSongs, setLikedSongs] = useState<LikedSongs>({});
  
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
        Object.keys(parsedLikes).forEach(songId => {
          if (now - parsedLikes[songId] > TWENTY_FOUR_HOURS_IN_MS) {
            delete parsedLikes[songId];
          }
        });
        setLikedSongs(parsedLikes);
        localStorage.setItem(LIKED_SONGS_KEY, JSON.stringify(parsedLikes));
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
      } catch (error) {
        console.error("Failed to fetch Azuracast data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const setupAudioContext = () => {
    if (audioContextRef.current || !audioRef.current) return;
    
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = context.createAnalyser();
    const source = context.createMediaElementSource(audioRef.current);

    source.connect(analyser);
    analyser.connect(context.destination);

    audioContextRef.current = context;
    analyserRef.current = analyser;
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
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const isSongLiked = (songId: string | number): boolean => {
    const id = String(songId);
    if (!likedSongs[id]) return false;
    const isExpired = Date.now() - likedSongs[id] > TWENTY_FOUR_HOURS_IN_MS;
    return !isExpired;
  };

  const handleLikeSong = (songId: string | number) => {
    const id = String(songId);
    setLikedSongs(prevLikes => {
      const newLikes = { ...prevLikes, [id]: Date.now() };
      try {
        localStorage.setItem(LIKED_SONGS_KEY, JSON.stringify(newLikes));
      } catch (error) {
        console.error("Failed to save liked songs to local storage:", error);
      }
      return newLikes;
    });
  };

  const currentSongInfo = nowPlayingData?.now_playing;
  const previouslyPlayedSongs: Song[] = nowPlayingData?.song_history.map(item => ({
    id: item.song.id,
    title: item.song.title,
    artist: item.song.artist,
    albumArtUrl: item.song.art,
  })).slice(0, HISTORY_SONG_COUNT) ?? [];

  const comingUpNextSong: Song | null = nowPlayingData?.playing_next ? {
    id: nowPlayingData.playing_next.song.id,
    title: nowPlayingData.playing_next.song.title,
    artist: nowPlayingData.playing_next.song.artist,
    albumArtUrl: nowPlayingData.playing_next.song.art,
  } : null;

  return (
    <div className="bg-zinc-900 min-h-screen text-white font-sans overflow-hidden">
      <audio ref={audioRef} src={STREAM_URL} crossOrigin="anonymous" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
          {currentSongInfo ? (
            <NowPlaying 
              songInfo={currentSongInfo} 
              listeners={nowPlayingData?.listeners.current ?? 0}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              isLiked={isSongLiked(currentSongInfo.song.id)}
              onLike={() => handleLikeSong(currentSongInfo.song.id)}
            />
          ) : (
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 md:p-8 flex items-center justify-center min-h-[256px]">
              <p className="text-zinc-400">Loading player...</p>
            </div>
          )}
          
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SongList 
                title="Previously Played" 
                songs={previouslyPlayedSongs}
                icon={<ClockIcon className="w-6 h-6 mr-3" />}
                isSongLiked={isSongLiked}
                onLikeSong={handleLikeSong}
              />
            </div>
<div>
  <SongList 
    title="Coming Up Next" 
    songs={comingUpNextSong ? [comingUpNextSong] : []}
    />
</div>
          </div>
        </main>
        
        <Waveform analyser={analyserRef.current} isPlaying={isPlaying} />
        <Footer />
      </div>
    </div>
  );
}

export default App;
