import React, { useEffect, useMemo } from 'react';
import { THEME_KEY, LANG_KEY } from './constants';
import { Lang, makeT } from './i18n';
import { useNowPlaying } from './hooks/useNowPlaying';
import { useRadioPlayer } from './hooks/useRadioPlayer';
import { useLikedSongs } from './hooks/useLikedSongs';
import { useIsMobile } from './hooks/useIsMobile';
import { usePersistentState } from './hooks/usePersistentState';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import History from './components/History';
import UpNext from './components/UpNext';
import { LangSwitch, ThemeToggle, Theme } from './components/Controls';
import { IconFacebook, IconInstagram, IconTwitter, IconYoutube } from './components/Icons';

const parseTheme = (raw: string | null): Theme | null => (raw === 'light' || raw === 'dark' ? raw : null);
const parseLang = (raw: string | null): Lang | null => (raw === 'fr' || raw === 'en' ? raw : null);
const detectLang = (): Lang => (navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en');

const App: React.FC = () => {
  const [theme, setTheme] = usePersistentState<Theme>(THEME_KEY, () => 'dark', parseTheme);
  const [lang, setLang] = usePersistentState<Lang>(LANG_KEY, detectLang, parseLang);
  const isMobile = useIsMobile();
  const { data, receivedAt, error: apiError } = useNowPlaying();
  const { isSongLiked, toggleLike } = useLikedSongs();

  const now = data?.now_playing;
  const next = data?.playing_next;
  const songHistory = data?.song_history;
  const history = useMemo(() => songHistory?.slice(0, 6) ?? [], [songHistory]);

  const meta = useMemo(
    () => (now ? { title: now.song.title, artist: now.song.artist, art: now.song.art } : null),
    [now?.song.title, now?.song.artist, now?.song.art], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const { audioRef, status, analyser, volume, setVolume, toggle } = useRadioPlayer(meta);

  const t = makeT(lang);
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const errorBanner = apiError && (
    <div className="api-error" role="alert">
      {t("Unable to reach station", "Erreur de connexion au serveur")} — {apiError}
    </div>
  );

  const hero = (
    <Hero
      status={status}
      onToggle={toggle}
      volume={volume}
      onVolume={setVolume}
      receivedAt={receivedAt}
      liked={now ? isSongLiked(now.song.id) : false}
      toggleLike={() => now && toggleLike(now.song.id)}
      lang={lang}
      nowPlaying={now}
      analyser={analyser}
    />
  );

  const rootCls = `app ${theme === "light" ? "theme-light" : ""} ${isMobile ? "is-mobile" : "is-desktop"}`;

  return (
    <div className={rootCls}>
      <audio ref={audioRef} crossOrigin="anonymous" />
      {isMobile ? (
        <main className="mobile">
          <header className="mobile-header">
            <img src="/images/logo.png" alt="EthnAfrika" className="mobile-logo" />
            <div className="mobile-header-actions">
              <LangSwitch lang={lang} setLang={setLang} />
              <ThemeToggle lang={lang} theme={theme} toggleTheme={toggleTheme} />
            </div>
          </header>
          {errorBanner}
          {hero}
          <UpNext lang={lang} next={next} />
          <History lang={lang} history={history} isSongLiked={isSongLiked} toggleLike={toggleLike} />

          <footer className="footer-strip mobile-footer-only">
            <div className="qr">
              <div className="qr-box">
                <img src="/images/qr.png" alt="QR Code EthnAfrika" loading="lazy" />
              </div>
              <div className="qr-text">
                <strong>{t("Scan to listen", "Scanner pour écouter")}</strong>
                <span>{t("EthnAfrika on your mobile", "EthnAfrika sur votre mobile")}</span>
              </div>
            </div>
            <div className="socials">
              <a href="https://facebook.com/ethnafrika" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><IconFacebook /></a>
              <a href="https://instagram.com/ethnafrika" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><IconInstagram /></a>
              <a href="https://twitter.com/ethnafrika" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><IconTwitter /></a>
              <a href="https://youtube.com/@ethnafrika" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><IconYoutube /></a>
            </div>
          </footer>

          <div className="sidebar-copy mobile-footer-only">
            <div>EthnAfrika.org</div>
            <div>{t("The Sound of Africa, Worldwide", "Le son de l'Afrique, partout")}</div>
            <div className="sidebar-copy-mark">© {new Date().getFullYear()} EthnAfrika.org<br/>{t("All rights reserved", "Tous droits réservés")}</div>
          </div>
        </main>
      ) : (
        <div className="shell">
          <Sidebar lang={lang} />
          <main className="main">
            <TopBar lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} />
            {errorBanner}
            {hero}
            <div className="columns" style={{ marginTop: 28 }}>
              <History lang={lang} history={history} isSongLiked={isSongLiked} toggleLike={toggleLike} />
              <UpNext lang={lang} next={next} />
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
