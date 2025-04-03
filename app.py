from dotenv import load_dotenv

load_dotenv()

from flask import Flask
from backend.routes.sentiment import sentiment_bp
from backend.routes.youtube import youtube_bp  
from flask_cors import CORS, cross_origin


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173", "allow_headers": "*", "methods": ["GET", "POST", "OPTIONS"]}})

app.register_blueprint(sentiment_bp, url_prefix="/api")
app.register_blueprint(youtube_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)