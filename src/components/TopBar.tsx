import React from 'react';
import { Lang } from '../i18n';
import { LangSwitch, ThemeToggle, Theme } from './Controls';

interface TopBarProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ lang, setLang, theme, toggleTheme }) => (
  <div className="topbar">
    <div className="topbar-actions">
      <LangSwitch lang={lang} setLang={setLang} />
      <ThemeToggle lang={lang} theme={theme} toggleTheme={toggleTheme} />
    </div>
  </div>
);

export default TopBar;
