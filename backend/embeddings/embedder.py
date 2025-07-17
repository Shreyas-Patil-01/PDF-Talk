# embeddings/embedder.py

import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
EMBED_MODEL = "text-embedding-ada-002"

def get_embeddings(texts: list[str]) -> list[list[float]]:
    # Filter invalid or empty chunks
    valid_texts = [text for text in texts if text.strip() and len(text) < 3000]  # ~3000 characters ~ 1000-1500 tokens

    if not valid_texts:
        raise ValueError("No valid chunks to embed. Check your PDF or chunking logic.")

    response = client.embeddings.create(
        input=valid_texts,
        model=EMBED_MODEL
    )
    return [item.embedding for item in response.data]
