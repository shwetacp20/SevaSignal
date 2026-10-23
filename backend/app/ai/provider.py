import os
import time
import logging
from typing import Dict, Any, List, Optional
from app.config import settings
from app.retrieval.engine import knowledge_engine

logger = logging.getLogger("sevasignal.ai")

SYSTEM_PROMPT_TEMPLATE = """You are SevaSignal AI, a compassionate, accurate public-service guidance assistant for Indian citizens.
Your mission is to clarify public services, certificates, scholarships, and administrative processes in simple, actionable language.

CRITICAL RULES:
1. Grounding: Answer ONLY based on the verified evidence provided below. Do NOT fabricate rules, application fees, portals, deadlines, or eligibility terms.
2. Independent Identity: You are an independent student project guidance system, NOT a government portal or official representative.
3. Language: You must respond entirely in the requested language: {target_language_name}. Use natural, respectful phrasing (Devanagari script for Hindi, Kannada script for Kannada).
4. Clarity: Provide a clear explanation followed by concise numbered next steps.
5. Official References: Always point the citizen to the verified official portal URL and helpline provided in the evidence.
6. Context Awareness: Pay close attention to the conversation history. If the user asks a follow-up question (e.g., "Is there any qualification?", "What documents are required?", "Why is my payment delayed?"), interpret it within the context of the service being discussed.
7. Unknown Information: If the evidence does not cover the citizen's specific situation, state clearly that official guidance is needed and direct them to the appropriate portal or helpline.

VERIFIED EVIDENCE FROM SEVASIGNAL DATABASE:
{evidence}
"""

LANGUAGE_MAP = {
    "en": "English",
    "kn": "Kannada (ಕನ್ನಡ)",
    "hi": "Hindi (हिन्दी)"
}

