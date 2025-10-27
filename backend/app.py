from flask import Flask, request, jsonify
import subprocess
import tempfile
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Backend is running!"})

@app.route("/run", methods=["POST"])
def run_code():
    lang = request.json.get("lang")
    code = request.json.get("code")

    if not code or not lang:
        return jsonify({"error": "Missing lang or code"}), 400

    with tempfile.TemporaryDirectory() as tmpdir:
        if lang == "python":
            file = os.path.join(tmpdir, "main.py")
            with open(file, "w") as f: f.write(code)
            result = subprocess.run(["python", file], capture_output=True, text=True)

        elif lang == "cpp":
            file = os.path.join(tmpdir, "main.cpp")
            exe = os.path.join(tmpdir, "main.exe")
            with open(file, "w") as f: f.write(code)
            subprocess.run(["g++", file, "-o", exe], check=True)
            result = subprocess.run([exe], capture_output=True, text=True)

        elif lang == "java":
            file = os.path.join(tmpdir, "Main.java")
            with open(file, "w") as f: f.write(code)
            subprocess.run(["javac", file], check=True)
            result = subprocess.run(["java", "-cp", tmpdir, "Main"], capture_output=True, text=True)

        else:
            return jsonify({"error": "Unsupported language"}), 400

        return jsonify({"stdout": result.stdout, "stderr": result.stderr})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
