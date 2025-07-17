# embeddings/retriever.py

import os
import pinecone
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

pc = pinecone.Pinecone()
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def embed_query(query: str) -> list[float]:
    response = client.embeddings.create(
        input=query,
        model="text-embedding-ada-002"
    )
    return response.data[0].embedding

def retrieve_relevant_chunks(query: str, top_k: int = 5) -> list[str]:
    query_embedding = embed_query(query)
    result = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    return [match['metadata']['text'] for match in result['matches']]
