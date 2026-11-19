import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
function SoilIntelligence() {
  const { t } = useTranslation();
const [moisture, setMoisture] = useState(null);
const [soilTemp, setSoilTemp] = useState(null);
const [sensorConnected, setSensorConnected] = useState(false);
useEffect(() => {
  const fetchSoilData = async () => {
    try {
      const response = await fetch("http://localhost:5000/data");

      if (!response.ok) {
        throw new Error("Failed to fetch sensor data");
      }

     const data = await response.json();

setSensorConnected(
  data.sensorConnected === true &&
  typeof data.soilMoisture === "number" &&
  typeof data.soilTemperature === "number"
);

if (
  data.sensorConnected === true &&
  typeof data.soilMoisture === "number" &&
  typeof data.soilTemperature === "number"
) {
  setMoisture(data.soilMoisture);
  setSoilTemp(data.soilTemperature);
} else {
  setMoisture(null);
  setSoilTemp(null);
}
    } catch (error) {
      console.error("Soil sensor API error:", error);
    
    setSensorConnected(false);
setMoisture(null);
setSoilTemp(null);}
  };

  fetchSoilData();

  const interval = setInterval(fetchSoilData, 2000);

  return () => clearInterval(interval);
}, []);

  const moistureStatus =
  moisture === null
    ? "No sensor data"
    : moisture >= 55 && moisture <= 75
    ? t("optimal")
    : moisture < 55
    ? t("needsWater")
    : t("highMoisture");

const moistureColor =
  moisture === null
    ? "warning"
    : moisture >= 55 && moisture <= 75
    ? "optimal"
    : moisture < 55
    ? "warning"
    : "high";
  return (
    <div className="soil-page">
      <style>{`
        .soil-page {
          width: 100%;
          min-height: 100%;
        }

        .soil-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 28px;
        }

        .soil-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;
          background: rgba(255,255,255,0.7);
          border: 1px solid var(--border);
          border-radius: 999px;
          color: var(--text-soft);
          font-size: 0.78rem;
          white-space: nowrap;
        }

        .soil-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.75fr);
          gap: 22px;
        }

        .soil-card {
          padding: 26px;
        }

        .card-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 24px;
        }

        .card-heading h2 {
          margin-top: 5px;
          font-family: "Playfair Display", serif;
          font-size: 1.45rem;
          color: var(--forest);
        }

        .card-heading p {
          margin-top: 6px;
          color: var(--text-soft);
          font-size: 0.83rem;
        }

        .soil-main-card {
          min-height: 420px;
        }

        .moisture-layout {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 42px;
          align-items: center;
        }

        .moisture-ring {
          width: 220px;
          height: 220px;
          margin: 0 auto;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
      background: conic-gradient(
  var(--leaf) ${moisture === null ? 0 : moisture * 3.6}deg,
  #e6eee6 ${moisture === null ? 0 : moisture * 3.6}deg 360deg
);
        }

        .moisture-ring::before {
          content: "";
          position: absolute;
          inset: 17px;
          border-radius: 50%;
          background: #fff;
        }

        .moisture-ring-content {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .moisture-number {
          font-family: "Playfair Display", serif;
          font-size: 3.4rem;
          line-height: 1;
          color: var(--forest);
        }

        .moisture-unit {
          margin-top: 7px;
          color: var(--text-soft);
          font-size: 0.78rem;
        }

        .moisture-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 13px;
          padding: 7px 11px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .moisture-status.optimal {
          background: rgba(63,139,88,0.1);
          color: var(--success);
        }

        .moisture-status.warning {
          background: rgba(197,138,53,0.11);
          color: var(--warning);
        }

        .moisture-status.high {
          background: rgba(184,92,80,0.1);
          color: var(--danger);
        }

        .moisture-analysis {
          display: grid;
          gap: 15px;
        }

        .analysis-item {
          padding: 17px;
          border-radius: 16px;
          background: rgba(245,247,239,0.85);
          border: 1px solid var(--border);
        }

        .analysis-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .analysis-label {
          color: var(--text-soft);
          font-size: 0.75rem;
        }

        .analysis-value {
          color: var(--forest);
          font-weight: 700;
          font-size: 0.9rem;
        }

        .analysis-bar {
          height: 6px;
          margin-top: 12px;
          border-radius: 20px;
          background: #e1e9df;
          overflow: hidden;
        }

        .analysis-fill {
          height: 100%;
          border-radius: inherit;
          background: var(--leaf);
          transition: width 0.6s ease;
        }

        .side-stack {
          display: grid;
          gap: 22px;
        }

        .temperature-card {
          min-height: 198px;
        }

        .temperature-value {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-top: 15px;
        }

        .temperature-value strong {
          font-family: "Playfair Display", serif;
          font-size: 3.2rem;
          color: var(--forest);
        }

        .temperature-value span {
          color: var(--text-soft);
          font-size: 0.9rem;
        }

        .temp-range {
          margin-top: 18px;
          height: 8px;
          border-radius: 20px;
          background: linear-gradient(
            90deg,
            #dcebdc 0%,
            #91b89a 45%,
            #4f8f5b 70%,
            #d8b979 100%
          );
          position: relative;
        }

        .temp-marker {
          position: absolute;
          top: 50%;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: var(--forest);
          border: 3px solid #fff;
          box-shadow: 0 3px 10px rgba(23,63,43,0.2);
          transform: translate(-50%, -50%);
        }

        .temp-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          color: var(--text-soft);
          font-size: 0.68rem;
        }

        .irrigation-card {
          min-height: 198px;
          background:
            linear-gradient(
              135deg,
              rgba(23,63,43,0.98),
              rgba(40,91,61,0.94)
            );
          color: #fff;
          overflow: hidden;
          position: relative;
        }

        .irrigation-card::after {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          right: -70px;
          bottom: -90px;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
        }

        .irrigation-card .eyebrow {
          color: #b9d5bd;
        }

        .irrigation-card h2 {
          color: #fff;
        }

        .irrigation-card p {
          color: rgba(255,255,255,0.72);
        }

        .irrigation-decision {
          margin-top: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .decision-text strong {
          display: block;
          font-size: 1rem;
        }

        .decision-text span {
          display: block;
          margin-top: 4px;
          color: rgba(255,255,255,0.65);
          font-size: 0.7rem;
        }

        .decision-pill {
          padding: 9px 13px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          color: #d9eedc;
          font-size: 0.7rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .insight-card {
          margin-top: 22px;
          padding: 25px 28px;
          display: grid;
          grid-template-columns: 55px 1fr auto;
          gap: 18px;
          align-items: center;
        }

        .insight-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--mint);
          font-size: 22px;
        }

        .insight-content h3 {
          color: var(--forest);
          font-size: 0.95rem;
        }

        .insight-content p {
          margin-top: 5px;
          color: var(--text-soft);
          font-size: 0.78rem;
          line-height: 1.55;
        }

        .insight-tag {
          padding: 9px 13px;
          border-radius: 999px;
          background: rgba(79,143,91,0.08);
          color: var(--success);
          font-size: 0.7rem;
          font-weight: 700;
        }

        .soil-zones {
          margin-top: 22px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .zone-card {
          padding: 20px;
        }

        .zone-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .zone-name {
          font-weight: 700;
          color: var(--forest);
          font-size: 0.86rem;
        }

        .zone-number {
          width: 31px;
          height: 31px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--mint);
          color: var(--forest);
          font-size: 0.72rem;
          font-weight: 700;
        }

        .zone-moisture {
          margin-top: 18px;
          display: flex;
          align-items: baseline;
          gap: 5px;
        }

        .zone-moisture strong {
          font-family: "Playfair Display", serif;
          font-size: 2rem;
          color: var(--forest);
        }

        .zone-moisture span {
          color: var(--text-soft);
          font-size: 0.72rem;
        }

        .zone-bar {
          height: 5px;
          margin-top: 13px;
          border-radius: 20px;
          background: #e5ece4;
          overflow: hidden;
        }

        .zone-bar-fill {
          height: 100%;
          background: var(--leaf);
          border-radius: inherit;
        }

        .zone-status {
          margin-top: 10px;
          color: var(--success);
          font-size: 0.68rem;
          font-weight: 700;
        }

        @media (max-width: 1050px) {
          .moisture-layout {
            grid-template-columns: 1fr;
          }

          .moisture-ring {
            width: 190px;
            height: 190px;
          }

          .soil-grid {
            grid-template-columns: 1fr;
          }

          .side-stack {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 700px) {
          .soil-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 15px;
          }

          .side-stack {
            grid-template-columns: 1fr;
          }

          .soil-zones {
            grid-template-columns: 1fr;
          }

          .insight-card {
            grid-template-columns: 50px 1fr;
          }

          .insight-tag {
            grid-column: 2;
            width: fit-content;
          }

          .soil-card {
            padding: 20px;
          }
        }

        @media (max-width: 480px) {
          .moisture-ring {
            width: 175px;
            height: 175px;
          }

          .moisture-number {
            font-size: 2.8rem;
          }
        }
      `}</style>

      <header className="soil-header">
        <div>
          <span className="eyebrow">{t("soilIntelligence")}</span>

          <h1 className="page-title">
           {t("soilNeeds")}
          </h1>

          <p className="page-description">
           {t("soilIntro")}
          </p>
        </div>

       <div className="soil-header-right">
  <span className={`status-dot ${sensorConnected ? "online" : ""}`}></span>
  {sensorConnected ? "Sensor Connected" : "No Sensor Connected"}
</div>
      </header>

      <section className="soil-grid">
        <div className="soil-card soil-main-card glass-card hover-lift">
          <div className="card-heading">
            <div>
              <span className="eyebrow">{t("primarySoilSensor")}</span>
              <h2>	{t("moistureCondition")}</h2>
              <p>{t("currentSoilReading")}</p>
            </div>

            <span className={`moisture-status ${moistureColor}`}>
             <span className={`status-dot ${sensorConnected ? "online" : ""}`}></span> <span className="status-dot online"></span>
              {moistureStatus}
            </span>
          </div>

          <div className="moisture-layout">
            <div className="moisture-ring">
              <div className="moisture-ring-content">
                <div className="moisture-number">
                  {moisture === null ? "--" : Math.round(moisture)}
                </div>
                <div className="moisture-unit">
                  {t("soilMoisture")} %
                </div>
              </div>
            </div>

            <div className="moisture-analysis">
              <div className="analysis-item">
                <div className="analysis-top">
                  <span className="analysis-label">
                    	{t("currentMoisture")}
                  </span>
                  <span className="analysis-value">
                   {moisture === null ? "--" : `${Math.round(moisture)}%`}
                  </span>
                </div>

                <div className="analysis-bar">
                  <div
                    className="analysis-fill"
                    style={{ width: `${moisture === null ? 0 : moisture}%` }}
                  ></div>
                </div>
              </div>

              <div className="analysis-item">
                <div className="analysis-top">
                  <span className="analysis-label">
                   	{t("recommendedRange")}
                  </span>
                  <span className="analysis-value">
                    55–75%
                  </span>
                </div>

                <div className="analysis-bar">
                  <div
                    className="analysis-fill"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>

              <div className="analysis-item">
                <div className="analysis-top">
                  <span className="analysis-label">
                    {t("irrigationThreshold")}
                  </span>
                  <span className="analysis-value">
                    45%
                  </span>
                </div>

                <div className="analysis-bar">
                  <div
                    className="analysis-fill"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="side-stack">
          <div className="soil-card temperature-card glass-card hover-lift">
            <div className="card-heading">
              <div>
                <span className="eyebrow">DS18B20</span>
                <h2>{t("soilTemperature")}</h2>
                <p>	{t("rootZoneTemperature")}</p>
              </div>
            </div>

          <div className="temperature-value">
  <strong>{soilTemp === null ? "--" : soilTemp}</strong>
  <span>{soilTemp === null ? "" : "°C"}</span>
</div>

            <div className="temp-range">
             <div
  className="temp-marker"
  style={{
    display: soilTemp === null ? "none" : "block",
    left: `${Math.min(
      95,
      Math.max(5, ((soilTemp - 15) / 25) * 100)
    )}%`,
  }}
></div>
            </div>

            <div className="temp-labels">
              <span>15°C</span>
              <span>Optimal</span>
              <span>40°C</span>
            </div>
          </div>

          <div className="soil-card irrigation-card glass-card">
            <div className="card-heading">
              <div>
                <span className="eyebrow">	{t("smartIrrigation")}</span>
                <h2>{t("irrigationDecision")}</h2>
                <p>{t("basedOnSoilConditions")}</p>
              </div>
            </div>

            <div className="irrigation-decision">
  <div className="decision-text">
    <strong>
      {moisture === null
        ? "Waiting for sensor data"
        : moisture < 45
        ? "Irrigation Recommended"
        : moisture > 75
        ? "Avoid Irrigation"
        : "No Irrigation Needed"}
    </strong>

    <span>
      {moisture === null
        ? "Connect soil sensor to get recommendations"
        : `Current soil moisture: ${Math.round(moisture)}%`}
    </span>
  </div>

  <div className="decision-pill">
    {moisture === null
      ? "Waiting"
      : moisture < 45
      ? "Water Needed"
      : moisture > 75
      ? "Moisture High"
      : "Stable"}
  </div>
</div>
          </div>
        </div>
      </section>

     <section className="soil-zones">
  <div className="zone-card glass-card hover-lift">
    <div className="zone-top">
      <span className="zone-name">Soil Sensor</span>
      <span className="zone-number">01</span>
    </div>

    <div className="zone-moisture">
      <strong>
        {moisture === null ? "--" : `${Math.round(moisture)}%`}
      </strong>
      <span>moisture</span>
    </div>

    <div className="zone-bar">
      <div
        className="zone-bar-fill"
        style={{
          width: `${moisture === null ? 0 : moisture}%`,
        }}
      ></div>
    </div>

    <div className="zone-status">
      {moisture === null ? "Waiting for sensor data" : moistureStatus}
    </div>
  </div>
</section>
      <section className="insight-card glass-card hover-lift">
        <div className="insight-icon">✦</div>

        <div className="insight-content">
          <h3>{t("agrinovaRecommendation")}</h3>

        <p>
  {moisture === null
    ? "Connect the soil sensor to receive soil health recommendations."
    : moisture < 45
    ? "Soil moisture is low. Irrigation is recommended."
    : moisture > 75
    ? "Soil moisture is high. Avoid additional irrigation."
    : "Soil moisture is within the recommended range. Continue monitoring."}
</p>
        </div>

       <span className="insight-tag">
  {moisture === null
    ? "Awaiting Data"
    : moisture < 45
    ? "Water Needed"
    : moisture > 75
    ? "Moisture High"
    : "Optimal Conditions"}
</span>
      </section>
    </div>
  );
}

export default SoilIntelligence;