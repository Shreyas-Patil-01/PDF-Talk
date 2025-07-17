# utils/chunker.py

import tiktoken

def chunk_text(text: str, max_tokens: int = 800, overlap: int = 100) -> list[str]:
    encoding = tiktoken.get_encoding("cl100k_base")
    tokens = encoding.encode(text)

    chunks = []
    start = 0
    while start < len(tokens):
        end = start + max_tokens
        chunk_tokens = tokens[start:end]
        chunk = encoding.decode(chunk_tokens)
        chunks.append(chunk)
        start += max_tokens - overlap  # move with overlap
    return chunks
