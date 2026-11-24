
import React, { useEffect, useState } from "react";
import API_URL from "../services/api";

function Sensors() {
  const [sensorData, setSensorData] = useState({
    temperature: null,
    humidity: null,
    soilTemperature: null,
    soilMoisture: null,
    timestamp: null,
  });

  const [backendConnected, setBackendConnected] = useState(false);

  useEffect(() => {
    let active = true;

    const getNumber = (value) => {
      if (value === null || value === undefined || value === "") {
        return null;
      }

      const number = Number(value);
      return Number.isFinite(number) ? number : null;
    };

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/data`);

        if (!response.ok) {
          throw new Error("Failed to fetch sensor data");
        }

        const data = await response.json();

        if (!active) return;

        setSensorData({
          temperature: getNumber(data.temperature),
          humidity: getNumber(data.humidity),
          soilTemperature: getNumber(data.soilTemperature),
          soilMoisture: getNumber(data.soilMoisture),
          timestamp: data.timestamp || null,
        });

        setBackendConnected(true);
      } catch (error) {
        if (!active) return;

        console.error("Sensor connection error:", error);
        setBackendConnected(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 2000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const getReading = (value, unit = "") => {
    return typeof value === "number"
      ? `${value.toFixed(2)}${unit}`
      : "--";
  };

  const lastUpdate = (() => {
    if (!sensorData.timestamp) return "--:--:--";

    const date = new Date(sensorData.timestamp);

    if (Number.isNaN(date.getTime())) return "--:--:--";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  })();

  const sht40Online =
    sensorData.temperature !== null &&
    sensorData.humidity !== null;

  const ds18b20Online =
    sensorData.soilTemperature !== null;

  const soilMoistureOnline =
    sensorData.soilMoisture !== null;

  const sensors = [
    {
      name: "SHT40",
      type: "Air Temperature & Humidity",
      protocol: "I²C",
      status: sht40Online,
      icon: "°",
      values: [
        {
          label: "Air Temperature",
          value: getReading(sensorData.temperature, " °C"),
        },
        {
          label: "Relative Humidity",
          value: getReading(sensorData.humidity, " %"),
        },
      ],
      description:
        "High-accuracy environmental sensor measuring greenhouse air temperature and relative humidity.",
    },
    {
      name: "DS18B20",
      type: "Soil Temperature",
      protocol: "1-Wire",
      status: ds18b20Online,
      icon: "◌",
      values: [
        {
          label: "Soil Temperature",
          value: getReading(sensorData.soilTemperature, " °C"),
        },
        {
          label: "Sensor State",
          value: ds18b20Online ? "Available" : "Waiting",
        },
      ],
      description:
        "Digital temperature sensor used to monitor soil and root-zone temperature.",
    },
    {
      name: "Soil Moisture",
      type: "Soil Moisture Sensor",
      protocol: "Analog",
      status: soilMoistureOnline,
      icon: "💧",
      values: [
        {
          label: "Raw ADC Reading",
          value:
            sensorData.soilMoisture !== null
              ? String(sensorData.soilMoisture)
              : "--",
        },
        {
          label: "Sensor State",
          value: soilMoistureOnline ? "Available" : "Waiting",
        },
      ],
      description:
        "Analog soil moisture sensor providing raw ADC readings. Calibration is required before converting readings into moisture percentages.",
    },
  ];

  const connectedCount = sensors.filter(
    (sensor) => sensor.status
  ).length;

  const systemHealth = Math.round(
    (connectedCount / sensors.length) * 100
  );

  return (
    <div className="sensors-page">
      <style>{`
        .sensors-page {
          width: 100%;
          min-height: calc(100vh - 56px);
          padding-bottom: 30px;
        }

        .sensors-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 25px;
          margin-bottom: 28px;
        }

        .sensors-header-copy {
          max-width: 720px;
        }

        .sensor-live-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 18px;
          padding: 9px 13px;
          border-radius: 999px;
          background: rgba(63, 139, 88, 0.08);
          color: var(--success);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .sensor-live-status.offline {
          background: rgba(184, 92, 80, 0.08);
          color: var(--danger);
        }

        .controller-card {
          min-width: 250px;
          padding: 18px 20px;
        }

        .controller-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .controller-label {
          color: var(--text-soft);
          font-size: 0.67rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .controller-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(63, 139, 88, 0.08);
          color: var(--success);
          font-size: 0.6rem;
          font-weight: 800;
        }

        .controller-badge.offline {
          background: rgba(184, 92, 80, 0.08);
          color: var(--danger);
        }

        .controller-name {
          margin-top: 12px;
          color: var(--forest);
          font-family: "Playfair Display", serif;
          font-size: 1.2rem;
        }

        .controller-info {
          margin-top: 5px;
          color: var(--text-soft);
          font-size: 0.67rem;
        }

        .sensor-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .summary-box {
          padding: 20px;
        }

        .summary-box-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .summary-box-label {
          color: var(--text-soft);
          font-size: 0.72rem;
          font-weight: 600;
        }

        .summary-box-icon {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: var(--mint);
          color: var(--forest);
          font-size: 15px;
        }

        .summary-box-value {
          display: block;
          margin-top: 12px;
          color: var(--forest);
          font-family: "Playfair Display", serif;
          font-size: 1.75rem;
        }

        .summary-box-note {
          margin-top: 5px;
          color: var(--text-soft);
          font-size: 0.65rem;
        }

        .sensors-section {
          padding: 25px;
        }

        .section-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .section-title h2 {
          color: var(--forest);
          font-size: 1.05rem;
        }

        .section-title span {
          color: var(--text-soft);
          font-size: 0.68rem;
        }

        .sensor-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .sensor-card {
          position: relative;
          overflow: hidden;
          padding: 21px;
          border: 1px solid var(--border);
          border-radius: 19px;
          background: rgba(255,255,255,0.62);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .sensor-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(31,63,43,0.08);
          border-color: rgba(79,143,91,0.2);
        }

        .sensor-card::after {
          content: "";
          position: absolute;
          width: 120px;
          height: 120px;
          right: -55px;
          bottom: -60px;
          border-radius: 50%;
          background: rgba(145,184,154,0.12);
          pointer-events: none;
        }

        .sensor-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
        }

        .sensor-identity {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .sensor-icon {
          width: 47px;
          height: 47px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          background: var(--mint);
          color: var(--forest);
          font-size: 20px;
          font-weight: 700;
        }

        .sensor-name {
          color: var(--forest);
          font-size: 0.92rem;
          font-weight: 800;
        }

        .sensor-type {
          margin-top: 4px;
          color: var(--text-soft);
          font-size: 0.66rem;
        }

        .sensor-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 8px;
          border-radius: 999px;
          background: rgba(63,139,88,0.08);
          color: var(--success);
          font-size: 0.59rem;
          font-weight: 800;
        }

        .sensor-status.offline {
          background: rgba(184,92,80,0.08);
          color: var(--danger);
        }

        .sensor-values {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 20px;
        }

        .sensor-value-box {
          padding: 13px;
          border-radius: 13px;
          background: var(--cream);
        }

        .sensor-value-label {
          display: block;
          color: var(--text-soft);
          font-size: 0.59rem;
        }

        .sensor-value {
          display: block;
          margin-top: 5px;
          color: var(--forest);
          font-size: 1rem;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        .sensor-description {
          margin-top: 17px;
          padding-top: 15px;
          border-top: 1px solid var(--border);
          color: var(--text-soft);
          font-size: 0.68rem;
          line-height: 1.55;
        }

        .sensor-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 15px;
        }

        .protocol {
          padding: 6px 9px;
          border-radius: 8px;
          background: rgba(79,143,91,0.07);
          color: var(--leaf);
          font-size: 0.6rem;
          font-weight: 800;
        }

        .sensor-updated {
          color: var(--text-soft);
          font-size: 0.59rem;
        }

        .architecture-card {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 25px;
          margin-top: 22px;
          padding: 25px;
        }

        .architecture-copy h2 {
          color: var(--forest);
          font-family: "Playfair Display", serif;
          font-size: 1.4rem;
        }

        .architecture-copy p {
          margin-top: 9px;
          color: var(--text-soft);
          font-size: 0.72rem;
          line-height: 1.65;
        }

        .architecture-flow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .flow-node {
          min-width: 105px;
          padding: 14px 10px;
          border-radius: 14px;
          background: var(--cream);
          text-align: center;
        }

        .flow-node strong {
          display: block;
          color: var(--forest);
          font-size: 0.72rem;
        }

        .flow-node span {
          display: block;
          margin-top: 4px;
          color: var(--text-soft);
          font-size: 0.57rem;
        }

        .flow-arrow {
          color: var(--leaf);
          font-size: 18px;
          font-weight: 700;
        }

        @media (max-width: 1050px) {
          .sensors-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .controller-card {
            width: 100%;
          }

          .architecture-card {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 800px) {
          .sensor-summary {
            grid-template-columns: 1fr;
          }

          .sensor-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .sensors-section,
          .architecture-card {
            padding: 17px;
          }

          .sensor-card {
            padding: 17px;
          }

          .sensor-values {
            grid-template-columns: 1fr;
          }

          .flow-arrow {
            transform: rotate(90deg);
          }
        }
      `}</style>

      <header className="sensors-header">
        <div className="sensors-header-copy">
          <span className="eyebrow">Sensor Network</span>

          <h1 className="page-title">
            Your greenhouse senses everything.
          </h1>

          <p className="page-description">
            Monitor connected sensors, communication protocols
            and environmental data powering AgriNova.
          </p>

          <div
            className={`sensor-live-status ${
              !backendConnected ? "offline" : ""
            }`}
          >
            <span
              className={`status-dot ${
                backendConnected ? "online" : "offline"
              }`}
            />

            {backendConnected
              ? `${connectedCount} of 3 sensor nodes reporting`
              : "Backend connection unavailable"}
          </div>
        </div>

        <div className="controller-card glass-card">
          <div className="controller-top">
            <span className="controller-label">
              LoRaWAN device
            </span>

            <span
              className={`controller-badge ${
                !backendConnected ? "offline" : ""
              }`}
            >
              <span
                className={`status-dot ${
                  backendConnected ? "online" : "offline"
                }`}
              />

              {backendConnected ? "Backend Online" : "Offline"}
            </span>
          </div>

          <div className="controller-name">
            RAK3172 WisDuo
          </div>

          <div className="controller-info">
            AgriNova Greenhouse 01 · Last data {lastUpdate}
          </div>
        </div>
      </header>

      <section className="sensor-summary">
        <div className="summary-box glass-card hover-lift">
          <div className="summary-box-header">
            <span className="summary-box-label">
              Reporting sensor nodes
            </span>

            <div className="summary-box-icon">⌁</div>
          </div>

          <strong className="summary-box-value">
            {connectedCount} / {sensors.length}
          </strong>

          <p className="summary-box-note">
            Based on available sensor readings
          </p>
        </div>

        <div className="summary-box glass-card hover-lift">
          <div className="summary-box-header">
            <span className="summary-box-label">
              Communication
            </span>

            <div className="summary-box-icon">↔</div>
          </div>

          <strong className="summary-box-value">
            LoRaWAN
          </strong>

          <p className="summary-box-note">
            RAK3172 to TTN via Dragino gateway
          </p>
        </div>

        <div className="summary-box glass-card hover-lift">
          <div className="summary-box-header">
            <span className="summary-box-label">
              Sensor availability
            </span>

            <div className="summary-box-icon">✓</div>
          </div>

          <strong className="summary-box-value">
            {systemHealth}%
          </strong>

          <p className="summary-box-note">
            Current reporting sensor nodes
          </p>
        </div>
      </section>

      <section className="sensors-section glass-card">
        <div className="section-title">
          <h2>Connected sensor nodes</h2>
          <span>Live monitoring network</span>
        </div>

        <div className="sensor-grid">
          {sensors.map((sensor) => (
            <article
              key={sensor.name}
              className="sensor-card"
            >
              <div className="sensor-card-top">
                <div className="sensor-identity">
                  <div className="sensor-icon">
                    {sensor.icon}
                  </div>

                  <div>
                    <h3 className="sensor-name">
                      {sensor.name}
                    </h3>

                    <p className="sensor-type">
                      {sensor.type}
                    </p>
                  </div>
                </div>

                <div
                  className={`sensor-status ${
                    sensor.status ? "" : "offline"
                  }`}
                >
                  <span
                    className={`status-dot ${
                      sensor.status ? "online" : "offline"
                    }`}
                  />

                  {sensor.status ? "Reporting" : "No data"}
                </div>
              </div>

              <div className="sensor-values">
                {sensor.values.map((item) => (
                  <div
                    className="sensor-value-box"
                    key={item.label}
                  >
                    <span className="sensor-value-label">
                      {item.label}
                    </span>

                    <strong className="sensor-value">
                      {item.value}
                    </strong>
                  </div>
                ))}
              </div>

              <p className="sensor-description">
                {sensor.description}
              </p>

              <div className="sensor-footer">
                <span className="protocol">
                  {sensor.protocol}
                </span>

                <span className="sensor-updated">
                  Last data · {lastUpdate}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="architecture-card glass-card">
        <div className="architecture-copy">
          <span className="eyebrow">
            System Architecture
          </span>

          <h2>
            From sensor to insight.
          </h2>

          <p>
            Environmental readings are collected by the sensors
            and transmitted through the RAK3172 WisDuo LoRaWAN
            module. The Dragino gateway forwards the data to
            The Things Network, which delivers it to the AgriNova
            backend for storage and dashboard monitoring.
          </p>
        </div>

        <div className="architecture-flow">
          <div className="flow-node">
            <strong>Sensors</strong>
            <span>SHT40 · DS18B20 · Moisture</span>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-node">
            <strong>RAK3172</strong>
            <span>LoRaWAN device</span>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-node">
            <strong>Dragino</strong>
            <span>LG308 gateway</span>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-node">
            <strong>TTN</strong>
            <span>The Things Network</span>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-node">
            <strong>AgriNova</strong>
            <span>Backend & Dashboard</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Sensors;
