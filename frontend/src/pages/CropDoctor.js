
import React, { useEffect, useRef, useState } from "react";
import API_URL from "../services/api";
function CropDoctor() {
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [cropType, setCropType] = useState("Tomato");
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleImage = (file) => {
    setError("");
    setResult(null);

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG or WEBP image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");
      return;
    }

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (event) => {
    handleImage(event.target.files[0]);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleImage(event.dataTransfer.files[0]);
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl("");
    setResult(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const analyzeImage = async () => {
    if (!image) {
      setError("Please upload a crop image first.");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("image", image);
      formData.append("cropType", cropType);

      const response = await fetch(
        `${API_URL}/crop-doctor/analyze`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Crop analysis failed. Please try again."
        );
      }

      if (!data.analysis) {
        throw new Error("No analysis was returned.");
      }

      setResult(data.analysis);
    } catch (err) {
      console.error("Crop Doctor error:", err);

      setError(
        err.message || "Unable to analyse image. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <style>{`
        .crop-doctor {
          width: 100%;
          max-width: 1450px;
          margin: 0 auto;
          padding: 34px 42px;
          color: #304437;
          font-family: "DM Sans", sans-serif;
          animation: cropFade 0.4s ease;
        }

        @keyframes cropFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .crop-doctor * {
          box-sizing: border-box;
        }

        .cd-eyebrow {
          color: #748778;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .cd-header {
          margin-bottom: 27px;
        }

        .cd-header h1 {
          margin: 9px 0 0;
          color: #294332;
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(2rem, 3vw, 2.7rem);
          font-weight: 600;
          letter-spacing: -0.03em;
        }

        .cd-header p {
          margin: 10px 0 0;
          color: #829087;
          font-size: 0.86rem;
          line-height: 1.7;
        }

        .cd-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 25px 30px;
          margin-bottom: 25px;
          border: 1px solid #e3ebe2;
          border-radius: 12px;
          background: #f3f7f1;
        }

        .cd-banner h2 {
          margin: 0;
          color: #304b37;
          font-family: "Playfair Display", Georgia, serif;
          font-size: 1.35rem;
          font-weight: 600;
        }

        .cd-banner p {
          max-width: 650px;
          margin: 8px 0 0;
          color: #7b897d;
          font-size: 0.77rem;
          line-height: 1.65;
        }

        .cd-banner-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 53px;
          height: 53px;
          flex-shrink: 0;
          border-radius: 12px;
          background: #e5eee2;
          color: #55745b;
          font-size: 1.5rem;
        }

        .cd-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          gap: 20px;
          align-items: start;
        }

        .cd-panel {
          min-width: 0;
          padding: 25px;
          border: 1px solid #e7ece5;
          border-radius: 12px;
          background: #fff;
        }

        .cd-panel-heading {
          margin-bottom: 21px;
        }

        .cd-panel-heading h3 {
          margin: 7px 0 0;
          color: #304637;
          font-family: "Playfair Display", Georgia, serif;
          font-size: 1.35rem;
          font-weight: 600;
        }

        .cd-panel-heading p {
          margin: 7px 0 0;
          color: #879389;
          font-size: 0.75rem;
          line-height: 1.6;
        }

        .cd-upload {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 255px;
          overflow: hidden;
          border: 1.5px dashed #cbd8ca;
          border-radius: 10px;
          background: #f8faf7;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .cd-upload:hover {
          border-color: #6c9470;
          background: #f3f7f1;
        }

        .cd-upload-content {
          padding: 25px;
          text-align: center;
        }

        .cd-upload-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 54px;
          height: 54px;
          margin: 0 auto 15px;
          border-radius: 12px;
          background: #eaf1e7;
          color: #55745b;
          font-size: 1.5rem;
        }

        .cd-upload-content h4 {
          margin: 0;
          color: #3c5542;
          font-size: 0.88rem;
          font-weight: 650;
        }

        .cd-upload-content p {
          margin: 8px 0 0;
          color: #8b968d;
          font-size: 0.72rem;
          line-height: 1.6;
        }

        .cd-browse {
          display: inline-block;
          margin-top: 16px;
          padding: 10px 19px;
          border: 1px solid #45684c;
          border-radius: 7px;
          background: #45684c;
          color: white;
          font-size: 0.72rem;
          font-weight: 600;
        }

        .cd-preview {
          position: relative;
          width: 100%;
          height: 255px;
          background: #f4f6f2;
        }

        .cd-preview img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .cd-remove {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 8px 12px;
          border: 0;
          border-radius: 6px;
          background: rgba(255,255,255,0.95);
          color: #a04d48;
          font-size: 0.7rem;
          font-weight: 650;
          cursor: pointer;
        }

        .cd-file-name {
          margin-top: 10px;
          overflow: hidden;
          color: #718075;
          font-size: 0.7rem;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cd-field {
          margin-top: 23px;
        }

        .cd-field label {
          display: block;
          margin-bottom: 9px;
          color: #526457;
          font-size: 0.76rem;
          font-weight: 650;
        }

        .cd-select {
          width: 100%;
          padding: 12px 13px;
          border: 1px solid #e0e7df;
          border-radius: 7px;
          outline: none;
          background: white;
          color: #435649;
          font-family: inherit;
          font-size: 0.78rem;
        }

        .cd-select:focus {
          border-color: #78977b;
        }

        .cd-hint {
          margin-top: 9px;
          color: #919b92;
          font-size: 0.68rem;
          line-height: 1.6;
        }

        .cd-analyze {
          width: 100%;
          margin-top: 22px;
          padding: 13px 16px;
          border: 0;
          border-radius: 7px;
          background: #35583d;
          color: white;
          font-family: inherit;
          font-size: 0.79rem;
          font-weight: 650;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .cd-analyze:hover:not(:disabled) {
          background: #294631;
        }

        .cd-analyze:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .cd-error {
          margin-top: 15px;
          padding: 12px 14px;
          border: 1px solid #f0dfc4;
          border-radius: 7px;
          background: #fcf8ef;
          color: #8b7041;
          font-size: 0.72rem;
          line-height: 1.6;
        }

        .cd-result-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 350px;
          padding: 25px;
          border: 1px solid #edf0eb;
          border-radius: 9px;
          background: #fafbf9;
          text-align: center;
        }

        .cd-empty-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 57px;
          height: 57px;
          margin: 0 auto 16px;
          border-radius: 50%;
          background: #edf3ea;
          color: #63816a;
          font-size: 1.45rem;
        }

        .cd-result-empty h4 {
          margin: 0;
          color: #465d4b;
          font-family: "Playfair Display", Georgia, serif;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .cd-result-empty p {
          max-width: 280px;
          margin: 10px auto 0;
          color: #89948b;
          font-size: 0.73rem;
          line-height: 1.7;
        }

        .cd-coming {
          display: inline-block;
          margin-top: 17px;
          padding: 6px 10px;
          border-radius: 5px;
          background: #edf3ea;
          color: #63816a;
          font-size: 0.64rem;
          font-weight: 650;
        }

        .cd-result-report {
          padding: 20px;
          border: 1px solid #e7ece5;
          border-radius: 9px;
          background: #fafbf9;
        }

        .cd-report-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .cd-report-status {
          color: #55745b;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .cd-severity {
          padding: 6px 10px;
          border-radius: 5px;
          background: #edf3ea;
          color: #55745b;
          font-size: 0.68rem;
          font-weight: 700;
        }

        .cd-report-disease {
          margin: 0;
          color: #304b37;
          font-family: "Playfair Display", Georgia, serif;
          font-size: 1.35rem;
          font-weight: 600;
        }

        .cd-report-confidence {
          margin-top: 7px;
          color: #879389;
          font-size: 0.7rem;
        }

        .cd-report-section {
          padding-top: 16px;
          margin-top: 16px;
          border-top: 1px solid #e8ede6;
        }

        .cd-report-section h4 {
          margin: 0 0 9px;
          color: #405745;
          font-size: 0.76rem;
        }

        .cd-report-section p,
        .cd-report-section li {
          color: #78867b;
          font-size: 0.72rem;
          line-height: 1.7;
        }

        .cd-report-section p {
          margin: 0;
        }

        .cd-report-section ul {
          margin: 0;
          padding-left: 19px;
        }

        .cd-report-disclaimer {
          margin-top: 18px;
          color: #929b92;
          font-size: 0.65rem;
          line-height: 1.6;
        }

        .cd-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 350px;
          color: #718477;
          text-align: center;
          font-size: 0.78rem;
          gap: 12px;
        }

        .cd-tips {
          margin-top: 20px;
          padding: 19px 22px;
          border: 1px solid #e8ede5;
          border-radius: 10px;
          background: #fff;
        }

        .cd-tips h4 {
          margin: 0;
          color: #405745;
          font-size: 0.79rem;
          font-weight: 650;
        }

        .cd-tips ul {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 11px 20px;
          margin: 15px 0 0;
          padding: 0;
          list-style: none;
        }

        .cd-tips li {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          color: #78867b;
          font-size: 0.7rem;
          line-height: 1.5;
        }

        .cd-check {
          color: #628168;
          font-weight: 700;
        }

        .cd-disclaimer {
          margin-top: 18px;
          color: #9aa39b;
          font-size: 0.65rem;
          line-height: 1.6;
        }

        @media (max-width: 950px) {
          .crop-doctor {
            padding: 28px 24px;
          }

          .cd-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .crop-doctor {
            padding: 22px 15px;
          }

          .cd-banner {
            padding: 20px;
          }

          .cd-panel {
            padding: 19px;
          }

          .cd-tips ul {
            grid-template-columns: 1fr;
          }

          .cd-upload {
            min-height: 220px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .crop-doctor {
            animation: none;
          }
        }
      `}</style>

      <main className="crop-doctor">

        <header className="cd-header">
          <span className="cd-eyebrow">Crop health intelligence</span>
          <h1>Crop Doctor</h1>
          <p>
            Identify potential crop diseases and pests through leaf image analysis.
          </p>
        </header>

        <section className="cd-banner">
          <div>
            <h2>Give your crops the care they deserve.</h2>
            <p>
              Upload a clear photograph of an affected leaf to help
              identify possible diseases, pest damage and treatment options.
            </p>
          </div>

          <div className="cd-banner-icon">✳</div>
        </section>

        <section className="cd-layout">

          <article className="cd-panel">
            <div className="cd-panel-heading">
              <span className="cd-eyebrow">Image analysis</span>
              <h3>Upload crop image</h3>
              <p>
                Choose a clear photograph showing the affected part of your plant.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handleFileChange}
            />

            {previewUrl ? (
              <>
                <div className="cd-preview">
                  <img src={previewUrl} alt="Uploaded crop preview" />

                  <button
                    className="cd-remove"
                    onClick={removeImage}
                    type="button"
                  >
                    Remove image ×
                  </button>
                </div>

                <div className="cd-file-name">{image?.name}</div>
              </>
            ) : (
              <div
                className="cd-upload"
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <div className="cd-upload-content">
                  <div className="cd-upload-icon">↑</div>
                  <h4>Drag and drop your image here</h4>
                  <p>
                    Or browse files from your device
                    <br />
                    JPG, PNG or WEBP · Maximum 10 MB
                  </p>
                  <span className="cd-browse">Choose image</span>
                </div>
              </div>
            )}

            <div className="cd-field">
              <label htmlFor="cropType">Select crop type</label>

              <select
                id="cropType"
                className="cd-select"
                value={cropType}
                onChange={(event) => setCropType(event.target.value)}
              >
                <option>Tomato</option>
                <option>Wheat</option>
                <option>Rice</option>
                <option>Potato</option>
                <option>Cotton</option>
                <option>Maize</option>
                <option>Mustard</option>
                <option>Other / Not sure</option>
              </select>

              <p className="cd-hint">
                Selecting the crop helps provide more relevant analysis.
              </p>
            </div>

            <button
              className="cd-analyze"
              type="button"
              onClick={analyzeImage}
              disabled={!image || isAnalyzing}
            >
              {isAnalyzing ? "Analysing crop..." : "Analyse crop image →"}
            </button>

            {error && (
              <div className="cd-error" role="alert">
                {error}
              </div>
            )}
          </article>

          <article className="cd-panel">
            <div className="cd-panel-heading">
              <span className="cd-eyebrow">AI diagnosis</span>
              <h3>Analysis report</h3>
              <p>
                Your crop health assessment will appear here after analysis.
              </p>
            </div>

            {isAnalyzing ? (
              <div className="cd-loading">
                <div className="cd-empty-icon">✳</div>
                <strong>Examining your crop image...</strong>
                <span>
                  AI is checking visible symptoms and possible diseases.
                </span>
              </div>
            ) : result ? (
              <div className="cd-result-report">

                <div className="cd-report-top">
                  <span className="cd-report-status">
                    ✓ Analysis complete
                  </span>

                  <span className="cd-severity">
                    Severity: {result.severity || "Unknown"}
                  </span>
                </div>

                <h4 className="cd-report-disease">
                  {result.disease || "No diagnosis available"}
                </h4>

                <p className="cd-report-confidence">
                  Confidence: {result.confidence || "Not specified"}
                </p>

                <div className="cd-report-section">
                  <h4>Visible observations</h4>
                  <p>
                    {result.observation || "No observations provided."}
                  </p>
                </div>

                <div className="cd-report-section">
                  <h4>Symptoms</h4>
                  <ul>
                    {(Array.isArray(result.symptoms) ? result.symptoms : []).map(
                      (item, index) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>

                <div className="cd-report-section">
                  <h4>Suggested treatment</h4>
                  <ul>
                    {(Array.isArray(result.treatment) ? result.treatment : []).map(
                      (item, index) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>

                <div className="cd-report-section">
                  <h4>Prevention</h4>
                  <ul>
                    {(Array.isArray(result.prevention) ? result.prevention : []).map(
                      (item, index) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>

                <p className="cd-report-disclaimer">
                  AI-generated assessment only. This is not a confirmed diagnosis.
                  Consult an agricultural expert before applying treatments.
                </p>
              </div>
            ) : (
              <div className="cd-result-empty">
                <div>
                  <div className="cd-empty-icon">✳</div>

                  <h4>Ready to examine your crop?</h4>

                  <p>
                    Upload a crop photograph to begin.
                    Your disease identification, severity and
                    treatment recommendations will appear here.
                  </p>

                  <span className="cd-coming">
                    Waiting for crop image
                  </span>
                </div>
              </div>
            )}
          </article>

        </section>

        <section className="cd-tips">
          <h4>Tips for better image results</h4>

          <ul>
            <li>
              <span className="cd-check">✓</span>
              Photograph the affected leaf clearly.
            </li>

            <li>
              <span className="cd-check">✓</span>
              Use natural lighting where possible.
            </li>

            <li>
              <span className="cd-check">✓</span>
              Avoid blurry or distant photographs.
            </li>

            <li>
              <span className="cd-check">✓</span>
              Include visible spots or pest damage.
            </li>
          </ul>

          <p className="cd-disclaimer">
            AI-based crop diagnosis is an assistance tool.
            Recommendations should be verified before applying treatments.
          </p>
        </section>

      </main>
    </>
  );
}

export default CropDoctor;
