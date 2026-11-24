
import React, { useEffect, useState } from "react";
import API_URL from "../services/api";

// Only records containing all four current RAK3172 sensor readings
const isValidRecord = (item) =>
  typeof item.temperature === "number" &&
  typeof item.humidity === "number" &&
  typeof item.soilTemperature === "number" &&
  typeof item.soilMoisture === "number";

const formatTime = (timestamp) => {
  if (!timestamp) return "--";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return "--";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateTime = (timestamp) => {
  if (!timestamp) return "Waiting for sensor data";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return "Waiting for sensor data";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Reusable SVG graph - no chart library required
function HistoryChart({
  title,
  description,
  data,
  dataKey,
  unit,
  color = "#4f8f5b",
  gradientId,
}) {
  const width = 800;
  const height = 270;
  const left = 55;
  const right = 785;
  const top = 20;
  const bottom = 225;

  const values = data
    .map((item) => item[dataKey])
    .filter((value) => typeof value === "number");

  if (!values.length) {
    return (
      <div className="small-chart-card glass-card hover-lift">
        <div className="card-heading">
          <div>
            <span className="eyebrow">Sensor history</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>

        <div className="empty-chart">
          <div>📡</div>
          <p>No historical readings available</p>
          <small>Data will appear when sensor readings are received.</small>
        </div>
      </div>
    );
  }

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const range = rawMax - rawMin || 1;
  const padding = range * 0.15;

  const min = rawMin - padding;
  const max = rawMax + padding;
  const chartRange = max - min;

  const points = data
    .filter((item) => typeof item[dataKey] === "number")
    .map((item, index, filteredData) => {
      const x =
        filteredData.length === 1
          ? (left + right) / 2
          : left + (index / (filteredData.length - 1)) * (right - left);

      const y =
        bottom -
        ((item[dataKey] - min) / chartRange) * (bottom - top);

      return {
        x,
        y,
        value: item[dataKey],
        timestamp: item.timestamp,
      };
    });

  const linePath = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const areaPath =
    points.length > 1
      ? `${linePath} L ${points[points.length - 1].x} ${bottom} L ${points[0].x} ${bottom} Z`
      : "";

  const yLabels = Array.from({ length: 5 }, (_, index) => {
    return max - (index / 4) * chartRange;
  });

  const xLabels =
    points.length > 0
      ? [
          points[0],
          points[Math.floor((points.length - 1) / 2)],
          points[points.length - 1],
        ]
      : [];

  return (
    <div className="small-chart-card glass-card hover-lift">
      <div className="card-heading">
        <div>
          <span className="eyebrow">Sensor history</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <span className="chart-unit">{unit}</span>
      </div>

      <div className="history-chart">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="history-svg"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {yLabels.map((value, index) => {
            const y = top + (index / 4) * (bottom - top);

            return (
              <g key={index}>
                <line
                  x1={left}
                  y1={y}
                  x2={right}
                  y2={y}
                  stroke="#dce6dc"
                  strokeDasharray="5 6"
                />
                <text
                  x={left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="15"
                  fill="#89958d"
                >
                  {value.toFixed(1)}
                </text>
              </g>
            );
          })}

          {areaPath && (
            <path
              d={areaPath}
              fill={`url(#${gradientId})`}
            />
          )}

          {points.length > 1 && (
            <path
              d={linePath}
              fill="none"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}

          {points.map((point, index) => (
            <circle
              key={`${point.timestamp}-${index}`}
              cx={point.x}
              cy={point.y}
              r={points.length > 35 ? 3 : 5}
              fill="#ffffff"
              stroke={color}
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            >
              <title>
                {`${point.value} ${unit} | ${formatDateTime(point.timestamp)}`}
              </title>
            </circle>
          ))}
        </svg>

        <div className="history-x-labels">
          {xLabels.map((point, index) => (
            <span key={index}>{formatTime(point.timestamp)}</span>
          ))}
        </div>
      </div>

      <div className="chart-footer">
        <span>
          {points.length} actual readings
        </span>
        <strong>
          Latest: {values[values.length - 1].toFixed(2)} {unit}
        </strong>
      </div>
    </div>
  );
}

function Analytics() {
  const [liveData, setLiveData] = useState(null);
  const [history, setHistory] = useState([]);
  const [sensorConnected, setSensorConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAnalyticsData = async () => {
      try {
        const [latestResponse, historyResponse] = await Promise.all([
          fetch(`${API_URL}/data`),
          fetch(`${API_URL}/data/history?limit=100`),
        ]);

        if (!latestResponse.ok) {
          throw new Error("Failed to fetch latest sensor data");
        }

        if (!historyResponse.ok) {
          throw new Error("Failed to fetch sensor history");
        }

        const latest = await latestResponse.json();
        const historicalData = await historyResponse.json();

        if (!isMounted) return;

        if (isValidRecord(latest)) {
          setLiveData(latest);
          setSensorConnected(true);
          setLastUpdated(latest.timestamp);
        } else {
          setLiveData(null);
          setSensorConnected(false);
        }

        // Exclude old ESP32 records and retain current RAK3172 readings
        const validHistory = Array.isArray(historicalData)
          ? historicalData.filter(isValidRecord)
          : [];

        setHistory(validHistory);
      } catch (error) {
        console.error("Analytics sensor API error:", error);

        if (isMounted) {
          setSensorConnected(false);
        }
      }
    };

    fetchAnalyticsData();

    const interval = setInterval(fetchAnalyticsData, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const readings = [
    {
      label: "Air temperature",
      value: liveData?.temperature,
      unit: "°C",
      icon: "🌡",
    },
    {
      label: "Humidity",
      value: liveData?.humidity,
      unit: "%",
      icon: "≈",
    },
    {
      label: "Soil temperature",
      value: liveData?.soilTemperature,
      unit: "°C",
      icon: "🌱",
    },
    {
      label: "Soil moisture",
      value: liveData?.soilMoisture,
      unit: "ADC",
      icon: "◉",
    },
  ];

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
          font-size: 2.2rem;
        }

        .summary-description {
          margin-top: 8px;
          color: var(--text-soft);
          font-size: 0.73rem;
          line-height: 1.6;
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
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          margin-top: 22px;
        }

        .small-chart-card {
          padding: 25px;
          min-width: 0;
        }

        .history-chart {
          position: relative;
          height: 230px;
          width: 100%;
          margin-top: 12px;
        }

        .history-svg {
          display: block;
          width: 100%;
          height: 200px;
          overflow: visible;
        }

        .history-x-labels {
          display: flex;
          justify-content: space-between;
          padding-left: 42px;
          padding-right: 8px;
          color: #89958d;
          font-size: 0.62rem;
        }

        .chart-unit {
          padding: 7px 11px;
          background: var(--mint);
          border-radius: 8px;
          color: var(--forest);
          font-size: 0.7rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .chart-footer {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          border-top: 1px solid var(--border);
          padding-top: 13px;
          color: var(--text-soft);
          font-size: 0.65rem;
        }

        .chart-footer strong {
          color: var(--forest);
        }

        .empty-chart {
          text-align: center;
          padding: 55px 10px;
          color: var(--text-soft);
        }

        .empty-chart div {
          font-size: 32px;
          margin-bottom: 10px;
        }

        .empty-chart p {
          font-size: 0.85rem;
        }

        .empty-chart small {
          display: block;
          margin-top: 7px;
          font-size: 0.7rem;
        }

        @media (max-width: 1100px) {
          .metric-row {
            grid-template-columns: repeat(2, 1fr);
          }

          .analytics-main {
            grid-template-columns: 1fr;
          }

          .bottom-charts {
            grid-template-columns: repeat(2, minmax(0, 1fr));
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

          .history-chart {
            height: 210px;
          }

          .history-svg {
            height: 180px;
          }

          .chart-footer {
            flex-direction: column;
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
            Explore actual sensor readings and environmental trends
            across your greenhouse.
          </p>
        </div>

        <div className="analytics-live">
          <span
            className={`status-dot ${sensorConnected ? "online" : ""}`}
          ></span>
          {sensorConnected ? "Sensor connected" : "Waiting for sensor data"}
        </div>
      </header>

      {/* Current sensor readings */}
      <section className="metric-row">
        {readings.map((item) => (
          <MetricCard
            key={item.label}
            label={item.label}
            value={
              typeof item.value === "number"
                ? item.value.toFixed(2)
                : "--"
            }
            unit={item.unit}
            icon={item.icon}
            change={sensorConnected ? "Live reading" : "Awaiting data"}
          />
        ))}
      </section>

      {/* Main air temperature graph */}
      <section className="analytics-main">
        <div className="chart-card glass-card hover-lift">
          <HistoryChart
            title="Air temperature trend"
            description="Temperature readings collected from the SHT40 sensor."
            data={history}
            dataKey="temperature"
            unit="°C"
            color="#4f8f5b"
            gradientId="airTemperatureGradient"
          />
        </div>

        <div className="summary-stack">
          <div className="summary-card glass-card hover-lift">
            <span className="eyebrow">Historical data</span>

            <div className="summary-number">
              {history.length}
            </div>

            <p className="summary-description">
              Valid RAK3172 sensor records available for analytics.
              Older records without all four current sensor readings
              are excluded.
            </p>
          </div>

          <div className="summary-card glass-card hover-lift">
            <span className="eyebrow">Current conditions</span>

            <div className="condition-list">
              {readings.map((item) => (
                <div className="condition-item" key={item.label}>
                  <div className="condition-left">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>

                  <span className="condition-value">
                    {typeof item.value === "number"
                      ? `${item.value.toFixed(2)} ${item.unit}`
                      : "--"}
                  </span>
                </div>
              ))}
            </div>

            <p className="summary-description">
              Last updated: {formatDateTime(lastUpdated)}
            </p>
          </div>
        </div>
      </section>

      {/* Remaining three actual sensor graphs */}
      <section className="bottom-charts">
        <HistoryChart
          title="Humidity trend"
          description="Relative humidity measured by SHT40."
          data={history}
          dataKey="humidity"
          unit="%"
          color="#5796b5"
          gradientId="humidityGradient"
        />

        <HistoryChart
          title="Soil temperature"
          description="Temperature measured by DS18B20."
          data={history}
          dataKey="soilTemperature"
          unit="°C"
          color="#c28b4e"
          gradientId="soilTemperatureGradient"
        />

        <HistoryChart
          title="Soil moisture"
          description="Raw analog readings from the soil moisture sensor."
          data={history}
          dataKey="soilMoisture"
          unit="ADC"
          color="#789b58"
          gradientId="soilMoistureGradient"
        />
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

      <div className="metric-change">{change}</div>
    </div>
  );
}

export default Analytics;
