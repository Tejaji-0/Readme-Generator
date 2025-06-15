'''
✅ Step-by-Step Flow:
Accept path of the cloned repo (e.g., /temp/abcd1234/).

Walk through the directory recursively.

Select important files (.js, .ts, .jsx, .py, .json, etc.).

For each file, summarize it using a selected LLM (like Gemini or Groq).

Combine all summaries into a single big summary.

Send it back to Node.js (stdout or file system).
'''


import sys
from utils.file_reader import get_code_files
from llm_clients.gemini_client import summarize_code
import os

def main(repo_path):
    code_files = get_code_files(repo_path)
    combined_summary = ""

    for path in code_files:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            code = f.read()
        summary = summarize_code(code, path)
        combined_summary += f"\n### {path}:\n{summary}\n"

    # Save to file (or print if you want to pass back to Node)
    with open(os.path.join(repo_path, "summary.txt"), "w") as f:
        f.write(combined_summary)

if __name__ == "__main__":
    main(sys.argv[1])
