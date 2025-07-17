from app.langgraph_agent import build_langgraph
from langchain_core.messages import HumanMessage

if __name__ == "__main__":
    agent_graph = build_langgraph()

    while True:
        query = input("\nAsk your question (or type 'exit'): ")
        if query.lower() == "exit":
            break

        result = agent_graph.invoke({"messages": [HumanMessage(content=query)]})
        print("\n🤖:", result["messages"][-1].content)
