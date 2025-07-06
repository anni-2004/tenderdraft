from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import docgen
from backend.config import GEMINI_API_KEY
import google.generativeai as genai

genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with actual frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(docgen.router, prefix="/docgen", tags=["Document Generator"])
