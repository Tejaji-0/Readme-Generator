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
import time

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

# Step 1: Fast file selection with existing prompt
def agent_select_files(state):
    file_tree = get_file_tree()
    
    # Speed optimization: Limit files shown to LLM
    max_files_to_show = int(os.getenv('MAX_FILES_TO_SHOW', '50'))
    max_files_to_process = int(os.getenv('MAX_FILES_TO_PROCESS', '12'))
    
    # Pre-filter: Remove obviously unimportant files for speed
    filtered_tree = []
    for file_path in file_tree:
        file_lower = file_path.lower()
        # Skip files that are usually not important for README
        if not any(skip in file_lower for skip in [
            '.git/', 'node_modules/', '__pycache__/', '.venv/', 'venv/',
            '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
            '.css', '.scss', '.sass', '.less',
            'test/', 'tests/', '.test.', '.spec.',
            '.min.js', '.min.css', 'dist/', 'build/'
        ]):
            filtered_tree.append(file_path)
    
    # Limit the tree size for faster LLM processing
    display_tree = filtered_tree[:max_files_to_show]
    
    print(f"⚡ Fast selection: {len(file_tree)} → {len(filtered_tree)} → {len(display_tree)} files")
    
    # Use existing prompt
    prompt = select_files_prompt.format(file_tree="\n".join(display_tree))
    messages = [{"role": "user", "content": prompt}]
    
    # Reduced token limit for faster response
    raw = llm.make_request(messages, max_tokens=512)
    raw = raw.strip()

    # Parse selected files
    try:
        match = re.search(r'\[(.*?)\]', raw, re.DOTALL)
        if match:
            json_like = f"[{match.group(1)}]"
            selected_files = json.loads(json_like)
        else:
            selected_files = [line.strip().strip('"').strip(',') for line in raw.splitlines() if line.strip()]
    except Exception as e:
        print("⚠️ Parsing failed, using fallback selection", e)
        # Smart fallback for speed
        selected_files = display_tree[:max_files_to_process]

    # Limit final selection for speed
    final_selection = selected_files[:max_files_to_process]
    print(f"✅ Selected {len(final_selection)} files for processing")
    return {"selected_files": final_selection}

# Step 2: Ultra-fast bulk processing
def agent_summarize_files(state):
    selected_files = state["selected_files"]
    summaries = []
    
    # Speed settings
    files_per_request = int(os.getenv('FILES_PER_REQUEST', '6'))  # More files per call
    max_content_per_file = int(os.getenv('MAX_CONTENT_PER_FILE', '1200'))  # Smaller content
    
    print(f"🚀 Ultra-fast bulk processing: {len(selected_files)} files, {files_per_request} per request")
    
    # Process in bulk for maximum speed
    for i in range(0, len(selected_files), files_per_request):
        batch = selected_files[i:i + files_per_request]
        batch_num = (i // files_per_request) + 1
        total_batches = (len(selected_files) + files_per_request - 1) // files_per_request
        
        print(f"⚡ Batch {batch_num}/{total_batches}: {len(batch)} files")
        
        # Combine files for bulk processing
        bulk_content = []
        for filename in batch:
            try:
                content = read_file(filename)
                if content.strip():
                    # Aggressively truncate for speed
                    truncated = content[:max_content_per_file]
                    bulk_content.append(f"=== {filename} ===\n{truncated}")
                else:
                    bulk_content.append(f"=== {filename} ===\n(Empty file)")
            except Exception as e:
                bulk_content.append(f"=== {filename} ===\n(Read error: {str(e)[:100]})")
        
        # Create bulk prompt using existing summarize_prompt as template
        bulk_prompt = f"""Process these {len(batch)} files and provide a concise summary for each:

{chr(10).join(bulk_content)}

For each file, provide:
- What this file does
- Important functions, classes, or components
- How it fits into the application

Format as:
### filename1
[summary]

### filename2  
[summary]"""
        
        try:
            messages = [{"role": "user", "content": bulk_prompt}]
            # Increased tokens but still reasonable for speed
            bulk_response = llm.make_request(messages, max_tokens=1500)
            
            if bulk_response.strip():
                summaries.append(bulk_response)
                print(f"✅ Processed {len(batch)} files successfully")
            else:
                # Minimal fallback
                for filename in batch:
                    summaries.append(f"### {filename}\n(Processing skipped)")
                    
        except Exception as e:
            print(f"⚠️ Batch {batch_num} failed: {e}")
            # Quick fallback
            for filename in batch:
                summaries.append(f"### {filename}\n(Failed to process)")
    
    print(f"✅ Bulk processing complete: {total_batches} API calls total")
    return {"summaries": summaries}

# Step 3: Fast README generation (keep existing)
def agent_generate_readme(state):
    summaries = state["summaries"]

    # Speed optimization: Limit summaries
    max_summaries = int(os.getenv('MAX_SUMMARIES_FOR_README', '20'))
    limited_summaries = summaries[:max_summaries]

    joined = "\n\n".join(limited_summaries)

    # Use existing prompt
    prompt = generate_readme_prompt.format(summaries=joined)
    
    # Optimized token limit
    response = llm.make_request([{"role": "user", "content": prompt}], max_tokens=3500)
    
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
