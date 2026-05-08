import React from 'react';

interface ScheduleProps {
  lang: string;
}

export const Schedule: React.FC<ScheduleProps> = ({ lang }) => {
  const t = (en: string, fr: string) => lang === "fr" ? fr : en;

  // Static mock data for schedule as in prototype
  const SCHEDULE = [
    { time: "12:00", host: "DJ Amadou", show: "Routes & Racines", duration: "2h", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&q=80&auto=format&fit=crop", now: true },
    { time: "14:00", host: "Aïcha Diop",  show: "Sahel & Sand",       duration: "1h30", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80&auto=format&fit=crop" },
    { time: "15:30", host: "Kwame Selecta",show: "Lagos to London",   duration: "2h", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80&auto=format&fit=crop" },
    { time: "17:30", host: "Lina Mensah",  show: "Tribal Pulse",       duration: "1h", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80&auto=format&fit=crop" },
    { time: "18:30", host: "Fela Crew",    show: "Afrobeat Hour",      duration: "1h", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&q=80&auto=format&fit=crop" },
  ];

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
};
