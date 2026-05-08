import React from 'react';
import { IconShare } from './icons';
import { SongHistoryItem } from '../types';

interface UpNextProps {
  lang: string;
  nextSong: SongHistoryItem | null;
}

const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
};

export const UpNext: React.FC<UpNextProps> = ({ lang, nextSong }) => {
  const t = (en: string, fr: string) => lang === "fr" ? fr : en;

  if (!nextSong) return null;

  return (
    <div className="next-card">
      <div className="section-head" style={{ margin: 0 }}>
        <div>
          <span className="eyebrow accent">{t("Coming up", "À suivre")}</span>
          <h2 style={{ marginTop: 4 }}>{t("Next on EthnAfrika", "Prochain titre")}</h2>
        </div>
      </div>
      <div className="next-art">
        <img src={nextSong.song.art} alt={nextSong.song.title} />
        {/* We don't have exact countdown but we could estimate if needed */}
        {/* <div className="countdown">in 2:14</div> */}
      </div>
      <div className="next-info">
        <div className="title">{nextSong.song.title}</div>
        <div className="artist">{nextSong.song.artist}</div>
        <div className="meta-row">
          <span className="pill">{nextSong.song.genre || "Afro"}</span>
          <span className="pill">{fmtTime(nextSong.duration)}</span>
          <button className="pill" style={{ borderColor: "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <IconShare size={11} /> {t("Share", "Partager")}
          </button>
        </div>
      </div>
    </div>
  );
};
