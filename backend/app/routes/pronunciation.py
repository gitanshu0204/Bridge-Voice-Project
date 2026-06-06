from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))
router = APIRouter()

class PronunciationRequest(BaseModel):
    target: str
    spoken: str
    score: int
    wrong_words: list

@router.post("/pronunciation-feedback")
async def pronunciation_feedback(data: PronunciationRequest):
    try:
        prompt = f"""You are a friendly English pronunciation coach.

The student was asked to say: "{data.target}"
They actually said: "{data.spoken}"
Their pronunciation score: {data.score}%
Words they mispronounced: {', '.join(data.wrong_words) if data.wrong_words else 'None'}

Give helpful, encouraging feedback in 2-3 sentences.
Then provide exactly 3 specific tips to improve their pronunciation.

Respond in this exact JSON format:
{{
  "feedback": "your encouraging feedback here",
  "tips": ["tip 1", "tip 2", "tip 3"]
}}"""

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300
        )

        import json
        response_text = completion.choices[0].message.content
        result = json.loads(response_text)
        return result

    except Exception as e:
        print(f"Pronunciation feedback error: {e}")
        return {
            "feedback": "Good effort! Keep practicing your pronunciation every day.",
            "tips": [
                "Listen to the correct pronunciation first before speaking",
                "Practice slowly then gradually speed up",
                "Record yourself and compare with the original"
            ]
        }