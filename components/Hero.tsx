import React from 'react';
import { Visualizer } from './Visualizer';
import { IconShuffle, IconPrev, IconPause, IconPlay, IconNext, IconHeart, IconVolume } from './icons';
import { NowPlayingInfo } from '../types';

interface HeroProps {
  tweaks: any;
  playing: boolean;
  onTogglePlay: () => void;
  liked: boolean;
  toggleLike: () => void;
  elapsed: number;
  lang: string;
  songInfo: NowPlayingInfo;
  analyser?: AnalyserNode | null;
}

const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
};

export const Hero: React.FC<HeroProps> = ({
  tweaks, playing, onTogglePlay, liked, toggleLike, elapsed, lang, songInfo, analyser
}) => {
  const t = (en: string, fr: string) => lang === "fr" ? fr : en;
  const { song, duration } = songInfo;

  return (
    <div className="hero">
      <div className={"hero-art shape-" + (tweaks.coverShape || 'square')}>
        <img src={song.art} alt={song.title} />
      </div>
      <div className="hero-info">
        <div className="hero-meta">
          <span className="live"><span className="dot" /> {t("On Air", "À l'antenne")}</span>
          {/* Using stream name or playlist as show info if available */}
          <span className="show">{songInfo.streamer || "EthnAfrika Live"} · {song.album || "The Sound of Africa"}</span>
        </div>
        <h1 className="hero-title">{song.title}</h1>
        <div className="hero-artist">
          {song.artist}
          <span className="dot-sep">·</span>
          <span className="genre">{song.genre || "Afro Sounds"}</span>
        </div>

        <Visualizer playing={playing} paused={!playing} analyser={analyser} />

        <div className="progress">
          <span className="time">{fmtTime(elapsed)}</span>
          <div className="track">
            <div className="fill" style={{ width: `${(elapsed / duration) * 100}%` }} />
          </div>
          <span className="time">{fmtTime(duration)}</span>
        </div>

        <div className="controls">
          <button className="ctl" aria-label="shuffle"><IconShuffle /></button>
          <button className="ctl" aria-label="prev"><IconPrev /></button>
          <button className="ctl play" onClick={onTogglePlay} aria-label={playing ? "pause" : "play"}>
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
