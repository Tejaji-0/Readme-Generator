import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash")

def summarize_code(code, filename):
    prompt = f"Summarize the following code from file: {filename}. Keep it professional and accurate.\n\n{code}"
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"[Error summarizing {filename}]: {e}"
