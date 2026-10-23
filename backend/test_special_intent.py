import re
import sys

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

SPECIAL_INTENTS = {
    "GIBBERISH_KEYBOARD": {
        "en": "It looks like your message may contain random text. Please enter your question again so I can help you.",
        "kn": "ನಿಮ್ಮ ಸಂದೇಶದಲ್ಲಿ ಯಾದೃಚ್ಛಿಕ (random) ಅಕ್ಷರಗಳಿರುವಂತೆ ತೋರುತ್ತಿದೆ. ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮತ್ತೆ ನಮೂದಿಸಿ.",
        "hi": "ऐसा प्रतीत होता है कि आपके संदेश में यादृच्छिक (random) अक्षर हैं। कृपया अपना प्रश्न दोबारा दर्ज करें ताकि मैं आपकी सहायता कर सकूँ।"
    },
    "GIBBERISH_UNINTELLIGIBLE": {
        "en": "I couldn't understand your message. Please tell me which public service you need help with, such as scholarships, certificates, pensions, or electricity services.",
        "kn": "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನನಗೆ ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ವಿದ್ಯಾರ್ಥಿವೇತನ, ಪ್ರಮಾಣಪತ್ರ, ಪಿಂಚಣಿ ಅಥವಾ ವಿದ್ಯುತ್ ಸೇವೆಗಳಂತಹ ಯಾವ ಸಾರ್ವಜನಿಕ ಸೇವೆಯ ಮಾಹಿತಿ ನಿಮಗೆ ಬೇಕು ಎಂದು ದಯವಿಟ್ಟು ತಿಳಿಸಿ.",
        "hi": "मैं आपका संदेश समझ नहीं पाया। कृपया मुझे बताएं कि आपको किस सार्वजनिक सेवा (जैसे छात्रवृत्ति, प्रमाणपत्र, पेंशन या बिजली सेवा) में सहायता चाहिए।"
    },
    "PUNCTUATION_ONLY": {
        "en": "I'm not sure what you're asking. Could you please explain your question in a few words?",
        "kn": "ನೀವು ಏನು ಕೇಳುತ್ತಿದ್ದೀರಿ ಎಂದು ನನಗೆ ಅರ್ಥವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೆಲವು ಪದಗಳಲ್ಲಿ ವಿವರಿಸಿ ತಿಳಿಸಿ.",
        "hi": "मुझे समझ नहीं आया कि आप क्या पूछ रहे हैं। क्या आप कृपया कुछ शब्दों में अपना प्रश्न स्पष्ट कर सकते हैं?"
    },
    "GREETING": {
        "en": "Hello! Welcome to SevaSignal. How can I help you with public services today?",
        "kn": "ನಮಸ್ಕಾರ! ಸೇವಾಸಂಜ್ಞೆಗೆ (SevaSignal) ಸುಸ್ವಾಗತ. ಇಂದು ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳು, ವಿದ್ಯಾರ್ಥಿವೇತನ ಅಥವಾ ಪ್ರಮಾಣಪತ್ರಗಳ ಬಗ್ಗೆ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
        "hi": "नमस्ते! सेवा-सिग्नल में आपका स्वागत है। आज मैं छात्रवृत्ति, प्रमाणपत्र या अन्य सार्वजनिक सेवाओं में आपकी क्या सहायता कर सकता हूँ?"
    },
    "CASUAL_HOW_ARE_YOU": {
        "en": "I am doing well, thank you! I am here to help you navigate public services like scholarships, certificates, pensions, and utilities. What can I assist you with today?",
        "kn": "ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ, ಧನ್ಯವಾದಗಳು! ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು, ಪ್ರಮಾಣಪತ್ರಗಳು, ಪಿಂಚಣಿ ಮತ್ತು ವಿದ್ಯುತ್ ಸೇವೆಗಳಂತಹ ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳಲ್ಲಿ ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಲು ನಾನಿದ್ದೇನೆ. ಇಂದು ನಿಮಗೆ ಯಾವ ಮಾಹಿತಿ ಬೇಕು?",
        "hi": "मैं ठीक हूँ, धन्यवाद! मैं छात्रवृत्ति, प्रमाणपत्र, पेंशन और उपयोगिता जैसी सार्वजनिक सेवाओं में आपका मार्गदर्शन करने के लिए यहाँ हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?"
    },
    "OUT_OF_SCOPE": {
        "en": "SevaSignal specializes exclusively in public-service and citizen guidance (such as scholarships, certificates, transport, ration cards, and welfare schemes). I cannot provide general information such as weather forecasts or entertainment. Please ask a question related to civic services.",
        "kn": "ಸೇವಾಸಂಜ್ಞೆ (SevaSignal) ಕೇವಲ ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳು, ವಿದ್ಯಾರ್ಥಿವೇತನ, ಪ್ರಮಾಣಪತ್ರ, ಪಡಿತರ ಚೀಟಿ ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಮಾರ್ಗದರ್ಶನಕ್ಕೆ ಸೀಮಿತವಾಗಿದೆ. ಹವಾಮಾನ ಅಥವಾ ಇತರ ಸಾಮಾನ್ಯ ವಿಷಯಗಳ ಮಾಹಿತಿ ಇಲ್ಲಿ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ.",
        "hi": "सेवा-सिग्नल विशेष रूप से सार्वजनिक सेवाओं, छात्रवृत्ति, प्रमाणपत्र, राशन कार्ड और सरकारी योजनाओं के मार्गदर्शन के लिए है। मौसम या मनोरंजन जैसे विषयों की जानकारी यहाँ उपलब्ध नहीं है। कृपया नागरिक सेवाओं से संबंधित प्रश्न पूछें।"
    }
}

