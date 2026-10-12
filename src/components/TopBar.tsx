import React from 'react';
import { IconSun, IconMoon } from './Icons';

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
          {theme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
