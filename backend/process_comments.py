from backend.utils.preprocess import Preprocessor
from backend.models.sentiment_model import SentimentAnalyzer
import numpy as np

preprocessor = Preprocessor()

weights_path = "/Users/lkbalyan/Documents/GitHub/Comment-Analyzer/backend/models/weights"
sentiment_analyzer = SentimentAnalyzer(weights_path=weights_path)

def process_comments(comments):
    """
    Process a list of comments by preprocessing them and predicting sentiment.
    """
    processed_data = []

    for comment in comments:
        cleaned_comment, translated_comment = preprocessor.preprocess_comment(comment)
        sentiment_label, probabilities = sentiment_analyzer.predict(cleaned_comment)
        
        processed_data.append({
            "original_comment": comment,
            "translated_comment": translated_comment,
            "cleaned_comment": cleaned_comment,
            "sentiment_label": int(sentiment_label),
            "sentiment_probabilities": np.round(probabilities, 2).tolist()
        })

    return processed_data