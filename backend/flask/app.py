from flask import Flask
from flask_cors import CORS
from verification.routes import bp as verify_bp

# initializes Flask app

app = Flask(__name__)
CORS(app)  # allow local dev from Next.js later

app.register_blueprint(verify_bp, url_prefix="/api")

@app.get("/")
def home():
    return {"message": "SaveCanto Flask backend running!"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
