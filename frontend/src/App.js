// frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import SkillChart from './SkillChart';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const handleUpload = async (e) => {
    console.log("Uploading file:", file);
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await axios.post('/upload', formData);
      setResult(res.data);
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      setResult({ error: "Upload failed" });
    }
  };

  return (
    <div className={darkMode ? "App dark" : "App"}>
      <button onClick={toggleDarkMode} className="toggle-btn">
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <h1>Resume Analyzer 📄</h1>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>

      {result && (
        <div className="result-box">
          <h3>Parsed Resume Content:</h3>
          <pre>{result.content || result.error}</pre>

          {result.fields && (
            <>
              <h3>🔍 Extracted Info</h3>
              <p><strong>Name:</strong> {result.fields.name}</p>
              <p><strong>Email:</strong> {result.fields.email}</p>
              <p><strong>Phone:</strong> {result.fields.phone}</p>

              <p><strong>Skills:</strong> {result.fields.skills.join(', ')}</p>
              <SkillChart skills={result.fields.skills} />

              <p><strong>Education:</strong><br /> {result.fields.education.map((e, i) => <div key={i}>• {e}</div>)}</p>
              <p><strong>Experience:</strong><br /> {result.fields.experience.map((e, i) => <div key={i}>• {e}</div>)}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
