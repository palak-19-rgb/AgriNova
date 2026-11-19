import React from "react";

function SensorCard({
  icon = "◉",
  label = "Sensor",
  value = "--",
  unit = "",
  status = "Live",
  description = "Monitoring greenhouse conditions",
  accent = "green",
}) {
  const accentClass = `sensor-card-${accent}`;

  return (
    <>
      <div className={`sensor-card ${accentClass}`}>
        <div className="sensor-card-top">
          <div className="sensor-icon">{icon}</div>

          <div className="sensor-status">
            <span className="status-dot online"></span>
            {status}
          </div>
        </div>

        <div className="sensor-label">{label}</div>

        <div className="sensor-reading">
          <strong>{value}</strong>
          <span>{unit}</span>
        </div>

        <p className="sensor-description">{description}</p>

        <div className="sensor-line">
          <span></span>
        </div>
      </div>

      <style>{`
        .sensor-card {
          position: relative;
          overflow: hidden;
          min-height: 190px;
          padding: 21px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.82);
          box-shadow: var(--shadow);
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }

        .sensor-card::after {
          content: "";
          position: absolute;
          width: 100px;
          height: 100px;
          right: -45px;
          bottom: -50px;
          border-radius: 50%;
          background: rgba(79, 143, 91, 0.07);
          pointer-events: none;
        }

        .sensor-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 42px rgba(31, 63, 43, 0.12);
          border-color: rgba(79, 143, 91, 0.2);
        }

        .sensor-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .sensor-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: var(--mint);
          color: var(--forest);
          font-size: 19px;
          font-weight: 700;
        }

        .sensor-status {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(63, 139, 88, 0.07);
          color: var(--success);
          font-size: 0.65rem;
          font-weight: 700;
        }

        .sensor-label {
          margin-top: 19px;
          color: var(--text-soft);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .sensor-reading {
          display: flex;
          align-items: baseline;
          gap: 5px;
          margin-top: 5px;
        }

        .sensor-reading strong {
          color: var(--forest);
          font-family: "Playfair Display", serif;
          font-size: 2.15rem;
          line-height: 1;
        }

        .sensor-reading span {
          color: var(--text-soft);
          font-size: 0.8rem;
          font-weight: 600;
        }

        .sensor-description {
          margin-top: 9px;
          max-width: 220px;
          color: var(--text-soft);
          font-size: 0.7rem;
          line-height: 1.5;
        }

        .sensor-line {
          position: absolute;
          left: 21px;
          right: 21px;
          bottom: 13px;
          height: 2px;
          overflow: hidden;
          border-radius: 10px;
          background: rgba(79, 143, 91, 0.08);
        }

        .sensor-line span {
          display: block;
          width: 62%;
          height: 100%;
          border-radius: inherit;
          background: var(--leaf);
          animation: sensorProgress 3s ease-in-out infinite;
        }

        .sensor-card-blue .sensor-icon {
          background: #e5eef1;
          color: #426f78;
        }

        .sensor-card-blue .sensor-line span {
          background: #6e9da5;
        }

        .sensor-card-gold .sensor-icon {
          background: #f3ead5;
          color: #967238;
        }

        .sensor-card-gold .sensor-line span {
          background: #c49a4d;
        }

        .sensor-card-brown .sensor-icon {
          background: #eee4dc;
          color: var(--soil);
        }

        .sensor-card-brown .sensor-line span {
          background: var(--soil);
        }

        @keyframes sensorProgress {
          0% {
            width: 45%;
            opacity: 0.55;
          }

          50% {
            width: 78%;
            opacity: 1;
          }

          100% {
            width: 45%;
            opacity: 0.55;
          }
        }

        @media (max-width: 600px) {
          .sensor-card {
            min-height: 175px;
            padding: 18px;
          }

          .sensor-reading strong {
            font-size: 1.9rem;
          }

          .sensor-line {
            left: 18px;
            right: 18px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sensor-line span {
            animation: none;
          }

          .sensor-card:hover {
            transform: none;
          }
        }
      `}</style>
    </>
  );
}

export default SensorCard;