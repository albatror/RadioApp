import React from 'react';
import { NowPlayingInfo } from '../types';
import { ListenersIcon } from './icons/ListenersIcon';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';

interface NowPlayingProps {
  songInfo: NowPlayingInfo;
  listeners: number;
  isPlaying: boolean;
  togglePlay: () => void;
  isLiked: boolean;
  onLike: () => void;
}

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const NowPlaying: React.FC<NowPlayingProps> = ({ songInfo, listeners, isPlaying, togglePlay, isLiked, onLike }) => {
  const { song, elapsed, duration } = songInfo;

  // For live streams, duration can be 0. Avoid division by zero.
  const progressPercentage = duration > 0 ? (elapsed / duration) * 100 : 0;
  
  const likeButtonClasses = isLiked
    ? "bg-green-500/20 text-green-400 cursor-not-allowed"
    : "bg-zinc-700/80 text-zinc-300 hover:bg-zinc-600";

  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6">
      <img 
        src={song.art} 
        alt={song.title} 
        className="w-40 h-40 object-cover rounded-lg shadow-lg flex-shrink-0"
      />
      <div className="w-full min-w-0 flex flex-col justify-center">
        <p className="text-yellow-400 text-xs font-bold tracking-widest">NOW PLAYING</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-1 truncate">{song.title}</h2>
        <p className="text-lg text-zinc-400 mt-1">{song.artist}</p>
        
        <div className="mt-4 w-full">
          <div className="relative h-1.5 bg-zinc-700 rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-yellow-400 rounded-full transition-all duration-1000 linear"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-zinc-400 mt-2">
            <span>{formatTime(elapsed)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center text-zinc-400 text-sm">
            <ListenersIcon className="w-5 h-5 mr-2" />
            <span>{listeners} Listener{listeners !== 1 ? 's' : ''}</span>
          </div>
          <button 
            onClick={togglePlay} 
            className="bg-yellow-400 text-black w-14 h-14 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors shadow-lg"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
          </button>
          <button
            onClick={onLike}
            disabled={isLiked}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${likeButtonClasses}`}
            aria-label={isLiked ? "You've liked this song" : "Like this song"}
          >
            <ThumbsUpIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
