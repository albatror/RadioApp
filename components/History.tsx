import React from 'react';
import { IconHeart } from './icons';
import { SongHistoryItem } from '../types';

interface HistoryProps {
  lang: string;
  likedSet: Set<string | number>;
  toggleHist: (id: string | number) => void;
  history: SongHistoryItem[];
}

export const History: React.FC<HistoryProps> = ({ lang, likedSet, toggleHist, history }) => {
  const t = (en: string, fr: string) => lang === "fr" ? fr : en;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="history-card">
      <div className="section-head" style={{ margin: "0 0 14px" }}>
        <div>
          <h2>{t("Recently played", "Récemment joués")}</h2>
          <div className="sub">{t("Last tracks from the live stream", "Derniers titres du flux live")}</div>
        </div>
        <a className="see-all" href="#">{t("See all", "Tout voir")} →</a>
      </div>
      {history.map((item, i) => {
        const s = item.song;
        const isLiked = likedSet.has(s.id);
        return (
          <div className="history-row" key={item.sh_id || i}>
            <div className="num">{String(i + 1).padStart(2, "0")}</div>
            <img className="art" src={s.art} alt="" />
            <div className="meta">
              <div className="title">{s.title}</div>
              <div className="artist">{s.artist}</div>
            </div>
            <div className="genre-chip">{s.genre || "Afro"}</div>
            <div className="time">{formatTime(item.played_at)}</div>
            <button className={"like-mini" + (isLiked ? " liked" : "")} onClick={() => toggleHist(s.id)} aria-label="like">
              <IconHeart />
            </button>
          </div>
        );
      })}
    </div>
  );
};
