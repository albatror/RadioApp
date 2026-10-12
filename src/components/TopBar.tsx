import React from 'react';
import { IconSearch, IconCast, IconBell, IconSettings } from './Icons';

interface TopBarProps {
  lang: string;
  setLang: (lang: string) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ lang, setLang, theme, toggleTheme }) => {
  return (
    <div className="topbar">
      <div className="topbar-actions">
        <div className="lang-switch">
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
          <button className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>FR</button>
        </div>
        <button className="icon-btn" onClick={toggleTheme} aria-label="toggle theme">
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>
        <button className="icon-btn" aria-label="cast"><IconCast /></button>
        <button className="icon-btn" aria-label="notifications"><IconBell /></button>
        <button className="icon-btn" aria-label="settings"><IconSettings /></button>
      </div>
    </div>
  );
};

export default TopBar;
