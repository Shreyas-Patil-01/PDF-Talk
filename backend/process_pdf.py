# process_pdf.py

from embeddings.pdf_parser import extract_text_from_pdf
from embeddings.embedder import get_embeddings
from embeddings.pinecone_manager import reset_index, upsert_text_chunks
from utils.chunker import chunk_text

import sys

def process_pdf(pdf_path: str):
    print("📄 Extracting text...")
    text = extract_text_from_pdf(pdf_path)

    print("🔪 Chunking text...")
    chunks = chunk_text(text)

    print(f"📏 {len(chunks)} chunks created.")

    print("🧠 Generating embeddings...")
    for i, chunk in enumerate(chunks):
        print(f"\n--- Chunk {i} ({len(chunk)} chars) ---\n{chunk[:200]}...")
        
    embeddings = get_embeddings(chunks)

    print("🧹 Resetting Pinecone index...")
    reset_index()

    print("📤 Uploading to Pinecone...")
    upsert_text_chunks(chunks, embeddings)

    print("✅ PDF processed and indexed successfully.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python process_pdf.py path/to/your.pdf")
    else:
        process_pdf(sys.argv[1])
