# app/tools/summarizer_tool.py

from embeddings.retriever import retrieve_relevant_chunks
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarizer_tool(_: str = "") -> str:
    # Summarize entire document by retrieving top chunks
    chunks = retrieve_relevant_chunks("Summarize the document", top_k=10)
    prompt = f"""Summarize the following document content:\n\n{''.join(chunks)}"""
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return completion.choices[0].message.content
