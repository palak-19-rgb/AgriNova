import React from "react";
import { useTranslation } from "react-i18next";
function Sidebar({ activePage, setActivePage }) {
  const { t } = useTranslation();
 const navigation = [
  { id: "dashboard", label: t("dashboard"), icon: "⌂" },
  { id: "soil", label: t("soil"), icon: "◉" },
  { id: "analytics", label: t("analytics"), icon: "↗" },
  { id: "alerts", label: t("alerts"), icon: "!", badge: 2 },
  { id: "sensors", label: t("sensors"), icon: "⌁" },
    { id: "cropDoctor", label: "Crop Doctor", icon: "✿" },
  { id: "settings", label: t("settings"), icon: "⚙" },
];
  return (
    <>
      <style>{`

        /* =====================================================
           AGRINOVA SIDEBAR
        ===================================================== */

        .agrinova-sidebar {
          position: fixed;
          z-index: 100;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          width: 255px;
          height: 100vh;
          padding: 30px 18px 22px;
          border-right: 1px solid rgba(31, 63, 43, 0.09);
          background: rgba(248, 250, 245, 0.94);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        /* =====================================================
           LOGO
        ===================================================== */

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 12px;
          margin-bottom: 48px;
        }

        .sidebar-logo-mark {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 39px;
          height: 39px;
          overflow: hidden;
          border-radius: 13px;
          background: var(--forest);
          box-shadow: 0 7px 20px rgba(23, 63, 43, 0.18);
        }

        .sidebar-logo-mark::before {
          content: "";
          position: absolute;
          width: 23px;
          height: 13px;
          top: 10px;
          left: 7px;
          border-radius: 100% 0 100% 0;
          background: #9fc491;
          transform: rotate(-25deg);
        }

        .sidebar-logo-mark::after {
          content: "";
          position: absolute;
          width: 3px;
          height: 17px;
          left: 19px;
          top: 13px;
          border-radius: 5px;
          background: #d5e6ce;
          transform: rotate(25deg);
        }

        .sidebar-logo-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .sidebar-logo-text strong {
          color: var(--forest);
          font-family: "Playfair Display", serif;
          font-size: 1.22rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .sidebar-logo-text span {
          color: #8a968d;
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        /* =====================================================
           NAVIGATION
        ===================================================== */

        .sidebar-section-label {
          padding: 0 13px;
          margin-bottom: 10px;
          color: #9aa59d;
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .sidebar-navigation {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .sidebar-nav-item {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          min-height: 47px;
          padding: 0 13px;
          border-radius: 13px;
          background: transparent;
          color: #718078;
          text-align: left;
          transition:
            background 0.25s ease,
            color 0.25s ease,
            transform 0.25s ease;
        }

        .sidebar-nav-item:hover {
          background: rgba(79, 143, 91, 0.07);
          color: var(--forest);
          transform: translateX(2px);
        }

        .sidebar-nav-item.active {
          background: #e5eee2;
          color: var(--forest);
          font-weight: 600;
        }

        .sidebar-nav-item.active::before {
          content: "";
          position: absolute;
          left: 0;
          width: 3px;
          height: 22px;
          border-radius: 0 5px 5px 0;
          background: var(--leaf);
        }

        .sidebar-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 29px;
          height: 29px;
          margin-right: 11px;
          border-radius: 9px;
          font-size: 0.92rem;
          transition: background 0.25s ease;
        }

        .sidebar-nav-item.active .sidebar-nav-icon {
          background: rgba(79, 143, 91, 0.11);
        }

        .sidebar-nav-label {
          flex: 1;
          font-size: 0.75rem;
        }

        .sidebar-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 19px;
          height: 19px;
          padding: 0 5px;
          border-radius: 20px;
          background: #d9e8d4;
          color: var(--forest);
          font-size: 0.58rem;
          font-weight: 700;
        }

        /* =====================================================
           SIDEBAR BOTTOM
        ===================================================== */

        .sidebar-bottom {
          margin-top: auto;
        }

        .sidebar-system-card {
          position: relative;
          overflow: hidden;
          padding: 17px;
          border: 1px solid rgba(79, 143, 91, 0.1);
          border-radius: 17px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(169, 204, 160, 0.3),
              transparent 55%
            ),
            #eef4ea;
        }

        .sidebar-system-card::after {
          content: "";
          position: absolute;
          width: 70px;
          height: 70px;
          right: -30px;
          bottom: -35px;
          border: 1px solid rgba(79, 143, 91, 0.12);
          border-radius: 50%;
        }

        .system-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .system-online-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--success);
          box-shadow: 0 0 0 4px rgba(63, 139, 88, 0.1);
        }

        .system-card-header span {
          color: var(--success);
          font-size: 0.62rem;
          font-weight: 700;
        }

        .sidebar-system-card strong {
          display: block;
          color: var(--forest);
          font-size: 0.73rem;
        }

        .sidebar-system-card p {
          margin-top: 5px;
          color: #819087;
          font-size: 0.6rem;
          line-height: 1.5;
        }

        /* =====================================================
           VERSION
        ===================================================== */

        .sidebar-version {
          padding: 17px 12px 0;
          color: #a1aaa3;
          font-size: 0.56rem;
        }

        /* =====================================================
           MOBILE BUTTON
        ===================================================== */

        .mobile-sidebar-button {
          display: none;
        }

        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 900px) {

          .agrinova-sidebar {
            width: 220px;
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 700px) {

          .agrinova-sidebar {
            width: 245px;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            box-shadow: 15px 0 40px rgba(23, 63, 43, 0.12);
          }

          .agrinova-sidebar.mobile-open {
            transform: translateX(0);
          }

          .mobile-sidebar-button {
            position: fixed;
            z-index: 120;
            top: 16px;
            left: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            border: 1px solid rgba(31, 63, 43, 0.1);
            border-radius: 13px;
            background: rgba(255, 255, 255, 0.9);
            color: var(--forest);
            font-size: 1.2rem;
            box-shadow: 0 8px 25px rgba(31, 63, 43, 0.1);
          }

          .sidebar-overlay {
            position: fixed;
            z-index: 90;
            inset: 0;
            background: rgba(23, 63, 43, 0.18);
            backdrop-filter: blur(2px);
          }
        }

      `}</style>

      {/* Mobile menu button */}

      <button
        className="mobile-sidebar-button"
        onClick={() => setActivePage("menu")}
        aria-label="Open navigation"
      >
        ☰
      </button>

      <aside className="agrinova-sidebar">

        {/* ===================================================
            LOGO
        =================================================== */}

        <div className="sidebar-logo">

          <div className="sidebar-logo-mark"></div>

          <div className="sidebar-logo-text">
            <strong>AgriNova</strong>
            <span>Smart Agriculture</span>
          </div>

        </div>

        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <span className="sidebar-section-label">
        {t("workspace")}
        </span>

        <nav className="sidebar-navigation">

          {navigation.map((item) => (

            <button
              key={item.id}
              className={`sidebar-nav-item ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => setActivePage(item.id)}
            >

              <span className="sidebar-nav-icon">
                {item.icon}
              </span>

              <span className="sidebar-nav-label">
                {item.label}
              </span>

              {item.badge && (
                <span className="sidebar-badge">
                  {item.badge}
                </span>
              )}

            </button>

          ))}

        </nav>

        {/* ===================================================
            BOTTOM
        =================================================== */}

        <div className="sidebar-bottom">

          <div className="sidebar-system-card">

            <div className="system-card-header">

              <span className="system-online-dot"></span>

              <span>
              {t("systemOnline")}
              </span>

            </div>

            <strong>
            {t("greenhouseUnit")}
            </strong>

            <p>
             {t("controllerStatus")}
            </p>

          </div>

          <div className="sidebar-version">
            AgriNova v1.0 • Capstone Edition
          </div>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;