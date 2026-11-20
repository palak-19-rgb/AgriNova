
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import API_URL from "../services/api";
function Dashboard() {
  const { t } = useTranslation();
  const [sensorData, setSensorData] = useState({
    temperature: null,
    humidity: null,
    timestamp: null,
     waterLevel: null,
  });
  const waterLevel = sensorData.waterLevel;


  const [connectionStatus, setConnectionStatus] = useState("Connecting");

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/data`);

        if (!response.ok) {
          throw new Error("Server response failed");
        }

        const data = await response.json();

        if (!active) return;

        setSensorData({
          temperature:
            data.temperature !== null &&
            data.temperature !== undefined &&
            data.temperature !== ""
              ? Number(data.temperature)
              : null,

          humidity:
            data.humidity !== null &&
            data.humidity !== undefined &&
            data.humidity !== ""
              ? Number(data.humidity)
              : null,

              waterLevel:
  data.waterLevel !== null &&
  data.waterLevel !== undefined &&
  data.waterLevel !== ""
    ? Number(data.waterLevel)
    : null,

          timestamp: data.timestamp || null,
        });

        setConnectionStatus("Live");
      } catch (error) {
        if (!active) return;

        console.error("Unable to connect to greenhouse server:", error);
        setConnectionStatus("Offline");
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 2000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const getTime = () => {
    if (!sensorData.timestamp) return "--";

    const date = new Date(sensorData.timestamp);

    if (Number.isNaN(date.getTime())) return "--";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const temperature = sensorData.temperature;
  const humidity = sensorData.humidity;

  const isLive = connectionStatus === "Live";

  const getStatusText = () => {
    if (connectionStatus === "Live") return t("live");
    if (connectionStatus === "Offline") return t("offline");
    return t("connecting");
  };

  const getReading = (value) => {
   return typeof value === "number" && Number.isFinite(value)
  ? String(value)
  : "--";
  };

  return (
    <>
      <style>{`
        .ag-dashboard {
          width: 100%;
          max-width: 1480px;
          margin: 0 auto;
          padding: 34px 42px 28px;
          color: #26382d;
          font-family: "DM Sans", sans-serif;
          animation: agFadeIn 0.4s ease;
        }

        @keyframes agFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ag-dashboard * {
          box-sizing: border-box;
        }

        /* Header */

        .ag-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          margin-bottom: 28px;
        }

        .ag-eyebrow {
          display: block;
          color: #718273;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .ag-header h1 {
          margin: 9px 0 0;
          color: #263d2e;
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(2rem, 3vw, 2.8rem);
          font-weight: 600;
          letter-spacing: -0.035em;
          line-height: 1.15;
        }

        .ag-header p {
          margin: 9px 0 0;
          color: #7b887e;
          font-size: 0.88rem;
          line-height: 1.6;
        }

        .ag-connection {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 155px;
          padding: 12px 15px;
          border: 1px solid #e5eae4;
          border-radius: 10px;
          background: #fff;
        }

        .ag-connection-dot {
          width: 8px;
          height: 8px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #d4a34d;
        }

        .ag-connection-dot.live {
          background: #548263;
        }

        .ag-connection-dot.offline {
          background: #bd6860;
        }

        .ag-connection strong {
          display: block;
          color: #354b3b;
          font-size: 0.78rem;
          font-weight: 650;
        }

        .ag-connection small {
          display: block;
          margin-top: 3px;
          color: #8a958c;
          font-size: 0.67rem;
        }

        /* Hero */

        .ag-hero {
          position: relative;
          display: flex;
          align-items: center;
          min-height: 265px;
          overflow: hidden;
          border-radius: 13px;
          background: #294a35;
          isolation: isolate;
        }

        .ag-hero-image {
          position: absolute;
          inset: 0;
          z-index: -2;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 52%;
        }

        .ag-hero::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background: linear-gradient(
            90deg,
            rgba(24, 49, 34, 0.91) 0%,
            rgba(24, 49, 34, 0.77) 43%,
            rgba(24, 49, 34, 0.15) 100%
          );
        }

        .ag-hero-content {
          max-width: 560px;
          padding: 38px 44px;
          color: white;
        }

        .ag-hero-label {
          color: #d0dfd0;
          font-size: 0.68rem;
          font-weight: 650;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .ag-hero h2 {
          margin: 13px 0 0;
          color: #fff;
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 500;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }

        .ag-hero p {
          max-width: 420px;
          margin: 13px 0 0;
          color: rgba(255, 255, 255, 0.79);
          font-size: 0.83rem;
          line-height: 1.7;
        }

        .ag-hero-meta {
          display: flex;
          gap: 32px;
          margin-top: 25px;
        }

        .ag-hero-meta span {
          display: block;
          color: rgba(255, 255, 255, 0.62);
          font-size: 0.66rem;
        }

        .ag-hero-meta strong {
          display: block;
          margin-top: 5px;
          color: #fff;
          font-size: 0.78rem;
          font-weight: 600;
        }

        /* Section heading */

        .ag-section {
          margin-top: 35px;
        }

        .ag-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        .ag-section-heading h2 {
          margin: 6px 0 0;
          color: #304637;
          font-family: "Playfair Display", Georgia, serif;
          font-size: 1.55rem;
          font-weight: 600;
        }

        .ag-updated {
          color: #879389;
          font-size: 0.7rem;
        }

        /* Sensor cards */

        .ag-sensor-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .ag-sensor-card {
          min-width: 0;
          padding: 21px 22px;
          border: 1px solid #e7ebe5;
          border-radius: 11px;
          background: #fff;
          transition: border-color 0.2s ease;
        }

        .ag-sensor-card:hover {
          border-color: #cbd8cb;
        }

        .ag-sensor-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .ag-sensor-name {
          color: #637267;
          font-size: 0.79rem;
          font-weight: 600;
        }

        .ag-sensor-tag {
          padding: 5px 9px;
          border-radius: 5px;
          background: #f1f4f0;
          color: #718074;
          font-size: 0.64rem;
          font-weight: 600;
        }

        .ag-sensor-tag.live {
          background: #edf4ee;
          color: #4d7757;
        }

        .ag-sensor-value {
          display: flex;
          align-items: baseline;
          gap: 5px;
          margin-top: 24px;
          color: #2d4534;
          font-family: "Playfair Display", Georgia, serif;
          font-size: 2.65rem;
          font-weight: 600;
          line-height: 1;
        }

        .ag-sensor-value small {
          color: #829084;
          font-family: "DM Sans", sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .ag-sensor-description {
          margin: 11px 0 0;
          color: #8a958c;
          font-size: 0.7rem;
        }

        /* Lower section */

        .ag-lower-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 16px;
        }

        .ag-panel {
          min-width: 0;
          padding: 23px;
          border: 1px solid #e7ebe5;
          border-radius: 11px;
          background: #fff;
        }

        .ag-panel h3 {
          margin: 7px 0 0;
          color: #304637;
          font-family: "Playfair Display", Georgia, serif;
          font-size: 1.35rem;
          font-weight: 600;
        }

        .ag-panel-description {
          margin: 9px 0 0;
          color: #879389;
          font-size: 0.77rem;
          line-height: 1.65;
        }

        /* System rows */

        .ag-system-list {
          margin-top: 20px;
        }

        .ag-system-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #edf0ec;
        }

        .ag-system-row:last-child {
          border-bottom: 0;
          padding-bottom: 0;
        }

        .ag-system-row span {
          color: #748177;
          font-size: 0.76rem;
        }

        .ag-system-row strong {
          color: #4e6754;
          font-size: 0.73rem;
          font-weight: 650;
          text-align: right;
        }

        .ag-system-row strong.pending {
          color: #a17d43;
        }

        .ag-system-row strong.error {
          color: #b45e58;
        }

        /* Information panel */

        .ag-info-panel {
          background: #f7f8f5;
        }

        .ag-info-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          margin-bottom: 17px;
          border: 1px solid #e1e8df;
          border-radius: 8px;
          color: #55735b;
          font-size: 1rem;
        }

        .ag-info-panel h3 {
          max-width: 350px;
        }

        .ag-info-panel p {
          max-width: 440px;
          margin: 10px 0 0;
          color: #7e8a80;
          font-size: 0.77rem;
          line-height: 1.7;
        }

        /* Footer */

        .ag-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-top: 25px;
          padding-top: 16px;
          border-top: 1px solid #e8ece6;
          color: #929c93;
          font-size: 0.66rem;
        }

        /* Responsive */

        @media (max-width: 1000px) {
          .ag-dashboard {
            padding: 28px 25px;
          }

          .ag-sensor-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ag-lower-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .ag-dashboard {
            padding: 22px 16px;
          }

          .ag-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .ag-connection {
            width: 100%;
          }

          .ag-hero {
            min-height: 300px;
          }

          .ag-hero-content {
            padding: 28px 23px;
          }

          .ag-hero::after {
            background: linear-gradient(
              90deg,
              rgba(24, 49, 34, 0.9),
              rgba(24, 49, 34, 0.58)
            );
          }

          .ag-hero-meta {
            gap: 22px;
            flex-wrap: wrap;
          }

          .ag-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .ag-sensor-grid {
            grid-template-columns: 1fr;
          }

          .ag-sensor-card {
            padding: 20px;
          }

          .ag-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ag-dashboard {
            animation: none;
          }

          .ag-sensor-card {
            transition: none;
          }
        }
      `}</style>

      <main className="ag-dashboard">

        {/* Header */}

        <header className="ag-header">
          <div>
            <span className="ag-eyebrow">
              {t("greenhouseOverview")}
            </span>

            <h1>{t("goodMorning")}</h1>

            <p>{t("dashboardIntro")}</p>
          </div>

          <div className="ag-connection">
            <span
              className={`ag-connection-dot ${
                isLive
                  ? "live"
                  : connectionStatus === "Offline"
                  ? "offline"
                  : ""
              }`}
            />

            <div>
              <strong>{getStatusText()}</strong>
              <small>{t("sensorConnection")}</small>
            </div>
          </div>
        </header>

        {/* Greenhouse banner */}

        <section className="ag-hero">
          <img
            className="ag-hero-image"
            src="https://images.unsplash.com/photo-1623263376046-058d2e3fa27c?auto=format&fit=crop&w=1800&q=85"
            alt="Greenhouse interior with rows of growing plants"
          />

          <div className="ag-hero-content">
            <span className="ag-hero-label">
              {t("agrinovaGreenhouse")}
            </span>

            <h2>
              {t("healthierEnvironment")}
            </h2>

            <p>{t("heroDescription")}</p>

            <div className="ag-hero-meta">
              <div>
                <span>{t("lastUpdated")}</span>
                <strong>{getTime()}</strong>
              </div>

              <div>
                <span>{t("system")}</span>
                <strong>{t("automaticMonitoring")}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Sensor readings */}

        <section className="ag-section">
          <div className="ag-section-heading">
            <div>
              <span className="ag-eyebrow">
                {t("liveSensors")}
              </span>

              <h2>{t("environmentalConditions")}</h2>
            </div>

            <span className="ag-updated">
              {t("updatesEvery2Seconds")}
            </span>
          </div>

          <div className="ag-sensor-grid">

            {/* Temperature */}

            <article className="ag-sensor-card">
              <div className="ag-sensor-top">
                <span className="ag-sensor-name">
                  {t("temperature")}
                </span>

                <span className={`ag-sensor-tag ${temperature !== null && isLive ? "live" : ""}`}>
                  {temperature !== null && isLive
                    ? t("live")
                    : "Awaiting data"}
                </span>
              </div>

              <div className="ag-sensor-value">
                {getReading(temperature)}
                <small>°C</small>
              </div>

              <p className="ag-sensor-description">
                Temperature sensor reading
              </p>
            </article>

            {/* Humidity */}

            <article className="ag-sensor-card">
              <div className="ag-sensor-top">
                <span className="ag-sensor-name">
                  {t("humidity")}
                </span>

                <span className={`ag-sensor-tag ${humidity !== null && isLive ? "live" : ""}`}>
                  {humidity !== null && isLive
                    ? t("live")
                    : "Awaiting data"}
                </span>
              </div>

              <div className="ag-sensor-value">
                {getReading(humidity)}
                <small>%</small>
              </div>

              <p className="ag-sensor-description">
                Relative humidity reading
              </p>
            </article>

{/* Water Level */}

<article className="ag-sensor-card">
  <div className="ag-sensor-top">
    <span className="ag-sensor-name">
      Water Level Sensor
    </span>

    <span className={`ag-sensor-tag ${waterLevel !== null && isLive ? "live" : ""}`}>
      {waterLevel !== null && isLive ? "Live" : "Awaiting data"}
    </span>
  </div>

  <div className="ag-sensor-value">
    {getReading(waterLevel)}
    <small>Raw value</small>
  </div>

  <p className="ag-sensor-description">
    Raw reading received from the water level sensor
  </p>
</article>

            {/* Light */}

            <article className="ag-sensor-card">
              <div className="ag-sensor-top">
                <span className="ag-sensor-name">
                  {t("lightIntensity")}
                </span>

                <span className="ag-sensor-tag">
                  Pending
                </span>
              </div>

              <div className="ag-sensor-value">
                --
                <small>lux</small>
              </div>

              <p className="ag-sensor-description">
                Light sensor integration pending
              </p>
            </article>

          </div>
        </section>

        {/* System overview */}

        <section className="ag-lower-grid">

          <article className="ag-panel">
            <span className="ag-eyebrow">
              System overview
            </span>

            <h3>Monitoring status</h3>

            <p className="ag-panel-description">
              A quick overview of your greenhouse monitoring connection.
            </p>

            <div className="ag-system-list">

              <div className="ag-system-row">
                <span>Backend connection</span>

                <strong
                  className={
                    connectionStatus === "Offline"
                      ? "error"
                      : connectionStatus === "Live"
                      ? ""
                      : "pending"
                  }
                >
                  {connectionStatus}
                </strong>
              </div>

              <div className="ag-system-row">
                <span>Temperature data</span>

                <strong className={temperature === null ? "pending" : ""}>
                  {temperature !== null ? "Available" : "Waiting for sensor"}
                </strong>
              </div>

              <div className="ag-system-row">
                <span>Humidity data</span>

                <strong className={humidity === null ? "pending" : ""}>
                  {humidity !== null ? "Available" : "Waiting for sensor"}
                </strong>
              </div>

              <div className="ag-system-row">
                <span>Light sensor</span>
                <strong className="pending">Integration pending</strong>
              </div>

            </div>
          </article>

          {/* Information */}

          <article className="ag-panel ag-info-panel">
            <div className="ag-info-mark">i</div>

            <span className="ag-eyebrow">
              About your dashboard
            </span>

            <h3>Your greenhouse, in one place.</h3>

            <p>
              AgriNova brings environmental readings and
              greenhouse information together in one dashboard.
              Once the sensor hardware is integrated, live
              readings will appear here automatically.
            </p>
          </article>

        </section>

        {/* Footer */}

        <footer className="ag-footer">
          <span>AgriNova · Smart Greenhouse Monitoring</span>

          <span>Automatic data refresh · 2 seconds</span>
        </footer>

      </main>
    </>
  );
}

export default Dashboard;
