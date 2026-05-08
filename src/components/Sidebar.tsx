import React from 'react';

interface SidebarProps {
  lang: string;
  listeners: number;
}

const Sidebar: React.FC<SidebarProps> = ({ lang, listeners }) => {
  const t = (en: string, fr: string) => lang === "fr" ? fr : en;
  const currentYear = new Date().getFullYear();

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
        <div className="sidebar-copy-mark">© {currentYear} EthnAfrika.org<br/>{t("All rights reserved", "Tous droits réservés")}</div>
      </div>
    </aside>
  );
};

export default Sidebar;
