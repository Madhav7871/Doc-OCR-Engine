import React, { useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);

  // NEW: State to toggle the ID visibility
  const [showFullId, setShowFullId] = useState(false);

  // Handle image selection and create a preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setExtractedData(null);
      setError(null);
      setShowFullId(false); // Reset toggle when new image is uploaded
    }
  };

  // Helper function to dynamically mask/unmask the ID
  const getDisplayedId = (idString, isVisible) => {
    if (!idString) return "XXXX XXXX XXXX";
    if (isVisible) return idString; // Show complete number

    // Mask the first 8 digits and keep the last 4 visible
    return idString.replace(/^(\d{4}\s?\d{4})/, "XXXX XXXX");
  };

  // Send the image to your backend API
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
    <div className="app-container">
      <header>
        <h1>DocuLens OCR Engine</h1>
        <p>Upload an identity document for real-time data extraction.</p>
      </header>

      <main className="main-content">
        {/* Upload Section */}
        <div className="upload-card">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="file-upload"
          />

          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Document Preview" />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className="upload-btn"
          >
            {loading ? "Processing Document..." : "Run OCR Pipeline"}
          </button>

          {error && <p className="error-text">{error}</p>}
        </div>

        {/* Results Section */}
        {extractedData && (
          <div className="results-card">
            <h2>Extraction Results</h2>
            <div className="result-grid">
              <div className="data-field">
                <span className="label">Name:</span>
                <span className="value">
                  {extractedData.name || "Not detected"}
                </span>
              </div>

              <div className="data-field">
                <span className="label">DOB:</span>
                <span className="value">
                  {extractedData.dob || "Not detected"}
                </span>
              </div>

              <div className="data-field">
                <span className="label">Gender:</span>
                <span className="value">
                  {extractedData.gender || "Not detected"}
                </span>
              </div>

              {/* UPDATED: ID Number field with Eye Toggle */}
              <div
                className="data-field highlight"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span className="label">ID Number:</span>
                  <span className="value">
                    {getDisplayedId(
                      extractedData.id_number || extractedData.aadhaar_no,
                      showFullId,
                    )}
                  </span>
                </div>

                {/* Eye Icon Button */}
                <button
                  type="button"
                  onClick={() => setShowFullId(!showFullId)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                    padding: "5px",
                  }}
                  title={showFullId ? "Hide ID Number" : "Show ID Number"}
                >
                  {showFullId ? (
                    /* Eye-Slash Icon */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
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
                    /* Eye Icon */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
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
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
