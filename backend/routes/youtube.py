import os
import re
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

class YouTubeAPI:
    def __init__(self, api_key=None):
        """
        Initialize the YouTube Data API client.
        :param api_key: YouTube Data API key. If not provided, it will look for the API key in the environment variable 'YOUTUBE_API_KEY'.
        """
        self.api_key = api_key or os.getenv("YOUTUBE_API_KEY")
        if not self.api_key:
            raise ValueError("YouTube API key is required. Set it in the environment variable 'YOUTUBE_API_KEY' or pass it as a parameter.")
        self.youtube = build("youtube", "v3", developerKey=self.api_key)

    def extract_video_id(self, youtube_url):
        """
        Extract the video ID from a YouTube URL.
        :param youtube_url: The full YouTube video URL.
        :return: The video ID as a string.
        """
        match = re.search(r"v=([a-zA-Z0-9_-]{11})", youtube_url)
        if match:
            return match.group(1)
        else:
            raise ValueError("Invalid YouTube URL. Could not extract video ID.")

    def fetch_comments(self, youtube_url, max_results=50):
        """
        Fetch comments from a YouTube video.
        :param youtube_url: The full YouTube video URL.
        :param max_results: The maximum number of comments to fetch (default is 50).
        :return: A list of comments.
        """
        try:
            # Extract video ID from the URL
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
            print(f"An error occurred: {e}")
            return []
        except ValueError as e:
            print(f"Error: {e}")
            return []