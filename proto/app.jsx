/* global React, ReactDOM */
const { useState, useEffect, useRef, useMemo } = React;

// ---------- Icons ----------
const Icon = ({ d, fill, size = 16, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={fill || "none"} stroke={fill ? "none" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);
const IconPlay = (p) => <Icon {...p} d="M7 5l12 7-12 7V5z" fill="currentColor" />;
const IconPause = (p) => <Icon {...p} d={["M7 5h3v14H7z", "M14 5h3v14h-3z"]} fill="currentColor" />;
const IconPrev = (p) => <Icon {...p} d={["M19 5L9 12l10 7V5z", "M5 5v14"]} fill="currentColor" />;
const IconNext = (p) => <Icon {...p} d={["M5 5l10 7-10 7V5z", "M19 5v14"]} fill="currentColor" />;
const IconHeart = (p) => <Icon {...p} d="M12 21s-7-4.5-9.5-9.5C1 8 3 5 6 5c2 0 3.5 1 6 3.5C14.5 6 16 5 18 5c3 0 5 3 3.5 6.5C19 16.5 12 21 12 21z" />;
const IconShare = (p) => <Icon {...p} d={["M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7", "M16 6l-4-4-4 4", "M12 2v13"]} />;
const IconShuffle = (p) => <Icon {...p} d={["M16 3h5v5", "M4 20l17-17", "M21 16v5h-5", "M15 15l6 6", "M4 4l5 5"]} />;
const IconRepeat = (p) => <Icon {...p} d={["M17 1l4 4-4 4", "M3 11V9a4 4 0 0 1 4-4h14", "M7 23l-4-4 4-4", "M21 13v2a4 4 0 0 1-4 4H3"]} />;
const IconVolume = (p) => <Icon {...p} d={["M11 5L6 9H2v6h4l5 4V5z", "M19 12c0-2-1-4-2-5", "M22 12c0-3-2-6-4-8"]} />;
const IconSearch = (p) => <Icon {...p} d={["M11 11m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0", "M21 21l-4.35-4.35"]} />;
const IconHome = (p) => <Icon {...p} d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2v-9z" />;
const IconRadio = (p) => <Icon {...p} d={["M4 11v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9", "M2 9l18-6", "M8 11h8M8 15h8", "M16 17a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"]} />;
const IconClock = (p) => <Icon {...p} d={["M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", "M12 7v5l3 2"]} />;
const IconCalendar = (p) => <Icon {...p} d={["M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z", "M16 2v4", "M8 2v4", "M3 10h18"]} />;
const IconDisc = (p) => <Icon {...p} d={["M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0", "M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"]} />;
const IconUsers = (p) => <Icon {...p} d={["M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M22 21v-2a4 4 0 0 0-3-3.87", "M15 3.13a4 4 0 0 1 0 7.75"]} />;
const IconCompass = (p) => <Icon {...p} d={["M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0", "M16 8l-2 6-6 2 2-6 6-2z"]} />;
const IconBookmark = (p) => <Icon {...p} d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />;
const IconSettings = (p) => <Icon {...p} d={["M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"]} />;
const IconCast = (p) => <Icon {...p} d={["M2 16a5 5 0 0 1 5 5", "M2 12a9 9 0 0 1 9 9", "M2 8a13 13 0 0 1 13 13", "M2 4h20v16h-7"]} />;
const IconBell = (p) => <Icon {...p} d={["M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9", "M13.7 21a2 2 0 0 1-3.4 0"]} />;
const IconFB = (p) => <Icon {...p} d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="currentColor" />;
const IconIG = (p) => <Icon {...p} d={["M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7z", "M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0", "M17.5 6.5h.01"]} />;
const IconYT = (p) => <Icon {...p} d="M22 8.6a3 3 0 0 0-2.1-2.1C18 6 12 6 12 6s-6 0-7.9.5A3 3 0 0 0 2 8.6 31 31 0 0 0 1.5 12a31 31 0 0 0 .5 3.4 3 3 0 0 0 2.1 2.1C6 18 12 18 12 18s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-3.4 31 31 0 0 0-.5-3.4z M10 15.5l5-3.5-5-3.5v7z" fill="currentColor" />;

// ---------- Mock data (tracks the EthnAfrika feed shape) ----------
const NOW = {
  title: "Sénégal Soleil",
  artist: "Cheikh Lô & Orchestre Baobab",
  album: "Routes des griots",
  genre: "Afro Soul",
  duration: 247,
  art: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80&auto=format&fit=crop",
  show: "Routes & Racines",
  host: "DJ Amadou",
};

const HISTORY = [
  { id: 1, title: "Pata Pata (rework)", artist: "Miriam Makeba × Black Coffee", genre: "Afro House", time: "13:42", art: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80&auto=format&fit=crop", liked: true },
  { id: 2, title: "Lagos at Dawn", artist: "Femi Kuti", genre: "Afrobeat", time: "13:36", art: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=80&auto=format&fit=crop" },
  { id: 3, title: "Ngoma", artist: "Sona Jobarteh", genre: "Mandé", time: "13:31", art: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=200&q=80&auto=format&fit=crop" },
  { id: 4, title: "Sahel Lullaby", artist: "Tinariwen", genre: "Tuareg Blues", time: "13:25", art: "https://images.unsplash.com/photo-1454922915609-78549ad709bb?w=200&q=80&auto=format&fit=crop", liked: true },
  { id: 5, title: "Kinshasa Nights", artist: "Konono N°1", genre: "Tradi-Modern", time: "13:18", art: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=200&q=80&auto=format&fit=crop" },
  { id: 6, title: "Mbira Echoes", artist: "Stella Chiweshe", genre: "Zimbabwe", time: "13:11", art: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&q=80&auto=format&fit=crop" },
];

const NEXT = {
  title: "Maputo Sunrise",
  artist: "Mariza & Mokoomba",
  genre: "Afro Fado",
  duration: 312,
  art: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80&auto=format&fit=crop",
};

const SCHEDULE = [
  { time: "12:00", host: "DJ Amadou", show: "Routes & Racines", duration: "2h", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&q=80&auto=format&fit=crop", now: true },
  { time: "14:00", host: "Aïcha Diop",  show: "Sahel & Sand",       duration: "1h30", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80&auto=format&fit=crop" },
  { time: "15:30", host: "Kwame Selecta",show: "Lagos to London",   duration: "2h", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80&auto=format&fit=crop" },
  { time: "17:30", host: "Lina Mensah",  show: "Tribal Pulse",       duration: "1h", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80&auto=format&fit=crop" },
  { time: "18:30", host: "Fela Crew",    show: "Afrobeat Hour",      duration: "1h", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&q=80&auto=format&fit=crop" },
];

const GENRES = [
  { name: "Afrobeat",   count: "412 tracks", cls: "g1" },
  { name: "Reggae",     count: "287 tracks", cls: "g2" },
  { name: "Afro House", count: "356 tracks", cls: "g3" },
  { name: "Tribal",     count: "198 tracks", cls: "g4" },
  { name: "Drums",      count: "143 tracks", cls: "g5" },
  { name: "Afro Pop",   count: "521 tracks", cls: "g6" },
];

// ---------- Visualizer (DOM-direct, throttled, pauses when offscreen/hidden) ----------
function Visualizer({ playing }) {
  const BARS = 48;
  const rootRef = useRef(null);
  const barsRef = useRef([]);
  const phasesRef = useRef(null);
  const envRef = useRef(null);
  if (!phasesRef.current) {
    phasesRef.current = Array.from({ length: BARS }, (_, i) => Math.random() * Math.PI * 2 + i * 0.13);
    envRef.current = Array.from({ length: BARS }, (_, i) => {
      const x = (i / BARS) * 2 - 1;
      return Math.exp(-Math.pow(x * 1.5, 2)) * 0.6 + 0.4;
    });
  }

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    let last = 0;
    let visible = true;
    let onScreen = true;
    const FPS = 24;          // cap — visualizer doesn't need 60fps
    const FRAME = 1000 / FPS;

    const onVis = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);

    const phases = phasesRef.current;
    const envs = envRef.current;
    const bars = barsRef.current;

    // Render an idle resting state once when paused
    if (!playing) {
      for (let i = 0; i < BARS; i++) {
        if (bars[i]) bars[i].style.height = `${10 + envs[i] * 8}%`;
      }
      return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
    }

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (!visible || !onScreen) return;
      if (now - last < FRAME) return;
      last = now;
      const t = now / 600;
      for (let i = 0; i < BARS; i++) {
        const ph = phases[i];
        const v = (0.55 + 0.45 * Math.abs(Math.sin(t + ph) * 0.7 + Math.sin(t * 1.7 + ph * 1.3) * 0.3)) * envs[i];
        const h = Math.max(6, v * 100);
        if (bars[i]) bars[i].style.height = h + "%";
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [playing]);

  return (
    <div ref={rootRef} className={"visualizer" + (playing ? "" : " paused")}>
      {Array.from({ length: BARS }).map((_, i) => (
        <div key={i} ref={(el) => (barsRef.current[i] = el)} className="bar" style={{ height: "20%" }} />
      ))}
    </div>
  );
}

// ---------- Hero ----------
function Hero({ tweaks, playing, setPlaying, liked, toggleLike, elapsed, lang }) {
  const t = (en, fr) => lang === "fr" ? fr : en;
  return (
    <div className="hero">
      <div className={"hero-art shape-" + tweaks.coverShape}>
        <img src={NOW.art} alt={NOW.title} />
      </div>
      <div className="hero-info">
        <div className="hero-meta">
          <span className="live"><span className="dot" /> {t("On Air", "À l'antenne")}</span>
          <span className="show">{NOW.show} · {NOW.host}</span>
        </div>
        <h1 className="hero-title">{NOW.title}</h1>
        <div className="hero-artist">
          {NOW.artist}
          <span className="dot-sep">·</span>
          <span className="genre">{NOW.genre}</span>
        </div>

        <Visualizer playing={playing} paused={!playing} />

        <div className="progress">
          <span className="time">{fmtTime(elapsed)}</span>
          <div className="track"><div className="fill" style={{ width: `${(elapsed / NOW.duration) * 100}%` }} /></div>
          <span className="time">{fmtTime(NOW.duration)}</span>
        </div>

        <div className="controls">
          <button className="ctl" aria-label="shuffle"><IconShuffle /></button>
          <button className="ctl" aria-label="prev"><IconPrev /></button>
          <button className="ctl play" onClick={() => setPlaying(p => !p)} aria-label={playing ? "pause" : "play"}>
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
}

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}

// ---------- Sidebar ----------
function Sidebar({ lang }) {
  const t = (en, fr) => lang === "fr" ? fr : en;
  return (
    <aside className="sidebar">
      <div className="brand-logo-wrap">
        <img
          src="https://i.ibb.co/YBntfXQm/logo-digital-K-2.png"
          alt="EthnAfrika"
          className="brand-logo"
        />
        <div className="brand-tagline">
          <span className="serif">The Sound of Africa</span>
          <span className="brand-sub">{t("Afro-descendant sounds & cultures", "Sons & cultures afro-descendants")}</span>
        </div>
      </div>

      <div className="sidebar-qr">
        <div className="sidebar-qr-label">{t("Scan to listen", "Scannez pour écouter")}</div>
        <div className="sidebar-qr-box">
          <svg viewBox="0 0 30 30" aria-hidden="true">
            {Array.from({length:30}).map((_,r) => Array.from({length:30}).map((_,c) => (
              ((r+c*7+r*c)%5 < 2) ? <rect key={r+'_'+c} x={c} y={r} width="1" height="1" fill="#1a0e07"/> : null
            )))}
            <rect x="0" y="0" width="8" height="8" fill="none" stroke="#1a0e07" strokeWidth="1.4"/>
            <rect x="22" y="0" width="8" height="8" fill="none" stroke="#1a0e07" strokeWidth="1.4"/>
            <rect x="0" y="22" width="8" height="8" fill="none" stroke="#1a0e07" strokeWidth="1.4"/>
            <rect x="3" y="3" width="2" height="2" fill="#1a0e07"/>
            <rect x="25" y="3" width="2" height="2" fill="#1a0e07"/>
            <rect x="3" y="25" width="2" height="2" fill="#1a0e07"/>
          </svg>
        </div>
        <div className="sidebar-qr-hint">{t("Open the web app", "Ouvrir l'application")}</div>
      </div>

      <div className="sidebar-copy">
        <div>EthnAfrika.org</div>
        <div>{t("The Sound of Africa, Worldwide", "Le son de l'Afrique, partout")}</div>
        <div className="sidebar-copy-mark">© 2026 EthnAfrika.org<br/>{t("All rights reserved", "Tous droits réservés")}</div>
      </div>
    </aside>
  );
}



// ---------- TopBar ----------
function TopBar({ lang, setLang }) {
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
}

// ---------- History ----------
function History({ lang, likedSet, toggleHist }) {
  const t = (en, fr) => lang === "fr" ? fr : en;
  return (
    <div className="history-card">
      <div className="section-head" style={{ margin: "0 0 14px" }}>
        <div>
          <h2>{t("Recently played", "Récemment joués")}</h2>
          <div className="sub">{t("Last six tracks from the live stream", "Six derniers titres du flux live")}</div>
        </div>
        <a className="see-all" href="#">{t("See all", "Tout voir")} →</a>
      </div>
      {HISTORY.map((s, i) => {
        const isLiked = likedSet.has(s.id) || s.liked;
        return (
          <div className="history-row" key={s.id}>
            <div className="num">{String(i + 1).padStart(2, "0")}</div>
            <img className="art" src={s.art} alt="" />
            <div className="meta">
              <div className="title">{s.title}</div>
              <div className="artist">{s.artist}</div>
            </div>
            <div className="genre-chip">{s.genre}</div>
            <div className="time">{s.time}</div>
            <button className={"like-mini" + (isLiked ? " liked" : "")} onClick={() => toggleHist(s.id)} aria-label="like">
              <IconHeart />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Up Next ----------
function UpNext({ lang }) {
  const t = (en, fr) => lang === "fr" ? fr : en;
  return (
    <div className="next-card">
      <div className="section-head" style={{ margin: 0 }}>
        <div>
          <span className="eyebrow accent">{t("Coming up", "À suivre")}</span>
          <h2 style={{ marginTop: 4 }}>{t("Next on EthnAfrika", "Prochain titre")}</h2>
        </div>
      </div>
      <div className="next-art">
        <img src={NEXT.art} alt={NEXT.title} />
        <div className="countdown">in 2:14</div>
      </div>
      <div className="next-info">
        <div className="title">{NEXT.title}</div>
        <div className="artist">{NEXT.artist}</div>
        <div className="meta-row">
          <span className="pill">{NEXT.genre}</span>
          <span className="pill">{fmtTime(NEXT.duration)}</span>
          <button className="pill" style={{ borderColor: "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <IconShare size={11} /> {t("Share", "Partager")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Schedule ----------
function Schedule({ lang }) {
  const t = (en, fr) => lang === "fr" ? fr : en;
  return (
    <div className="schedule-card">
      <div className="section-head" style={{ margin: "0 0 12px" }}>
        <div>
          <h2>{t("Today's program", "Programme du jour")}</h2>
          <div className="sub">{t("All times in CEST · Africa/Dakar", "Heures en CEST · Afrique/Dakar")}</div>
        </div>
        <a className="see-all" href="#">{t("Full schedule", "Programme complet")} →</a>
      </div>
      <div className="schedule-grid">
        {SCHEDULE.map((s, i) => (
          <div key={i} className={"schedule-item" + (s.now ? " now" : "")}>
            <div className="time">{s.time}</div>
            <img className="host-img" src={s.img} alt={s.host} />
            <div className="show-meta">
              <div className="show-name">{s.show}</div>
              <div className="host-name">{t("with", "avec")} {s.host}</div>
            </div>
            {s.now ? (
              <span className="now-tag"><span style={{width:5,height:5,borderRadius:99,background:"currentColor"}}/> {t("On air", "Direct")}</span>
            ) : (
              <span className="duration">{s.duration}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Genres ----------
function GenreTiles({ lang }) {
  const t = (en, fr) => lang === "fr" ? fr : en;
  return (
    <>
      <div className="section-head">
        <div>
          <h2>{t("Browse by genre", "Parcourir par genre")}</h2>
          <div className="sub">{t("From spiritual Reggae to hypnotic Tribal pulses", "Du Reggae spirituel aux pulsations Tribales")}</div>
        </div>
      </div>
      <div className="genres">
        {GENRES.map((g, i) => (
          <div key={i} className={"genre-tile " + g.cls}>
            <div className="count">{g.count}</div>
            <div className="name">{g.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ---------- Footer ----------
function FooterStrip({ lang }) {
  const t = (en, fr) => lang === "fr" ? fr : en;
  return (
    <div className="footer-strip">
      <div className="qr">
        <div className="qr-box">
          {/* Simple decorative QR */}
          <svg viewBox="0 0 30 30">
            {Array.from({length:30}).map((_,r) => Array.from({length:30}).map((_,c) => (
              ((r+c*7+r*c)%5 < 2) ? <rect key={r+'_'+c} x={c} y={r} width="1" height="1" fill="#000"/> : null
            )))}
            <rect x="0" y="0" width="8" height="8" fill="none" stroke="#000" strokeWidth="1.4"/>
            <rect x="22" y="0" width="8" height="8" fill="none" stroke="#000" strokeWidth="1.4"/>
            <rect x="0" y="22" width="8" height="8" fill="none" stroke="#000" strokeWidth="1.4"/>
            <rect x="3" y="3" width="2" height="2" fill="#000"/>
            <rect x="25" y="3" width="2" height="2" fill="#000"/>
            <rect x="3" y="25" width="2" height="2" fill="#000"/>
          </svg>
        </div>
        <div className="qr-text">
          <strong>{t("Listen on mobile", "Écouter en mobile")}</strong>
          {t("Scan to open the web app", "Scannez pour ouvrir l'app")}
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div className="serif" style={{ fontSize: 14, color: "var(--text-2)" }}>EthnAfrika.org — {t("The Sound of Africa, Worldwide", "Le son de l'Afrique, partout")}</div>
        <div style={{ fontSize: 11, marginTop: 4, color: "var(--text-4)" }}>© 2026 EthnAfrika.org</div>
      </div>

      <div className="socials">
        <a href="#" aria-label="Facebook"><IconFB size={14}/></a>
        <a href="#" aria-label="Instagram"><IconIG size={14}/></a>
        <a href="#" aria-label="YouTube"><IconYT size={14}/></a>
      </div>
    </div>
  );
}

// ---------- App ----------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "terracotta",
  "coverShape": "vinyl",
  "showQR": false
}/*EDITMODE-END*/;

// Mobile detection (UA + viewport, re-evaluated on resize)
function useIsMobile() {
  const get = () => {
    if (typeof window === "undefined") return false;
    const uaMobile = /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry/i.test(navigator.userAgent || "");
    return uaMobile || window.innerWidth < 760;
  };
  const [m, setM] = useState(get);
  useEffect(() => {
    const onR = () => setM(get());
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  return m;
}

function App() {
  const hookResult = window.useTweaks ? window.useTweaks(TWEAK_DEFAULTS) : [TWEAK_DEFAULTS, () => {}];
  const tweaks = hookResult[0];
  const setTweak = hookResult[1];

  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(74);
  const [liked, setLiked] = useState(false);
  const [likedSet, setLikedSet] = useState(new Set([1, 4]));
  const [lang, setLang] = useState("en");
  const isMobile = useIsMobile();

  // Smooth progress
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setElapsed(e => (e + 1) % NOW.duration), 1000);
    return () => clearInterval(id);
  }, [playing]);

  const toggleHist = (id) => setLikedSet(s => {
    const ns = new Set(s);
    if (ns.has(id)) ns.delete(id); else ns.add(id);
    return ns;
  });

  const paletteCls = "palette-" + tweaks.palette;
  const rootCls = "app " + (paletteCls === "palette-terracotta" ? "" : paletteCls) + (isMobile ? " is-mobile" : " is-desktop");

  return (
    <div className={rootCls}>
      {isMobile ? (
        <main className="mobile">
          <header className="mobile-header">
            <img src="https://i.ibb.co/YBntfXQm/logo-digital-K-2.png" alt="EthnAfrika" className="mobile-logo" />
            <div className="lang-switch">
              <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
              <button className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>FR</button>
            </div>
          </header>
          <Hero
            tweaks={tweaks}
            playing={playing}
            setPlaying={setPlaying}
            elapsed={elapsed}
            liked={liked}
            toggleLike={() => setLiked(v => !v)}
            lang={lang}
          />
          <UpNext lang={lang} />
          <History lang={lang} likedSet={likedSet} toggleHist={toggleHist} />
          {tweaks.showQR && <FooterStrip lang={lang} />}
        </main>
      ) : (
        <div className="shell">
          <Sidebar lang={lang} />
          <main className="main">
            <TopBar lang={lang} setLang={setLang} />
            <Hero
              tweaks={tweaks}
              playing={playing}
              setPlaying={setPlaying}
              elapsed={elapsed}
              liked={liked}
              toggleLike={() => setLiked(v => !v)}
              lang={lang}
            />
            <div className="columns" style={{ marginTop: 28 }}>
              <History lang={lang} likedSet={likedSet} toggleHist={toggleHist} />
              <UpNext lang={lang} />
            </div>
            {tweaks.showQR && <FooterStrip lang={lang} />}
          </main>
        </div>
      )}
      <Tweaks tweaks={tweaks} setTweak={setTweak} />
    </div>
  );
}

// Tweaks panel — uses TweaksPanel + helpers from tweaks-panel.jsx
function Tweaks({ tweaks, setTweak }) {
  const { TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakSelect } = window;
  if (!TweaksPanel) return null;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Palette">
        <TweakSelect
          label="Color theme"
          value={tweaks.palette}
          onChange={(v) => setTweak("palette", v)}
          options={[
            { value: "terracotta", label: "Terracotta — warm African dusk" },
            { value: "pan",        label: "Pan-African — green / yellow / red" },
            { value: "cinema",     label: "Cinema — moody amber on charcoal" },
            { value: "dusk",       label: "Dusk — purple sunset" },
          ]}
        />
      </TweakSection>

      <TweakSection label="Hero">
        <TweakRadio
          label="Cover shape"
          value={tweaks.coverShape}
          onChange={(v) => setTweak("coverShape", v)}
          options={[
            { value: "square", label: "Square" },
            { value: "circle", label: "Circle" },
            { value: "vinyl",  label: "Vinyl" },
          ]}
        />
      </TweakSection>

      <TweakSection label="Modules">
        <TweakToggle label="Show QR + footer" value={tweaks.showQR} onChange={(v) => setTweak("showQR", v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
