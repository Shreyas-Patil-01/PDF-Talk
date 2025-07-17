# app/tools/question_tool.py

from embeddings.retriever import retrieve_relevant_chunks
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def answer_question_tool(input: str) -> str:
    context = retrieve_relevant_chunks(input)
    prompt = f"""Answer the question based on the following context:\n\n{''.join(context)}\n\nQuestion: {input}"""
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return completion.choices[0].message.content
