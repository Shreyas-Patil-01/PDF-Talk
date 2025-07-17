# embeddings/pinecone_manager.py

import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from uuid import uuid4

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
PINECONE_REGION = os.getenv("PINECONE_REGION", "us-east-1")  # Optional default

pc = Pinecone(api_key=PINECONE_API_KEY)


def reset_index():
    # Delete index if exists
    existing_indexes = [index.name for index in pc.list_indexes()]
    if PINECONE_INDEX_NAME in existing_indexes:
        pc.delete_index(PINECONE_INDEX_NAME)

    # Create new index
    pc.create_index(
        name=PINECONE_INDEX_NAME,
        dimension=1536,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region=PINECONE_REGION)
    )


def upsert_text_chunks(chunks: list[str], embeddings: list[list[float]]):
    index = pc.Index(PINECONE_INDEX_NAME)
    items = [
        {
            "id": str(uuid4()),
            "values": embedding,
            "metadata": {"text": chunk}
        }
        for chunk, embedding in zip(chunks, embeddings)
    ]
    index.upsert(vectors=items)
