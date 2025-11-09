import React from 'react';
import { Song } from '../types';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';

const QR_CODE_URL = 'https://i.ibb.co/QvZnZVhC/Radio-App-QRCode.png';

interface SongListProps {
  title: string;
  songs: Song[];
  icon?: React.ReactNode;
  isSongLiked?: (songId: string | number) => boolean;
  onLikeSong?: (songId: string | number) => void;
}

const SongListItem: React.FC<{
  song: Song;
  isLiked: boolean;
  onLike: () => void;
  canBeLiked: boolean;
}> = ({ song, isLiked, onLike, canBeLiked }) => {
  const likeButtonClasses = isLiked
    ? "text-green-400 cursor-not-allowed"
    : "text-zinc-500 hover:text-white";

  return (
    <div className="flex flex-col py-3 group">
      <div className="flex items-center justify-between min-w-0">
        <div className="flex items-center min-w-0">
          <img
            src={song.albumArtUrl}
            alt={song.title}
            className="w-12 h-12 object-cover rounded-md flex-shrink-0"
          />
          <div className="ml-4 min-w-0">
            <p className="text-white font-semibold truncate">{song.title}</p>
            <p className="text-zinc-400 text-sm truncate">{song.artist}</p>
          </div>
        </div>

        {canBeLiked && (
          <button
            onClick={onLike}
            disabled={isLiked}
            className={`ml-4 p-2 rounded-full transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 ${likeButtonClasses}`}
            aria-label={isLiked ? "You've liked this song" : "Like this song"}
          >
            <ThumbsUpIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export const SongList: React.FC<SongListProps> = ({
  title,
  songs,
  icon,
  isSongLiked,
  onLikeSong,
}) => {
  const canBeLiked = !!(isSongLiked && onLikeSong);
  const showQRCode = title === 'Coming Up Next';

  return (
    <div className="relative bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 h-full overflow-hidden">
      <h3 className="text-yellow-400 font-bold flex items-center text-lg">
        {icon}
        {title}
      </h3>

      <div className="mt-4 space-y-3">
        {songs.map((song, index) => (
          <React.Fragment key={song.id}>
            <SongListItem
              song={song}
              isLiked={canBeLiked ? isSongLiked(song.id) : false}
              onLike={() => canBeLiked && onLikeSong(song.id)}
              canBeLiked={canBeLiked}
            />
            {index < songs.length - 1 && <hr className="border-zinc-700" />}
          </React.Fragment>
        ))}

        {songs.length === 0 && title === 'Previously Played' && (
          <p className="text-zinc-500">Song history is not available yet.</p>
        )}
        {songs.length === 0 && title === 'Coming Up Next' && (
          <p className="text-zinc-500">Next song information is not available.</p>
        )}
      </div>

      {/* QR code positionné plus bas et centré */}
      {showQRCode && (
        <div className="absolute left-1/2 bottom-6 transform -translate-x-1/2">
          <img
            src={QR_CODE_URL}
            alt="QR Code"
            className="w-60 h-60 object-contain rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};
