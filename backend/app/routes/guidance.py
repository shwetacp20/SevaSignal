from fastapi import APIRouter, HTTPException
from app.models.schemas import GuidanceRequest, NextStepCardResponse
from app.retrieval.engine import knowledge_engine

router = APIRouter(tags=["Guidance"])

DISCLAIMERS = {
    "en": "SevaSignal is an independent guidance platform and not an official government portal. Verify details on the official portal before taking legal or financial action.",
    "kn": "ಸೇವಾಸಂಜ್ಞೆ (SevaSignal) ಒಂದು ಸ್ವತಂತ್ರ ನಾಗರಿಕ ಮಾರ್ಗದರ್ಶನ ವೇದಿಕೆಯಾಗಿದ್ದು, ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್ ಅಲ್ಲ. ಯಾವುದೇ ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳುವ ಮೊದಲು ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.",
    "hi": "सेवा-सिग्नल (SevaSignal) एक स्वतंत्र नागरिक मार्गदर्शन मंच है, आधिकारिक सरकारी पोर्टल नहीं। कोई भी कानूनी या वित्तीय कदम उठाने से पहले आधिकारिक पोर्टल पर पुष्टि करें।"
}

@router.post("/guidance", response_model=NextStepCardResponse)
def generate_guidance(req: GuidanceRequest):
    service = None
    if req.service_id:
        service = knowledge_engine.get_service(req.service_id)
    
    if req.problem_query:
        # Check if the query is random, gibberish, greeting, or out-of-scope
        special = knowledge_engine.classify_special_query(req.problem_query, req.lang)
        if special:
            raise HTTPException(
                status_code=400, 
                detail="Cannot generate an action plan for random, unclear, or greeting queries. Please specify a valid public service."
            )

        if not service:
            detected_id = knowledge_engine.detect_service_from_text(req.problem_query)
            if detected_id:
                service = knowledge_engine.get_service(detected_id)
            if not service:
                matches = knowledge_engine.search_services(req.problem_query)
                if matches:
                    service = matches[0]

    if not service:
        raise HTTPException(
            status_code=404, 
            detail="No matching public service found. Please select a valid service category."
        )
    
    lang = req.lang if req.lang in ["en", "kn", "hi"] else "en"
    cat = knowledge_engine.get_category_by_id(service.get("category_id"))
    cat_title = cat["title"].get(lang, cat["title"].get("en", "Public Service")) if cat else "Public Service"
    s_name = service["name"].get(lang, service["name"].get("en", ""))
    
    # Check if a specific problem was requested
    selected_problem = None
    if req.problem_id:
        for p in service.get("common_problems", []):
            if p["problem_id"] == req.problem_id:
                selected_problem = p
                break

    # If no exact problem_id match, try intelligent problem matching from problem_query
    if not selected_problem and req.problem_query:
        selected_problem = knowledge_engine.match_common_problem(service, req.problem_query)

    if not selected_problem and service.get("common_problems"):
        selected_problem = service["common_problems"][0]

    if selected_problem:
        user_problem = selected_problem["problem_title"].get(lang, selected_problem["problem_title"].get("en", ""))
        rec_action = selected_problem["recommended_action"].get(lang, selected_problem["recommended_action"].get("en", ""))
        checklist = selected_problem["checklist"].get(lang, selected_problem["checklist"].get("en", []))
        escalation = selected_problem["escalation_route"].get(lang, selected_problem["escalation_route"].get("en", ""))
    else:
        user_problem = req.problem_query or (
            "ಸಾಮಾನ್ಯ ಅರ್ಜಿ ಮಾರ್ಗದರ್ಶನ" if lang == "kn" else
            "सामान्य आवेदन एवं प्रक्रिया" if lang == "hi" else
            "General Application Guidance"
        )
        rec_action = (
            "ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಭೇಟಿ ನೀಡಿ ಅಗತ್ಯ ದಾಖಲೆಗಳೊಂದಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ." if lang == "kn" else
            "आधिकारिक पोर्टल पर जाएं और आवश्यक दस्तावेजों के साथ आवेदन जमा करें।" if lang == "hi" else
            "Visit the official portal and submit your application with verified documents."
        )
        checklist = service.get("required_documents", {}).get(lang, service.get("required_documents", {}).get("en", []))
        escalation = f"Official Portal: {service.get('portal_url', '')} / Helpdesk 1902"

    explanation = service["summary"].get(lang, service["summary"].get("en", ""))
    docs = service.get("required_documents", {}).get(lang, service.get("required_documents", {}).get("en", []))

    return NextStepCardResponse(
        service_id=service["id"],
        service_name=s_name,
        category_title=cat_title,
        portal_url=service.get("portal_url", "https://sevasindhu.karnataka.gov.in/"),
        verification_status=service.get("verification_status", "verified"),
        last_verified=service.get("last_verified", "2026-03-15"),
        user_problem=user_problem,
        explanation=explanation,
        recommended_action=rec_action,
        checklist=checklist,
        required_documents=docs,
        escalation_route=escalation,
        disclaimer=DISCLAIMERS.get(lang, DISCLAIMERS["en"]),
        language=lang
    )
