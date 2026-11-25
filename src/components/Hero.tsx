import React from 'react';
import { NowPlaying } from '../types';
import { Lang, makeT } from '../i18n';
import { PlayerStatus } from '../hooks/useRadioPlayer';
import { cssUrl } from '../utils';
import Visualizer from './Visualizer';
import ProgressBar from './ProgressBar';
import { IconPause, IconPlay, IconHeart, IconVolume } from './Icons';

interface HeroProps {
  status: PlayerStatus;
  onToggle: () => void;
  volume: number;
  onVolume: (v: number) => void;
  liked: boolean;
  toggleLike: () => void;
  receivedAt: number;
  lang: Lang;
  nowPlaying: NowPlaying | undefined;
  analyser: AnalyserNode | null;
}

const Hero: React.FC<HeroProps> = ({
  status,
  onToggle,
  volume,
  onVolume,
  liked,
  toggleLike,
  receivedAt,
  lang,
  nowPlaying,
  analyser,
}) => {
  const t = makeT(lang);
  if (!nowPlaying) {
    return (
      <div className="hero" aria-busy="true">
        <div className="hero-bg" />
        <div className="hero-info">{t("Loading...", "Chargement...")}</div>
      </div>
    );
  }

  const active = status === 'playing' || status === 'loading';
  const playing = status === 'playing';
  const { song } = nowPlaying;

  return (
    <div className="hero" style={{ '--hero-art': cssUrl(song.art) } as React.CSSProperties}>
      <div className="hero-bg" />
      <div className={`hero-art shape-vinyl${playing ? '' : ' paused'}`}>
        <img src={song.art} alt={`${song.title} — ${song.artist}`} />
      </div>
      <div className="hero-info">
        <div className="hero-meta">
          <span className="live"><span className="dot" /> {t("On Air", "À l'antenne")}</span>
          <span className="show">{t("Live Stream", "Flux en direct")}</span>
        </div>
        <h1 className="hero-title">{song.title}</h1>
        <div className="hero-artist">
          {song.artist}
          <span className="dot-sep">·</span>
          <span className="genre">{song.genre || "Afro"}</span>
        </div>
        <span className="sr-only" aria-live="polite">
          {t("Now playing", "En cours")}: {song.title} — {song.artist}
        </span>

        <Visualizer playing={playing} analyser={analyser} />

        <ProgressBar baseElapsed={nowPlaying.elapsed} receivedAt={receivedAt} duration={nowPlaying.duration} />

        <div className="controls">
          <button
            className="ctl play"
            onClick={onToggle}
            aria-pressed={active}
            aria-busy={status === 'loading'}
            aria-label={active ? t("Pause", "Pause") : t("Play", "Lecture")}
          >
            {active ? <IconPause /> : <IconPlay />}
          </button>
          <button
            className={"ctl like" + (liked ? " active" : "")}
            onClick={toggleLike}
            aria-pressed={liked}
            aria-label={t("Like this track", "Aimer ce titre")}
          >
            <IconHeart />
          </button>
          <label className="volume">
            <IconVolume />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={e => onVolume(Number(e.target.value))}
              aria-label={t("Volume", "Volume")}
            />
          </label>
        </div>
        {status === 'error' && (
          <div className="api-error" role="alert" style={{ marginTop: 14 }}>
            {t("Playback failed. Please try again.", "Échec de la lecture. Veuillez réessayer.")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
