import React from 'react';
import { Lang, makeT } from '../i18n';

const Sidebar: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = makeT(lang);
  const currentYear = new Date().getFullYear();

  return (
    <aside className="sidebar">
      <div className="brand-logo-wrap">
        <img
          src="/images/logo.png"
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
          <img src="/images/qr.png" alt="QR Code EthnAfrika" loading="lazy" width={160} height={160} />
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
