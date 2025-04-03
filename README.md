<!-- # YouTube Comment Sentiment Analyzer -->

# YouTube Comment Sentiment Analyzer

<!-- ## Overview -->

## Overview

This project is a **YouTube comment sentiment analysis tool** that uses machine learning to classify comments as **positive, negative, or neutral**. The model is trained on a dataset of **1 million labeled comments** and leverages **BERT (Bidirectional Encoder Representations from Transformers)** for accurate sentiment classification.

<!-- ## Features -->

## Features

- **Sentiment Analysis Model**: A BERT-based model trained on a large dataset of YouTube comments.
- **Saved Model Weights**: The trained model weights are stored for efficient inference.
- **Frontend and Backend Integration**: A user-friendly interface where users can input a YouTube video link to analyze its comments.
- **Sentiment Breakdown**: Provides a percentage breakdown of **positive, negative, and neutral** comments for the given video.

<!-- ## Workflow -->

## Workflow

### **Model Training**

1. Train the sentiment analysis model using **BERT** on a dataset of **1 million labeled comments**.
2. Save the trained model weights for future inference.

### **Frontend**

1. A simple interface where users can input a YouTube video link.

### **Backend**

1. Extract comments from the provided YouTube video using the YouTube API.
2. Use the saved model weights to classify each comment.
3. Calculate the percentage of **positive, negative, and neutral** comments.

### **Output**

1. Display the sentiment analysis results to the user in a clear format.

<!-- ## Technologies Used -->

## Technologies Used

- **Machine Learning**: BERT for sentiment analysis.
- **Frontend**: React.js with Vite for a fast and responsive UI.
- **Backend**: Flask for handling API requests and ML model inference.
- **Dataset**: A labeled dataset of **1 million YouTube comments**.
- **YouTube API**: For fetching comments from videos.

<!-- ## Future Enhancements -->

## Future Enhancements

- Add support for **multilingual sentiment analysis**.
- Improve **UI/UX** of the frontend.
- Optimize the backend for **faster processing** of large datasets.
- Implement **real-time analysis** and dynamic visualization.

<!-- ## How to Use -->

## How to Use

### **Setup Instructions**

1. **Clone the repository**:
   ```sh
   git clone https://github.com/YourUsername/Comment-Analyzer.git
   cd Comment-Analyzer
   ```
2. **Setup the Backend**:
   ```sh
   cd backend
   python -m venv env
   source env/bin/activate  # For Mac/Linux
   env\Scripts\activate  # For Windows
   pip install -r requirements.txt
   python app.py
   ```
3. **Setup the Frontend**:
   ```sh
   cd frontend
   npm install
   npm run dev
   ```
4. **Use the App**:
   - Open the **frontend URL** in your browser.
   - Enter a YouTube video link.
   - Get sentiment analysis results for the comments.

<!-- ## License -->

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

<!-- ## Acknowledgments -->

## Acknowledgments

- **Hugging Face** for providing pre-trained **BERT** models.
- **YouTube API** for enabling comment extraction.
- The **creators of the labeled dataset** used for training.

---

Feel free to **contribute** or suggest **enhancements**! 🚀
