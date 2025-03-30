from flask import Blueprint, request, jsonify
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import os
import re

# Create a Flask blueprint for YouTube routes
youtube_bp = Blueprint("youtube", __name__)

class YouTubeAPI:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("YOUTUBE_API_KEY")
        if not self.api_key:
            raise ValueError("YouTube API key is required. Set it in the environment variable 'YOUTUBE_API_KEY' or pass it as a parameter.")
        self.youtube = build("youtube", "v3", developerKey=self.api_key)

    def extract_video_id(self, youtube_url):
        match = re.search(r"v=([a-zA-Z0-9_-]{11})", youtube_url)
        if match:
            return match.group(1)
        else:
            raise ValueError("Invalid YouTube URL. Could not extract video ID.")

    def fetch_comments(self, youtube_url, max_results=50):
        try:
            video_id = self.extract_video_id(youtube_url)
            comments = []
            request = self.youtube.commentThreads().list(
                part="snippet",
                videoId=video_id,
                maxResults=max_results,
                textFormat="plainText"
            )
            response = request.execute()
            for item in response.get("items", []):
                comment = item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
                comments.append(comment)
            return comments
        except HttpError as e:
            raise Exception(f"An error occurred: {e}")

# Initialize the YouTubeAPI class
youtube_api = YouTubeAPI()

@youtube_bp.route("/fetch-comments", methods=["POST"])
def fetch_comments():
    """
    Endpoint to fetch comments from a YouTube video.
    Expects a JSON payload with a "youtube_url" field.
    """
    data = request.get_json()
    if not data or "youtube_url" not in data:
        return jsonify({"error": "Invalid input. Please provide a 'youtube_url' field."}), 400

    youtube_url = data["youtube_url"]
    try:
        comments = youtube_api.fetch_comments(youtube_url)
        return jsonify({"comments": comments}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500