from backend.utils.preprocess import Preprocessor
from backend.models.sentiment_model import SentimentAnalyzer
import numpy as np

preprocessor = Preprocessor()

weights_path = "D:/College/Projects/Comment Analyzer/backend/models/weights"
sentiment_analyzer = SentimentAnalyzer(weights_path=weights_path)


def process_comments(comments):
    """
    Process a list of comments by preprocessing them and predicting sentiment.
    """
    processed_comments = []
    sentiment_results = []

    for comment in comments:
        cleaned_comment = preprocessor.preprocess_comment(comment)
        processed_comments.append(cleaned_comment)

    for cleaned_comment in processed_comments:
        sentiment_label, probabilities = sentiment_analyzer.predict(cleaned_comment)

        sentiment_results.append({
            "cleaned_comment": cleaned_comment,
            "sentiment_label": int(sentiment_label),
            "sentiment_probabilities": np.round(probabilities, 2).tolist()
        })

    response = []
    for original, sentiment in zip(comments, sentiment_results):
        response.append({
            "original_comment": original,
            "cleaned_comment": sentiment["cleaned_comment"],
            "sentiment_label": sentiment["sentiment_label"],
            "sentiment_probabilities": sentiment["sentiment_probabilities"]
        })

    return response
