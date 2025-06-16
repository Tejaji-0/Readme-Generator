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

## File Summaries
-   **next.config.ts**: Primary configuration file for the Next.js application, allowing customization of build-time and runtime settings.
-   **app/page.tsx**: Defines the main landing page, rendering `HeroSection`, `DemoSection`, `HowItWorks`, and `CTA` components.
-   **app/layout.tsx**: Defines the root layout, setting up basic HTML structure, configuring fonts, defining global metadata (title, description), rendering `<Header>` and `<Footer>` components and setting the background styles.
-   **app/api/generate-readme/route.ts**: Defines an API route for generating a README file summary, cloning a GitHub repository, and executing a Python script for summarization.
-   **app/api/lib/clone-repo.ts**: Defines a utility function, `cloneRepo`, to clone Git repositories using the `simple-git` library.
-   **summariser-llm/requirements.txt**: Specifies Python package dependencies like `langgraph`, `langchain`, and `google-generativeai`.
-   **summariser-llm/tools.py**: Provides utility functions for interacting with the local file system, including setting the repository path, getting the file tree, and reading file contents.
-   **summariser-llm/prompts.py**: Defines prompt templates for the LLM, including prompts for selecting important files, summarizing files, and generating the README.
-   **summariser-llm/agents.py**: Defines an agent that orchestrates the process of generating a `README.md` file using the Gemini language model, including file selection, summarization, and README generation.
-   **lib/utils.ts**: Defines a utility function `cn` for simplifying conditional class name management in React components using `clsx` and `tailwind-merge`.
-   **components/common/footer.tsx**: Defines the `Footer` component, including a copyright notice and links to social media profiles.
-   **components/common/Header.tsx**: Defines the `Header` component, providing navigation with a logo and a link to the developer's GitHub profile.
