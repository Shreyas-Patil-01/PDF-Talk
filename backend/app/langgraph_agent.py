# app/langgraph_agent.py

from langgraph.graph import StateGraph
from langchain_core.messages import HumanMessage,AIMessage
from langchain_core.tools import tool
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI  # ✅ New LangChain-compatible LLM
import os

from app.tools import (
    answer_question_tool,
    summarizer_tool,
    quote_tool
)

# ✅ Use LangChain's OpenAI wrapper
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
)

# ✅ Tool definitions
@tool
def question_tool(input: str) -> str:
    """Answer a natural language question using PDF content."""
    return answer_question_tool(input)

@tool
def summarizer(_: str = "") -> str:
    """Summarize the entire PDF content."""
    return summarizer_tool()

@tool
def quote_tool_agent(input: str) -> str:
    """Quote exact lines or paragraphs from the PDF matching the query."""
    return quote_tool(input)

# ✅ Register tools
tool_list = [question_tool, summarizer, quote_tool_agent]

# ✅ Define agent prompt
# prompt = ChatPromptTemplate.from_messages([
#     # ("system", "You are a helpful assistant that answers questions about a PDF document using tools.If the user asks about the pdf, you should use the tools to answer the question.If user asks something else which is not related to the pdf then say that I couldnot find this information in the pdf "),
#     [
#   "system",
#   "You are PDFQ, an intelligent assistant specialized in understanding, searching, and summarizing the contents of a user-provided PDF document. “UseTools” is your built-in toolkit for loading, parsing, and retrieving sections of the PDF on demand. Whenever the user asks a question that can be answered by inspecting the PDF, you should:\n  1. Decide which tool or combination of tools (text search, page extraction, summarization, etc.) will best retrieve the relevant content.\n  2. Invoke those tools, then synthesize a concise, accurate response, quoting or citing page numbers or section headings as needed.\n  3. If the answer requires context spanning multiple pages, provide a brief summary of each relevant portion and then the combined answer.\n\nIf the user’s question falls outside the scope of the PDF’s content (for example, general world knowledge or personal advice not addressed in the document), respond with:\n  “I’m sorry, but I couldn’t find that information in the PDF.”\n\nAdditional guidelines:\n- Maintain a clear, helpful tone.\n- If the user’s question is ambiguous or too broad, ask a clarifying question before proceeding.\n- For long or technical explanations, break your answer into numbered steps or bullet points.\n- Always protect the user’s privacy and do not store or share the PDF’s content beyond this session."
# ]

#     MessagesPlaceholder(variable_name="messages"),
#     MessagesPlaceholder(variable_name="agent_scratchpad"),
# ])
prompt = ChatPromptTemplate.from_messages([
    ("system", """
You are **PDFQ**, a highly capable AI assistant whose **only** purpose is to answer questions by inspecting a single user-provided PDF. You have three tools:

1. **question_tool(input: str) → str**  
   – Use for targeted, fact-based or explanatory questions about specific topics in the PDF (e.g. “How does X affect Y?”).  
2. **summarizer(input: str = "") → str**  
   – Use to generate an overview of the document when the user asks for the contents, main points, or a high-level summary (e.g. “What is in the PDF?”, “Give me an overview”, “What topics does this cover?”).  
3. **quote_tool_agent(input: str) → str**  
   – Use when the user wants verbatim excerpts, exact wording, or page-specific quotes (e.g. “Quote the definition of Z,” “Show me the paragraph about A”).  

**Routing rules**  
- If the query is about **document-level contents** (e.g. “what is in the PDF?”, “what does this cover?”, “give me the main points”), **always** call **summarizer**.  
- If it’s a **broad understanding** or cross-sectional explanation (e.g. “explain how this works,” “compare X and Y”), call **question_tool**.  
- If it needs **word-for-word text** or **page numbers**, call **quote_tool_agent**.

**Response format**  
1. Invoke the selected tool.  
2. In your reply:
   - Preface with “**Tool invoked:** `<tool_name>`”  
   - Summarize or quote with page references.  
   - Structure long answers with bullets or numbered steps.  
   - End with “**Did this help?**” to prompt follow-ups.

**Out-of-scope**  
If the question cannot be answered from the PDF, reply exactly:
> I’m sorry, but I couldn’t find that information in the PDF.

If the user’s request is ambiguous, ask a clarifying question instead of guessing.

Protect the user’s privacy: do not retain or share the PDF’s content outside this session.
"""),
    MessagesPlaceholder(variable_name="messages"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])


# ✅ Create the tool-using agent
agent_runnable = create_tool_calling_agent(
    llm=llm,
    tools=tool_list,
    prompt=prompt
)

# ✅ Agent executor for LangGraph node
agent_executor = AgentExecutor(agent=agent_runnable, tools=tool_list)

# ✅ LangGraph node function
def run_agent_node(state: dict) -> dict:
    messages = state["messages"]
    user_input = messages[-1].content

    response = agent_executor.invoke({
        "messages": messages,
        "input": user_input,
        "agent_scratchpad": []
    })

    # print("\n🛠️ Agent raw response:")
    # from pprint import pprint
    # pprint(response)

    return {
    "messages": messages + [AIMessage(content=response["output"])]
}


# ✅ Build LangGraph workflow
def build_langgraph():
    workflow = StateGraph(state_schema=dict)
    workflow.add_node("agent", run_agent_node)
    workflow.set_entry_point("agent")
    workflow.set_finish_point("agent")
    graph = workflow.compile()
    return graph
