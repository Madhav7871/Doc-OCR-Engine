# Install dependencies
npm install

# Start the development server
npm start
```

## 🎯 Usage Flow
1. Open the React frontend locally (`http://localhost:3000`).
2. Securely upload an image of an identity document.
3. The image is passed to the FastAPI backend endpoint.
4. **YOLOv8** isolates and crops the essential data fields.
5. **EasyOCR** reads the text from the cropped fields.
6. **Regex rules** clean the output and return structured JSON to the frontend.
7. The structured data is displayed instantly to the user!

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📜 License
This project is [MIT](LICENSE) licensed.
