from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class MultilingualText(BaseModel):
    en: str
    kn: Optional[str] = None
    hi: Optional[str] = None

class MultilingualList(BaseModel):
    en: List[str]
    kn: Optional[List[str]] = None
    hi: Optional[List[str]] = None

class CategorySchema(BaseModel):
    id: str
    slug: str
    order: int
    title: Dict[str, str]
    short_title: Dict[str, str]
    description: Dict[str, str]
    color_theme: str
    bg_color: str
    accent_color: str
    image_key: Optional[str] = None

class ProblemSchema(BaseModel):
    problem_id: str
    problem_title: Dict[str, str]
    recommended_action: Dict[str, str]
    checklist: Dict[str, List[str]]
    escalation_route: Dict[str, str]

class ServiceSchema(BaseModel):
    id: str
    category_id: str
    name: Dict[str, str]
    provider: Dict[str, str]
    scope: str
    portal_url: str
    verification_status: str
    last_verified: str
    summary: Dict[str, str]
    eligibility: Dict[str, List[str]]
    required_documents: Dict[str, List[str]]
    common_problems: List[ProblemSchema] = []

class GuidanceRequest(BaseModel):
    service_id: Optional[str] = None
    problem_id: Optional[str] = None
    problem_query: Optional[str] = None
    lang: str = Field(default="en", description="Language code: en, kn, or hi")

class NextStepCardResponse(BaseModel):
    service_id: str
    service_name: str
    category_title: str
    portal_url: str
    verification_status: str
    last_verified: str
    user_problem: str
    explanation: str
    recommended_action: str
    checklist: List[str]
    required_documents: List[str]
    escalation_route: str
    disclaimer: str
    language: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    question: str
    lang: str = Field(default="en", description="Language code: en, kn, or hi")
    category_id: Optional[str] = None
    service_id: Optional[str] = None
    conversation_history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    answer: str
    language: str
    identified_service: Optional[str] = None
    sources: List[Dict[str, str]] = []
    verification_status: str
    last_verified: Optional[str] = None
    suggested_steps: List[str] = []
    is_fallback: bool = False
