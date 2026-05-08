import React from 'react';
import { NowPlaying } from '../types';
import { IconShare } from './Icons';

interface UpNextProps {
  lang: string;
  next: NowPlaying | undefined;
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}

const UpNext: React.FC<UpNextProps> = ({ lang, next }) => {
  const t = (en: string, fr: string) => lang === "fr" ? fr : en;
  if (!next) return null;
  return (
    <div className="next-card">
      <div className="section-head" style={{ margin: 0 }}>
        <div>
          <span className="eyebrow accent">{t("Coming up", "À suivre")}</span>
          <h2 style={{ marginTop: 4 }}>{t("Next on EthnAfrika", "Prochain titre")}</h2>
        </div>
      </div>
      <div className="next-art">
        <img src={next.song.art} alt={next.song.title} />
        {/* <div className="countdown">in 2:14</div> */}
      </div>
      <div className="next-info">
        <div className="title">{next.song.title}</div>
        <div className="artist">{next.song.artist}</div>
        <div className="meta-row">
          <span className="pill">{next.song.genre || "Afro"}</span>
          <span className="pill">{fmtTime(next.duration || 0)}</span>
          <button className="pill share-btn" style={{ borderColor: "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <IconShare size={11} /> {t("Share", "Partager")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpNext;
