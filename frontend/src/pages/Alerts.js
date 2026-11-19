import React, { useEffect, useMemo, useState } from "react";
import API_URL from "../services/api";
function Alerts() {
  const [filter, setFilter] = useState("all");
  const [sensorData, setSensorData] = useState(null);
  const [resolvedAlerts, setResolvedAlerts] = useState([]);


useEffect(() => {
  const fetchAlertData = async () => {
    try {
      const response = await fetch(`${API_URL}/data`);

      if (!response.ok) {
        throw new Error("Failed to fetch alert data");
      }

      const data = await response.json();

      const validReadings =
        data.sensorConnected === true &&
        Number.isFinite(data.temperature) &&
        Number.isFinite(data.humidity) &&
        Number.isFinite(data.light) &&
        Number.isFinite(data.soilMoisture);

      setSensorData(validReadings ? data : null);

    } catch (error) {
      console.error("Alerts sensor API error:", error);
      setSensorData(null);
    }
  };

  fetchAlertData();

  const interval = setInterval(fetchAlertData, 2000);

  return () => clearInterval(interval);
}, []);


  const alerts = useMemo(() => {
    if (!sensorData) {
      return [];
    }

    const generatedAlerts = [];

    const temperature = Number(sensorData.temperature);
    const humidity = Number(sensorData.humidity);
    const light = Number(sensorData.light);
    const soilMoisture = Number(sensorData.soilMoisture);
    const soilTemperature = Number(sensorData.soilTemperature);

    /*
      -----------------------------
      SOIL MOISTURE ALERTS
      -----------------------------
    */

    if (soilMoisture < 40) {
      generatedAlerts.push({
        id: "soil-danger",
        severity: "danger",
        title: "Soil moisture is critically low",
        message:
          "Soil moisture has fallen significantly below the preferred range. Irrigation should be checked immediately.",
        source: "Capacitive Soil Moisture",
        zone: "Greenhouse 01",
        value: `${soilMoisture}%`,
        threshold: "< 40%",
        time: "Live",
        status: resolvedAlerts.includes("soil-danger")
          ? "resolved"
          : "active",
        icon: "!",
      });
    } else if (soilMoisture < 45) {
      generatedAlerts.push({
        id: "soil-warning",
        severity: "warning",
        title: "Soil moisture is below optimal range",
        message:
          "Soil moisture is approaching the irrigation threshold. Consider checking the growing zone before plants become stressed.",
        source: "Capacitive Soil Moisture",
        zone: "Greenhouse 01",
        value: `${soilMoisture}%`,
        threshold: "< 45%",
        time: "Live",
        status: resolvedAlerts.includes("soil-warning")
          ? "resolved"
          : "active",
        icon: "💧",
      });
    } 

    /*
      -----------------------------
      TEMPERATURE ALERTS
      -----------------------------
    */

    if (temperature > 32) {
      generatedAlerts.push({
        id: "temperature-danger",
        severity: "danger",
        title: "Greenhouse temperature is high",
        message:
          "Temperature has exceeded the preferred operating range and may affect crop health if it continues.",
        source: "SHT40",
        zone: "Greenhouse 01",
        value: `${temperature}°C`,
        threshold: "> 32°C",
        time: "Live",
        status: resolvedAlerts.includes("temperature-danger")
          ? "resolved"
          : "active",
        icon: "!",
      });
    } else if (temperature > 30) {
      generatedAlerts.push({
        id: "temperature-warning",
        severity: "warning",
        title: "Temperature is above optimal range",
        message:
          "Greenhouse temperature is slightly above the preferred range. Continue monitoring the environment.",
        source: "SHT40",
        zone: "Greenhouse 01",
        value: `${temperature}°C`,
        threshold: "> 30°C",
        time: "Live",
        status: resolvedAlerts.includes("temperature-warning")
          ? "resolved"
          : "active",
        icon: "🌡",
      });
    } else if (temperature < 20) {
      generatedAlerts.push({
        id: "temperature-low",
        severity: "warning",
        title: "Greenhouse temperature is low",
        message:
          "Temperature is below the preferred operating range for the monitored greenhouse.",
        source: "SHT40",
        zone: "Greenhouse 01",
        value: `${temperature}°C`,
        threshold: "< 20°C",
        time: "Live",
        status: resolvedAlerts.includes("temperature-low")
          ? "resolved"
          : "active",
        icon: "❄",
      });
    }

    /*
      -----------------------------
      HUMIDITY ALERTS
      -----------------------------
    */

    if (humidity > 80) {
      generatedAlerts.push({
        id: "humidity-high",
        severity: "warning",
        title: "Humidity is above target range",
        message:
          "High humidity can increase the risk of excessive moisture around plants. Continue monitoring ventilation.",
        source: "SHT40",
        zone: "Greenhouse 01",
        value: `${humidity}%`,
        threshold: "> 80%",
        time: "Live",
        status: resolvedAlerts.includes("humidity-high")
          ? "resolved"
          : "active",
        icon: "💧",
      });
    } else if (humidity < 45) {
      generatedAlerts.push({
        id: "humidity-low",
        severity: "warning",
        title: "Humidity is below target range",
        message:
          "Greenhouse humidity is lower than the preferred range and may increase plant water stress.",
        source: "SHT40",
        zone: "Greenhouse 01",
        value: `${humidity}%`,
        threshold: "< 45%",
        time: "Live",
        status: resolvedAlerts.includes("humidity-low")
          ? "resolved"
          : "active",
        icon: "◌",
      });
    }

    /*
      -----------------------------
      LIGHT ALERTS
      -----------------------------
    */

    if (light < 300) {
      generatedAlerts.push({
        id: "light-low",
        severity: "info",
        title: "Light intensity is low",
        message:
          "Current light intensity is relatively low. Monitor whether plants are receiving sufficient light for photosynthesis.",
        source: "BH1750",
        zone: "Greenhouse 01",
        value: `${light} lux`,
        threshold: "< 300 lux",
        time: "Live",
        status: resolvedAlerts.includes("light-low")
          ? "resolved"
          : "active",
        icon: "☀",
      });
    } 

    /*
      -----------------------------
      SOIL TEMPERATURE
      -----------------------------
    */

    if (soilTemperature > 30) {
      generatedAlerts.push({
        id: "soil-temperature-high",
        severity: "warning",
        title: "Soil temperature is elevated",
        message:
          "Soil temperature is above the preferred range. Monitor root-zone conditions closely.",
        source: "DS18B20",
        zone: "Root Zone",
        value: `${soilTemperature}°C`,
        threshold: "> 30°C",
        time: "Live",
        status: resolvedAlerts.includes(
          "soil-temperature-high"
        )
          ? "resolved"
          : "active",
        icon: "🌡",
      });
    }

    return generatedAlerts;
  }, [sensorData, resolvedAlerts]);

  const filteredAlerts = useMemo(() => {
    if (filter === "active") {
      return alerts.filter(
        (alert) => alert.status === "active"
      );
    }

    if (filter === "resolved") {
      return alerts.filter(
        (alert) => alert.status === "resolved"
      );
    }

    return alerts;
  }, [alerts, filter]);

  const activeCount = alerts.filter(
    (alert) => alert.status === "active"
  ).length;

  const warningCount = alerts.filter(
    (alert) =>
      alert.status === "active" &&
      (alert.severity === "warning" ||
        alert.severity === "danger")
  ).length;

  const resolveAlert = (id) => {
    setResolvedAlerts((current) => {
      if (current.includes(id)) {
        return current;
      }

      return [...current, id];
    });
  };

 const systemStatus = !sensorData
  ? "Waiting"
  : warningCount > 0
  ? "Attention"
  : "Good";
  return (
    <div className="alerts-page">
      <style>{`
        .alerts-page {
          width: 100%;
          min-height: calc(100vh - 56px);
          padding-bottom: 30px;
        }

        .alerts-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 28px;
        }

        .alerts-header-left {
          max-width: 720px;
        }

        .alerts-live {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 18px;
          padding: 9px 13px;
          border-radius: 999px;
          background: rgba(63, 139, 88, 0.08);
          color: var(--success);
          font-size: 0.76rem;
          font-weight: 700;
        }

        .alerts-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .alert-filter {
          display: flex;
          align-items: center;
          padding: 5px;
          border: 1px solid var(--border);
          border-radius: 14px;
          background: rgba(255,255,255,0.78);
          box-shadow: var(--shadow);
        }

        .filter-button {
          padding: 9px 14px;
          border-radius: 10px;
          background: transparent;
          color: var(--text-soft);
          font-size: 0.78rem;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .filter-button:hover {
          color: var(--forest);
        }

        .filter-button.active {
          background: var(--mint);
          color: var(--forest);
        }

        .alert-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 22px;
        }

        .summary-card {
          position: relative;
          overflow: hidden;
          padding: 22px;
          min-height: 125px;
        }

        .summary-card::after {
          content: "";
          position: absolute;
          width: 95px;
          height: 95px;
          right: -35px;
          bottom: -45px;
          border-radius: 50%;
          background: rgba(145, 184, 154, 0.16);
        }

        .summary-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .summary-label {
          color: var(--text-soft);
          font-size: 0.78rem;
          font-weight: 600;
        }

        .summary-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: var(--mint);
          color: var(--forest);
          font-size: 16px;
        }

        .summary-value {
          display: block;
          margin-top: 12px;
          color: var(--forest);
          font-family: "Playfair Display", serif;
          font-size: 2rem;
          line-height: 1;
        }

        .summary-note {
          margin-top: 8px;
          color: var(--text-soft);
          font-size: 0.72rem;
        }

        .alerts-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(280px, 0.8fr);
          gap: 22px;
          align-items: start;
        }

        .alerts-list-card {
          padding: 24px;
        }

        .section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .section-heading h2 {
          color: var(--forest);
          font-size: 1.1rem;
          font-weight: 700;
        }

        .section-heading span {
          color: var(--text-soft);
          font-size: 0.76rem;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .alert-item {
          position: relative;
          display: grid;
          grid-template-columns: 48px minmax(0, 1fr) auto;
          gap: 16px;
          padding: 18px;
          border: 1px solid var(--border);
          border-radius: 17px;
          background: rgba(255,255,255,0.58);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .alert-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(31, 63, 43, 0.07);
          border-color: rgba(79,143,91,0.18);
        }

        .alert-item.resolved {
          opacity: 0.72;
        }

        .alert-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          font-size: 19px;
          font-weight: 800;
        }

        .alert-icon.warning {
          background: rgba(197, 138, 53, 0.11);
          color: var(--warning);
        }

        .alert-icon.danger {
          background: rgba(184, 92, 80, 0.11);
          color: var(--danger);
        }

        .alert-icon.info {
          background: rgba(79, 143, 91, 0.1);
          color: var(--leaf);
        }

        .alert-icon.success {
          background: rgba(63, 139, 88, 0.1);
          color: var(--success);
        }

        .alert-content {
          min-width: 0;
        }

        .alert-title-row {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .alert-title {
          color: var(--forest);
          font-size: 0.9rem;
          font-weight: 700;
        }

        .severity-pill {
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .severity-pill.warning {
          background: rgba(197, 138, 53, 0.1);
          color: var(--warning);
        }

        .severity-pill.danger {
          background: rgba(184, 92, 80, 0.1);
          color: var(--danger);
        }

        .severity-pill.info {
          background: rgba(79, 143, 91, 0.1);
          color: var(--leaf);
        }

        .severity-pill.success {
          background: rgba(63, 139, 88, 0.1);
          color: var(--success);
        }

        .alert-message {
          margin-top: 8px;
          max-width: 700px;
          color: var(--text-soft);
          font-size: 0.77rem;
          line-height: 1.6;
        }

        .alert-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 12px;
        }

        .meta-chip {
          padding: 6px 9px;
          border-radius: 8px;
          background: var(--cream-dark);
          color: var(--text-soft);
          font-size: 0.65rem;
          font-weight: 600;
        }

        .alert-value {
          align-self: start;
          min-width: 82px;
          padding: 10px 12px;
          border-radius: 12px;
          background: var(--cream);
          text-align: center;
        }

        .alert-value strong {
          display: block;
          color: var(--forest);
          font-size: 0.88rem;
        }

        .alert-value span {
          display: block;
          margin-top: 3px;
          color: var(--text-soft);
          font-size: 0.6rem;
        }

        .resolve-button {
          margin-top: 10px;
          padding: 7px 10px;
          border-radius: 9px;
          background: var(--forest);
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .resolve-button:hover {
          transform: translateY(-1px);
          background: var(--forest-light);
        }

        .resolved-label {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 11px;
          color: var(--success);
          font-size: 0.64rem;
          font-weight: 700;
        }

        .recommendation-card {
          padding: 24px;
          position: sticky;
          top: 24px;
        }

        .recommendation-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .recommendation-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: var(--mint);
          font-size: 19px;
        }

        .recommendation-header h2 {
          color: var(--forest);
          font-size: 0.95rem;
        }

        .recommendation-header p {
          margin-top: 3px;
          color: var(--text-soft);
          font-size: 0.67rem;
        }

        .recommendation-main {
          margin-top: 22px;
          padding: 18px;
          border-radius: 16px;
          background:
            linear-gradient(
              135deg,
              rgba(220,235,220,0.85),
              rgba(245,247,239,0.7)
            );
        }

        .recommendation-main .small-label {
          color: var(--leaf);
          font-size: 0.64rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .recommendation-main h3 {
          margin-top: 8px;
          color: var(--forest);
          font-family: "Playfair Display", serif;
          font-size: 1.3rem;
        }

        .recommendation-main p {
          margin-top: 8px;
          color: var(--text-soft);
          font-size: 0.73rem;
          line-height: 1.6;
        }

        .recommendation-action {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 14px;
          color: var(--forest);
          font-size: 0.68rem;
          font-weight: 700;
        }

        .recommendation-action span {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(79,143,91,0.12);
        }

        .priority-list {
          margin-top: 22px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }

        .priority-list h3 {
          color: var(--forest);
          font-size: 0.78rem;
        }

        .priority-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 13px;
        }

        .priority-number {
          width: 23px;
          height: 23px;
          flex: 0 0 23px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: var(--cream-dark);
          color: var(--forest);
          font-size: 0.65rem;
          font-weight: 800;
        }

        .priority-item p {
          color: var(--text-soft);
          font-size: 0.68rem;
          line-height: 1.45;
        }

        .empty-state {
          padding: 50px 25px;
          text-align: center;
          border: 1px dashed rgba(31,63,43,0.14);
          border-radius: 17px;
        }

        .empty-state-icon {
          width: 55px;
          height: 55px;
          margin: 0 auto 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 17px;
          background: var(--mint);
          font-size: 22px;
        }

        .empty-state h3 {
          color: var(--forest);
          font-size: 0.95rem;
        }

        .empty-state p {
          margin-top: 7px;
          color: var(--text-soft);
          font-size: 0.72rem;
        }

        .live-reading {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 7px;
          color: var(--success);
          font-size: 0.65rem;
          font-weight: 700;
        }

        @media (max-width: 1100px) {
          .alerts-layout {
            grid-template-columns: 1fr;
          }

          .recommendation-card {
            position: static;
          }
        }

        @media (max-width: 800px) {
          .alerts-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .alerts-header-right {
            width: 100%;
          }

          .alert-filter {
            width: 100%;
          }

          .filter-button {
            flex: 1;
          }

          .alert-summary {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .alerts-page {
            min-height: auto;
          }

          .alerts-list-card,
          .recommendation-card {
            padding: 17px;
          }

          .alert-item {
            grid-template-columns: 42px minmax(0, 1fr);
            gap: 12px;
          }

          .alert-icon {
            width: 42px;
            height: 42px;
            border-radius: 13px;
          }

          .alert-value {
            grid-column: 2;
            justify-self: start;
            margin-top: 2px;
          }

          .summary-card {
            min-height: 110px;
          }

          .page-description {
            font-size: 0.85rem;
          }
        }
      `}</style>

      <header className="alerts-header">
        <div className="alerts-header-left">
          <span className="eyebrow">Monitoring Center</span>

          <h1 className="page-title">
            Alerts & Recommendations
          </h1>

          <p className="page-description">
            Stay ahead of greenhouse conditions with intelligent
            alerts, sensor events and actionable recommendations.
          </p>

          <div className="alerts-live">
  <span
    className={`status-dot ${sensorData ? "online" : "warning"}`}
  ></span>
  {sensorData
    ? "Monitoring system active"
    : "No sensor connected"}
</div>
        </div>

        <div className="alerts-header-right">
          <div className="alert-filter">
            {["all", "active", "resolved"].map((item) => (
              <button
                key={item}
                className={`filter-button ${
                  filter === item ? "active" : ""
                }`}
                onClick={() => setFilter(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="alert-summary">
        <div className="summary-card glass-card hover-lift">
          <div className="summary-top">
            <span className="summary-label">
              Active alerts
            </span>

            <div className="summary-icon">!</div>
          </div>

          <strong className="summary-value">
            {activeCount}
          </strong>

          <p className="summary-note">
            Conditions currently requiring attention
          </p>
        </div>

        <div className="summary-card glass-card hover-lift">
          <div className="summary-top">
            <span className="summary-label">
              Priority issues
            </span>

            <div className="summary-icon">⚠</div>
          </div>

          <strong className="summary-value">
            {warningCount}
          </strong>

          <p className="summary-note">
            Temperature and moisture conditions detected
          </p>
        </div>

        <div className="summary-card glass-card hover-lift">
          <div className="summary-top">
            <span className="summary-label">
              System status
            </span>

            <div className="summary-icon">✓</div>
          </div>

          <strong className="summary-value">
            {systemStatus}
          </strong>

          <p className="summary-note">
            {sensorData
  ? "Sensors are actively reporting data"
  : "Waiting for sensor connection"}
          </p>
        </div>
      </section>

      <section className="alerts-layout">
        <div className="alerts-list-card glass-card">
          <div className="section-heading">
            <h2>Live sensor activity</h2>

            <span>
              {sensorData
                ? `${filteredAlerts.length} events`
                : "Waiting for data"}
            </span>
          </div>

          <div className="alerts-list">
            {!sensorData ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  ◌
                </div>

                <h3>Connecting to sensor network</h3>

                <p>
                  Waiting for the latest greenhouse readings
                  from the backend.
                </p>

                <div className="live-reading">
                  <span className="status-dot warning"></span>
                  Checking /data endpoint
                </div>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  ✓
                </div>

                <h3>No alerts in this view</h3>

                <p>
                  Your greenhouse monitoring system has nothing
                  matching this filter.
                </p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <article
                  key={alert.id}
                  className={`alert-item ${
                    alert.status === "resolved"
                      ? "resolved"
                      : ""
                  }`}
                >
                  <div
                    className={`alert-icon ${alert.severity}`}
                  >
                    {alert.icon}
                  </div>

                  <div className="alert-content">
                    <div className="alert-title-row">
                      <h3 className="alert-title">
                        {alert.title}
                      </h3>

                      <span
                        className={`severity-pill ${alert.severity}`}
                      >
                        {alert.severity}
                      </span>
                    </div>

                    <p className="alert-message">
                      {alert.message}
                    </p>

                    <div className="alert-meta">
                      <span className="meta-chip">
                        {alert.source}
                      </span>

                      <span className="meta-chip">
                        {alert.zone}
                      </span>

                      <span className="meta-chip">
                        {alert.time}
                      </span>
                    </div>

                    {alert.status === "active" ? (
                      <button
                        className="resolve-button"
                        onClick={() =>
                          resolveAlert(alert.id)
                        }
                      >
                        Mark as resolved
                      </button>
                    ) : (
                      <div className="resolved-label">
                        <span>✓</span>
                        {alert.time === "Live"
                          ? "Resolved"
                          : "Resolved"}
                      </div>
                    )}
                  </div>

                  <div className="alert-value">
                    <strong>{alert.value}</strong>
                    <span>{alert.threshold}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <aside className="recommendation-card glass-card">
          <div className="recommendation-header">
            <div className="recommendation-icon">
              🌱
            </div>

            <div>
              <h2>AgriNova recommendation</h2>
              <p>Based on current sensor conditions</p>
            </div>
          </div>

          <div className="recommendation-main">
            <span className="small-label">
              Suggested action
            </span>

            {!sensorData ? (
  <>
    <h3>Waiting for sensor data</h3>
    <p>
      Recommendations will appear once the greenhouse
      sensors are connected and valid readings are received.
    </p>
  </>
) : sensorData.soilMoisture < 45 ? (
              <>
                <h3>Check irrigation</h3>

                <p>
                  Soil moisture is below the preferred range.
                  Inspect the growing zone and consider a short
                  irrigation cycle.
                </p>
              </>
            ) : sensorData &&
              sensorData.temperature > 30 ? (
              <>
                <h3>Monitor temperature</h3>

                <p>
                  Greenhouse temperature is above the preferred
                  range. Check ventilation and continue monitoring.
                </p>
              </>
            ) : sensorData &&
              sensorData.humidity > 80 ? (
              <>
                <h3>Review ventilation</h3>

                <p>
                  Humidity is elevated. Check greenhouse airflow
                  and ventilation to maintain a healthier growing
                  environment.
                </p>
              </>
            ) : (
              <>
                <h3>Conditions look healthy</h3>

                <p>
                  Current sensor readings are within the monitored
                  operating ranges. Continue normal greenhouse
                  monitoring.
                </p>
              </>
            )}

            <div className="recommendation-action">
              <span>→</span>
              Continue live monitoring
            </div>
          </div>

          <div className="priority-list">
            <h3>Priority actions</h3>
{!sensorData ? (
  <div className="priority-item">
    <span className="priority-number">—</span>
    <p>
      Priority actions will appear once sensor data is available.
    </p>
  </div>
) : null}
            {sensorData &&
            sensorData.soilMoisture < 45 ? (
              <div className="priority-item">
                <span className="priority-number">01</span>

                <p>
                  Review soil moisture and irrigation conditions.
                </p>
              </div>
            ) : null}

            {sensorData &&
            sensorData.temperature > 30 ? (
              <div className="priority-item">
                <span className="priority-number">02</span>

                <p>
                  Monitor greenhouse temperature and ventilation.
                </p>
              </div>
            ) : null}

            {sensorData &&
            sensorData.humidity > 80 ? (
              <div className="priority-item">
                <span className="priority-number">03</span>

                <p>
                  Check airflow because humidity is elevated.
                </p>
              </div>
            ) : null}

            {sensorData &&
            sensorData.soilMoisture >= 45 &&
            sensorData.temperature <= 30 &&
            sensorData.humidity <= 80 ? (
              <div className="priority-item">
                <span className="priority-number">01</span>

                <p>
                  Continue monitoring all greenhouse sensors.
                </p>
              </div>
            ) : null}
          </div>
        </aside>
      </section>
    </div>
  );
}

export default Alerts;