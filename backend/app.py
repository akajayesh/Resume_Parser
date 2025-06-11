# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from parser import extract_text_from_pdf, extract_fields ,extract_text_from_docx

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['resume']
    if file:
        filename = file.filename
        filepath = os.path.join("uploads", filename)
        os.makedirs("uploads", exist_ok=True)
        file.save(filepath)

        if filename.endswith(".pdf"):
            text = extract_text_from_pdf(filepath)
        elif filename.endswith(".docx"):
            text = extract_text_from_docx(filepath)
        else:
            return jsonify({"error": "Unsupported file format"}), 400

        fields = extract_fields(text)

        return jsonify({
            "message": "Resume processed",
            "filename": filename,
            "content": text,
            "fields": fields
        }), 200

    return jsonify({"error": "No file uploaded"}), 400
@app.route('/', methods=['GET'])
def home():
    return "Flask server is Running"


if __name__ == '__main__':
    app.run(debug=True)
