from transformers import TFBertForSequenceClassification, BertTokenizer
import tensorflow as tf
import numpy as np

class SentimentAnalyzer:
    def __init__(self, model_name="bert-base-uncased"):
        self.tokenizer = BertTokenizer.from_pretrained(model_name)
        self.model = TFBertForSequenceClassification.from_pretrained(model_name, num_labels=3)

    def predict(self, text):
        inputs = self.tokenizer(
            text,
            return_tensors="tf",
            truncation=True,
            padding=True,
            max_length=512
        )

        outputs = self.model(inputs)
        logits = outputs.logits

        probabilities = np.round(tf.nn.softmax(logits, axis=-1).numpy(), 2)
        predicted_label = np.argmax(probabilities, axis=-1)[0]

        return predicted_label, probabilities[0].tolist() 