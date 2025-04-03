from transformers import TFBertForSequenceClassification, BertTokenizer
import tensorflow as tf
import numpy as np

class SentimentAnalyzer:
    def __init__(self, model_name="bert-base-uncased", weights_path=None):
        self.tokenizer = BertTokenizer.from_pretrained(model_name)
        
        if weights_path:
            self.model = TFBertForSequenceClassification.from_pretrained(
                weights_path, 
                num_labels=3,
                from_pt=True, 
            )
            print(f"Model loaded from {weights_path}")
        else:
            self.model = TFBertForSequenceClassification.from_pretrained(
                model_name,
                num_labels=3
            )

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
        
        predicted_label = tf.argmax(probabilities, axis=-1).numpy()[0]

        return predicted_label, probabilities[0].tolist()