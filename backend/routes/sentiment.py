from flask import Blueprint, request, jsonify
from backend.models.sentiment_model import SentimentAnalyzer

sentiment_bp = Blueprint("sentiment", __name__)

analyzer = SentimentAnalyzer()

@sentiment_bp.route("/predict", methods=["POST"])
def predict_sentiment():
    """
    Endpoint to predict the sentiment of a given text.
    Expects a JSON payload with a "text" field.
    """
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Invalid input. Please provide a 'text' field."}), 400

    text = data["text"]
    label, probabilities = analyzer.predict(text)

    LABELS = {0: "Negative", 1: "Neutral", 2: "Positive"}

    probabilities = probabilities[0].tolist()

    response = {
        "text": text,
        "predicted_label": LABELS[label],
        "probabilities": {
            "Negative": probabilities[0],
            "Neutral": probabilities[1],
            "Positive": probabilities[2],
        },
    }
    return jsonify(response), 200