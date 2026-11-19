import React from "react";
import { useTranslation } from "react-i18next";
function GreenhouseScene() {
    const { t } = useTranslation();
  return (
    <>
      <div className="greenhouse-scene">
        <div className="scene-sky">
          <div className="sun"></div>
          <div className="cloud cloud-one"></div>
          <div className="cloud cloud-two"></div>
        </div>

        <div className="greenhouse">
          <div className="greenhouse-roof roof-left"></div>
          <div className="greenhouse-roof roof-right"></div>

          <div className="greenhouse-frame frame-top"></div>
          <div className="greenhouse-frame frame-left"></div>
          <div className="greenhouse-frame frame-right"></div>
          <div className="greenhouse-frame frame-middle"></div>

          <div className="glass-panel panel-left"></div>
          <div className="glass-panel panel-center"></div>
          <div className="glass-panel panel-right"></div>

          <div className="plant plant-one">
            <span className="stem"></span>
            <span className="leaf leaf-left"></span>
            <span className="leaf leaf-right"></span>
            <span className="leaf leaf-top"></span>
          </div>

          <div className="plant plant-two">
            <span className="stem"></span>
            <span className="leaf leaf-left"></span>
            <span className="leaf leaf-right"></span>
            <span className="leaf leaf-top"></span>
          </div>

          <div className="plant plant-three">
            <span className="stem"></span>
            <span className="leaf leaf-left"></span>
            <span className="leaf leaf-right"></span>
            <span className="leaf leaf-top"></span>
          </div>

          <div className="soil-bed">
            <div className="soil-line line-one"></div>
            <div className="soil-line line-two"></div>
            <div className="soil-line line-three"></div>
          </div>
        </div>

        <div className="scene-ground"></div>

        <div className="scene-label">
          <div className="label-icon">⌁</div>
          <div>
            <strong>	{t("greenhouseA")}</strong>
            <span>{t("smartMonitoringZone")}</span>
          </div>
        </div>

        <div className="floating-reading reading-temp">
          <span className="reading-icon">°</span>
          <div>
            <small>	{t("temperature")}</small>
            <strong>26.4°C</strong>
          </div>
        </div>

        <div className="floating-reading reading-moisture">
          <span className="reading-icon">◌</span>
          <div>
            <small>{t("soilMoisture")}</small>
            <strong>68%</strong>
          </div>
        </div>
      </div>

      <style>{`
        .greenhouse-scene {
          position: relative;
          min-height: 420px;
          overflow: hidden;
          border-radius: 26px;
          background:
            linear-gradient(
              180deg,
              #dfeee2 0%,
              #edf3e8 58%,
              #dce8d7 100%
            );
          border: 1px solid rgba(31, 63, 43, 0.08);
          box-shadow: 0 18px 50px rgba(31, 63, 43, 0.1);
        }

        .scene-sky {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .sun {
          position: absolute;
          top: 48px;
          right: 15%;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #f4d98b;
          box-shadow:
            0 0 0 12px rgba(244, 217, 139, 0.12),
            0 0 45px rgba(244, 217, 139, 0.3);
          animation: sunFloat 5s ease-in-out infinite;
        }

        .cloud {
          position: absolute;
          width: 100px;
          height: 24px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.55);
          filter: blur(1px);
        }

        .cloud::before,
        .cloud::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          background: inherit;
        }

        .cloud::before {
          width: 38px;
          height: 38px;
          left: 15px;
          bottom: 4px;
        }

        .cloud::after {
          width: 48px;
          height: 48px;
          right: 16px;
          bottom: 3px;
        }

        .cloud-one {
          top: 80px;
          left: 8%;
          opacity: 0.65;
          animation: cloudMove 15s linear infinite;
        }

        .cloud-two {
          top: 135px;
          right: 8%;
          transform: scale(0.65);
          opacity: 0.4;
          animation: cloudMoveReverse 18s linear infinite;
        }

        .greenhouse {
          position: absolute;
          left: 50%;
          bottom: 68px;
          width: min(68%, 570px);
          height: 245px;
          transform: translateX(-50%);
        }

        .greenhouse-roof {
          position: absolute;
          top: 8px;
          width: 50%;
          height: 105px;
          border: 3px solid rgba(53, 101, 69, 0.58);
          border-bottom: none;
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(2px);
        }

        .roof-left {
          left: 0;
          transform: skewY(-28deg);
          transform-origin: bottom right;
        }

        .roof-right {
          right: 0;
          transform: skewY(28deg);
          transform-origin: bottom left;
        }

        .greenhouse-frame {
          position: absolute;
          background: rgba(53, 101, 69, 0.65);
          z-index: 4;
        }

        .frame-top {
          left: 3%;
          right: 3%;
          top: 91px;
          height: 3px;
        }

        .frame-left {
          left: 3%;
          top: 91px;
          bottom: 0;
          width: 3px;
        }

        .frame-right {
          right: 3%;
          top: 91px;
          bottom: 0;
          width: 3px;
        }

        .frame-middle {
          left: 50%;
          top: 48px;
          bottom: 0;
          width: 3px;
          transform: translateX(-50%);
        }

        .glass-panel {
          position: absolute;
          top: 96px;
          bottom: 0;
          background: rgba(220, 235, 220, 0.28);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .panel-left {
          left: 4%;
          width: 45%;
        }

        .panel-center {
          left: 50%;
          width: 0;
        }

        .panel-right {
          right: 4%;
          width: 45%;
        }

        .soil-bed {
          position: absolute;
          left: 5%;
          right: 5%;
          bottom: 0;
          height: 65px;
          border-radius: 45% 45% 8px 8px;
          background:
            radial-gradient(
              circle at 20% 40%,
              rgba(255,255,255,0.1) 0 2px,
              transparent 3px
            ),
            radial-gradient(
              circle at 60% 55%,
              rgba(255,255,255,0.08) 0 2px,
              transparent 3px
            ),
            var(--soil);
          box-shadow: inset 0 8px 15px rgba(60, 40, 25, 0.14);
          z-index: 5;
        }

        .soil-line {
          position: absolute;
          height: 2px;
          width: 24%;
          border-radius: 20px;
          background: rgba(240, 220, 195, 0.18);
        }

        .line-one {
          left: 8%;
          top: 20px;
        }

        .line-two {
          left: 39%;
          top: 31px;
        }

        .line-three {
          right: 8%;
          top: 18px;
        }

        .plant {
          position: absolute;
          bottom: 42px;
          width: 62px;
          height: 105px;
          z-index: 6;
          animation: plantSway 4s ease-in-out infinite;
          transform-origin: bottom center;
        }

        .plant-one {
          left: 20%;
        }

        .plant-two {
          left: 46%;
          height: 125px;
          animation-delay: -1.2s;
        }

        .plant-three {
          right: 19%;
          height: 92px;
          animation-delay: -2s;
        }

        .stem {
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 5px;
          height: 78%;
          border-radius: 10px;
          transform: translateX(-50%);
          background: var(--leaf);
        }

        .leaf {
          position: absolute;
          width: 34px;
          height: 18px;
          border-radius: 100% 0 100% 0;
          background: #4f8f5b;
          box-shadow: inset -3px -2px 5px rgba(25, 70, 38, 0.12);
        }

        .leaf-left {
          left: 0;
          top: 45px;
          transform: rotate(-25deg);
        }

        .leaf-right {
          right: 0;
          top: 28px;
          transform: rotate(25deg) scaleX(-1);
        }

        .leaf-top {
          left: 50%;
          top: 3px;
          transform: translateX(-50%) rotate(45deg);
          width: 29px;
          height: 29px;
          border-radius: 100% 0 100% 0;
        }

        .scene-ground {
          position: absolute;
          left: -5%;
          right: -5%;
          bottom: -70px;
          height: 120px;
          border-radius: 50% 50% 0 0;
          background: #c9dcc4;
          z-index: 2;
        }

        .scene-label {
          position: absolute;
          left: 24px;
          bottom: 22px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 15px;
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(31,63,43,0.08);
          backdrop-filter: blur(12px);
          z-index: 10;
        }

        .label-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: var(--mint);
          color: var(--forest);
          font-size: 20px;
        }

        .scene-label strong,
        .scene-label span {
          display: block;
        }

        .scene-label strong {
          color: var(--forest);
          font-size: 0.75rem;
        }

        .scene-label span {
          margin-top: 2px;
          color: var(--text-soft);
          font-size: 0.62rem;
        }

        .floating-reading {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 13px;
          border: 1px solid rgba(31,63,43,0.08);
          border-radius: 15px;
          background: rgba(255,255,255,0.82);
          box-shadow: 0 10px 30px rgba(31,63,43,0.09);
          backdrop-filter: blur(12px);
          z-index: 10;
          animation: readingFloat 5s ease-in-out infinite;
        }

        .reading-temp {
          top: 36%;
          left: 7%;
        }

        .reading-moisture {
          top: 45%;
          right: 6%;
          animation-delay: -2s;
        }

        .reading-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: var(--mint);
          color: var(--forest);
          font-size: 17px;
          font-weight: 700;
        }

        .floating-reading small,
        .floating-reading strong {
          display: block;
        }

        .floating-reading small {
          color: var(--text-soft);
          font-size: 0.58rem;
        }

        .floating-reading strong {
          margin-top: 2px;
          color: var(--forest);
          font-family: "Playfair Display", serif;
          font-size: 0.95rem;
        }

        @keyframes sunFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes plantSway {
          0%, 100% {
            transform: rotate(-1deg);
          }

          50% {
            transform: rotate(2deg);
          }
        }

        @keyframes readingFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes cloudMove {
          0% {
            transform: translateX(-20px);
          }

          50% {
            transform: translateX(25px);
          }

          100% {
            transform: translateX(-20px);
          }
        }

        @keyframes cloudMoveReverse {
          0% {
            transform: translateX(15px) scale(0.65);
          }

          50% {
            transform: translateX(-25px) scale(0.65);
          }

          100% {
            transform: translateX(15px) scale(0.65);
          }
        }

        @media (max-width: 900px) {
          .greenhouse-scene {
            min-height: 390px;
          }

          .greenhouse {
            width: 65%;
            transform: translateX(-50%) scale(0.9);
          }

          .reading-temp {
            left: 4%;
          }

          .reading-moisture {
            right: 4%;
          }
        }

        @media (max-width: 650px) {
          .greenhouse-scene {
            min-height: 355px;
            border-radius: 20px;
          }

          .sun {
            width: 52px;
            height: 52px;
            top: 35px;
            right: 12%;
          }

          .greenhouse {
            width: 82%;
            height: 205px;
            bottom: 66px;
            transform: translateX(-50%);
          }

          .floating-reading {
            padding: 7px 9px;
          }

          .reading-icon {
            width: 27px;
            height: 27px;
            font-size: 14px;
          }

          .floating-reading small {
            font-size: 0.5rem;
          }

          .floating-reading strong {
            font-size: 0.75rem;
          }

          .reading-temp {
            top: 23%;
            left: 4%;
          }

          .reading-moisture {
            top: 29%;
            right: 4%;
          }

          .scene-label {
            left: 14px;
            bottom: 14px;
            padding: 8px 10px;
          }

          .label-icon {
            width: 27px;
            height: 27px;
            font-size: 16px;
          }

          .scene-label strong {
            font-size: 0.65rem;
          }

          .scene-label span {
            font-size: 0.52rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sun,
          .plant,
          .floating-reading,
          .cloud {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}

export default GreenhouseScene;