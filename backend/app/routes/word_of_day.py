from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
import json
import random
from datetime import datetime

client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))
router = APIRouter()

class WordOfDayRequest(BaseModel):
    native_language: str = "English"

@router.post("/word-of-day/generate")
async def generate_word_of_day(data: WordOfDayRequest):
    try:
        today = datetime.now().strftime("%Y-%m-%d")
        random_seed = random.randint(1000, 9999)

        prompt = f"""You are an English vocabulary teacher creating a "Word of the Day" for newcomers to Canada learning English for work and daily life.

Today's date: {today}
Session ID: {random_seed} — pick a fresh, useful word different from common overused choices like "perseverance" or "resilient".

Pick ONE intermediate-to-advanced English word that is genuinely useful for:
- Workplace conversations
- Job interviews
- Daily life in Canada

Respond ONLY with valid JSON, no markdown, no extra text:
{{
  "word": "Example",
  "pronunciation": "/ɪɡˈzæmpəl/",
  "partOfSpeech": "noun",
  "meaning": "A clear, simple definition",
  "example": "A natural example sentence using the word",
  "synonyms": ["synonym1", "synonym2", "synonym3"],
  "tip": "A short practical tip on how/when to use this word"
}}"""

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400,
            temperature=1.1
        )

        response_text = completion.choices[0].message.content.strip()
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]
        response_text = response_text.strip()

        word_data = json.loads(response_text)
        word_data['date'] = today
        return word_data

    except Exception as e:
        print(f"Word of day error: {e}")
        return {
            "word": "Perseverance",
            "pronunciation": "/ˌpɜːrsɪˈvɪərəns/",
            "partOfSpeech": "noun",
            "meaning": "Continued effort to do something despite difficulty or failure",
            "example": "Her perseverance helped her learn English in just 6 months.",
            "synonyms": ["persistence", "determination", "resilience"],
            "tip": "Use this word in job interviews to describe your work ethic!",
            "date": datetime.now().strftime("%Y-%m-%d")
        }