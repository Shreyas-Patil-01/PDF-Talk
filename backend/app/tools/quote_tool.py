# app/tools/quote_tool.py

from embeddings.retriever import retrieve_relevant_chunks

def quote_tool(query: str) -> str:
    chunks = retrieve_relevant_chunks(query)
    quoted = "\n\n".join([f"> {chunk.strip()}" for chunk in chunks])
    return f"Here are quotes related to your query:\n\n{quoted}"
