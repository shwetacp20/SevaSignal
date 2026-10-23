from fastapi import APIRouter
from app.models.schemas import ChatRequest, ChatResponse
from app.ai.provider import ai_assistant

router = APIRouter(tags=["AI Assistant"])

@router.post("/chat", response_model=ChatResponse)
def chat_with_assistant(req: ChatRequest):
    result = ai_assistant.generate_response(
        question=req.question,
        lang=req.lang,
        category_id=req.category_id,
        service_id=req.service_id,
        conversation_history=req.conversation_history
    )
    return ChatResponse(**result)
