# 📄 Doc-OCR-Engine: Indian Identity Document Recognition

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-00a393.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![YOLOv8](https://img.shields.io/badge/YOLO-v8-yellow.svg)
![EasyOCR](https://img.shields.io/badge/EasyOCR-Ready-ff69b4.svg)

## 🚀 Overview
An end-to-end Optical Character Recognition (OCR) pipeline engineered specifically for extracting structured data from Indian identity documents (like Aadhaar cards). Built with a FastAPI backend and a React frontend, this system focuses on precision and accuracy by utilizing a multi-stage computer vision approach.

---

## 🧠 How the OCR Engine Works (The Pipeline)
Standard OCR tools often struggle with the complex layouts, background watermarks, and Indic scripts found on Indian documents. This engine solves that using a strategic 4-step pipeline:

1. **Intelligent Object Detection (YOLOv8):** Instead of scanning the entire document at once, a YOLOv8 model detects the exact bounding boxes for essential fields (Name, Date of Birth, ID Number).
2. **Precision Cropping (ROI):** The system isolates and crops these specific Regions of Interest (ROI). This drastically eliminates background noise and irrelevant text.
3. **Targeted Transcription (EasyOCR):** The isolated, high-contrast cropped images are passed to EasyOCR. Because it only looks at specific fields, it can transcribe complex layouts and Indic scripts with much higher accuracy.
4. **Data Sanitization (Regex):** Raw OCR text can contain artifacts (e.g., mistaking an 'O' for a '0'). We apply strict Regular Expressions (Regex) to validate, clean, and format the extracted data into a perfectly structured JSON response.

---

## ✨ Key Features
- **Smart Field Cropping:** Eliminates background noise to boost OCR accuracy.
- **High-Performance API:** Powered by **FastAPI** for asynchronous, ultra-fast image processing.
- **Secure Interface:** A responsive **React.js** frontend for seamless uploads and real-time data visualization.
- **Structured Output:** Automatically formats raw text into clean JSON data points.

## 🛠️ Technology Stack
- **Frontend:** React.js, HTML, CSS, JavaScript
- **Backend:** Python, FastAPI, Uvicorn
- **AI & Vision:** YOLOv8 (Ultralytics), EasyOCR, OpenCV
- **Data Processing:** Regular Expressions (Regex)

---

## ⚙️ Local Setup & Installation

### Prerequisites
- Python 3.9+
- Node.js & npm

### 1. Start the Backend (FastAPI)
```bash
# Navigate to the backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Start the API server
python server.py
```

### 2. Start the Frontend (React)
```bash
# Navigate to the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the development server
npm start
```

## 🎯 Usage Flow
1. Open the React frontend locally (`http://localhost:3000`).
2. Securely upload an image of an identity document.
3. The image is passed to the FastAPI backend endpoint.
4. The **OCR Engine** executes its detection, cropping, and extraction pipeline.
5. The structured JSON data is displayed instantly to the user!

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📜 License
This project is [MIT](LICENSE) licensed.
