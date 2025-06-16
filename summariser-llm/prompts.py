# Prompt to help LLM choose important files from the list
select_files_prompt = """
You are an experienced software engineer performing static analysis on a codebase to generate a high-level understanding of the application's structure and logic.

Below is the file tree of the entire project:
{file_tree}

From this list, identify and return only the most relevant files that are essential for understanding:
- The main functionality
- Application flow
- Configuration
- Routing (if any)
- Core business logic
- Key utilities or helpers

Avoid test files, style files (CSS, SCSS), images.

💡 Output Format (strictly):
"Only return the list of filenames as a clean JSON array of strings. No markdown formatting, no explanation. Example: ["index.html", "script.js"]"
"""

# Prompt to generate summary from a file
summarize_prompt = """
You are an AI assistant helping developers document codebases.

Your task is to summarize the purpose and functionality of the following file in clear and concise technical language. Focus on:
- What this file does
- Any important functions, classes, or components defined
- How it fits into the larger application

Filename: {filename}

File Content:
{content}

🔍 Notes:
- Mention important libraries used, if applicable.
- Highlight API routes, handlers, utility logic, etc., based on file type.
- Ignore internal implementation details unless necessary to understand functionality.

🎯 Output:
Return a short but descriptive paragraph or bullet summary. Use a professional tone.

"""

# Prompt to merge all summaries into a README
generate_readme_prompt = """
You are an AI technical writer. Based on the provided summaries of important files from a codebase, generate a professional-quality `README.md` file for the repository.

🧠 Your README should:
- Provide a high-level overview of the project
- Explain the core features and functionality
- In the Project Structure section, display the folder structure in a visual tree-like format (using markdown code block and indents), rather than describing each file in text.
- include basic setup instructions, if evident

💼 Style Guide:
- Use markdown formatting (`##`, `-`, code blocks)
- Maintain a professional and developer-friendly tone
- Begin with a concise project description
- Keep it structured and readable

📄 Input: Summaries of key files
{summaries}

✏️ Output: A complete end to end `README.md` file don't leave the markdown formatting in between the sections. generate the file in one go.

"""
