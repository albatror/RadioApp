import React from 'react';
import { NowPlaying } from '../types';
import Visualizer from './Visualizer';
import { IconShuffle, IconPrev, IconPause, IconPlay, IconNext, IconHeart, IconVolume } from './Icons';

interface HeroProps {
  playing: boolean;
  setPlaying: () => void;
  liked: boolean;
  toggleLike: () => void;
  elapsed: number;
  lang: string;
  nowPlaying: NowPlaying | undefined;
  analyser: AnalyserNode | null;
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}

const Hero: React.FC<HeroProps> = ({
  playing,
  setPlaying,
  liked,
  toggleLike,
  elapsed,
  lang,
  nowPlaying,
  analyser
}) => {
  const t = (en: string, fr: string) => lang === "fr" ? fr : en;
  if (!nowPlaying) return <div className="hero"><div className="hero-info">Loading...</div></div>;

  return (
    <div className="hero">
      <div className={"hero-art shape-vinyl"}>
        <img src={nowPlaying.song.art} alt={nowPlaying.song.title} />
      </div>
      <div className="hero-info">
        <div className="hero-meta">
          <span className="live"><span className="dot" /> {t("On Air", "À l'antenne")}</span>
          <span className="show">{t("Live Stream", "Flux en direct")}</span>
        </div>
        <h1 className="hero-title">{nowPlaying.song.title}</h1>
        <div className="hero-artist">
          {nowPlaying.song.artist}
          <span className="dot-sep">·</span>
          <span className="genre">{nowPlaying.song.genre || "Afro"}</span>
        </div>

        <Visualizer playing={playing} analyser={analyser} />

        <div className="progress">
          <span className="time">{fmtTime(elapsed)}</span>
          <div className="track">
            <div className="fill" style={{ width: nowPlaying.duration ? `${(elapsed / nowPlaying.duration) * 100}%` : '0%' }} />
          </div>
          <span className="time">{fmtTime(nowPlaying.duration || 0)}</span>
        </div>

        <div className="controls">
          <button className="ctl" aria-label="shuffle"><IconShuffle /></button>
          <button className="ctl" aria-label="prev"><IconPrev /></button>
          <button className="ctl play" onClick={setPlaying} aria-label={playing ? "pause" : "play"}>
            {playing ? <IconPause /> : <IconPlay />}
          </button>
          <button className="ctl" aria-label="next"><IconNext /></button>
          <button className={"ctl like" + (liked ? " active" : "")} onClick={toggleLike} aria-label="like"><IconHeart /></button>
          <div className="volume">
            <IconVolume />
            <div className="vbar"><div className="vfill" /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
