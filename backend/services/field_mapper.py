from sentence_transformers import SentenceTransformer, util
import numpy as np

# Load once (lightweight model)
model = SentenceTransformer('all-MiniLM-L6-v2')


def map_fields_by_embedding(gemini_fields: list, backend_fields: list, backend_data: dict, threshold: float = 0.5):
    """
    Maps Gemini schema fields to backend data fields using embedding similarity.

    Parameters:
    - gemini_fields: List of field dicts from Gemini schema
    - backend_fields: List of backend keys (from MongoDB/document)
    - backend_data: Full backend dict (one tender document)
    - threshold: Minimum similarity required to map

    Returns: dict with mapped values
    """
    mapped_data = {}

    # Embed backend fields
    backend_embeddings = model.encode(backend_fields, convert_to_tensor=True)

    for field in gemini_fields:
        field_id = field['id']
        label = field.get('label', field_id)

        # Embed Gemini label/id
        query_embedding = model.encode(label, convert_to_tensor=True)

        # Compute cosine similarities
        cosine_scores = util.cos_sim(query_embedding, backend_embeddings)[0].cpu().numpy()
        max_score_idx = np.argmax(cosine_scores)
        max_score = cosine_scores[max_score_idx]

        if max_score >= threshold:
            matched_backend_field = backend_fields[max_score_idx]
            mapped_data[field_id] = backend_data.get(matched_backend_field, "")
            print(f"✅ {label} -> {matched_backend_field} (score: {max_score:.2f})")
        else:
            mapped_data[field_id] = ""  # leave empty if no good match
            print(f"⚠️ No good match for {label} (max score: {max_score:.2f})")

    return mapped_data
