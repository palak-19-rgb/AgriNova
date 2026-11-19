import React, { useEffect, useState } from "react";
import API_URL from "../services/api";
function Analytics() {
 const [liveTemp, setLiveTemp] = useState(null);
const [liveHumidity, setLiveHumidity] = useState(null);
const [liveMoisture, setLiveMoisture] = useState(null);
const [liveLight, setLiveLight] = useState(null);
const [sensorConnected, setSensorConnected] = useState(false);
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
       const response = await fetch(`${API_URL}/data`);

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const data = await response.json();

const connected = data.sensorConnected === true;

setSensorConnected(connected);

if (connected) {
  setLiveTemp(
    typeof data.temperature === "number" ? data.temperature : null
  );
  setLiveHumidity(
    typeof data.humidity === "number" ? data.humidity : null
  );
  setLiveMoisture(
    typeof data.soilMoisture === "number" ? data.soilMoisture : null
  );
  setLiveLight(
    typeof data.light === "number" ? data.light : null
  );
} else {
  setLiveTemp(null);
  setLiveHumidity(null);
  setLiveMoisture(null);
  setLiveLight(null);
}

     
} catch (error) {
  console.error("Analytics sensor API error:", error);

  setSensorConnected(false);
  setLiveTemp(null);
  setLiveHumidity(null);
  setLiveMoisture(null);
  setLiveLight(null);
}

    };

    fetchAnalyticsData();

    const interval = setInterval(fetchAnalyticsData, 2000);

    return () => clearInterval(interval);
  }, []);

 
  return (
    <div className="analytics-page">
      <style>{`
        .analytics-page {
          width: 100%;
        }

        .analytics-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 28px;
        }

        .analytics-live {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 15px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.72);
          color: var(--text-soft);
          font-size: 0.75rem;
          white-space: nowrap;
        }

        .metric-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 22px;
        }

        .metric-card {
          padding: 22px;
          min-height: 145px;
        }

        .metric-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .metric-label {
          color: var(--text-soft);
          font-size: 0.76rem;
          font-weight: 500;
        }

        .metric-icon {
          width: 36px;
          height: 36px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--mint);
          color: var(--forest);
          font-size: 15px;
        }

        .metric-value {
          margin-top: 18px;
          display: flex;
          align-items: baseline;
          gap: 5px;
        }

        .metric-value strong {
          font-family: "Playfair Display", serif;
          font-size: 2rem;
          line-height: 1;
          color: var(--forest);
        }

        .metric-value span {
          color: var(--text-soft);
          font-size: 0.75rem;
        }

        .metric-change {
          margin-top: 9px;
          color: var(--success);
          font-size: 0.67rem;
          font-weight: 700;
        }

        .analytics-main {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.7fr);
          gap: 22px;
        }

        .chart-card {
          padding: 26px;
        }

        .card-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 25px;
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
          font-size: 0.8rem;
        }

        .period-selector {
          display: flex;
          gap: 5px;
          padding: 4px;
          background: var(--cream);
          border-radius: 10px;
        }

        .period-selector button {
          padding: 7px 10px;
          border-radius: 7px;
          background: transparent;
          color: var(--text-soft);
          font-size: 0.68rem;
        }

        .period-selector button.active {
          background: #fff;
          color: var(--forest);
          box-shadow: 0 3px 10px rgba(31,63,43,0.07);
          font-weight: 700;
        }

        .chart-area {
          position: relative;
          height: 330px;
          padding: 10px 0 30px 40px;
        }

        .chart-grid {
          position: absolute;
          inset: 10px 0 35px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .grid-line {
          width: 100%;
          border-top: 1px dashed rgba(31,63,43,0.1);
        }

        .chart-labels-y {
          position: absolute;
          left: 0;
          top: 3px;
          bottom: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #89958d;
          font-size: 0.64rem;
        }

        .chart-svg {
          position: absolute;
          left: 40px;
          right: 0;
          top: 10px;
          bottom: 35px;
          width: calc(100% - 40px);
          height: calc(100% - 45px);
          overflow: visible;
        }

        .chart-line {
          fill: none;
          stroke: var(--leaf);
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          filter: drop-shadow(0 4px 6px rgba(79,143,91,0.16));
        }

        .chart-area-fill {
          fill: url(#areaGradient);
          opacity: 0.65;
        }

        .chart-point {
          fill: #fff;
          stroke: var(--forest);
          stroke-width: 2;
        }

        .chart-x-labels {
          position: absolute;
          left: 40px;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: space-between;
          color: #89958d;
          font-size: 0.63rem;
        }

        .chart-legend {
          display: flex;
          gap: 18px;
          align-items: center;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 7px;
          color: var(--text-soft);
          font-size: 0.68rem;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--leaf);
        }

        .summary-stack {
          display: grid;
          gap: 18px;
        }

        .summary-card {
          padding: 24px;
        }

        .summary-number {
          margin-top: 16px;
          font-family: "Playfair Display", serif;
          color: var(--forest);
          font-size: 2.6rem;
        }

        .summary-description {
          margin-top: 5px;
          color: var(--text-soft);
          font-size: 0.73rem;
          line-height: 1.5;
        }

        .mini-progress {
          height: 6px;
          margin-top: 17px;
          border-radius: 20px;
          background: #e5ece4;
          overflow: hidden;
        }

        .mini-progress span {
          display: block;
          height: 100%;
          width: 82%;
          background: var(--leaf);
          border-radius: inherit;
        }

        .condition-list {
          margin-top: 20px;
          display: grid;
          gap: 13px;
        }

        .condition-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-bottom: 13px;
          border-bottom: 1px solid var(--border);
        }

        .condition-item:last-child {
          padding-bottom: 0;
          border-bottom: 0;
        }

        .condition-left {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .condition-left span:last-child {
          color: var(--text-soft);
          font-size: 0.72rem;
        }

        .condition-value {
          color: var(--forest);
          font-size: 0.73rem;
          font-weight: 700;
        }

        .bottom-charts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
          margin-top: 22px;
        }

        .small-chart-card {
          padding: 25px;
        }

        .bars {
          height: 190px;
          margin-top: 25px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 9px;
        }

        .bar-column {
          height: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
        }

        .bar {
          width: 100%;
          max-width: 35px;
          min-height: 10px;
          border-radius: 7px 7px 3px 3px;
          background: linear-gradient(
            to top,
            var(--forest),
            var(--leaf)
          );
          transition: height 0.5s ease;
        }

        .bar-label {
          color: #89958d;
          font-size: 0.62rem;
        }

        .moisture-track {
          margin-top: 25px;
          display: grid;
          gap: 19px;
        }

        .moisture-row {
          display: grid;
          grid-template-columns: 70px 1fr 42px;
          align-items: center;
          gap: 12px;
        }

        .moisture-row label {
          color: var(--text-soft);
          font-size: 0.7rem;
        }

        .moisture-row strong {
          color: var(--forest);
          font-size: 0.7rem;
          text-align: right;
        }

        .track {
          height: 8px;
          border-radius: 20px;
          background: #e6ece5;
          overflow: hidden;
        }

        .track span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: var(--leaf);
        }

        @media (max-width: 1100px) {
          .metric-row {
            grid-template-columns: repeat(2, 1fr);
          }

          .analytics-main {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 750px) {
          .analytics-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .bottom-charts {
            grid-template-columns: 1fr;
          }

          .chart-area {
            height: 280px;
          }
        }

        @media (max-width: 520px) {
          .metric-row {
            grid-template-columns: 1fr;
          }

          .chart-card,
          .summary-card,
          .small-chart-card {
            padding: 20px;
          }

          .card-heading {
            flex-direction: column;
          }

          .period-selector {
            align-self: flex-start;
          }

          .chart-area {
            padding-left: 30px;
          }

          .chart-grid,
          .chart-svg,
          .chart-x-labels {
            left: 30px;
          }

          .chart-svg {
            width: calc(100% - 30px);
          }

          .chart-labels-y {
            font-size: 0.55rem;
          }
        }
      `}</style>

      <header className="analytics-header">
        <div>
          <span className="eyebrow">Environmental analytics</span>

          <h1 className="page-title">
            Understand your greenhouse.
          </h1>

          <p className="page-description">
            Explore environmental trends and identify patterns
            across your greenhouse conditions.
          </p>
        </div>

       <div className="analytics-live">
  <span className={`status-dot ${sensorConnected ? "online" : ""}`}></span>
  {sensorConnected ? "Sensor connected" : "No sensor connected"}
</div>
      </header>

      <section className="metric-row">
       <MetricCard
  label="Temperature"
  value={liveTemp ?? "--"}
  unit="°C"
  icon="°"
  change={sensorConnected ? "Live reading" : "Awaiting sensor data"}
/>

<MetricCard
  label="Humidity"
  value={liveHumidity ?? "--"}
  unit="%"
  icon="≈"
  change={sensorConnected ? "Live reading" : "Awaiting sensor data"}
/>

<MetricCard
  label="Soil moisture"
  value={liveMoisture ?? "--"}
  unit="%"
  icon="◉"
  change={sensorConnected ? "Live reading" : "Awaiting sensor data"}
/>

<MetricCard
  label="Light intensity"
  value={liveLight ?? "--"}
  unit="lux"
  icon="☼"
  change={sensorConnected ? "Live reading" : "Awaiting sensor data"}
/>
      </section>

   
<section className="analytics-main">
  <div className="chart-card glass-card hover-lift">
    <div className="card-heading">
      <div>
        <span className="eyebrow">Trend analysis</span>
        <h2>Temperature trend</h2>
        <p>Environmental temperature over the monitored period.</p>
      </div>
    </div>

    <div className="chart-area">
      <div style={{
        textAlign: "center",
        paddingTop: "100px",
        color: "var(--text-soft)"
      }}>
        <div style={{ fontSize: "35px" }}>📡</div>
        <p>No sensor connected</p>
        <small>Connect your sensors to view temperature trends.</small>
      </div>
    </div>
  </div>

  <div className="summary-stack">
    <div className="summary-card glass-card hover-lift">
      <span className="eyebrow">Greenhouse score</span>
      <div className="summary-number">--</div>
      <p className="summary-description">
        Greenhouse score will be available once sensor data is connected.
      </p>
    </div>

    <div className="summary-card glass-card hover-lift">
      <span className="eyebrow">Current conditions</span>
      <p className="summary-description">
        {sensorConnected
          ? "Sensor connected. Readings are being collected."
          : "No sensor connected. Waiting for sensor data."}
      </p>
    </div>
  </div>
</section>


<section className="bottom-charts">
  <div className="small-chart-card glass-card hover-lift">
    <div className="card-heading">
      <div>
        <span className="eyebrow">Light environment</span>
        <h2>Daily light profile</h2>
        <p>Light readings will appear after sensor integration.</p>
      </div>
    </div>

    <div style={{
      textAlign: "center",
      padding: "45px 10px",
      color: "var(--text-soft)"
    }}>
      <div style={{ fontSize: "30px" }}>📡</div>
      <p>No sensor connected</p>
    </div>
  </div>

  <div className="small-chart-card glass-card hover-lift">
    <div className="card-heading">
      <div>
        <span className="eyebrow">Soil health</span>
        <h2>Moisture by zone</h2>
        <p>Soil moisture readings will appear after sensor integration.</p>
      </div>
    </div>

    <div style={{
      textAlign: "center",
      padding: "45px 10px",
      color: "var(--text-soft)"
    }}>
      <div style={{ fontSize: "30px" }}>📡</div>
      <p>No sensor connected</p>
    </div>
  </div>
</section>

    </div>
  );
}

function MetricCard({ label, value, unit, icon, change }) {
  return (
    <div className="metric-card glass-card hover-lift">
      <div className="metric-card-top">
        <span className="metric-label">{label}</span>
        <span className="metric-icon">{icon}</span>
      </div>

      <div className="metric-value">
        <strong>{value}</strong>
        <span>{unit}</span>
      </div>

      <div className="metric-change">↑ {change}</div>
    </div>
  );
}







export default Analytics;