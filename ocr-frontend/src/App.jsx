import React, { useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);

  // Handle image selection and create a preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setExtractedData(null);
      setError(null);
    }
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
      // NOTE: Replace this URL with your actual backend API endpoint
      // Example: http://localhost:5000/api/extract
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
              <div className="data-field highlight">
                <span className="label">ID Number:</span>
                <span className="value">
                  {extractedData.id_number || "XXXX-XXXX-XXXX"}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
