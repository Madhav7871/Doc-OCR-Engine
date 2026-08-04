import React, { useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [showFullId, setShowFullId] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setExtractedData(null);
      setError(null);
      setShowFullId(false);
    }
  };

  const getDisplayedId = (idString, isVisible) => {
    if (!idString) return "XXXX XXXX XXXX";
    if (isVisible) return idString;
    return idString.replace(/^(\d{4}\s?\d{4})/, "XXXX XXXX ");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("document", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/api/ocr", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process document");
      }

      const data = await response.json();
      setExtractedData(data);
    } catch (err) {
      setError(
        "Error processing image. Make sure your backend API is running.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Top Header Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon"></span>
          <span>DocuLens AI</span>
        </div>
        <div className="nav-badge">v1.0 Ready</div>
      </nav>

      <div className="app-container">
        {/* Hero Section */}
        <header className="hero-section">
          <div className="pill-tag">
            <span>✨ Real-Time Document OCR</span>
          </div>
          <h1 className="hero-title">
            Extract Data <br />
            <span className="gradient-text">Instantly.</span>
          </h1>
          <p className="hero-subtitle">
            Upload identity documents for high-precision computer vision
            detection and extraction.
          </p>
        </header>

        {/* Upload Card */}
        <div className="glass-card">
          <div className="file-upload-wrapper">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="file-upload"
            />
          </div>

          {previewUrl && (
            <div className="image-preview-container">
              <img
                src={previewUrl}
                alt="Document Preview"
                className="image-preview"
              />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className="primary-btn"
          >
            {loading ? "Processing Document..." : "Run OCR Pipeline →"}
          </button>

          {error && <p className="error-text">{error}</p>}
        </div>

        {/* Results Card */}
        {extractedData && (
          <div className="glass-card results-card">
            <h2>
              <span>⚡</span> Extraction Results
            </h2>

            <div className="result-grid">
              <div className="result-row">
                <span className="result-label">Name</span>
                <span className="result-value">
                  {extractedData.name || "Not detected"}
                </span>
              </div>

              <div className="result-row">
                <span className="result-label">DOB</span>
                <span className="result-value">
                  {extractedData.dob || "Not detected"}
                </span>
              </div>

              <div className="result-row">
                <span className="result-label">Gender</span>
                <span className="result-value">
                  {extractedData.gender || "Not detected"}
                </span>
              </div>

              <div className="result-row">
                <span className="result-label">ID Number</span>
                <span className="result-value">
                  {getDisplayedId(
                    extractedData.id_number || extractedData.aadhaar_no,
                    showFullId,
                  )}

                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => setShowFullId(!showFullId)}
                    title={showFullId ? "Hide ID Number" : "Show ID Number"}
                  >
                    {showFullId ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clipRule="evenodd"
                        />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.274 5.943 5.065 3 10 3s8.726 2.943 9.542 7c-.816 4.057-4.607 7-9.542 7S1.274 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
