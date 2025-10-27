import React, { useState } from "react";
import "./App.css";

function App() {
  const [lang, setLang] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleRun = async () => {
    setOutput("");
    setError("");
    try {
      const res = await fetch("https://multilang-backend-dmfqgvc3e5fcgkdv.centralindia-01.azurewebsites.net/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, code }),
      });
      const data = await res.json();
      setOutput(data.stdout || "");
      setError(data.stderr || data.error || "");
    } catch {
      setError("Failed to connect to backend.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">🖥 Code Executor</h1>

      <div className="lang-selector">
        <label>Language:</label>
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
        <button onClick={handleRun}>Run</button>
      </div>

      <div className="split-container">
        <div className="code-box">
          <h2>Code</h2>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your code here..."
          />
        </div>

        <div className="output-box">
          <h2>Output</h2>
          {output && <pre className="stdout">{output}</pre>}
          {error && <pre className="stderr">{error}</pre>}
        </div>
      </div>
    </div>
  );
}

export default App;
