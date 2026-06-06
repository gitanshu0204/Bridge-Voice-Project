from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))
router = APIRouter()

class PhrasePracticeRequest(BaseModel):
    phrase: str
    meaning: str
    user_response: str = ""
    native_language: str = "English"
    action: str = "explain"

@router.post("/phrase-practice")
async def phrase_practice(data: PhrasePracticeRequest):
    try:
        if data.action == "explain":
            prompt = f"""You are a friendly English language coach.

Explain this English phrase to a language learner:
Phrase: "{data.phrase}"
Meaning: "{data.meaning}"
User's native language: {data.native_language}

Provide:
1. A simple explanation in plain English
2. 2 natural example sentences showing different contexts
3. Common mistakes to avoid
4. A similar phrase they can also use

Keep it friendly, encouraging and easy to understand.
Format your response clearly with sections."""

        elif data.action == "practice":
            prompt = f"""You are a friendly English language coach running a quick practice exercise.

The student is practicing this phrase: "{data.phrase}" (meaning: {data.meaning})

Ask them to use this phrase in a sentence about one of these topics:
- Their job or workplace
- A conversation with a friend
- A daily life situation

Ask ONE specific practice question. Keep it short and encouraging."""

        elif data.action == "check":
            prompt = f"""You are a friendly English language coach.

The student is practicing using: "{data.phrase}" (meaning: {data.meaning})

Their response: "{data.user_response}"

Check if they used the phrase correctly and naturally.
Give:
1. Score out of 10
2. Whether they used it correctly (yes/no with explanation)
3. An improved version if needed
4. Encouragement

Keep feedback short, friendly and specific."""

        elif data.action == "translate":
            prompt = f"""Explain this English phrase in {data.native_language}:

Phrase: "{data.phrase}"
Meaning: "{data.meaning}"

Give:
1. Translation/explanation in {data.native_language}
2. When to use it
3. One example in English with {data.native_language} translation

Keep it simple and clear."""

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400
        )

        return {"response": completion.choices[0].message.content}

    except Exception as e:
        print(f"Phrase practice error: {e}")
        return {"response": "I'm having trouble right now. Please try again!"}