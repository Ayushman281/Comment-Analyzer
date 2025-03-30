from flask import Flask
from backend.routes.sentiment import sentiment_bp

app = Flask(__name__)

# Register the sentiment blueprint
app.register_blueprint(sentiment_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)