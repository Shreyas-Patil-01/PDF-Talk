# PDF-Talk

PDF-Talk is an **open-source** project that lets you _talk_ to your PDF files through an AI-powered, chat-style interface—directly in your browser.

---

## ✨ Key Features

| Feature | What it does |
|---------|--------------|
| **AI-Powered PDF Query** | Ask natural-language questions about your PDF (e.g., “_What equations are introduced on page 5?_”) and get smart answers. |
| **Smart Summaries** | Generate concise summaries of whole documents or specific sections. |
| **Chat-like Interface** | Interact with your PDF as if you’re having a conversation. |
| **Modern Web UI** | Sleek, responsive frontend built with React & modern tooling. |
| **Modular Backend** | Clean, well-separated backend layers for PDF parsing and AI tasks. |

---

## AI Agents 
At the heart of PDF-Talk is an AI agent built using the LangGraph orchestration framework, which enables stateful, multi-step, and tool-augmented reasoning .
### Integrated Tools
The LangGraph agent in PDF-Talk incorporates key tools for working with document PDF content:
####Summarizer Tool: Utilizes LLM-driven summarization prompts and map-reduce workflows to distill content into short and accurate summaries for users57.

####Retrieval Tool: Employs semantic search and retrieval-augmented generation (RAG) techniques, allowing the agent to fetch the most relevant document snippets for a user's query. Can handle long and complex documents robustly8.

####Quoting Tool: Scans the document to find and present direct quotations, always referencing the original page or section.

| Node               | Purpose                                                                           |
|--------------------|-----------------------------------------------------------------------------------|
| **Router Node**    | Classifies each user utterance and dispatches it to the appropriate downstream tool(s). |
| **SummarizerTool** | Generates abstractive summaries of arbitrary spans (pages, sections, whole doc).  |
| **RetrievalTool**  | Performs semantic search over vector-indexed PDF chunks to surface relevant passages. |
| **QuotingTool**    | Extracts direct quotes with page/line metadata so answers can cite the source.     |
| **Response Synth** | Combines tool outputs using an LLM to craft a final, context-aware answer.         |

```mermaid
graph TD
    A(User Message) --> B{Router}
    B -->|query| C(RetrievalTool)
    B -->|summarize| D(SummarizerTool)
    B -->|quote| E(QuotingTool)
    C --> F(Response Synth)
    D --> F
    E --> F
    F --> G(Agent Reply)
