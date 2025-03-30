from dotenv import load_dotenv

load_dotenv()

from flask import Flask
from backend.routes.sentiment import sentiment_bp
from backend.routes.youtube import youtube_bp  

app = Flask(__name__)

app.register_blueprint(sentiment_bp, url_prefix="/api")
app.register_blueprint(youtube_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)