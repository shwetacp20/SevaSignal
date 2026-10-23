from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.retrieval.engine import knowledge_engine

router = APIRouter(tags=["Services"])

@router.get("/categories")
def get_categories(lang: str = Query(default="en", description="Language: en, kn, hi")):
    return knowledge_engine.get_categories(lang=lang)

@router.get("/services")
def get_services(
    category_id: Optional[str] = Query(default=None),
    lang: str = Query(default="en")
):
    services = knowledge_engine.get_services(category_id=category_id)
    # Add localized fields
    res = []
    for s in services:
        s_copy = dict(s)
        s_copy["localized_name"] = s["name"].get(lang, s["name"].get("en", ""))
        s_copy["localized_provider"] = s["provider"].get(lang, s["provider"].get("en", ""))
        s_copy["localized_summary"] = s["summary"].get(lang, s["summary"].get("en", ""))
        res.append(s_copy)
    return res

@router.get("/services/{service_id}")
def get_service_detail(service_id: str, lang: str = Query(default="en")):
    s = knowledge_engine.get_service(service_id)
    if not s:
        raise HTTPException(status_code=404, detail=f"Service with id '{service_id}' not found")
    
    s_copy = dict(s)
    s_copy["localized_name"] = s["name"].get(lang, s["name"].get("en", ""))
    s_copy["localized_provider"] = s["provider"].get(lang, s["provider"].get("en", ""))
    s_copy["localized_summary"] = s["summary"].get(lang, s["summary"].get("en", ""))
    s_copy["localized_eligibility"] = s["eligibility"].get(lang, s["eligibility"].get("en", []))
    s_copy["localized_documents"] = s["required_documents"].get(lang, s["required_documents"].get("en", []))
    return s_copy

@router.get("/search")
def search(q: str = Query(..., min_length=1), lang: str = Query(default="en")):
    results = knowledge_engine.search_services(q, lang=lang)
    return {
        "query": q,
        "language": lang,
        "count": len(results),
        "results": results
    }
