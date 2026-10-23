import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "SevaSignal API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    ALLOWED_ORIGINS: list = ["*"]
    DATA_PATH: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "knowledge.json")

settings = Settings()
