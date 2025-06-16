# Readme.ai

Readme.ai is a tool that automatically generates `README.md` files for your code repositories using Large Language Models. It analyzes your codebase, identifies key files, summarizes their functionality, and then creates a comprehensive and informative README file.

## Core Features

-   **Automated README Generation:**  Automatically creates a `README.md` file based on codebase analysis.
-   **Codebase Summarization:**  Analyzes and summarizes the purpose and functionality of important files.
-   **Intelligent File Selection:** Identifies the most relevant files for summarization, focusing on core logic and functionality.
-   **Clear and Concise Output:** Generates a well-structured `README.md` with a project overview, feature explanations, and setup instructions.

## Project Structure

```
.
├── app
│   ├── api
│   │   └── generate-readme
│   │       └── route.ts
│   │   └── lib
│   │       ├── clone-repo.ts
│   │       └── make-dir.ts (Assumed file, used in api/generate-readme/route.ts)
│   ├── layout.tsx
│   └── page.tsx
├── components
│   └── common
│       ├── Footer.tsx
│       └── Header.tsx
├── lib
│   └── utils.ts
├── next.config.ts
└── summariser-llm
    ├── agents.py
    ├── prompts.py
    ├── requirements.txt
    └── tools.py
```

## Setup Instructions

1.  **Install Dependencies:**
    Navigate to the summariser-llm directory:

    ```bash
    cd summariser-llm
    ```

    Then, install the Python dependencies using pip:

    ```bash
    pip install -r requirements.txt
    ```

2.  **Configure Environment Variables:**
    Create a `.env` file in the root directory of the project. Add your Gemini API key:

    ```
    GOOGLE_API_KEY=YOUR_GEMINI_API_KEY
    ```

    **Note:** Ensure you have a Google Cloud project set up and the Gemini API enabled.

3.  **Run the Next.js application:**

    ```bash
    npm install # or yarn install or pnpm install
    npm run dev
    ```