class GeminiAssistant:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self._client = None
        self._init_client()

    def _init_client(self):
        if self.api_key:
            try:
                from google import genai
                self._client = genai.Client(api_key=self.api_key)
                logger.info(f"Initialized Gemini client with model {self.model_name}")
            except Exception as e:
                logger.warning(f"Could not initialize google-genai client: {e}")
                self._client = None

    def generate_response(
        self, 
        question: str, 
        lang: str = "en", 
        category_id: Optional[str] = None, 
        service_id: Optional[str] = None,
        conversation_history: Optional[List[Any]] = None
    ) -> Dict[str, Any]:
        start_time = time.time()
        target_lang = LANGUAGE_MAP.get(lang, "English")

        # 0. Check for gibberish, keyboard-mash, punctuation-only, greetings, casual questions, out-of-scope
        special_res = knowledge_engine.classify_special_query(question, lang)
        if special_res:
            special_res["latency_ms"] = round((time.time() - start_time) * 1000, 2)
            return special_res

        # 1. Retrieve grounded context with conversation awareness
        retrieval_res = knowledge_engine.retrieve_grounding_context(
            query=question, 
            category_id=category_id, 
            service_id=service_id,
            conversation_history=conversation_history
        )
        evidence = retrieval_res.get("evidence", "")
        sources = retrieval_res.get("sources", [])
        primary_service = retrieval_res.get("primary_service")
        matched_problem = retrieval_res.get("matched_problem")

        # 2. Try Gemini AI if client is active
        if self._client and evidence:
            try:
                system_instruction = SYSTEM_PROMPT_TEMPLATE.format(
                    target_language_name=target_lang,
                    evidence=evidence
                )
                
                # Format conversation history
                history_texts = []
                if conversation_history:
                    for m in conversation_history[-6:]:
                        role = "Citizen" if (isinstance(m, dict) and m.get("role") == "user") or getattr(m, "role", "") == "user" else "Assistant"
                        content = m.get("content", "") if isinstance(m, dict) else getattr(m, "content", "")
                        history_texts.append(f"{role}: {content}")
                
                history_prompt = "\n".join(history_texts)
                user_content = f"Conversation History:\n{history_prompt}\n\nCurrent Question: {question}\nLanguage requested: {target_lang}" if history_texts else f"Citizen Question: {question}\nLanguage requested: {target_lang}"

                response = self._client.models.generate_content(
                    model=self.model_name,
                    contents=user_content,
                    config={
                        "system_instruction": system_instruction,
                        "temperature": 0.2,
                        "max_output_tokens": 1024,
                    }
                )
                
                latency = round((time.time() - start_time) * 1000, 2)
                return {
                    "answer": response.text.strip(),
                    "language": lang,
                    "identified_service": primary_service["name"].get(lang, primary_service["name"].get("en")) if primary_service else None,
                    "sources": sources,
                    "verification_status": primary_service.get("verification_status", "verified") if primary_service else "verified",
                    "last_verified": primary_service.get("last_verified") if primary_service else None,
                    "suggested_steps": self._extract_steps(primary_service, matched_problem, lang),
                    "is_fallback": False,
                    "latency_ms": latency
                }
            except Exception as e:
                logger.error(f"Gemini API invocation error: {e}. Falling back to structured local guidance.")

        # 3. Grounded Local Intelligence Fallback (High-quality deterministic response from verified database)
        return self._generate_local_fallback(question, lang, retrieval_res, start_time)

    def _generate_local_fallback(self, question: str, lang: str, retrieval_res: Dict[str, Any], start_time: float) -> Dict[str, Any]:
        primary = retrieval_res.get("primary_service")
        matched_problem = retrieval_res.get("matched_problem")
        sources = retrieval_res.get("sources", [])
        latency = round((time.time() - start_time) * 1000, 2)

        # A. If no service matched
        if not primary:
            no_match_text = {
                "en": "We searched the verified SevaSignal knowledge base, but could not identify a specific government scheme matching your question. For general Karnataka public services, you can explore Seva Sindhu (https://sevasindhu.karnataka.gov.in/) or call toll-free 1902.",
                "kn": "ನಾವು ಪರಿಶೀಲಿಸಿದ ಸೇವಾಸಂಜ್ಞೆ (SevaSignal) ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಹುಡುಕಿದ್ದೇವೆ, ಆದರೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ನಿಖರವಾದ ಸರ್ಕಾರಿ ಯೋಜನೆಯ ಮಾಹಿತಿ ಕಂಡುಬಂದಿಲ್ಲ. ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳ ಸಾಮಾನ್ಯ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಕರ್ನಾಟಕ ಸೇವಾ ಸಿಂಧು (https://sevasindhu.karnataka.gov.in/) ಅಥವಾ ಸಹಾಯವಾಣಿ 1902 ಅನ್ನು ಸಂಪರ್ಕಿಸಿ.",
                "hi": "हमने सत्यापित सेवा-सिग्नल डेटाबेस में खोज की, लेकिन आपके प्रश्न से संबंधित सटीक सरकारी योजना उपलब्ध नहीं है। सामान्य नागरिक सेवाओं की जानकारी के लिए कृपया कर्नाटक सेवा सिंधु (https://sevasindhu.karnataka.gov.in/) अथवा हेल्पलाइन 1902 पर संपर्क करें।"
            }
            return {
                "answer": no_match_text.get(lang, no_match_text["en"]),
                "language": lang,
                "identified_service": None,
                "sources": sources,
                "verification_status": "unverified",
                "last_verified": None,
                "suggested_steps": [],
                "is_fallback": True,
                "latency_ms": latency
            }

        s_name = primary["name"].get(lang, primary["name"].get("en", primary["id"]))
        portal = primary.get("portal_url", "")
        q_lower = question.lower()

        # B. Check for Specific Intent: Eligibility / Qualification
        is_qualification = any(w in q_lower for w in ["qualification", "eligibility", "eligible", "who is eligible", "criteria", "ಅರ್ಹತೆ", "ಮಾನದಂಡ", "ಯಾರು ಅರ್ಹರು", "पात्रता", "योग्यता", "कौन पात्र"])
        if is_qualification:
            elig_list = primary.get("eligibility", {}).get(lang, primary.get("eligibility", {}).get("en", []))
            if lang == "kn":
                text = f"**{s_name} — ಅರ್ಹತಾ ಮಾನದಂಡಗಳು:**\n\n"
                for idx, e_item in enumerate(elig_list):
                    text += f"{idx+1}. {e_item}\n"
                text += f"\n**ಅಧಿಕೃತ ಪೋರ್ಟಲ್:** {portal}\n"
                text += "ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಅಗತ್ಯ ದಾಖಲೆಗಳನ್ನು ಹೊಂದಿದ್ದೀರಾ ಎಂದು ಪರಿಶೀಲಿಸಿಕೊಳ್ಳಿ."
            elif lang == "hi":
                text = f"**{s_name} — पात्रता एवं योग्यता शर्तें:**\n\n"
                for idx, e_item in enumerate(elig_list):
                    text += f"{idx+1}. {e_item}\n"
                text += f"\n**आधिकारिक पोर्टल:** {portal}\n"
                text += "आवेदन करने से पहले कृपया सुनिश्चित करें कि आपके पास सभी आवश्यक दस्तावेज उपलब्ध हैं।"
            else:
                text = f"**{s_name} — Eligibility & Qualification Criteria:**\n\n"
                for idx, e_item in enumerate(elig_list):
                    text += f"{idx+1}. {e_item}\n"
                text += f"\n**Official Portal:** {portal}\n"
                text += "Ensure all supporting documents match official criteria before applying."

            return {
                "answer": text,
                "language": lang,
                "identified_service": s_name,
                "sources": sources,
                "verification_status": primary.get("verification_status", "verified"),
                "last_verified": primary.get("last_verified"),
                "suggested_steps": elig_list,
                "is_fallback": True,
                "latency_ms": latency
            }

        # C. Check for Specific Intent: Required Documents
        is_documents = any(w in q_lower for w in ["document", "documents", "what documents", "which documents", "proof", "ದಾಖಲೆ", "ದಾಖಲೆಗಳು", "ಪಟ್ಟಿ", "ದಸ್ತಾವೇಜು", "दस्तावेज", "कागजात"])
        if is_documents:
            doc_list = primary.get("required_documents", {}).get(lang, primary.get("required_documents", {}).get("en", []))
            if lang == "kn":
                text = f"**{s_name} — ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳ ಪಟ್ಟಿ:**\n\n"
                for idx, d_item in enumerate(doc_list):
                    text += f"{idx+1}. {d_item}\n"
                text += f"\n**ಅಧಿಕೃತ ಪೋರ್ಟಲ್:** {portal}\n"
                text += "ಎಲ್ಲಾ ದಾಖಲೆಗಳಲ್ಲಿ ಹೆಸರು ಮತ್ತು ಜನ್ಮ ದಿನಾಂಕ ಒಂದೇ ರೀತಿ ಇರುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ."
            elif lang == "hi":
                text = f"**{s_name} — आवश्यक दस्तावेजों की चेकलिस्ट:**\n\n"
                for idx, d_item in enumerate(doc_list):
                    text += f"{idx+1}. {d_item}\n"
                text += f"\n**आधिकारिक पोर्टल:** {portal}\n"
                text += "कृपया सुनिश्चित करें कि सभी दस्तावेजों में नाम और जन्मतिथि एक समान हों।"
            else:
                text = f"**{s_name} — Required Documents Checklist:**\n\n"
                for idx, d_item in enumerate(doc_list):
                    text += f"{idx+1}. {d_item}\n"
                text += f"\n**Official Portal:** {portal}\n"
                text += "Verify that names and dates match identically across all submitted certificates."

            return {
                "answer": text,
                "language": lang,
                "identified_service": s_name,
                "sources": sources,
                "verification_status": primary.get("verification_status", "verified"),
                "last_verified": primary.get("last_verified"),
                "suggested_steps": doc_list,
                "is_fallback": True,
                "latency_ms": latency
            }

        # D. Match Specific Situation / Problem
        if matched_problem:
            prob_title = matched_problem["problem_title"].get(lang, matched_problem["problem_title"].get("en", ""))
            action = matched_problem["recommended_action"].get(lang, matched_problem["recommended_action"].get("en", ""))
            steps = matched_problem["checklist"].get(lang, matched_problem["checklist"].get("en", []))
            escalation = matched_problem["escalation_route"].get(lang, matched_problem["escalation_route"].get("en", ""))

            if lang == "kn":
                text = f"**{s_name}**\n**ವಿಷಯ:** {prob_title}\n\n"
                text += f"**ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮ:** {action}\n\n"
                text += "**ಹಂತ-ಹಂತದ ಕ್ರಮಗಳು:**\n"
                for i, st in enumerate(steps):
                    text += f"{i+1}. {st}\n"
                text += f"\n**ಅಧಿಕೃತ ಪೋರ್ಟಲ್:** {portal}\n"
                text += f"**ಸಹಾಯವಾಣಿ / ದೂರು ಪರಿಹಾರ:** {escalation}"
            elif lang == "hi":
                text = f"**{s_name}**\n**विषय:** {prob_title}\n\n"
                text += f"**अनुशंसित तत्काल कार्रवाई:** {action}\n\n"
                text += "**चरणबद्ध प्रक्रिया:**\n"
                for i, st in enumerate(steps):
                    text += f"{i+1}. {st}\n"
                text += f"\n**आधिकारिक पोर्टल:** {portal}\n"
                text += f"**हेल्पलाइन / शिकायत निवारण:** {escalation}"
            else:
                text = f"**{s_name}**\n**Situation:** {prob_title}\n\n"
                text += f"**Recommended Action:** {action}\n\n"
                text += "**Step-by-Step Procedure:**\n"
                for i, st in enumerate(steps):
                    text += f"{i+1}. {st}\n"
                text += f"\n**Official Portal:** {portal}\n"
                text += f"**Helpline / Escalation:** {escalation}"

            return {
                "answer": text,
                "language": lang,
                "identified_service": s_name,
                "sources": sources,
                "verification_status": primary.get("verification_status", "verified"),
                "last_verified": primary.get("last_verified"),
                "suggested_steps": steps,
                "is_fallback": True,
                "latency_ms": latency
            }

        # E. General Service Overview
        summary = primary["summary"].get(lang, primary["summary"].get("en", ""))
        docs = primary.get("required_documents", {}).get(lang, primary.get("required_documents", {}).get("en", []))
        if lang == "kn":
            text = f"**{s_name}**\n\n{summary}\n\n**ಅಧಿಕೃತ ಪೋರ್ಟಲ್:** {portal}\n"
            text += f"**ಮುಖ್ಯ ದಾಖಲೆಗಳು:** {', '.join(docs[:4])}.\n\nಹೆಚ್ಚಿನ ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ 'Get Complete Action Plan' ಪರಿಶೀಲಿಸಿ."
        elif lang == "hi":
            text = f"**{s_name}**\n\n{summary}\n\n**आधिकारिक पोर्टल:** {portal}\n"
            text += f"**मुख्य दस्तावेज:** {', '.join(docs[:4])}.\n\nविस्तृत जानकारी हेतु 'Get Complete Action Plan' देखें।"
        else:
            text = f"**{s_name}**\n\n{summary}\n\n**Official Portal:** {portal}\n"
            text += f"**Key Documents:** {', '.join(docs[:4])}.\n\nCheck 'Get Complete Action Plan' for actionable steps."

        return {
            "answer": text,
            "language": lang,
            "identified_service": s_name,
            "sources": sources,
            "verification_status": primary.get("verification_status", "verified"),
            "last_verified": primary.get("last_verified"),
            "suggested_steps": docs,
            "is_fallback": True,
            "latency_ms": latency
        }

    def _extract_steps(self, service: Optional[Dict[str, Any]], matched_problem: Optional[Dict[str, Any]], lang: str) -> List[str]:
        if matched_problem and "checklist" in matched_problem:
            return matched_problem["checklist"].get(lang, matched_problem["checklist"].get("en", []))
        if not service:
            return []
        problems = service.get("common_problems", [])
        if problems and "checklist" in problems[0]:
            return problems[0]["checklist"].get(lang, problems[0]["checklist"].get("en", []))
        return service.get("required_documents", {}).get(lang, service.get("required_documents", {}).get("en", []))

ai_assistant = GeminiAssistant()
