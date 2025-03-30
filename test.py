from backend.utils.preprocess import Preprocessor

# Initialize the Preprocessor
preprocess = Preprocessor()

# Example comments
comments = [
    "¡Este video es increíble!",  # Spanish
    "Ce vidéo est incroyable!",  # French
    "This is an amazing video!",  # English
    "Don't u give me this crap"  
]

for comment in comments:
    cleaned_text = preprocess.preprocess_comment(comment)
    print(f"Original Comment: {comment}")
    print(f"Processed Comment: {cleaned_text}")
    print("-" * 50)