import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes.services import router as services_router
from app.routes.guidance import router as guidance_router
from app.routes.chat import router as chat_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("sevasignal")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SevaSignal Backend - Grounded Multilingual Public Service Guidance API"
)

# Robust CORS configuration for local Vite development and deployed frontends (Vercel, custom domains)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=r"^https?://.*",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(services_router, prefix=settings.API_PREFIX)
app.include_router(guidance_router, prefix=settings.API_PREFIX)
app.include_router(chat_router, prefix=settings.API_PREFIX)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "SevaSignal API",
        "version": settings.VERSION,
        "ai_provider_configured": bool(settings.GEMINI_API_KEY)
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
