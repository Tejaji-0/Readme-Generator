from langgraph.graph import StateGraph
from langchain.schema import HumanMessage
from tools import get_file_tree, read_file, set_repo_path
from prompts import select_files_prompt, summarize_prompt, generate_readme_prompt
from dotenv import load_dotenv
from typing import TypedDict, List
import os
import re
import json
import sys

# Load .env variables
load_dotenv()

# ✅ Import fallback LLM manager
from llm_fallback import LLMFallbackManager

# Initialize fallback-based LLM
llm = LLMFallbackManager()

# Graph state structure
class GraphState(TypedDict):
    selected_files: List[str]
    summaries: List[str]
    readme: str

# Step 1: Select important files
def agent_select_files(state):
    file_tree = get_file_tree()
    prompt = select_files_prompt.format(file_tree="\n".join(file_tree))
    messages = [{"role": "user", "content": prompt}]
    raw = llm.make_request(messages, max_tokens=1024)
    raw = raw.strip()

    # Try extracting JSON array from the response
    try:
        match = re.search(r'\[(.*?)\]', raw, re.DOTALL)
        if match:
            json_like = f"[{match.group(1)}]"
            selected_files = json.loads(json_like)
        else:
            selected_files = [line.strip().strip('"').strip(',') for line in raw.splitlines() if line.strip()]
    except Exception as e:
        print("⚠️ Error parsing selected files, fallback to line-splitting", e)
        selected_files = [line.strip().strip('"').strip(',') for line in raw.splitlines() if line.strip()]

    print("✅ Cleaned selected files:", selected_files)
    return {"selected_files": selected_files}

# Step 2: Summarize selected files
def agent_summarize_files(state):
    summaries = []
    for filename in state["selected_files"]:
        content = read_file(filename)
        print(f"📄 Reading file: {filename}")
        print("🔍 Content preview:", content[:200])

        if not content.strip():
            summaries.append(f"### {filename}\n(No content found)")
            continue

        prompt = summarize_prompt.format(filename=filename, content=content[:3000])
        messages = [{"role": "user", "content": prompt}]
        summary = llm.make_request(messages, max_tokens=1024)
        summaries.append(f"### {filename}\n{summary}")
    return {"summaries": summaries}

# Step 3: Generate README
def agent_generate_readme(state):
    summaries = state["summaries"]

    # LIMIT the number of summaries to avoid exceeding token limits
    # You can experiment with this number
    max_summaries = 15  
    limited_summaries = summaries[:max_summaries]

    joined = "\n\n".join(limited_summaries)

    prompt = generate_readme_prompt.format(
        summaries=joined,
        instruction="Based on the following file summaries, generate a clean and concise README.md that explains the project as a whole. Do not describe each file individually. Instead, explain the purpose of the project, its core features, setup instructions, and any important dependencies or configurations."
    )

    response = llm.make_request([{"role": "user", "content": prompt}], max_tokens=4096)
    
    return {"readme": response}


# Build LangGraph graph
def run_agent(repo_path):
    set_repo_path(repo_path)

    builder = StateGraph(GraphState)
    builder.add_node("select_files", agent_select_files)
    builder.add_node("summarize", agent_summarize_files)
    builder.add_node("generate_readme", agent_generate_readme)

    builder.set_entry_point("select_files")
    builder.add_edge("select_files", "summarize")
    builder.add_edge("summarize", "generate_readme")
    builder.set_finish_point("generate_readme")

    graph = builder.compile()
    output = graph.invoke({})
    readme = output["readme"]
    write_readme_to_file(readme, root_dir=repo_path)
    return readme

# Save README to file
def write_readme_to_file(content, root_dir="temp"):
    path = os.path.join(root_dir, "README.md")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ README.md written to {path}")

# Local test
if __name__ == "__main__":
    repo_path = sys.argv[1]
    result = run_agent(repo_path)
    print(result)
