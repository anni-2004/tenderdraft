import os
import uuid
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse, JSONResponse
from backend.services.template_parser import extract_schema_from_docx
from backend.services.doc_generator import generate_docx_from_template

router = APIRouter()

TEMPLATE_DIR = "backend/storage/templates"
OUTPUT_DIR = "backend/storage/output"

os.makedirs(TEMPLATE_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


@router.post("/upload-template/")
async def upload_template(file: UploadFile = File(...)):
    file_ext = file.filename.split(".")[-1]
    if file_ext != "docx":
        return JSONResponse(status_code=400, content={"error": "Only .docx files allowed"})

    template_id = str(uuid.uuid4())
    saved_path = os.path.join(TEMPLATE_DIR, f"{template_id}.docx")

    with open(saved_path, "wb") as f:
        content = await file.read()
        f.write(content)

    schema = extract_schema_from_docx(saved_path)
    if not schema:
        return JSONResponse(status_code=500, content={"error": "Failed to parse schema from template."})

    return {"templateId": template_id, "schema": schema}


@router.post("/generate-document/")
async def generate_document(
    templateId: str = Form(...),
    mappedData: str = Form(...)
):
    try:
        mapped_data = eval(mappedData)  # 👈 Convert string dict to Python dict
        template_path = os.path.join(TEMPLATE_DIR, f"{templateId}.docx")

        schema = extract_schema_from_docx(template_path)
        template_string = schema["templateString"]

        output_path = os.path.join(OUTPUT_DIR, f"{templateId}_final.docx")
        generate_docx_from_template(template_string, mapped_data, output_path)

        return FileResponse(output_path, filename="Generated_Document.docx", media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Document generation failed: {str(e)}"})
