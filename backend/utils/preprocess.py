import re
from langdetect import detect
from langdetect.lang_detect_exception import LangDetectException
import emoji
import spacy
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from .translate import TranslatorService  # Import the TranslatorService class

# Load spaCy English model
nlp = spacy.load("en_core_web_sm")

# Contractions dictionary
contractions = {
    "don't": "do not",
    "can't": "cannot",
    "won't": "will not",
    "it's": "it is",
    "you're": "you are",
    "i'm": "i am",
    "they're": "they are",
    "we're": "we are",
    "isn't": "is not",
    "aren't": "are not",
    "doesn't": "does not",
    "didn't": "did not",
    "hasn't": "has not",
    "haven't": "have not",
    "couldn't": "could not",
    "shouldn't": "should not",
    "wouldn't": "would not",
    "u": "you",
    "ur": "your",
    "lol": "laughing out loud",
    "idk": "i do not know",
    "brb": "be right back",
    "btw": "by the way",
    "omg": "oh my god",
    "lmao": "laughing my ass off",
}

class Preprocessor:
    def __init__(self):
        self.stop_words = set(stopwords.words("english"))
        self.lemmatizer = WordNetLemmatizer()
        self.translator = TranslatorService()  # Initialize the TranslatorService

    def clean_text(self, text):
        """
        Clean the input text by removing unwanted characters, links, and extra spaces.
        """
        # Convert to lowercase
        text = text.lower()
        # Remove URLs
        text = re.sub(r"http\S+|www\S+|https\S+", "", text, flags=re.MULTILINE)
        # Handle mentions
        text = re.sub(r"@\w+", "<USER>", text)  # Replace mentions with <USER>
        # Handle emojis
        text = emoji.demojize(text)
        # Expand contractions
        text = self.expand_contractions(text)
        # Handle repeated characters
        text = self.reduce_repeated_characters(text)
        # Remove special characters and numbers
        text = re.sub(r"[^a-zA-Z\s]", "", text)
        # Remove extra spaces
        text = re.sub(r"\s+", " ", text).strip()
        # Remove promotional content and timestamps
        text = self.remove_promotional_content(text)
        return text

    def expand_contractions(self, text):
        """
        Expand contractions in the text.
        """
        words = text.split()
        expanded_words = [contractions[word] if word in contractions else word for word in words]
        return " ".join(expanded_words)

    def reduce_repeated_characters(self, text):
        """
        Reduce repeated characters in the text.
        """
        return re.sub(r"(.)\1{2,}", r"\1", text)

    def remove_stopwords(self, text):
        """
        Remove stopwords using spaCy.
        """
        doc = nlp(text)
        filtered_words = [token.text for token in doc if not token.is_stop]
        return " ".join(filtered_words)

    def remove_promotional_content(self, text):
        """
        Remove promotional content and handle patterns like timestamps.
        """
        # Remove timestamps (e.g., "00:45")
        text = re.sub(r"\b\d{1,2}:\d{2}\b", "", text)
        # Remove promotional phrases
        promotional_phrases = [
            "subscribe to my channel",
            "like and subscribe",
            "follow me on",
            "check out my website",
        ]
        for phrase in promotional_phrases:
            text = re.sub(re.escape(phrase), "", text, flags=re.IGNORECASE)
        return text

    def handle_case_specific_words(self, text):
        """
        Handle case-specific words and Gen Z slang.
        """
        words = text.split()
        handled_words = [contractions[word] if word in contractions else word for word in words]
        return " ".join(handled_words)

    def detect_language(self, text):
        """
        Detect the language of the input text.
        """
        try:
            language = detect(text)
            if language == "unknown" or len(text.split()) < 3: 
                return "en"
            return language
        except LangDetectException:
            return "unknown"

    def preprocess_comment(self, comment):
        """
        Preprocess a single comment.
        """
        language = self.detect_language(comment)
        needs_translation = language != "en"

        if needs_translation:
            comment = self.translator.translate_to_english(comment)
        cleaned_text = self.clean_text(comment)

        return cleaned_text