import React from 'react';
import { Song } from '../types';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';

const QR_CODE_WEB_URL = 'https://i.ibb.co/YFv9pmqM/QRCode-WEB-App.png';
const QR_CODE_ANDROID_URL = 'https://i.ibb.co/CsztGTt9/QRCode-ANDROID-Apk.png';
const ANDROID_DOWNLOAD_LINK = 'https://file.kiwi/a74dafc5#kcx1qA9mI93evXHAaOCPHQ';

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
    <div className="relative bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 h-full flex flex-col justify-between">
      {/* Titre */}
      <h3 className="text-yellow-400 font-bold flex items-center text-lg">
        {icon}
        {title}
      </h3>

      {/* Liste des chansons */}
      <div className="mt-4 space-y-3 overflow-y-auto">
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

      {/* QR codes positionnés en bas */}
      {showQRCode && (
        <div className="flex flex-col sm:flex-row justify-center items-center mt-auto gap-6">
          {/* QR Web App */}
          <div className="flex flex-col items-center">
            <img
              src={QR_CODE_WEB_URL}
              alt="QR Code Web App"
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg shadow-lg"
            />
            <span className="mt-2 text-zinc-300 text-sm text-center">Web App</span>
          </div>

          {/* QR Android APK avec lien de téléchargement */}
          <div className="flex flex-col items-center">
            <a
              href={ANDROID_DOWNLOAD_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={QR_CODE_ANDROID_URL}
                alt="QR Code Android APK"
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg shadow-lg cursor-pointer"
              />
            </a>
            <span className="mt-2 text-zinc-300 text-sm text-center">Android APK</span>
          </div>
        </div>
      )}
    </div>
  );
};
