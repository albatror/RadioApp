import React from 'react';

interface GenreTilesProps {
  lang: string;
}

export const GenreTiles: React.FC<GenreTilesProps> = ({ lang }) => {
  const t = (en: string, fr: string) => lang === "fr" ? fr : en;

  const GENRES = [
    { name: "Afrobeat",   count: "412 tracks", cls: "g1" },
    { name: "Reggae",     count: "287 tracks", cls: "g2" },
    { name: "Afro House", count: "356 tracks", cls: "g3" },
    { name: "Tribal",     count: "198 tracks", cls: "g4" },
    { name: "Drums",      count: "143 tracks", cls: "g5" },
    { name: "Afro Pop",   count: "521 tracks", cls: "g6" },
  ];

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
};
