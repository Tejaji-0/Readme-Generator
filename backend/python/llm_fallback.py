import os
import time
import random
import json
import re
from typing import List
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

API_KEYS = [
    os.getenv("GROQ_API_KEY"),
    os.getenv("GROQ_API_KEY_2"),
    os.getenv("GROQ_API_KEY_3"),
    os.getenv("GROQ_API_KEY_4"),
    os.getenv("GROQ_API_KEY_5"),
]

API_KEYS = [key for key in API_KEYS if key]

FALLBACK_MODELS = [
    "deepseek-r1-distill-llama-70b",
    "llama-3.3-70b-versatile",
    "deepseek-r1-distill-llama-70b",
    "llama-3.3-70b-versatile",
]

class LLMFallbackManager:
    def __init__(self):
        if not API_KEYS:
            raise Exception("No GROQ API keys found in environment.")
        self.api_keys = API_KEYS
        self.models = FALLBACK_MODELS
        self.key_index = 0
        self.model_index = 0
        self.cooldowns = {}  # Key: timestamp when key becomes available

    def _current_time(self):
        return time.time()

    def _key_available(self, index):
        key = self.api_keys[index]
        return self.cooldowns.get(key, 0) <= self._current_time()

    def _rotate_key(self):
        original = self.key_index
        while True:
            self.key_index = (self.key_index + 1) % len(self.api_keys)
            if self._key_available(self.key_index) or self.key_index == original:
                break
        print(f"🔁 Switched to API key #{self.key_index + 1}")

    def _rotate_model(self):
        self.model_index = (self.model_index + 1) % len(self.models)
        print(f"🔁 Switched to model: {self.models[self.model_index]}")

    def _mark_key_on_cooldown(self, seconds=60):
        key = self.api_keys[self.key_index]
        self.cooldowns[key] = self._current_time() + seconds
        print(f"⏳ Key #{self.key_index + 1} on cooldown for {seconds}s")

    def get_client(self):
        return Groq(api_key=self.api_keys[self.key_index])

    def get_model(self):
        return self.models[self.model_index]

    def make_request(self, messages, max_tokens=2048, temperature=0.2, max_retries=15):
        last_error = None
        for attempt in range(max_retries):
            try:
                client = self.get_client()
                model = self.get_model()
                print(f"⚙️ Attempt {attempt + 1}: Key #{self.key_index + 1}, Model: {model}")

                response = client.chat.completions.create(
                    model=model,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_tokens
                )
                content = response.choices[0].message.content
                print(f"✅ Success. Tokens used: {response.usage.total_tokens}")
                return content

            except Exception as e:
                last_error = e
                err_str = str(e).lower()
                print(f"[RETRY] {str(e).splitlines()[0]}")

                if "rate limit" in err_str or "too many requests" in err_str:
                    self._mark_key_on_cooldown(seconds=60)
                    self._rotate_key()

                elif "token" in err_str or "context" in err_str:
                    self._rotate_model()

                elif "quota" in err_str or "billing" in err_str:
                    self._mark_key_on_cooldown(seconds=600)
                    self._rotate_key()

                elif "model" in err_str or "not available" in err_str:
                    self._rotate_model()

                else:
                    self._rotate_key()

                delay = min(2 ** attempt + random.uniform(0, 1), 10)
                print(f"⏳ Retrying after {delay:.1f}s...")
                time.sleep(delay)

        print("💥 All retries failed.")
        raise Exception(f"LLM call failed after {max_retries} attempts. Last error: {last_error}")
