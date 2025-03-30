from googletrans import Translator

class TranslatorService:
    def __init__(self):
        self.translator = Translator()

    def translate_to_english(self, text):
        """
        Translate the input text to English.
        :param text: The text to be translated.
        :return: Translated text in English.
        """
        try:
            translation = self.translator.translate(text, src="auto", dest="en")
            if translation and translation.text:  
                return translation.text
            else:
                print("Translation failed. Returning original text.")
                return text 
        except Exception as e:
            print(f"Error during translation: {e}")
            return text