from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
import json
import random

client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))
router = APIRouter()

class QuizRequest(BaseModel):
    level: int
    level_title: str
    native_language: str = "English"
    weak_areas: list = []
    previous_wrong: list = []

class ExplainRequest(BaseModel):
    word: str
    correct_answer: str
    user_answer: str
    native_language: str = "English"

@router.post("/quiz/generate")
async def generate_quiz(data: QuizRequest):
    try:
        weak_areas_text = f"Focus on these weak areas: {', '.join(data.weak_areas)}" if data.weak_areas else ""
        previous_wrong_text = f"Avoid these words already tested: {', '.join(data.previous_wrong)}" if data.previous_wrong else ""

        random_seed = random.randint(1000, 9999)

        prompt = f"""You are an English vocabulary quiz generator for language learners.

Generate exactly 10 DIFFERENT vocabulary questions for:
- Level: {data.level_title} (Level {data.level}/5)
- Student's native language: {data.native_language}
- {weak_areas_text}
- {previous_wrong_text}

Session ID: {random_seed} — use this to pick a fresh, varied set of words different from typical/common examples for this level. Avoid always picking the most obvious "textbook" words for this level — mix in less common but still level-appropriate vocabulary.

Level guidelines:
- Level 1 (Beginner): Simple everyday words like happy, tired, busy
- Level 2 (Elementary): Common workplace words like punctual, reliable, motivated
- Level 3 (Intermediate): Professional words like collaborate, integrity, resilient
- Level 4 (Advanced): Complex words like paradigm, eloquent, meticulous
- Level 5 (Expert): Advanced academic words like juxtapose, ubiquitous, perspicacious

For {data.native_language} speakers, focus on words they commonly struggle with.

Respond ONLY with a valid JSON array, no other text:
[
  {{
    "word": "Example",
    "correct": "The correct definition",
    "options": [
      "The correct definition",
      "Wrong option 1",
      "Wrong option 2", 
      "Wrong option 3"
    ]
  }}
]

Make sure:
- All 4 options are plausible but only one is correct
- Options are shuffled randomly
- Words match the difficulty level exactly
- Wrong options are related but clearly different"""

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000,
            temperature=1.1
        )

        response_text = completion.choices[0].message.content.strip()
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]
        response_text = response_text.strip()

        questions = json.loads(response_text)
        return {"questions": questions[:10], "ai_generated": True}

    except Exception as e:
        print(f"Quiz generation error: {e}")
        return {"questions": [], "ai_generated": False, "error": str(e)}

@router.post("/quiz/explain")
async def explain_answer(data: ExplainRequest):
    try:
        prompt = f"""You are a friendly English vocabulary coach.

The student got this question wrong:
Word: "{data.word}"
Correct answer: "{data.correct_answer}"
Student answered: "{data.user_answer}"
Student's native language: {data.native_language}

Give a short, friendly explanation (3-4 sentences max):
1. Why the correct answer is right
2. A memory tip to remember this word
3. An example sentence using the word
4. Any connection to their native language if helpful

Keep it encouraging and easy to understand!"""

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )

        return {"explanation": completion.choices[0].message.content}

    except Exception as e:
        print(f"Explain error: {e}")
        return {"explanation": "Keep practicing! Every mistake is a learning opportunity. 💪"}