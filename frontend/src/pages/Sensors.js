import React, { useEffect, useState } from "react";

function Sensors() {
  const [sensorData, setSensorData] = useState({
    temperature: null,
    humidity: null,
    light: null,
    soilTemperature: null,
    soilMoisture: null,
  });

  const [lastUpdate, setLastUpdate] = useState("--:--:--");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/data");

        if (!response.ok) {
          throw new Error("Failed to fetch sensor data");
        }
        const data = await response.json();
const connected = data.sensorConnected === true;

setIsConnected(connected);

setSensorData({
  temperature: connected && typeof data.temperature === "number"
    ? data.temperature : null,

  humidity: connected && typeof data.humidity === "number"
    ? data.humidity : null,

  light: connected && typeof data.light === "number"
    ? data.light : null,

  soilTemperature: connected && typeof data.soilTemperature === "number"
    ? data.soilTemperature : null,

  soilMoisture: connected && typeof data.soilMoisture === "number"
    ? data.soilMoisture : null,
});

setLastUpdate(
  connected
    ? new Date().toLocaleTimeString()
    : "--:--:--"
);
      } catch (error) {
  console.log("Sensor connection error:", error);
  setIsConnected(false);

  setSensorData({
    temperature: null,
    humidity: null,
    light: null,
    soilTemperature: null,
    soilMoisture: null,
  });

  setLastUpdate("--:--:--");
}
    };

    fetchData();

    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  const temperature =
    sensorData.temperature !== null
      ? `${sensorData.temperature}°C`
      : "--";

  const humidity =
    sensorData.humidity !== null
      ? `${sensorData.humidity}%`
      : "--";

  const light =
    sensorData.light !== null
      ? `${sensorData.light} lux`
      : "--";

  const soilTemperature =
    sensorData.soilTemperature !== null
      ? `${sensorData.soilTemperature}°C`
      : "--";

  const soilMoisture =
    sensorData.soilMoisture !== null
      ? `${sensorData.soilMoisture}%`
      : "--";

  const getMoistureState = () => {
    if (sensorData.soilMoisture === null) return "Waiting";

    if (sensorData.soilMoisture < 40) return "Low";

    if (sensorData.soilMoisture <= 70) return "Healthy";

    return "High";
  };

 

  const getLightState = () => {
    if (sensorData.light === null) return "Waiting";

    if (sensorData.light < 300) return "Low";

    if (sensorData.light > 1200) return "High";

    return "Optimal";
  };

  const getSoilTemperatureState = () => {
    if (sensorData.soilTemperature === null) return "Waiting";

    if (sensorData.soilTemperature > 30) return "High";

    if (sensorData.soilTemperature < 18) return "Low";

    return "Stable";
  };

  const sensors = [
    {
      name: "SHT40",
      type: "Temperature & Humidity",
      protocol: "I²C",
      status: isConnected ? "online" : "offline",
      icon: "°",
      values: [
        {
          label: "Temperature",
          value: temperature,
        },
        {
          label: "Humidity",
          value: humidity,
        },
      ],
      description:
        "High-accuracy environmental sensor for greenhouse temperature and humidity monitoring.",
    },
    {
      name: "BH1750",
      type: "Light Intensity",
      protocol: "I²C",
      status:
        isConnected && sensorData.light !== null
          ? "online"
          : "offline",
      icon: "☀",
      values: [
        {
          label: "Light",
          value: light,
        },
        {
          label: "State",
          value: getLightState(),
        },
      ],
      description:
        "Digital ambient light sensor used to understand available light conditions inside the greenhouse.",
    },
    {
      name: "DS18B20",
      type: "Soil Temperature",
      protocol: "1-Wire",
      status:
        isConnected && sensorData.soilTemperature !== null
          ? "online"
          : "offline",
      icon: "◌",
      values: [
        {
          label: "Soil temp.",
          value: soilTemperature,
        },
        {
          label: "State",
          value: getSoilTemperatureState(),
        },
      ],
      description:
        "Waterproof digital temperature sensor for monitoring soil and root-zone conditions.",
    },
    {
      name: "Soil Moisture",
      type: "Capacitive Sensor",
      protocol: "Analog",
      status:
        isConnected && sensorData.soilMoisture !== null
          ? "online"
          : "offline",
      icon: "💧",
      values: [
        {
          label: "Average",
          value: soilMoisture,
        },
        {
          label: "State",
          value: getMoistureState(),
        },
      ],
      description:
        "Capacitive sensing system used to monitor soil moisture and support intelligent irrigation decisions.",
    },
  ];

  const connectedCount = sensors.filter(
    (sensor) => sensor.status === "online"
  ).length;

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

          .architecture-flow {
            flex-wrap: wrap;
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
            Monitor every connected sensor, its communication
            protocol and the environmental data powering AgriNova.
          </p>

          <div
            className={`sensor-live-status ${
              !isConnected ? "offline" : ""
            }`}
          >
            <span
              className={`status-dot ${
                isConnected ? "online" : "offline"
              }`}
            />

            {isConnected
              ? "All connected sensors reporting normally"
              : "Sensor connection unavailable"}
          </div>
        </div>

        <div className="controller-card glass-card">
          <div className="controller-top">
            <span className="controller-label">
              Main controller
            </span>

            <span
              className={`controller-badge ${
                !isConnected ? "offline" : ""
              }`}
            >
              <span
                className={`status-dot ${
                  isConnected ? "online" : "offline"
                }`}
              />

              {isConnected ? "Online" : "Offline"}
            </span>
          </div>

          <div className="controller-name">
            STM32 Controller
          </div>

          <div className="controller-info">
            AgriNova Greenhouse 01 • Last sync {lastUpdate}
          </div>
        </div>
      </header>

      <section className="sensor-summary">
        <div className="summary-box glass-card hover-lift">
          <div className="summary-box-header">
            <span className="summary-box-label">
              Connected sensors
            </span>

            <div className="summary-box-icon">
              ⌁
            </div>
          </div>

          <strong className="summary-box-value">
            {connectedCount} / {sensors.length}
          </strong>

          <p className="summary-box-note">
            Sensor nodes responding
          </p>
        </div>

        <div className="summary-box glass-card hover-lift">
          <div className="summary-box-header">
            <span className="summary-box-label">
              Communication
            </span>

            <div className="summary-box-icon">
              ↔
            </div>
          </div>

          <strong className="summary-box-value">
            I²C
          </strong>

          <p className="summary-box-note">
            Primary digital sensor bus
          </p>
        </div>

        <div className="summary-box glass-card hover-lift">
          <div className="summary-box-header">
            <span className="summary-box-label">
              System health
            </span>

            <div className="summary-box-icon">
              ✓
            </div>
          </div>

          <strong className="summary-box-value">
            {connectedCount === sensors.length ? "100%" : `${Math.round(
              (connectedCount / sensors.length) * 100
            )}%`}
          </strong>

          <p className="summary-box-note">
            Live sensor connectivity
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
                    sensor.status === "offline"
                      ? "offline"
                      : ""
                  }`}
                >
                  <span
                    className={`status-dot ${
                      sensor.status === "online"
                        ? "online"
                        : "offline"
                    }`}
                  />

                  {sensor.status === "online"
                    ? "Online"
                    : "Offline"}
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
                  Live • {lastUpdate}
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
            AgriNova collects environmental information from the
            greenhouse sensors, processes it through the STM32
            controller and makes the data available to the
            monitoring dashboard.
          </p>
        </div>

        <div className="architecture-flow">
          <div className="flow-node">
            <strong>Sensors</strong>
            <span>Environment data</span>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-node">
            <strong>STM32</strong>
            <span>Data processing</span>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-node">
            <strong>RAK3172</strong>
            <span>Wireless link</span>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-node">
            <strong>AgriNova</strong>
            <span>Smart dashboard</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Sensors;