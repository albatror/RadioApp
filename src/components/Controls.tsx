import React from 'react';
import { Lang, makeT } from '../i18n';

export type Theme = 'dark' | 'light';

export const LangSwitch: React.FC<{ lang: Lang; setLang: (l: Lang) => void }> = ({ lang, setLang }) => (
  <div className="lang-switch" role="group" aria-label="Language / Langue">
    <button className={lang === 'en' ? 'active' : ''} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
    <button className={lang === 'fr' ? 'active' : ''} aria-pressed={lang === 'fr'} onClick={() => setLang('fr')}>FR</button>
  </div>
);

export const ThemeToggle: React.FC<{ lang: Lang; theme: Theme; toggleTheme: () => void }> = ({ lang, theme, toggleTheme }) => {
  const t = makeT(lang);
  return (
    <button
      className="icon-btn"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? t('Switch to light theme', 'Passer au thème clair') : t('Switch to dark theme', 'Passer au thème sombre')}
    >
      {theme === 'dark' ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      )}
    </button>
  );
};
