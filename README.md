# 🧠 README Generator Project
This project aims to create a comprehensive and detailed README file for a given software project, providing developers with a complete understanding of the project's features, setup instructions, and technical details.

## 🚀 Features
- **Automated README Generation**: Generates a detailed README file based on the project's code structure and files.
- **Customizable Templates**: Allows for customization of the README template to fit the project's specific needs.
- **Technical Detailing**: Provides in-depth technical details about the project, including dependencies, setup instructions, and feature descriptions.
- **Code Analysis**: Analyzes the project's code to extract relevant information and generate the README content.

## 📸 Screenshots
<img width="1436" alt="Screenshot 2025-06-24 at 6 08 38 PM" src="https://github.com/user-attachments/assets/665aade1-33a9-4554-b064-3b6df7b55005" />
<img width="1436" alt="Screenshot 2025-06-24 at 6 08 38 PM" src="https://github.com/user-attachments/assets/3835bff7-2cc4-44f5-bb3e-0004e899d2dc" />

## 🛠️ Tech Stack
- **Frontend**:
  - Next.js
  - React
  - Tailwind CSS
  - tailwind-merge
- **Backend**:
  - Express.js
  - Python (for LLM interactions)
  - TypeScript
  - Langchain
  - Groq
- **Dependencies**:
  - Node.js
  - npm
  - Python
  - pip

## 📦 Installation
1. **Prerequisites**: Ensure you have Node.js, npm, Python, and pip installed on your system.
2. **Clone the Repository**: Clone the project repository using `git clone`.
3. **Install Dependencies**: Run `npm install` in the frontend directory and `pip install -r requirements.txt` in the backend directory.
4. **Setup Environment Variables**: Set the necessary environment variables, such as `NEXT_PUBLIC_BACKEND_URL`.

## 💻 Usage
1. **Start the Frontend**: Run `npm run dev` in the frontend directory.
2. **Start the Backend**: Run `npm run dev` in the backend directory.
3. **Generate README**: Use the project's API to generate a README file for a given software project.

## 📂 Project Structure
```markdown
project/
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   │   ├── readme.ts
│   │   ├── utils/
│   │   │   ├── clone-repo.ts
│   │   │   ├── make-dir.ts
│   │   ├── python/
│   │   │   ├── agents.py
│   │   │   ├── llm_fallback.py
│   │   │   ├── tools.py
│   │   │   ├── prompts.py
│   ├── package.json
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── config.ts
│   ├── package.json
├── README.md
```


## 🤝 Contributing
Contributions are welcome! Please submit a pull request with your changes and a brief description of what you've added or fixed.

## 📝 License
This project is licensed under the MIT License.

## 📬 Contact
For questions or concerns, please contact us at [lakshit7811@gmail.com](mailto:lakshit7811@gmail.com).

## 💖 Thanks Message
This is written by readme.ai - Your AI-powered README generator.
