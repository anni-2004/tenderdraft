from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from backend.config import GEMINI_API_KEY
import os

router = APIRouter()

# MongoDB Setup
MONGO_URI = "mongodb+srv://anirudh:anirudh@cluster0.vdtqwjl.mongodb.net/?retryWrites=true&w=majority"
DB_NAME = "tender_system"
COLLECTION_NAME = "tenders"

try:
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    # Test connection
    client.admin.command('ping')
    print("✅ Connected to MongoDB successfully")
except Exception as e:
    print(f"❌ Failed to connect to MongoDB: {e}")
    collection = None

@router.get("/tender/{tender_id}")
async def get_tender_data(tender_id: str):
    """
    Fetch tender data by Tender ID from MongoDB
    """
    if not collection:
        raise HTTPException(status_code=500, detail="Database connection not available")
    
    try:
        # Search for tender by Tender ID
        tender_data = collection.find_one({"Tender ID": tender_id})
        
        if not tender_data:
            raise HTTPException(status_code=404, detail=f"Tender with ID '{tender_id}' not found")
        
        # Remove MongoDB's _id field from response
        if '_id' in tender_data:
            del tender_data['_id']
        
        return tender_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch tender data: {str(e)}")

@router.get("/tenders/")
async def list_tenders(limit: int = 10, skip: int = 0):
    """
    List all tenders with pagination
    """
    if not collection:
        raise HTTPException(status_code=500, detail="Database connection not available")
    
    try:
        # Get total count
        total = collection.count_documents({})
        
        # Get paginated results
        tenders = list(collection.find({}, {"_id": 0}).skip(skip).limit(limit))
        
        return {
            "total": total,
            "skip": skip,
            "limit": limit,
            "tenders": tenders
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch tenders: {str(e)}")

@router.get("/tender/{tender_id}/fields")
async def get_tender_fields(tender_id: str):
    """
    Get available fields for a specific tender
    """
    if not collection:
        raise HTTPException(status_code=500, detail="Database connection not available")
    
    try:
        tender_data = collection.find_one({"Tender ID": tender_id})
        
        if not tender_data:
            raise HTTPException(status_code=404, detail=f"Tender with ID '{tender_id}' not found")
        
        # Remove MongoDB's _id field
        if '_id' in tender_data:
            del tender_data['_id']
        
        # Return field names and sample values
        fields = {}
        for key, value in tender_data.items():
            fields[key] = {
                "type": type(value).__name__,
                "sample_value": str(value)[:100] if value else None  # Truncate long values
            }
        
        return {
            "tender_id": tender_id,
            "total_fields": len(fields),
            "fields": fields
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch tender fields: {str(e)}")