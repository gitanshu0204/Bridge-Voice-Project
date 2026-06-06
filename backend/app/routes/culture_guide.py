from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))
router = APIRouter()

class CultureGuideRequest(BaseModel):
    topic: str
    content: str
    action: str
    native_language: str = "English"
    question: str = ""

@router.post("/culture-guide")
async def culture_guide(data: CultureGuideRequest):
    try:
        if data.action == "explain":
            prompt = f"""You are a friendly Canadian culture expert helping newcomers.

Topic: "{data.topic}"
Content: "{data.content}"

Explain this topic in very simple English (3-4 sentences).
Use simple words. Give 1-2 practical examples.
Be encouraging and friendly!"""

        elif data.action == "translate":
            prompt = f"""You are a friendly Canadian culture expert.

Topic: "{data.topic}"
Content: "{data.content}"
User's native language: {data.native_language}

Explain this Canadian culture topic in {data.native_language}.
Make it easy to understand for someone from that culture.
Keep it practical and friendly!"""

        elif data.action == "compare":
            prompt = f"""You are a friendly Canadian culture expert helping newcomers from {data.native_language} speaking countries.

Topic: "{data.topic}"
Content: "{data.content}"

Compare this Canadian cultural practice with what is common in countries where {data.native_language} is spoken.
Highlight the key differences and similarities.
Help the person understand what to expect and how to adapt.
Be respectful of both cultures. Keep it to 4-5 sentences."""

        else:
            prompt = f"""You are a friendly Canadian culture expert helping newcomers.

Topic: "{data.topic}"
Background info: "{data.content}"
User's question: "{data.question}"
User's native language: {data.native_language}

Answer their specific question about Canadian culture.
Be helpful, practical and encouraging.
Keep your answer concise and easy to understand."""

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300
        )

        return {"response": completion.choices[0].message.content}

    except Exception as e:
        print(f"Culture guide error: {e}")
        return {"response": "I'm having trouble right now. Please try again!"}