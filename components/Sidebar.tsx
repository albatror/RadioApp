import React from 'react';
import { IconHome, IconRadio, IconCalendar, IconCompass, IconClock, IconHeart, IconBookmark, IconUsers } from './icons';

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
  listeners: number;
  lang: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ active, setActive, listeners, lang }) => {
  const t = (en: string, fr: string) => lang === "fr" ? fr : en;
  const items = [
    { id: "home", icon: IconHome, label: t("Home", "Accueil") },
    { id: "live", icon: IconRadio, label: t("Live", "Direct"), badge: "ON" },
    { id: "schedule", icon: IconCalendar, label: t("Schedule", "Programme") },
    { id: "shows", icon: IconCompass, label: t("Shows", "Émissions") },
    { id: "history", icon: IconClock, label: t("History", "Historique") },
  ];
  const lib = [
    { id: "liked", icon: IconHeart, label: t("Liked", "Favoris"), badge: "12" },
    { id: "saved", icon: IconBookmark, label: t("Saved", "Sauvegardés") },
    { id: "djs", icon: IconUsers, label: t("DJ Crew", "Équipe DJ") },
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <svg viewBox="0 0 32 32"><path d="M16 4l4 8h8l-6 6 2 10-8-5-8 5 2-10-6-6h8z" fill="currentColor"/></svg>
        </div>
        <div>
          <div className="brand-name">EthnAfrika</div>
          <div className="brand-tag">SOUND OF AFRICA</div>
        </div>
      </div>

      <div className="nav-group">
        <div className="nav-label">{t("Discover", "Explorer")}</div>
        {items.map(it => (
          <button key={it.id} className={"nav-item" + (active === it.id ? " active" : "")} onClick={() => setActive(it.id)}>
            <span className="ico"><it.icon /></span>
            <span>{it.label}</span>
            {it.badge && <span className="badge">{it.badge}</span>}
          </button>
        ))}
      </div>

      <div className="nav-group">
        <div className="nav-label">{t("Library", "Bibliothèque")}</div>
        {lib.map(it => (
          <button key={it.id} className={"nav-item" + (active === it.id ? " active" : "")} onClick={() => setActive(it.id)}>
            <span className="ico"><it.icon /></span>
            <span>{it.label}</span>
            {it.badge && <span className="badge">{it.badge}</span>}
          </button>
        ))}
      </div>

      <div className="live-pill">
        <span className="live-dot" />
        <div className="meta">
          <span className="label">{t("Live now", "En direct")}</span>
          <span className="count">{listeners} {t("listeners", "auditeurs")}</span>
        </div>
      </div>
    </aside>
  );
};
