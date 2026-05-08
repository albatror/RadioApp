import React from 'react';
import { IconFB, IconIG, IconYT } from './icons';

interface FooterStripProps {
  lang: string;
}

export const FooterStrip: React.FC<FooterStripProps> = ({ lang }) => {
  const t = (en: string, fr: string) => lang === "fr" ? fr : en;
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
};
