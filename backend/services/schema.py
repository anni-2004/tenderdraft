import json
from backend.services.template_parser import extract_schema_from_docx

def load_template_schema(template_path="Refundable Deposit Refund Request Letters- EMD.docx"):
    """
    Extracts schema from the given DOCX template file.
    Should be called after Gemini is properly configured.
    """
    template = extract_schema_from_docx(template_path)
    if template:
        print("✅ Template schema loaded:")
        print(json.dumps(template, indent=2))
    else:
        print("❌ Failed to load template schema.")
    return template
