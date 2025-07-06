import pandas as pd
from pymongo import MongoClient

# MongoDB connection
MONGO_URI = "mongodb+srv://anirudh:anirudh@cluster0.vdtqwjl.mongodb.net/?retryWrites=true&w=majority"
DB_NAME = "tender_system"
COLLECTION_NAME = "tenders"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Load Excel
df = pd.read_excel(r"D:\anni\Basic Tender Report(New).xlsx")

# Optional: Replace NaN with empty strings or None
for col in df.columns:
    if pd.api.types.is_datetime64_any_dtype(df[col]):
        df[col] = df[col].astype(str)

# Replace 'NaT' or 'nan' or 'NaN' strings with empty string
df = df.replace(["NaT", "NaN", "nan"], "")

# Convert NaN in any column (including non-date) to empty string
df = df.fillna("")

# Convert rows to dict and insert
records = df.to_dict(orient="records")

# Optional: Drop old entries to avoid duplicates (CAUTION!)
collection.delete_many({})  # Comment this if you want to keep old data

# Insert new records
result = collection.insert_many(records)
print(f"✅ Inserted {len(result.inserted_ids)} records into MongoDB.")
