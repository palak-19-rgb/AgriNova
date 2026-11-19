import React from "react";
import { useTranslation } from "react-i18next";

function Topbar({
  title = "Dashboard",
  subtitle = "Greenhouse overview",
  titleKey = "dashboard",
  subtitleKey = "greenhouseOverview"
}) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };
  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <div className="mobile-brand">
            <div className="brand-mark">A</div>
            <div>
              <div className="brand-name">AgriNova</div>
             <div className="brand-sub">{t("smartGreenhouse")}</div>
            </div>
          </div>

          <div className="page-heading">
            <span className="eyebrow">{t("monitoring")}</span>
           <h1>{t(titleKey, { defaultValue: title })}</h1>
<p>{t(subtitleKey, { defaultValue: subtitle })}</p>
          </div>
        </div>

        <div className="topbar-right">
          <div className="live-status">
            <span className="status-dot online"></span>
         <span>{t("systemLive")}</span>
          </div>
<div className="language-selector">
  <span>🌐</span>
  <select
    value={i18n.resolvedLanguage || i18n.language}
    onChange={(e) => changeLanguage(e.target.value)}
    aria-label={t("language")}
  >
    <option value="en">English</option>
    <option value="hi">हिन्दी</option>
    <option value="pa">ਪੰਜਾਬੀ</option>
  </select>
</div>
          <div className="date-card">
            <span className="date-icon">◷</span>
            <div>
              <strong>{t("liveMonitoring")}</strong>
<small>{t("updatedAutomatically")}</small>
            </div>
          </div>

          <div className="profile">
            <div className="profile-avatar">G</div>
            <div className="profile-info">
            <strong>{t("greenhouse")}</strong>
              <span>{t("administrator")}</span>
            </div>
          </div>
        </div>
      </header>

      <style>{`
        .topbar {
          width: 100%;
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 24px;
          padding: 4px 4px 18px;
          border-bottom: 1px solid rgba(31, 63, 43, 0.08);
        }

        .topbar-left {
          display: flex;
          align-items: center;
        }

        .page-heading h1 {
          margin-top: 4px;
          font-family: "Playfair Display", serif;
          font-size: clamp(1.65rem, 2.5vw, 2.25rem);
          line-height: 1.1;
          color: var(--forest);
        }

        .page-heading p {
          margin-top: 5px;
          color: var(--text-soft);
          font-size: 0.82rem;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .live-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border-radius: 999px;
          background: rgba(63, 139, 88, 0.08);
          color: var(--success);
          font-size: 0.75rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .date-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 13px;
          border: 1px solid var(--border);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.7);
        }

        .date-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: var(--mint);
          color: var(--forest);
          font-size: 17px;
        }

        .date-card strong,
        .date-card small {
          display: block;
        }

        .date-card strong {
          color: var(--text);
          font-size: 0.74rem;
        }

        .date-card small {
          margin-top: 2px;
          color: var(--text-soft);
          font-size: 0.64rem;
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-left: 4px;
        }

        .profile-avatar {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--forest);
          color: white;
          font-family: "Playfair Display", serif;
          font-size: 1rem;
        }

        .profile-info strong,
        .profile-info span {
          display: block;
        }

        .profile-info strong {
          color: var(--forest);
          font-size: 0.78rem;
        }

        .profile-info span {
          margin-top: 2px;
          color: var(--text-soft);
          font-size: 0.65rem;
        }

        .mobile-brand {
          display: none;
        }

        @media (max-width: 1050px) {
          .date-card {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .topbar {
            padding-top: 5px;
          }

          .mobile-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-right: 22px;
          }

          .brand-mark {
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            background: var(--forest);
            color: white;
            font-family: "Playfair Display", serif;
            font-weight: 700;
          }

          .brand-name {
            color: var(--forest);
            font-family: "Playfair Display", serif;
            font-size: 1rem;
            font-weight: 700;
          }

          .brand-sub {
            margin-top: 1px;
            color: var(--text-soft);
            font-size: 0.58rem;
          }
        }

        @media (max-width: 650px) {
          .topbar {
            align-items: flex-start;
            min-height: auto;
            padding-bottom: 16px;
          }

          .mobile-brand {
            display: none;
          }

          .page-heading h1 {
            font-size: 1.55rem;
          }

          .page-heading p {
            font-size: 0.75rem;
          }

          .live-status {
            padding: 8px 10px;
          }

          .live-status span:last-child {
            display: none;
          }

          .profile-info {
            display: none;
          }

          .profile-avatar {
            width: 36px;
            height: 36px;
          }
        }
          .language-selector {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
}

.language-selector select {
  border: none;
  outline: none;
  background: transparent;
  color: var(--forest);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}

.language-selector select option {
  color: #1f3f2b;
  background: white;
}
      `}</style>
    </>
  );
}

export default Topbar;