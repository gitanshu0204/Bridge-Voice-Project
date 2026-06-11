from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
import json

client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))
router = APIRouter()

class PronunciationFeedbackRequest(BaseModel):
    target: str
    spoken: str
    score: int
    wrong_words: list
    native_language: str = "English"

class GenerateLevelRequest(BaseModel):
    level: str
    native_language: str = "English"

@router.post("/pronunciation-feedback")
async def pronunciation_feedback(data: PronunciationFeedbackRequest):
    try:
        prompt = f"""You are a friendly English pronunciation coach.

The student's native language is: {data.native_language}
They were asked to say: "{data.target}"
They actually said: "{data.spoken}"
Their pronunciation score: {data.score}%
Words they mispronounced: {', '.join(data.wrong_words) if data.wrong_words else 'None'}

Provide helpful feedback in this exact JSON format:
{{
  "feedback": "2-3 sentences of encouraging feedback in English",
  "feedback_native": "Same feedback translated to {data.native_language}",
  "tips": ["tip 1 in English", "tip 2 in English", "tip 3 in English"],
  "tips_native": ["tip 1 in {data.native_language}", "tip 2 in {data.native_language}", "tip 3 in {data.native_language}"]
}}

Make feedback encouraging and specific to their native language challenges."""

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )

        response_text = completion.choices[0].message.content.strip()
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]

        result = json.loads(response_text.strip())
        return result

    except Exception as e:
        print(f"Pronunciation feedback error: {e}")
        return {
            "feedback": "Good effort! Keep practicing your pronunciation every day.",
            "feedback_native": "अच्छा प्रयास! हर दिन अपने उच्चारण का अभ्यास करते रहें।",
            "tips": [
                "Listen to the correct pronunciation first before speaking",
                "Practice slowly then gradually speed up",
                "Record yourself and compare with the original"
            ],
            "tips_native": [
                "बोलने से पहले सही उच्चारण सुनें",
                "धीरे-धीरे अभ्यास करें फिर गति बढ़ाएं",
                "खुद को रिकॉर्ड करें और तुलना करें"
            ]
        }

@router.post("/pronunciation/generate-level")
async def generate_level(data: GenerateLevelRequest):
    try:
        level_descriptions = {
            "Beginner": "Simple single words and basic greetings (Hello, Thank you, Sorry, Please)",
            "Intermediate": "Common workplace and daily phrases (Could you repeat that, I would like to apply)",
            "Advanced": "Complex professional sentences with difficult vocabulary",
            "Canadian": "Canadian-specific words and phrases (Toque, Poutine, Double double, Eh)"
        }

        prompt = f"""You are an English pronunciation coach for {data.native_language} speakers.

Generate exactly 10 pronunciation practice items for {data.level} level.
Level description: {level_descriptions.get(data.level, "General English phrases")}

Focus on words/phrases that {data.native_language} speakers commonly struggle with.

Respond ONLY with a valid JSON array:
[
  {{
    "text": "Hello",
    "tip": "heh-LOH",
    "note": "Brief note about why this is challenging for {data.native_language} speakers"
  }}
]

Make sure:
- Items match the difficulty level exactly
- Tips show phonetic pronunciation clearly
- Notes are specific and helpful for {data.native_language} speakers
- Mix of words and short phrases"""

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000
        )

        response_text = completion.choices[0].message.content.strip()
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]

        items = json.loads(response_text.strip())
        return {"items": items[:10], "ai_generated": True}

    except Exception as e:
        print(f"Generate level error: {e}")
        return {
            "items": [
                {"text": "Hello", "tip": "heh-LOH", "note": "Common greeting"},
                {"text": "Thank you", "tip": "THANK yoo", "note": "Polite expression"},
                {"text": "Please", "tip": "PLEEZ", "note": "Polite request word"},
                {"text": "Sorry", "tip": "SAW-ree", "note": "Apology word"},
                {"text": "Excuse me", "tip": "ex-KYOOZ mee", "note": "Getting attention"},
                {"text": "Good morning", "tip": "good MOR-ning", "note": "Morning greeting"},
                {"text": "How are you", "tip": "how ar YOO", "note": "Common greeting"},
                {"text": "Nice to meet you", "tip": "nys to MEET yoo", "note": "Introduction phrase"},
                {"text": "See you later", "tip": "see yoo LAY-ter", "note": "Farewell phrase"},
                {"text": "You are welcome", "tip": "yoo ar WEL-kum", "note": "Response to thank you"},
            ],
            "ai_generated": False
        }