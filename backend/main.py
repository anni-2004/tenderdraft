from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import docgen, tender
from backend.config import GEMINI_API_KEY
import google.generativeai as genai

genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(
    title="TenderDraft API",
    description="AI-Powered Document Generator for Tender Processing",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(docgen.router, prefix="/docgen", tags=["Document Generator"])
app.include_router(tender.router, prefix="/api", tags=["Tender Data"])

@app.get("/")
async def root():
    return {
        "message": "TenderDraft API is running!",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "upload_template": "/docgen/upload-template/",
            "generate_document": "/docgen/generate-document/",
            "get_tender": "/api/tender/{tender_id}",
            "list_tenders": "/api/tenders/"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "TenderDraft API"}