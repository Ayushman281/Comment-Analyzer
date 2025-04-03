from flask import Blueprint, request, jsonify
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from backend.process_comments import process_comments 
import os
import re

youtube_bp = Blueprint("youtube", __name__)

class YouTubeAPI:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv('YOUTUBE_API_KEY')
        if not self.api_key:
            raise ValueError("YouTube API key is required. Set it in the environment variable 'YOUTUBE_API_KEY' or pass it as a parameter.")
        self.youtube = build("youtube", "v3", developerKey=self.api_key)

    def extract_video_id(self, youtube_url):
        """
        Extract the video ID from a YouTube URL.
        """
        match = re.search(r"v=([a-zA-Z0-9_-]{11})", youtube_url)
        if match:
            return match.group(1)
        else:
            raise ValueError("Invalid YouTube URL. Could not extract video ID.")

    def fetch_comments(self, youtube_url, max_results=10):
        """
        Fetch comments from a YouTube video.
        """
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
            raise Exception(f"An error occurred while fetching comments: {e}")
        except ValueError as e:
            raise Exception(f"Invalid YouTube URL: {e}")

youtube_api = YouTubeAPI()

@youtube_bp.route("/fetch-comments", methods=["POST"])
def fetch_comments():
    """
    Endpoint to fetch comments from a YouTube video, preprocess them, and predict sentiment.
    """
    data = request.get_json()
    if not data or "youtube_url" not in data:
        return jsonify({"error": "Invalid input. Please provide a 'youtube_url' field."}), 400

    youtube_url = data["youtube_url"]
    try:
        comments = youtube_api.fetch_comments(youtube_url)

        results = process_comments(comments)

        return jsonify({"results": results}), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500