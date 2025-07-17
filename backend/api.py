# api.py

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from langchain_core.messages import HumanMessage
import os
import shutil

from embeddings.pdf_parser import extract_text_from_pdf
from embeddings.embedder import get_embeddings
from embeddings.pinecone_manager import reset_index, upsert_text_chunks
from utils.chunker import chunk_text

from app.langgraph_agent import build_langgraph

app = FastAPI()

# Enable CORS for frontend (update origin in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://pdf-talk-assistant.vercel.app"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static folder (optional if you serve frontend from backend in prod)
app.mount("/data", StaticFiles(directory="data"), name="data")

# Build the LangGraph once
agent_graph = build_langgraph()

@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = f"data/{file.filename}"
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    text = extract_text_from_pdf(file_path)
    chunks = chunk_text(text)

    print(f"🧩 {len(chunks)} chunks created")

    embeddings = get_embeddings(chunks)
    print(f"🔗 {len(embeddings)} embeddings generated")

    if not embeddings:
        return {"status": "error", "message": "Embedding generation failed."}

    reset_index()
    upsert_text_chunks(chunks, embeddings)

    return {"status": "success", "message": "PDF uploaded and indexed successfully"}


@app.post("/chat/")
async def chat_api(message: str = Form(...)):
    try:
        result = agent_graph.invoke({"messages": [HumanMessage(content=message)]})
        response = result["messages"][-1].content
        return {"response": response}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
