from flask import Flask
from backend.routes.sentiment import sentiment_bp
from backend.routes.youtube import youtube_bp  # Import the YouTube blueprint

app = Flask(__name__)

# Register the sentiment blueprint
app.register_blueprint(sentiment_bp, url_prefix="/api")

# Register the YouTube blueprint
app.register_blueprint(youtube_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)