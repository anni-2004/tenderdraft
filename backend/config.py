import os
from dotenv import load_dotenv

# Load .env from root directory (one level above backend)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# Safely access environment variables
GEMINI_API_KEY = os.getenv("GEMINI_KEY")

if not GEMINI_API_KEY:
    raise ValueError("❌ GEMINI_KEY not found in .env file")
