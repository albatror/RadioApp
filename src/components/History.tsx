import React from 'react';
import { SongHistory } from '../types';
import { Lang, makeT } from '../i18n';
import { IconHeart } from './Icons';

interface HistoryProps {
  lang: Lang;
  history: SongHistory[];
  isSongLiked: (id: string | number) => boolean;
  toggleLike: (id: string | number) => void;
}

const History: React.FC<HistoryProps> = ({ lang, history, isSongLiked, toggleLike }) => {
  const t = makeT(lang);
  return (
    <div className="history-card">
      <div className="section-head" style={{ margin: "0 0 14px" }}>
        <div>
          <h2>{t("Recently played", "Récemment joués")}</h2>
          <div className="sub">{t("Last tracks from the live stream", "Derniers titres du flux live")}</div>
        </div>
      </div>
      {history.map((item, i) => {
        const s = item.song;
        const liked = isSongLiked(s.id);
        return (
          <div className="history-row" key={item.sh_id || s.id + i}>
            <div className="num">{String(i + 1).padStart(2, "0")}</div>
            <img className="art" src={s.art} alt="" loading="lazy" width={44} height={44} />
            <div className="meta">
              <div className="title">{s.title}</div>
              <div className="artist">{s.artist}</div>
            </div>
            <div className="genre-chip">{s.genre || "Afro"}</div>
            <div className="time">{new Date(item.played_at * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            <button
              className={"like-mini" + (liked ? " liked" : "")}
              onClick={() => toggleLike(s.id)}
              aria-pressed={liked}
              aria-label={t("Like this track", "Aimer ce titre")}
            >
              <IconHeart />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(History);
