import React from 'react';
import { IconSearch, IconCast, IconBell, IconSettings } from './Icons';

interface TopBarProps {
  lang: string;
  setLang: (lang: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ lang, setLang }) => {
  return (
    <div className="topbar">
      <div className="search">
        <IconSearch />
        <input placeholder={lang === "fr" ? "Rechercher artiste, émission, genre…" : "Search artist, show, genre…"} />
        <kbd>⌘K</kbd>
      </div>
      <div className="topbar-actions">
        <div className="lang-switch">
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
          <button className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>FR</button>
        </div>
        <button className="icon-btn" aria-label="cast"><IconCast /></button>
        <button className="icon-btn" aria-label="notifications"><IconBell /></button>
        <button className="icon-btn" aria-label="settings"><IconSettings /></button>
      </div>
    </div>
  );
};

export default TopBar;