def classify(text: str):
    if not text or not text.strip():
        return "PUNCTUATION_ONLY"
    raw = text.strip()
    clean = re.sub(r'[\s\?\!\.\,\;\:\-\_\@\#\$\%\^\&\*\(\)\[\]\{\}\<\>\/\\\|\`\~\'\"+=]+', '', raw)
    if len(clean) == 0:
        return "PUNCTUATION_ONLY"
    
    t = raw.lower()
    
    # 1. Keyboard mash sequences (e.g., asdfghjkl123, qwerty, zxcvbn)
    if re.search(r'asdfghjkl|qwerty|zxcvbn|[a-z0-9]*asdfghjkl', t):
        return "GIBBERISH_KEYBOARD"
    
    # 2. Greetings
    words = [w.strip("?!.,") for w in t.split()]
    greeting_words = {"hi", "hello", "hey", "namaste", "namaskara", "greetings", "ಹಲೋ", "ನಮಸ್ಕಾರ", "ಹಾಯ್", "नमस्ते", "प्रणाम", "हेलो"}
    if len(words) <= 3 and any(w in greeting_words for w in words) and not any(k in t for k in ["scholarship", "certificate", "bus", "bill", "ration"]):
        return "GREETING"
        
    # 3. How are you
    if any(p in t for p in ["how are you", "how r u", "how do you do", "hegidira", "hegiddeera", "kaise ho", "aap kaise hain", "ಹೇಗಿದ್ದೀರಾ", "ನೀವು ಹೇಗಿದ್ದೀರಿ", "आप कैसे हैं"]):
        return "CASUAL_HOW_ARE_YOU"
        
    # 4. Out of scope
    out_words = ["weather", "temperature", "rain today", "cricket", "ipl", "football", "recipe", "tell me a joke", "sing a song", "movie", "cinema", "president of", "मौसम", "हवामान"]
    if any(ow in t for ow in out_words):
        return "OUT_OF_SCOPE"
        
    # 5. Consonant mashing / gibberish (e.g. jjhhhghjhkj)
    KNOWN_ACRONYMS = {"ksrtc", "bmtc", "cpgrams", "pmkisan", "bescom", "hescom", "gescom", "mescom", "sakala", "sevasindhu"}
    for word in words:
        w_clean = re.sub(r'[^a-zA-Z]', '', word)
        if len(w_clean) >= 6 and w_clean not in KNOWN_ACRONYMS:
            vowels = len(re.findall(r'[aeiouy]', w_clean))
            consonants = len(w_clean) - vowels
            if vowels == 0 or (consonants / max(1, vowels) > 5) or re.search(r'[bcdfghjklmnpqrstvwxz]{5,}', w_clean):
                return "GIBBERISH_UNINTELLIGIBLE"

    return None

if __name__ == "__main__":
    test_inputs = [
        "jjhhhghjhkj",
        "asdfghjkl123",
        "??????",
        "Hi",
        "How are you?",
        "What is the weather today?",
        "ನಮಸ್ಕಾರ",
        "नमस्ते",
        "ಹೇಗಿದ್ದೀರಾ",
        "आप कैसे हैं",
        "ಇಂದಿನ ಹವಾಮಾನ ಹೇಗಿದೆ?",
        "आज का मौसम कैसा है?",
        "How do I apply for caste certificate?",
        "Which documents are required?"
    ]
    for ti in test_inputs:
        res = classify(ti)
        ans = SPECIAL_INTENTS.get(res, {}).get("en") if res else "LEGITIMATE_SERVICE_QUERY"
        print(f"[{ti}] => {res}\n   En: {ans}\n")
