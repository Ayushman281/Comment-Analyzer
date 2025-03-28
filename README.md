# YouTube Comment Sentiment Analyzer

## Overview
This project is a YouTube comment sentiment analysis tool that uses machine learning to classify comments as positive, negative, or neutral. The model is trained on a dataset of 1 million labeled comments and leverages the power of BERT (Bidirectional Encoder Representations from Transformers) for accurate sentiment classification.

## Features
- **Sentiment Analysis Model**: A BERT-based model trained on a large dataset of YouTube comments.
- **Saved Model Weights**: The trained model weights are saved for efficient inference.
- **Frontend and Backend Integration**: A user-friendly interface where users can input a YouTube video link to analyze its comments.
- **Sentiment Breakdown**: The tool provides a percentage breakdown of positive, negative, and neutral comments for the given video.

## Workflow
1. **Model Training**:
  - Train the sentiment analysis model using BERT on a dataset of 1 million labeled comments.
  - Save the trained model weights for future use.

2. **Frontend**:
  - A simple interface where users can input a YouTube video link.

3. **Backend**:
  - Extract comments from the provided YouTube video.
  - Use the saved model weights to classify each comment.
  - Calculate the percentage of positive, negative, and neutral comments.

4. **Output**:
  - Display the sentiment analysis results to the user.

## Technologies Used
- **Machine Learning**: BERT for sentiment analysis.
- **Frontend**: To be determined (e.g., React, Angular, or plain HTML/CSS/JavaScript).
- **Backend**: To be determined (e.g., Flask, Django, or Node.js).
- **Dataset**: A labeled dataset of 1 million YouTube comments.

## Future Enhancements
- Add support for multilingual sentiment analysis.
- Improve the UI/UX of the frontend.
- Optimize the backend for faster processing of large datasets.

## How to Use
1. Clone the repository.
2. Train the model or use the pre-trained weights provided.
3. Run the backend and frontend servers.
4. Enter a YouTube video link in the frontend interface to analyze its comments.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments
- Hugging Face for providing pre-trained BERT models.
- YouTube API for comment extraction.
- The creators of the labeled dataset used for training.
