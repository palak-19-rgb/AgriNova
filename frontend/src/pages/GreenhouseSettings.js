
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../services/api";
const initialSettings = {
  greenhouseName: "",
  location: "",
  greenhouseType: "Polyhouse",
  greenhouseArea: 0,
  areaUnit: "sq. ft.",
  numberOfZones: 1,
  crop: "Tomato",
  cropVariety: "",
  growingStage: "Seedling",
  plantingDate: "",
  expectedHarvestDate: "",
  growingDurationDays: 0,
  plantCount: 0,
  growingMedium: "Soil",
  irrigationMethod: "Drip",
  targetTemperatureMin: 18,
  targetTemperatureMax: 30,
  targetHumidityMin: 45,
  targetHumidityMax: 80,
  targetMoistureMin: 40,
  targetMoistureMax: 70,
  alertPreferences: {
    temperature: true,
    humidity: true,
    soilMoisture: true,
    light: true
  }
};

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().split("T")[0];
}

function displayDate(value) {
  if (!value) return "Not specified";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function GreenhouseSettings({ user }) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasSavedSettings, setHasSavedSettings] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const token = localStorage.getItem("agrinova_token");

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${API_URL}/greenhouse`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const greenhouse = res.data.greenhouse || {};

        const hasExistingProfile = Boolean(
          greenhouse.greenhouseName &&
          greenhouse.greenhouseName.trim()
        );

        setHasSavedSettings(hasExistingProfile);
        setIsEditing(!hasExistingProfile);

        setSettings(prev => ({
          ...prev,
          ...greenhouse,
          plantingDate: formatDate(greenhouse.plantingDate),
          expectedHarvestDate: formatDate(
            greenhouse.expectedHarvestDate
          ),
          alertPreferences: {
            ...prev.alertPreferences,
            ...greenhouse.alertPreferences
          }
        }));
      } catch (error) {
        console.error("Fetch greenhouse error:", error);
        setMessage("Unable to load greenhouse settings.");
        setMessageType("error");
        setIsEditing(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setSettings(prev => ({
      ...prev,
      [name]: type === "number" ? value : value
    }));
  };

  const handleAlertChange = (name) => {
    setSettings(prev => ({
      ...prev,
      alertPreferences: {
        ...prev.alertPreferences,
        [name]: !prev.alertPreferences[name]
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const res = await axios.put(
        `${API_URL}/greenhouse`,
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const updatedGreenhouse = res.data.greenhouse || {};

      setSettings(prev => ({
        ...prev,
        ...updatedGreenhouse,
        plantingDate: formatDate(
          updatedGreenhouse.plantingDate ?? prev.plantingDate
        ),
        expectedHarvestDate: formatDate(
          updatedGreenhouse.expectedHarvestDate ?? prev.expectedHarvestDate
        ),
        alertPreferences: {
          ...prev.alertPreferences,
          ...updatedGreenhouse.alertPreferences
        }
      }));

      setHasSavedSettings(true);
      setIsEditing(false);
      setMessage("Greenhouse configuration saved successfully!");
      setMessageType("success");

    } catch (error) {
      console.error("Save greenhouse error:", error);

      setMessage(
        error.response?.data?.message ||
        "Unable to save greenhouse settings."
      );

      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setMessage("");
    setMessageType("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (hasSavedSettings) {
      setIsEditing(false);
      setMessage("");
      setMessageType("");
    }
  };

  const Field = ({
    label,
    name,
    type = "text",
    options,
    min,
    max,
    step
  }) => (
    <div className="gs-field">
      <label htmlFor={name}>{label}</label>

      {options ? (
        <select
          id={name}
          name={name}
          value={settings[name] ?? ""}
          onChange={handleChange}
        >
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={settings[name] ?? ""}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
        />
      )}
    </div>
  );

  const ownerName =
    settings.ownerName ||
    user?.name ||
    user?.fullName ||
    "Grower";

  const ownerEmail =
    settings.ownerEmail ||
    user?.email ||
    "Not available";

  const ownerPhone =
    settings.ownerPhone ||
    user?.phone ||
    "Not provided";

  if (loading) {
    return (
      <div className="gs-loading">
        <div className="gs-spinner" />
        Loading your greenhouse configuration...
      </div>
    );
  }

  return (
    <div className="gs-page">

      <style>{`
        .gs-page {
          color: #234b35;
          padding-bottom: 45px;
          width: 100%;
        }

        .gs-hero {
          position: relative;
          overflow: hidden;
          padding: 32px;
          margin-bottom: 22px;
          border-radius: 20px;
          background: linear-gradient(115deg, #193f2d, #315f40 65%, #527e53);
          color: white;
        }

        .gs-eyebrow {
          color: #c0d9bc;
          font-size: .68rem;
          font-weight: 800;
          letter-spacing: .15em;
          text-transform: uppercase;
        }

        .gs-hero h1 {
          margin: 12px 0 8px;
          font-size: clamp(1.65rem, 3vw, 2.3rem);
          font-weight: 700;
        }

        .gs-hero p {
          max-width: 600px;
          color: #d5e3d4;
          font-size: .82rem;
          line-height: 1.7;
        }

        .gs-owner {
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
          margin-top: 24px;
          padding-top: 19px;
          border-top: 1px solid rgba(255,255,255,.18);
        }

        .gs-owner-item span {
          display: block;
          color: #b8d0b9;
          font-size: .62rem;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .gs-owner-item strong {
          display: block;
          margin-top: 5px;
          font-size: .82rem;
        }

        .gs-section {
          margin-bottom: 19px;
          padding: 25px;
          border: 1px solid var(--border);
          border-radius: 17px;
          background: rgba(255,255,255,.85);
          box-shadow: 0 5px 20px rgba(31,63,43,.035);
        }

        .gs-section-heading {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 24px;
        }

        .gs-section-number {
          display: grid;
          place-items: center;
          width: 39px;
          height: 39px;
          flex-shrink: 0;
          border-radius: 11px;
          background: #eaf2e7;
          color: #3f7650;
          font-size: .72rem;
          font-weight: 900;
        }

        .gs-section-heading h2 {
          margin: 1px 0 5px;
          color: var(--forest);
          font-size: 1rem;
          font-weight: 800;
        }

        .gs-section-heading p {
          margin: 0;
          color: var(--text-soft);
          font-size: .72rem;
          line-height: 1.5;
        }

        .gs-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 19px;
        }

        .gs-field label {
          display: block;
          margin-bottom: 8px;
          color: #64766a;
          font-size: .67rem;
          font-weight: 800;
          letter-spacing: .045em;
        }

        .gs-field input,
        .gs-field select {
          box-sizing: border-box;
          width: 100%;
          height: 46px;
          padding: 0 12px;
          border: 1px solid #dfe8dd;
          border-radius: 10px;
          outline: none;
          background: #fbfcfa;
          color: #294e37;
          font: inherit;
          font-size: .79rem;
        }

        .gs-field input:focus,
        .gs-field select:focus {
          border-color: #78a47c;
          box-shadow: 0 0 0 3px rgba(79,143,91,.10);
          background: white;
        }

        .gs-subheading {
          margin: 24px 0 15px;
          padding-top: 18px;
          border-top: 1px solid var(--border);
          color: var(--forest);
          font-size: .79rem;
          font-weight: 800;
        }

        .gs-alert-list {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 12px;
        }

        .gs-alert-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 15px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: #fbfcfa;
        }

        .gs-alert-option strong {
          display: block;
          font-size: .76rem;
        }

        .gs-alert-option small {
          display: block;
          margin-top: 4px;
          color: var(--text-soft);
          font-size: .64rem;
        }

        .gs-toggle {
          width: 42px;
          height: 23px;
          flex-shrink: 0;
          appearance: none;
          border: none;
          border-radius: 20px;
          background: #cbd5ca;
          cursor: pointer;
          position: relative;
        }

        .gs-toggle:checked {
          background: #4c895b;
        }

        .gs-toggle:after {
          content: "";
          position: absolute;
          top: 3px;
          left: 3px;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          background: white;
          transition: .2s;
        }

        .gs-toggle:checked:after {
          transform: translateX(19px);
        }

        .gs-savebar {
          position: sticky;
          bottom: 12px;
          z-index: 5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding: 15px 19px;
          border: 1px solid var(--border);
          border-radius: 15px;
          background: rgba(255,255,255,.96);
          box-shadow: 0 8px 30px rgba(31,63,43,.10);
        }

        .gs-feedback {
          font-size: .74rem;
          font-weight: 700;
        }

        .gs-feedback.success { color: #39804d; }
        .gs-feedback.error { color: #b85c50; }

        .gs-save,
        .gs-update,
        .gs-cancel {
          padding: 13px 22px;
          border: none;
          border-radius: 9px;
          font-size: .76rem;
          font-weight: 800;
          cursor: pointer;
          transition: .2s;
        }

        .gs-save,
        .gs-update {
          background: #244f36;
          color: white;
        }

        .gs-save:hover,
        .gs-update:hover {
          background: #427c4f;
        }

        .gs-cancel {
          border: 1px solid var(--border);
          background: white;
          color: var(--forest);
        }

        .gs-save:disabled {
          opacity: .6;
          cursor: wait;
        }

        .gs-loading {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 45px;
          color: var(--text-soft);
          font-size: .85rem;
        }

        .gs-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid #dce8da;
          border-top-color: #4d895a;
          border-radius: 50%;
          animation: gsSpin .8s linear infinite;
        }

        @keyframes gsSpin {
          to { transform: rotate(360deg); }
        }

        /* Saved profile card */

        .gs-profile {
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 19px;
          background: white;
          box-shadow: 0 6px 25px rgba(31,63,43,.05);
        }

        .gs-profile-header {
          padding: 27px;
          background: #f2f7f0;
          border-bottom: 1px solid var(--border);
        }

        .gs-profile-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
          flex-wrap: wrap;
        }

        .gs-profile-header h2 {
          margin: 9px 0 5px;
          color: #234b35;
          font-size: 1.45rem;
        }

        .gs-profile-header p {
          margin: 0;
          color: #718174;
          font-size: .78rem;
        }

        .gs-saved-badge {
          padding: 7px 12px;
          border-radius: 20px;
          background: #e0f0e1;
          color: #347347;
          font-size: .7rem;
          font-weight: 800;
        }

        .gs-profile-body {
          padding: 26px;
        }

        .gs-profile-body h3 {
          margin: 0 0 16px;
          color: #294e37;
          font-size: .88rem;
        }

        .gs-detail-grid {
          display: grid;
          grid-template-columns: repeat(3,minmax(0,1fr));
          gap: 17px;
        }

        .gs-detail {
          padding: 15px;
          border: 1px solid #e8eee6;
          border-radius: 11px;
          background: #fbfcfa;
          min-width: 0;
        }

        .gs-detail span {
          display: block;
          margin-bottom: 7px;
          color: #879389;
          font-size: .63rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .04em;
        }

        .gs-detail strong {
          color: #294e37;
          font-size: .82rem;
          overflow-wrap: anywhere;
        }

        .gs-profile-divider {
          margin: 25px 0;
          border: 0;
          border-top: 1px solid #e8eee6;
        }

        .gs-profile-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          padding: 19px 26px;
          border-top: 1px solid var(--border);
          background: #fcfdfb;
        }

        .gs-profile-footer p {
          margin: 0;
          color: #819083;
          font-size: .7rem;
        }

        .gs-message {
          margin-bottom: 15px;
          font-size: .77rem;
          font-weight: 700;
        }

        .gs-message.success { color: #39804d; }
        .gs-message.error { color: #b85c50; }

        @media(max-width: 800px) {
          .gs-detail-grid {
            grid-template-columns: repeat(2,minmax(0,1fr));
          }
        }

        @media(max-width: 600px) {
          .gs-hero { padding: 23px; }
          .gs-section { padding: 19px; }
          .gs-grid,
          .gs-alert-list,
          .gs-detail-grid {
            grid-template-columns: 1fr;
          }
          .gs-savebar {
            align-items: stretch;
            flex-direction: column;
          }
          .gs-save { width: 100%; }
          .gs-profile-body { padding: 19px; }
          .gs-profile-header { padding: 21px; }
          .gs-profile-footer { padding: 18px; }
        }
      `}</style>

      {/* Main heading */}

      <div className="gs-hero">
        <span className="gs-eyebrow">
          Agrinova / Configuration
        </span>

        <h1>Greenhouse Management</h1>

        <p>
          Manage your greenhouse profile, crop cycle and growing
          conditions from one place.
        </p>

        <div className="gs-owner">
          <div className="gs-owner-item">
            <span>Greenhouse owner</span>
            <strong>{ownerName}</strong>
          </div>

          <div className="gs-owner-item">
            <span>Email address</span>
            <strong>{ownerEmail}</strong>
          </div>

          <div className="gs-owner-item">
            <span>Contact number</span>
            <strong>{ownerPhone}</strong>
          </div>
        </div>
      </div>

      {message && (
        <div className={`gs-message ${messageType}`}>
          {message}
        </div>
      )}

      {/* Saved profile view */}

      {hasSavedSettings && !isEditing ? (
        <div className="gs-profile">

          <div className="gs-profile-header">
            <div className="gs-profile-top">
              <div>
                <span className="gs-eyebrow" style={{ color: "#57805c" }}>
                  YOUR GREENHOUSE PROFILE
                </span>

                <h2>{settings.greenhouseName}</h2>

                <p>
                  {settings.location || "Location not specified"}
                </p>
              </div>

              <span className="gs-saved-badge">
                ✓ Configuration Saved
              </span>
            </div>
          </div>

          <div className="gs-profile-body">

            <h3>Greenhouse specifications</h3>

            <div className="gs-detail-grid">
              <div className="gs-detail">
                <span>Greenhouse type</span>
                <strong>{settings.greenhouseType}</strong>
              </div>

              <div className="gs-detail">
                <span>Total area</span>
                <strong>
                  {settings.greenhouseArea} {settings.areaUnit}
                </strong>
              </div>

              <div className="gs-detail">
                <span>Growing zones</span>
                <strong>{settings.numberOfZones}</strong>
              </div>
            </div>

            <hr className="gs-profile-divider" />

            <h3>Crop & cultivation details</h3>

            <div className="gs-detail-grid">
              <div className="gs-detail">
                <span>Primary crop</span>
                <strong>{settings.crop}</strong>
              </div>

              <div className="gs-detail">
                <span>Crop variety</span>
                <strong>{settings.cropVariety || "Not specified"}</strong>
              </div>

              <div className="gs-detail">
                <span>Growing stage</span>
                <strong>{settings.growingStage}</strong>
              </div>

              <div className="gs-detail">
                <span>Number of plants</span>
                <strong>{settings.plantCount}</strong>
              </div>

              <div className="gs-detail">
                <span>Growing medium</span>
                <strong>{settings.growingMedium}</strong>
              </div>

              <div className="gs-detail">
                <span>Irrigation method</span>
                <strong>{settings.irrigationMethod}</strong>
              </div>
            </div>

            <hr className="gs-profile-divider" />

            <h3>Crop timeline</h3>

            <div className="gs-detail-grid">
              <div className="gs-detail">
                <span>Planting date</span>
                <strong>{displayDate(settings.plantingDate)}</strong>
              </div>

              <div className="gs-detail">
                <span>Expected harvest</span>
                <strong>{displayDate(settings.expectedHarvestDate)}</strong>
              </div>

              <div className="gs-detail">
                <span>Growing duration</span>
                <strong>{settings.growingDurationDays} days</strong>
              </div>
            </div>

            <hr className="gs-profile-divider" />

            <h3>Environmental target ranges</h3>

            <div className="gs-detail-grid">
              <div className="gs-detail">
                <span>Temperature</span>
                <strong>
                  {settings.targetTemperatureMin}°C – {settings.targetTemperatureMax}°C
                </strong>
              </div>

              <div className="gs-detail">
                <span>Humidity</span>
                <strong>
                  {settings.targetHumidityMin}% – {settings.targetHumidityMax}%
                </strong>
              </div>

              <div className="gs-detail">
                <span>Soil moisture</span>
                <strong>
                  {settings.targetMoistureMin}% – {settings.targetMoistureMax}%
                </strong>
              </div>
            </div>

            <hr className="gs-profile-divider" />

            <h3>Monitoring preferences</h3>

            <div className="gs-detail-grid">
              {[
                ["Temperature", "temperature"],
                ["Humidity", "humidity"],
                ["Soil moisture", "soilMoisture"],
                ["Light intensity", "light"]
              ].map(([label, key]) => (
                <div className="gs-detail" key={key}>
                  <span>{label} alerts</span>
                  <strong>
                    {settings.alertPreferences[key] ? "Enabled" : "Disabled"}
                  </strong>
                </div>
              ))}
            </div>

          </div>

          <div className="gs-profile-footer">
            <p>
              Your configuration is saved to your account.
            </p>

            <button
              className="gs-update"
              type="button"
              onClick={handleEdit}
            >
              Update Greenhouse Details →
            </button>
          </div>

        </div>
      ) : (

        /* Setup and edit form */

        <form onSubmit={handleSave}>

          <section className="gs-section">
            <div className="gs-section-heading">
              <div className="gs-section-number">01</div>
              <div>
                <h2>Greenhouse identity</h2>
                <p>
                  Basic details and physical specifications of your growing facility.
                </p>
              </div>
            </div>

            <div className="gs-grid">
              <Field label="GREENHOUSE NAME" name="greenhouseName" />
              <Field label="LOCATION" name="location" />

              <Field
                label="GREENHOUSE TYPE"
                name="greenhouseType"
                options={["Polyhouse", "Net House", "Glasshouse", "Open Field"]}
              />

              <Field
                label="GREENHOUSE AREA"
                name="greenhouseArea"
                type="number"
                min="0"
              />

              <Field
                label="AREA UNIT"
                name="areaUnit"
                options={["sq. ft.", "sq. m.", "acres", "hectares"]}
              />

              <Field
                label="NUMBER OF GROWING ZONES"
                name="numberOfZones"
                type="number"
                min="1"
              />
            </div>
          </section>

          <section className="gs-section">
            <div className="gs-section-heading">
              <div className="gs-section-number">02</div>
              <div>
                <h2>Crop & cultivation plan</h2>
                <p>
                  Identify what you're growing and how much you're cultivating.
                </p>
              </div>
            </div>

            <div className="gs-grid">
              <Field
                label="PRIMARY CROP"
                name="crop"
                options={[
                  "Tomato", "Cucumber", "Capsicum", "Lettuce",
                  "Spinach", "Strawberry", "Other"
                ]}
              />

              <Field label="CROP VARIETY" name="cropVariety" />

              <Field
                label="CURRENT GROWING STAGE"
                name="growingStage"
                options={[
                  "Seedling", "Vegetative", "Flowering",
                  "Fruiting", "Harvesting"
                ]}
              />

              <Field
                label="NUMBER OF PLANTS"
                name="plantCount"
                type="number"
                min="0"
              />

              <Field
                label="PLANTING / SOWING DATE"
                name="plantingDate"
                type="date"
              />
            </div>
          </section>

          <section className="gs-section">
            <div className="gs-section-heading">
              <div className="gs-section-number">03</div>
              <div>
                <h2>Harvest timeline</h2>
                <p>
                  Set your expected crop readiness and production timeline.
                </p>
              </div>
            </div>

            <div className="gs-grid">
              <Field
                label="EXPECTED HARVEST DATE"
                name="expectedHarvestDate"
                type="date"
              />

              <Field
                label="TARGET GROWING DURATION (DAYS)"
                name="growingDurationDays"
                type="number"
                min="0"
              />
            </div>
          </section>

          <section className="gs-section">
            <div className="gs-section-heading">
              <div className="gs-section-number">04</div>
              <div>
                <h2>Growing environment</h2>
                <p>
                  Define your cultivation method and desired environmental ranges.
                </p>
              </div>
            </div>

            <div className="gs-grid">
              <Field
                label="GROWING MEDIUM"
                name="growingMedium"
                options={["Soil", "Cocopeat", "Hydroponics", "Other"]}
              />

              <Field
                label="IRRIGATION METHOD"
                name="irrigationMethod"
                options={["Drip", "Sprinkler", "Manual", "Other"]}
              />
            </div>

            <h3 className="gs-subheading">
              Environmental target ranges
            </h3>

            <div className="gs-grid">
              <Field label="MIN. TEMPERATURE (°C)" name="targetTemperatureMin" type="number" />
              <Field label="MAX. TEMPERATURE (°C)" name="targetTemperatureMax" type="number" />
              <Field label="MIN. HUMIDITY (%)" name="targetHumidityMin" type="number" min="0" max="100" />
              <Field label="MAX. HUMIDITY (%)" name="targetHumidityMax" type="number" min="0" max="100" />
              <Field label="MIN. SOIL MOISTURE (%)" name="targetMoistureMin" type="number" min="0" max="100" />
              <Field label="MAX. SOIL MOISTURE (%)" name="targetMoistureMax" type="number" min="0" max="100" />
            </div>
          </section>

          <section className="gs-section">
            <div className="gs-section-heading">
              <div className="gs-section-number">05</div>
              <div>
                <h2>Monitoring & alert preferences</h2>
                <p>
                  Choose which environmental conditions you want AgriNova to monitor for alerts.
                </p>
              </div>
            </div>

            <div className="gs-alert-list">
              {[
                ["temperature", "Temperature alerts", "Temperature outside your target range."],
                ["humidity", "Humidity alerts", "Humidity outside your preferred range."],
                ["soilMoisture", "Soil moisture alerts", "Low or excessive soil moisture."],
                ["light", "Light intensity alerts", "Insufficient or excessive light."]
              ].map(([key, title, description]) => (
                <div className="gs-alert-option" key={key}>
                  <div>
                    <strong>{title}</strong>
                    <small>{description}</small>
                  </div>

                  <input
                    className="gs-toggle"
                    type="checkbox"
                    checked={Boolean(settings.alertPreferences[key])}
                    onChange={() => handleAlertChange(key)}
                    aria-label={title}
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="gs-savebar">
            <div className={`gs-feedback ${messageType}`}>
              {message || (
                hasSavedSettings
                  ? "Update your greenhouse configuration."
                  : "Complete your greenhouse profile to get started."
              )}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              {hasSavedSettings && (
                <button
                  className="gs-cancel"
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}

              <button
                className="gs-save"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : hasSavedSettings
                    ? "Save Changes →"
                    : "Save Greenhouse Configuration →"}
              </button>
            </div>
          </div>

        </form>
      )}

    </div>
  );
}

export default GreenhouseSettings;
