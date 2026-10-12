import React from 'react';
import { NowPlaying } from '../types';
import { fmtTime } from '../utils';
import Visualizer from './Visualizer';
import { IconPause, IconPlay, IconHeart, IconVolume, IconCast } from './Icons';

interface HeroProps {
  playing: boolean;
  setPlaying: () => void;
  liked: boolean;
  toggleLike: () => void;
  elapsed: number;
  lang: string;
  nowPlaying: NowPlaying | undefined;
  analyser: AnalyserNode | null;
  volume: number;
  setVolume: (v: number) => void;
  onCast?: () => void;
  networkQuality?: 'GOOD' | 'MODERATE' | 'POOR' | 'RECOVERING';
}

const Hero: React.FC<HeroProps> = ({
  playing,
  setPlaying,
  liked,
  toggleLike,
  elapsed,
  lang,
  nowPlaying,
  analyser,
  volume,
  setVolume
}) => {
  const t = (en: string, fr: string) => lang === "fr" ? fr : en;
  if (!nowPlaying) return <div className="hero"><div className="hero-bg" /><div className="hero-info">Loading...</div></div>;

  return (
    <div className="hero" style={{ '--hero-art': `url(${nowPlaying.song.art})` } as React.CSSProperties}>
      <div className="hero-bg" />
      <div className={`hero-art shape-vinyl${playing ? '' : ' paused'}`}>
        <img src={nowPlaying.song.art} alt={nowPlaying.song.title} />
      </div>
       <div className="hero-info">
         <div className="hero-meta">
           <span className="live"><span className="dot" /> {t("On Air", "À l'antenne")}</span>
           <span className="show">{t("Live Stream", "Flux en direct")}</span>
           <span className="network-quality-indicator">
             <span className={`network-quality-dot ${networkQuality?.toLowerCase() || 'good'}`} aria-label={`Network quality: ${networkQuality}`} />
             <span className="network-quality-text">{networkQuality}</span>
           </span>
         </div>
        <h1 className="hero-title">{nowPlaying.song.title}</h1>
        <div className="hero-artist">
          {nowPlaying.song.artist}
          <span className="dot-sep">·</span>
          <span className="genre">{nowPlaying.song.genre || "Afro"}</span>
        </div>

        <Visualizer playing={playing} analyser={analyser} networkQuality={networkQuality} />

        <div className="progress">
          <span className="time">{fmtTime(elapsed)}</span>
          <div className="track">
            <div className="fill" style={{ transform: `scaleX(${nowPlaying.duration ? elapsed / nowPlaying.duration : 0})` }} />
          </div>
          <span className="time">{fmtTime(nowPlaying.duration || 0)}</span>
        </div>

         <div className="controls">
           <button className="ctl play" onClick={setPlaying} aria-label={playing ? "pause" : "play"}>
             {playing ? <IconPause /> : <IconPlay />}
           </button>
           <button
             className={"ctl like" + (liked ? " active" : "")}
             onClick={toggleLike}
             aria-label={liked ? t("unlike", "ne plus aimer") : t("like", "aimer")}
             aria-pressed={liked}
           ><IconHeart /></button>
           <div className="volume">
             <IconVolume />
             <input
               type="range"
               min={0}
               max={1}
               step={0.01}
               value={volume}
               onChange={e => setVolume(Number(e.target.value))}
               aria-label={t("volume", "volume")}
             />
           </div>
           <button className="ctl cast" onClick={onCast} aria-label="cast">
             <IconCast />
           </button>
         </div>
      </div>
    </div>
  );
};

export default Hero;
