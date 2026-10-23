import json
import os
import re
from typing import List, Dict, Optional, Any
from app.config import settings

class KnowledgeEngine:
    def __init__(self, data_path: str = None):
        self.data_path = data_path or settings.DATA_PATH
        self._categories = []
        self._services = []
        self._load_data()

    def _load_data(self):
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Knowledge data not found at {self.data_path}")
        with open(self.data_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            self._categories = data.get("categories", [])
            self._services = data.get("services", [])

    def get_categories(self, lang: str = "en") -> List[Dict[str, Any]]:
        result = []
        for cat in sorted(self._categories, key=lambda c: c.get("order", 99)):
            c_copy = dict(cat)
            c_copy["localized_title"] = cat["title"].get(lang, cat["title"].get("en", ""))
            c_copy["localized_short_title"] = cat["short_title"].get(lang, cat["short_title"].get("en", ""))
            c_copy["localized_description"] = cat["description"].get(lang, cat["description"].get("en", ""))
            result.append(c_copy)
        return result

    def get_category_by_id(self, cat_id: str) -> Optional[Dict[str, Any]]:
        for cat in self._categories:
            if cat["id"] == cat_id or cat.get("slug") == cat_id:
                return cat
        return None

    def get_services(self, category_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if category_id:
            return [s for s in self._services if s.get("category_id") == category_id]
        return self._services

    def get_service(self, service_id: str) -> Optional[Dict[str, Any]]:
        for s in self._services:
            if s["id"] == service_id:
                return s
        return None

    def classify_special_query(self, text: str, lang: str = "en") -> Optional[Dict[str, Any]]:
        """Identifies gibberish, keyboard-mashing, punctuation-only, greetings, casual questions, and out-of-scope queries."""
        if not text or not text.strip():
            msg = {
                "en": "I'm not sure what you're asking. Could you please explain your question in a few words?",
                "kn": "ನೀವು ಏನು ಕೇಳುತ್ತಿದ್ದೀರಿ ಎಂದು ನನಗೆ ಅರ್ಥವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೆಲವು ಪದಗಳಲ್ಲಿ ವಿವರಿಸಿ ತಿಳಿಸಿ.",
                "hi": "मुझे समझ नहीं आया कि आप क्या पूछ रहे हैं। क्या आप कृपया कुछ शब्दों में अपना प्रश्न स्पष्ट कर सकते हैं?"
            }
            return {
                "answer": msg.get(lang, msg["en"]),
                "language": lang,
                "identified_service": None,
                "sources": [],
                "verification_status": "unverified",
                "last_verified": None,
                "suggested_steps": [],
                "is_fallback": True,
                "is_special_intent": True
            }

        raw = text.strip()
        clean = re.sub(r'[\s\?\!\.\,\;\:\-\_\@\#\$\%\^\&\*\(\)\[\]\{\}\<\>\/\\\|\`\~\'\"+=]+', '', raw)
        if len(clean) == 0:
            msg = {
                "en": "I'm not sure what you're asking. Could you please explain your question in a few words?",
                "kn": "ನೀವು ಏನು ಕೇಳುತ್ತಿದ್ದೀರಿ ಎಂದು ನನಗೆ ಅರ್ಥವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೆಲವು ಪದಗಳಲ್ಲಿ ವಿವರಿಸಿ ತಿಳಿಸಿ.",
                "hi": "मुझे समझ नहीं आया कि आप क्या पूछ रहे हैं। क्या आप कृपया कुछ शब्दों में अपना प्रश्न स्पष्ट कर सकते हैं?"
            }
            return {
                "answer": msg.get(lang, msg["en"]),
                "language": lang,
                "identified_service": None,
                "sources": [],
                "verification_status": "unverified",
                "last_verified": None,
                "suggested_steps": [],
                "is_fallback": True,
                "is_special_intent": True
            }

        t = raw.lower()

        # 1. Keyboard mash sequences (e.g., asdfghjkl123, qwerty, zxcvbn)
        if re.search(r'asdfghjkl|qwerty|zxcvbn|[a-z0-9]*asdfghjkl', t):
            msg = {
                "en": "It looks like your message may contain random text. Please enter your question again so I can help you.",
                "kn": "ನಿಮ್ಮ ಸಂದೇಶದಲ್ಲಿ ಯಾದೃಚ್ಛಿಕ (random) ಅಕ್ಷರಗಳಿರುವಂತೆ ತೋರುತ್ತಿದೆ. ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮತ್ತೆ ನಮೂದಿಸಿ.",
                "hi": "ऐसा प्रतीत होता है कि आपके संदेश में यादृच्छिक (random) अक्षर हैं। कृपया अपना प्रश्न दोबारा दर्ज करें ताकि मैं आपकी सहायता कर सकूँ।"
            }
            return {
                "answer": msg.get(lang, msg["en"]),
                "language": lang,
                "identified_service": None,
                "sources": [],
                "verification_status": "unverified",
                "last_verified": None,
                "suggested_steps": [],
                "is_fallback": True,
                "is_special_intent": True
            }

        # 2. Greetings
        words = [w.strip("?!.,") for w in t.split()]
        greeting_words = {"hi", "hello", "hey", "namaste", "namaskara", "greetings", "ಹಲೋ", "ನಮಸ್ಕಾರ", "ಹಾಯ್", "नमस्ते", "प्रणाम", "हेलो"}
        civic_keywords = ["scholarship", "certificate", "bus", "bill", "ration", "pension", "farmer", "ವಿದ್ಯಾರ್ಥಿವೇತನ", "ಪ್ರಮಾಣಪತ್ರ", "ಬಸ್", "ಬಿಲ್", "ಪಡಿತರ", "ಪಿಂಚಣಿ", "ರೈತ", "छात्रवृत्ति", "प्रमाणपत्र", "बिजली", "राशन", "पेंशन", "किसान"]
        if len(words) <= 3 and any(w in greeting_words for w in words) and not any(k in t for k in civic_keywords):
            msg = {
                "en": "Hello! Welcome to SevaSignal. How can I help you with public services today?",
                "kn": "ನಮಸ್ಕಾರ! ಸೇವಾಸಂಜ್ಞೆಗೆ (SevaSignal) ಸುಸ್ವಾಗತ. ಇಂದು ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳು, ವಿದ್ಯಾರ್ಥಿವೇತನ ಅಥವಾ ಪ್ರಮಾಣಪತ್ರಗಳ ಬಗ್ಗೆ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
                "hi": "नमस्ते! सेवा-सिग्नल में आपका स्वागत है। आज मैं छात्रवृत्ति, प्रमाणपत्र या अन्य सार्वजनिक सेवाओं में आपकी क्या सहायता कर सकता हूँ?"
            }
            return {
                "answer": msg.get(lang, msg["en"]),
                "language": lang,
                "identified_service": None,
                "sources": [],
                "verification_status": "unverified",
                "last_verified": None,
                "suggested_steps": [],
                "is_fallback": True,
                "is_special_intent": True
            }

        # 3. Casual inquiries ("How are you?")
        if any(p in t for p in ["how are you", "how r u", "how do you do", "hegidira", "hegiddeera", "kaise ho", "aap kaise hain", "ಹೇಗಿದ್ದೀರಾ", "ನೀವು ಹೇಗಿದ್ದೀರಿ", "आप कैसे हैं"]):
            msg = {
                "en": "I am doing well, thank you! I am here to help you navigate public services like scholarships, certificates, pensions, and utilities. What can I assist you with today?",
                "kn": "ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ, ಧನ್ಯವಾದಗಳು! ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು, ಪ್ರಮಾಣಪತ್ರಗಳು, ಪಿಂಚಣಿ ಮತ್ತು ವಿದ್ಯುತ್ ಸೇವೆಗಳಂತಹ ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳಲ್ಲಿ ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಲು ನಾನಿದ್ದೇನೆ. ಇಂದು ನಿಮಗೆ ಯಾವ ಮಾಹಿತಿ ಬೇಕು?",
                "hi": "मैं ठीक हूँ, धन्यवाद! मैं छात्रवृत्ति, प्रमाणपत्र, पेंशन और उपयोगिता जैसी सार्वजनिक सेवाओं में आपका मार्गदर्शन करने के लिए यहाँ हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?"
            }
            return {
                "answer": msg.get(lang, msg["en"]),
                "language": lang,
                "identified_service": None,
                "sources": [],
                "verification_status": "unverified",
                "last_verified": None,
                "suggested_steps": [],
                "is_fallback": True,
                "is_special_intent": True
            }

        # 4. Out of scope queries (weather, sports, jokes, etc.)
        out_words = ["weather", "temperature", "rain today", "cricket", "ipl", "football", "recipe", "tell me a joke", "sing a song", "movie", "cinema", "president of", "मौसम", "हवामान", "ಹವಾಮಾನ"]
        if any(ow in t for ow in out_words):
            msg = {
                "en": "SevaSignal specializes exclusively in public-service and citizen guidance (such as scholarships, certificates, transport, ration cards, and welfare schemes). I cannot provide general information such as weather forecasts or entertainment. Please ask a question related to civic services.",
                "kn": "ಸೇವಾಸಂಜ್ಞೆ (SevaSignal) ಕೇವಲ ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳು, ವಿದ್ಯಾರ್ಥಿವೇತನ, ಪ್ರಮಾಣಪತ್ರ, ಪಡಿತರ ಚೀಟಿ ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಮಾರ್ಗದರ್ಶನಕ್ಕೆ ಸೀಮಿತವಾಗಿದೆ. ಹವಾಮಾನ ಅಥವಾ ಇತರ ಸಾಮಾನ್ಯ ವಿಷಯಗಳ ಮಾಹಿತಿ ಇಲ್ಲಿ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ.",
                "hi": "सेवा-सिग्नल विशेष रूप से सार्वजनिक सेवाओं, छात्रवृत्ति, प्रमाणपत्र, राशन कार्ड और सरकारी योजनाओं के मार्गदर्शन के लिए है। मौसम या मनोरंजन जैसे विषयों की जानकारी यहाँ उपलब्ध नहीं है। कृपया नागरिक सेवाओं से संबंधित प्रश्न पूछें।"
            }
            return {
                "answer": msg.get(lang, msg["en"]),
                "language": lang,
                "identified_service": None,
                "sources": [],
                "verification_status": "unverified",
                "last_verified": None,
                "suggested_steps": [],
                "is_fallback": True,
                "is_special_intent": True
            }

        # 5. Consonant mashing / gibberish (e.g. jjhhhghjhkj)
        KNOWN_ACRONYMS = {"ksrtc", "bmtc", "cpgrams", "pmkisan", "bescom", "hescom", "gescom", "mescom", "sakala", "sevasindhu"}
        for word in words:
            w_clean = re.sub(r'[^a-zA-Z]', '', word)
            if len(w_clean) >= 6 and w_clean not in KNOWN_ACRONYMS:
                vowels = len(re.findall(r'[aeiouy]', w_clean))
                consonants = len(w_clean) - vowels
                if vowels == 0 or (consonants / max(1, vowels) > 5) or re.search(r'[bcdfghjklmnpqrstvwxz]{5,}', w_clean):
                    msg = {
                        "en": "I couldn't understand your message. Please tell me which public service you need help with, such as scholarships, certificates, pensions, or electricity services.",
                        "kn": "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನನಗೆ ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ವಿದ್ಯಾರ್ಥಿವೇತನ, ಪ್ರಮಾಣಪತ್ರ, ಪಿಂಚಣಿ ಅಥವಾ ವಿದ್ಯುತ್ ಸೇವೆಗಳಂತಹ ಯಾವ ಸಾರ್ವಜನಿಕ ಸೇವೆಯ ಮಾಹಿತಿ ನಿಮಗೆ ಬೇಕು ಎಂದು ದಯವಿಟ್ಟು ತಿಳಿಸಿ.",
                        "hi": "मैं आपका संदेश समझ नहीं पाया। कृपया मुझे बताएं कि आपको किस सार्वजनिक सेवा (जैसे छात्रवृत्ति, प्रमाणपत्र, पेंशन या बिजली सेवा) में सहायता चाहिए।"
                    }
                    return {
                        "answer": msg.get(lang, msg["en"]),
                        "language": lang,
                        "identified_service": None,
                        "sources": [],
                        "verification_status": "unverified",
                        "last_verified": None,
                        "suggested_steps": [],
                        "is_fallback": True,
                        "is_special_intent": True
                    }

        return None

    def detect_service_from_text(self, text: str) -> Optional[str]:
        """Detects specific public service ID from keywords in English, Kannada, and Hindi."""
        if not text:
            return None
        t = text.lower()

        # 1. Transport & Bus Pass
        if any(w in t for w in ["ksrtc", "bmtc", "bus pass", "student pass", "buspass", "ಬಸ್ ಪಾಸ್", "ಸಾರಿಗೆ ಪಾಸ್", "बस पास", "केएसआरटीसी"]):
            return "ksrtc_student_bus_pass"
        if any(w in t for w in ["driving licence", "driving license", "learner licence", "learner license", "llr", " dl ", "dl slot", "sarathi", "parivahan", "ಚಾಲನಾ ಪರವಾನಗಿ", "ಲರ್ನರ್ಸ್", "ಲೈಸೆನ್ಸ್", "ड्राइविंग लाइसेंस", "लर्नर लाइसेंस", "सारथी"]):
            return "parivahan_driving_licence"

        # 2. Education & Scholarships
        if any(w in t for w in ["ssp", "postmatric", "post-matric", "vidyasiri", "eattestation", "sats", "ಮೆಟ್ರಿಕ್ ನಂತರದ", "ಎಸ್ಎಸ್‌ಪಿ", "ವಿದ್ಯಾರ್ಥಿವೇತನ", "ವಿದ್ಯಾಸಿರಿ", "एसएसपी", "पोस्ट-मैट्रिक", "छात्रवृत्ति"]):
            # Distinguish central NSP vs state SSP
            if any(w in t for w in ["nsp", "national scholarship", "central sector", "ಕೇಂದ್ರ ವಿದ್ಯಾರ್ಥಿವೇತನ", "ರಾಷ್ಟ್ರೀಯ ವಿದ್ಯಾರ್ಥಿವೇತನ", "एनएसपी", "राष्ट्रीय छात्रवृत्ति"]):
                return "nsp_central_sector"
            return "ssp_postmatric_karnataka"
        if any(w in t for w in ["nsp", "national scholarship", "central sector", "scholarships.gov.in", "एनएसपी"]):
            return "nsp_central_sector"
        if "scholarship" in t or "scholarships" in t or "ವಿದ್ಯಾರ್ಥಿವೇತನ" in t or "छात्रवृत्ति" in t:
            return "ssp_postmatric_karnataka"

        # 3. Certificates & Nadakacheri
        if any(w in t for w in ["caste certificate", "caste cert", "income certificate", "income cert", "residence certificate", "domicile certificate", "nadakacheri", "rd number", "rd0", "ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ", "ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ", "ನಾಡಕಚೇರಿ", "ವಾಸಸ್ಥಳ", "ಜಾತಿ ಸರ್ಟಿಫಿಕೇಟ್", "जाति प्रमाणपत्र", "आय प्रमाणपत्र", "नाडाकचेरी", "निवास प्रमाणपत्र"]):
            return "nadakacheri_caste_income"
        if any(w in t for w in ["sevasindhu", "seva sindhu", "ಸೇವಾ ಸಿಂಧು", "ಸೇವಾಸಂಧು", "सेवा सिंधु"]):
            return "sevasindhu_certificates"

        # 4. Utilities & Electricity & Gruha Jyothi
        if any(w in t for w in ["gruha jyothi", "gruhajyothi", "zero bill", "zero-bill", "200 units", "ಗೃಹಜ್ಯೋತಿ", "ಶೂನ್ಯ ಬಿಲ್", "ಉಚಿತ ವಿದ್ಯುತ್", "गृह ज्योति", "शून्य बिल", "मुफ्त बिजली"]):
            return "bescom_gruha_jyothi"
        if any(w in t for w in ["electricity", "power bill", "electric bill", "bescom", "hescom", "gescom", "mescom", "cesc", "1912", "ವಿದ್ಯುತ್ ಬಿಲ್", "ಬೆಸ್ಕಾಂ", "ಕರೆಂಟ್ ಬಿಲ್", "बिजली बिल", "बेस्कॉम", "विद्युत"]):
            return "bescom_gruha_jyothi"

        # 5. Pensions & Welfare
        if any(w in t for w in ["sandhya suraksha", "old age pension", "widow pension", "disability pension", "pension", "oap", "dssp", "ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ", "ವೃದ್ಧಾಪ್ಯ ವೇತನ", "ವಿಧವಾ ವೇತನ", "ಪಿಂಚಣಿ", "ವಿಕಲಚೇತನರ ಪಿಂಚಣಿ", "संध्या सुरक्षा", "वृद्धावस्था पेंशन", "विधवा पेंशन", "पेंशन", "दिव्यांग पेंशन"]):
            return "karnataka_social_security_pensions"

        # 6. Ration Cards & Food
        if any(w in t for w in ["ration card", "ration", "ahara", "bpl card", "apl card", "phh", "food card", "fair price shop", "ಪಡಿತರ ಚೀಟಿ", "ರೇಷನ್ ಕಾರ್ಡ್", "ಆಹಾರ ಇಲಾಖೆ", "ಬಿಪಿಎಲ್ ಕಾರ್ಡ್", "ಎಪಿಎಲ್ ಕಾರ್ಡ್", "ನ್ಯಾಯಬೆಲೆ", "राशन कार्ड", "बीपीएल कार्ड", "खाद्य आपूर्ति", "राशन"]):
            return "ahara_ration_card"

        # 7. Agriculture & Farmers
        if any(w in t for w in ["pm-kisan", "pmkisan", "pm kisan", "fruits", "fid", "raitha", "raitha vidyanidhi", "farmer scheme", "kisan samman", "rtc", "pahani", "ರೈತ ಯೋಜನೆ", "ರೈತ", "ಕೃಷಿ", "ಪಹಣಿ", "ಕಿಸಾನ್ ಸಮ್ಮಾನ್", "ರೈತ ವಿದ್ಯಾನಿಧಿ", "किसान योजना", "पीएम-किसान", "किसान सम्मान निधि", "फ्रूट्स आईडी", "खतौनी"]):
            return "pm_kisan_agriculture"

        # 8. Grievances
        if any(w in t for w in ["janaspandana", "cm helpline", "1902", "ಜನಸ್ಪಂದನ", "ಮುಖ್ಯಮಂತ್ರಿ ಸಹಾಯವಾಣಿ", "जनस्पंदना"]):
            return "karnataka_janaspandana_grievances"
        if any(w in t for w in ["cpgrams", "pgportal", "public grievance", "grievance", "ದೂರು ಪೋರ್ಟಲ್", "ಸಾರ್ವಜನಿಕ ದೂರು", "लोक शिकायत"]):
            return "cpgrams_grievances"

        return None

    def detect_context_service(self, query: str, conversation_history: Optional[List[Any]] = None) -> Optional[str]:
        """Resolves active service by checking topic switch in current query, or falling back to conversation memory."""
        # 1. Does the current query explicitly name a service/domain?
        direct = self.detect_service_from_text(query)
        if direct:
            return direct

        # 2. If query is a follow-up ("How do I apply?", "Is there any qualification?", "What documents are required?", etc.),
        # extract service from conversation history (from most recent message backwards)
        if conversation_history:
            for msg in reversed(conversation_history):
                text = ""
                if isinstance(msg, dict):
                    text = msg.get("content", "")
                elif hasattr(msg, "content"):
                    text = msg.content
                found = self.detect_service_from_text(text)
                if found:
                    return found

        return None

    def search_services(self, query: str, lang: str = "en") -> List[Dict[str, Any]]:
        if not query or not query.strip():
            return []
        
        q = query.strip().lower()
        matches = []

        # Check direct keyword match first
        detected_id = self.detect_service_from_text(q)

        for s in self._services:
            score = 0
            if detected_id and s["id"] == detected_id:
                score += 50

            # Search in multilingual names
            for l_key, name_val in s.get("name", {}).items():
                if q in name_val.lower():
                    score += 15
                for w in q.split():
                    if len(w) > 3 and w in name_val.lower():
                        score += 5

            # Search in summary
            for l_key, sum_val in s.get("summary", {}).items():
                if q in sum_val.lower():
                    score += 8
                for w in q.split():
                    if len(w) > 3 and w in sum_val.lower():
                        score += 2

            # Search in problem titles
            for prob in s.get("common_problems", []):
                for l_key, p_title in prob.get("problem_title", {}).items():
                    if q in p_title.lower():
                        score += 12
                    for w in q.split():
                        if len(w) > 3 and w in p_title.lower():
                            score += 4

            # Search in eligibility and documents
            for doc_list in s.get("required_documents", {}).values():
                for d in doc_list:
                    if q in d.lower():
                        score += 2

            if score > 0:
                s_copy = dict(s)
                s_copy["match_score"] = score
                s_copy["localized_name"] = s["name"].get(lang, s["name"].get("en", ""))
                s_copy["localized_summary"] = s["summary"].get(lang, s["summary"].get("en", ""))
                matches.append(s_copy)

        matches.sort(key=lambda m: m["match_score"], reverse=True)
        return matches

    def match_common_problem(self, service: Dict[str, Any], query: str) -> Optional[Dict[str, Any]]:
        """Matches a user query to the most specific problem/situation inside the service."""
        if not service or not service.get("common_problems"):
            return None
        
        q = query.lower()

        # Situation triggers
        is_qualification = any(w in q for w in ["qualification", "eligibility", "eligible", "who is eligible", "criteria", "ಅರ್ಹತೆ", "ಮಾನದಂಡ", "ಯಾರು ಅರ್ಹರು", "पात्रता", "योग्यता", "कौन पात्र"])
        is_delayed_payment = any(w in q for w in ["delayed", "delay", "not credited", "stuck", "pending payment", "not received", "ಹಣ ಬಂದಿಲ್ಲ", "ತಡವಾಗಿದೆ", "ಬಂದಿಲ್ಲ", "पैसा नहीं आया", "विलंबित", "रुका", "भुगतान"])
        is_documents = any(w in q for w in ["document", "documents", "which documents", "what documents", "proof", "ದಾಖಲೆ", "ದಾಖಲೆಗಳು", "ಪಟ್ಟಿ", "दस्तावेज", "कागजात"])
        is_renewal = any(w in q for w in ["renewal", "renew", "second year", "subsequent", "ನವೀಕರಣ", "ನವೀಕರಿಸುವುದು", "नवीनीकरण", "रिन्यू"])
        is_rejected = any(w in q for w in ["reject", "rejected", "objection", "appeal", "ತಿರಸ್ಕೃತ", "ತಿರಸ್ಕಾರ", "ಆಕ್ಷೇಪಣೆ", "ಅಸ್ವೀಕೃತ", "अस्वीकृत", "आपत्ति"])
        is_download = any(w in q for w in ["download", "print", "get certificate", "ಡೌನ್‌ಲೋಡ್", "ಪ್ರಿಂಟ್", "ಪಡೆಯುವುದು", "डाउनलोड", "प्रिंट"])
        is_apply = any(w in q for w in ["apply", "fresh", "register", "new", "ಹೊಸ", "ಅರ್ಜಿ", "ಸಲ್ಲಿಸುವುದು", "ನೋಂದಣಿ", "आवेदन", "नया"])
        is_complaint = any(w in q for w in ["complain", "complaint", "where can i complain", "grievance", "faulty", "bill", "ದೂರು", "ಸಹಾಯವಾಣಿ", "ಹೆಚ್ಚುವರಿ ಬಿಲ್", "शिकायत", "हेल्पलाइन"])
        is_check = any(w in q for w in ["how can i check", "track", "status", "check it", "ಸ್ಥಿತಿ", "ಪರಿಶೀಲನೆ", "ಟ್ರ್ಯಾಕ್", "स्थिति", "जांच"])

        problems = service.get("common_problems", [])

        # Priority matching based on intent
        if is_qualification:
            for p in problems:
                if any(k in p["problem_id"] for k in ["eligibility", "qualification", "zero_bill"]):
                    return p
        if is_delayed_payment:
            for p in problems:
                if any(k in p["problem_id"] for k in ["delayed", "payment_delayed", "payment_issue"]):
                    return p
        if is_check and not is_qualification:
            for p in problems:
                if any(k in p["problem_id"] for k in ["track", "status", "payment_delayed", "payment_issue"]):
                    return p
        if is_documents:
            for p in problems:
                if any(k in p["problem_id"] for k in ["documents", "apply_fresh", "apply", "renewal"]):
                    return p
        if is_renewal:
            for p in problems:
                if "renewal" in p["problem_id"] or "renew" in p["problem_id"]:
                    return p
        if is_rejected:
            for p in problems:
                if any(k in p["problem_id"] for k in ["rejected", "unsatisfactory", "appeal"]):
                    return p
        if is_download:
            for p in problems:
                if any(k in p["problem_id"] for k in ["download", "print", "track_download"]):
                    return p
        if is_complaint:
            for p in problems:
                if any(k in p["problem_id"] for k in ["complaint", "grievance", "bill"]):
                    return p
        if is_apply:
            for p in problems:
                if any(k in p["problem_id"] for k in ["apply", "fresh"]):
                    return p

        # Keyword matching on problem titles
        for p in problems:
            for l_k, p_title in p.get("problem_title", {}).items():
                words = [w for w in p_title.lower().split() if len(w) > 3]
                if any(w in q for w in words):
                    return p

        return problems[0] if problems else None

    def retrieve_grounding_context(
        self, 
        query: str, 
        category_id: Optional[str] = None, 
        service_id: Optional[str] = None,
        conversation_history: Optional[List[Any]] = None
    ) -> Dict[str, Any]:
        """Returns structured grounding context with conversation context awareness."""
        selected_service = None

        # 1. Direct service_id parameter
        if service_id:
            selected_service = self.get_service(service_id)

        # 2. Context-aware service detection from query and history
        if not selected_service:
            detected_id = self.detect_context_service(query, conversation_history)
            if detected_id:
                selected_service = self.get_service(detected_id)

        # 3. Direct Category filtering
        candidate_services = []
        if selected_service:
            candidate_services = [selected_service]
        elif category_id:
            candidate_services = self.get_services(category_id)
        else:
            candidate_services = self.search_services(query)

        # Fallback to general representation only if nothing matched
        if not candidate_services:
            return {
                "evidence": "",
                "sources": [],
                "primary_service": None,
                "matched_problem": None
            }

        primary = candidate_services[0]
        matched_problem = self.match_common_problem(primary, query)

        sources = []
        for s in candidate_services[:3]:
            sources.append({
                "title": s["name"].get("en", s["id"]),
                "url": s.get("portal_url", ""),
                "department": s.get("provider", {}).get("en", ""),
                "verification_status": s.get("verification_status", "verified"),
                "last_verified": s.get("last_verified", "")
            })

        context_texts = []
        for s in candidate_services[:2]:
            info = f"SERVICE: {s['name'].get('en')}\n"
            info += f"Category: {s.get('category_id')}\n"
            info += f"Provider: {s['provider'].get('en')} | Official Portal: {s['portal_url']}\n"
            info += f"Verification: {s['verification_status']} (Date: {s['last_verified']})\n"
            info += f"Summary: {s['summary'].get('en')}\n"
            info += "Eligibility Requirements:\n- " + "\n- ".join(s['eligibility'].get('en', [])) + "\n"
            info += "Required Documents Checklist:\n- " + "\n- ".join(s['required_documents'].get('en', [])) + "\n"
            
            for prob in s.get("common_problems", []):
                info += f"\nSpecific Situation: {prob['problem_title'].get('en')}\n"
                info += f"Recommended Action: {prob['recommended_action'].get('en')}\n"
                info += "Action Steps:\n" + "\n".join([f"  {i+1}. {step}" for i, step in enumerate(prob['checklist'].get('en', []))]) + "\n"
                info += f"Official Helpline / Escalation: {prob['escalation_route'].get('en')}\n"
            context_texts.append(info)

        return {
            "evidence": "\n---\n".join(context_texts),
            "sources": sources,
            "primary_service": primary,
            "matched_problem": matched_problem
        }

knowledge_engine = KnowledgeEngine()
