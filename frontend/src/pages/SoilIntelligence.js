
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import API_URL from "../services/api";

function SoilIntelligence() {
  const { t } = useTranslation();

  const [moisture, setMoisture] = useState(null);
  const [soilTemp, setSoilTemp] = useState(null);
  const [sensorConnected, setSensorConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchSoilData = async () => {
      try {
        const response = await fetch(`${API_URL}/data`);

        if (!response.ok) {
          throw new Error("Failed to fetch soil data");
        }

        const data = await response.json();

        if (!isMounted) return;

        const validMoisture =
          typeof data.soilMoisture === "number";

        const validTemperature =
          typeof data.soilTemperature === "number";

        setMoisture(validMoisture ? data.soilMoisture : null);
        setSoilTemp(validTemperature ? data.soilTemperature : null);

        setSensorConnected(validMoisture && validTemperature);
      } catch (error) {
        console.error("Soil sensor API error:", error);

        if (isMounted) {
          setSensorConnected(false);
          setMoisture(null);
          setSoilTemp(null);
        }
      }
    };

    fetchSoilData();

    const interval = setInterval(fetchSoilData, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const moistureStatus =
    moisture === null ? "Awaiting sensor data" : "Raw ADC Reading";

  const moistureColor =
    moisture === null ? "warning" : "optimal";

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
            var(--leaf) 0deg,
            #e6eee6 0deg 360deg
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
          background: linear-gradient(
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

        {/* Soil moisture card */}
        <div className="soil-card soil-main-card glass-card hover-lift">
          <div className="card-heading">
            <div>
              <span className="eyebrow">{t("primarySoilSensor")}</span>
              <h2>{t("moistureCondition")}</h2>
              <p>Live raw readings from the soil moisture sensor</p>
            </div>

            <span className={`moisture-status ${moistureColor}`}>
              <span className={`status-dot ${sensorConnected ? "online" : ""}`}></span>
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
                  Raw ADC
                </div>
              </div>
            </div>

            <div className="moisture-analysis">

              <div className="analysis-item">
                <div className="analysis-top">
                  <span className="analysis-label">
                    Current soil moisture reading
                  </span>

                  <span className="analysis-value">
                    {moisture === null ? "--" : `${moisture} ADC`}
                  </span>
                </div>
              </div>

              <div className="analysis-item">
                <div className="analysis-top">
                  <span className="analysis-label">
                    Sensor type
                  </span>

                  <span className="analysis-value">
                    Analog
                  </span>
                </div>
              </div>

              <div className="analysis-item">
                <div className="analysis-top">
                  <span className="analysis-label">
                    Measurement unit
                  </span>

                  <span className="analysis-value">
                    Raw ADC
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Temperature and irrigation cards */}
        <div className="side-stack">

          <div className="soil-card temperature-card glass-card hover-lift">
            <div className="card-heading">
              <div>
                <span className="eyebrow">DS18B20</span>
                <h2>{t("soilTemperature")}</h2>
                <p>{t("rootZoneTemperature")}</p>
              </div>
            </div>

            <div className="temperature-value">
              <strong>
                {soilTemp === null ? "--" : soilTemp.toFixed(2)}
              </strong>

              <span>
                {soilTemp === null ? "" : "°C"}
              </span>
            </div>

            <div className="temp-range">
              {soilTemp !== null && (
                <div
                  className="temp-marker"
                  style={{
                    left: `${Math.min(
                      95,
                      Math.max(5, ((soilTemp - 15) / 25) * 100)
                    )}%`,
                  }}
                ></div>
              )}
            </div>

            <div className="temp-labels">
              <span>15°C</span>
              <span>Temperature scale</span>
              <span>40°C</span>
            </div>
          </div>

          <div className="soil-card irrigation-card glass-card">
            <div className="card-heading">
              <div>
                <span className="eyebrow">{t("smartIrrigation")}</span>
                <h2>Soil Monitoring</h2>
                <p>Based on actual sensor readings</p>
              </div>
            </div>

            <div className="irrigation-decision">
              <div className="decision-text">
                <strong>
                  {moisture === null
                    ? "Waiting for sensor data"
                    : "Moisture monitoring active"}
                </strong>

                <span>
                  {moisture === null
                    ? "Waiting for soil sensor readings"
                    : `Current reading: ${moisture} ADC`}
                </span>
              </div>

              <div className="decision-pill">
                {moisture === null ? "Waiting" : "Monitoring"}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Actual connected sensor */}
      <section className="soil-zones">
        <div className="zone-card glass-card hover-lift">

          <div className="zone-top">
            <span className="zone-name">Soil Moisture Sensor</span>
            <span className="zone-number">01</span>
          </div>

          <div className="zone-moisture">
            <strong>
              {moisture === null ? "--" : Math.round(moisture)}
            </strong>

            <span>ADC</span>
          </div>

          <div className="zone-bar">
            <div
              className="zone-bar-fill"
              style={{ width: "0%" }}
            ></div>
          </div>

          <div className="zone-status">
            {moisture === null
              ? "Waiting for sensor data"
              : "Live sensor reading available"}
          </div>

        </div>
      </section>

      {/* Recommendation */}
      <section className="insight-card glass-card hover-lift">

        <div className="insight-icon">✦</div>

        <div className="insight-content">
          <h3>{t("agrinovaRecommendation")}</h3>

          <p>
            {moisture === null
              ? "Waiting for soil moisture sensor readings."
              : "The soil moisture sensor is providing live raw ADC readings. Sensor calibration is required before generating accurate irrigation recommendations."}
          </p>
        </div>

        <span className="insight-tag">
          {moisture === null ? "Awaiting Data" : "Live Monitoring"}
        </span>

      </section>
    </div>
  );
}

export default SoilIntelligence;
