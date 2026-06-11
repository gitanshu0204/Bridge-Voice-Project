from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
import json

client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))
router = APIRouter()

class TranslatorQuizRequest(BaseModel):
    native_language: str = "Hindi"
    difficulty: str = "Medium"

class CheckAnswerRequest(BaseModel):
    original: str
    user_answer: str
    correct_answer: str
    native_language: str = "Hindi"

@router.post("/translator-quiz/generate")
async def generate_quiz(data: TranslatorQuizRequest):
    try:
        prompt = f"""You are an English language quiz generator.

Generate exactly 5 translation quiz questions for someone whose native language is {data.native_language}.
Difficulty: {data.difficulty}

Each question should have an English sentence and its translation in {data.native_language}.

Difficulty guidelines:
- Easy: Simple everyday sentences (greetings, shopping, basic needs)
- Medium: Workplace and social sentences
- Hard: Complex professional sentences

Respond ONLY with a valid JSON array:
[
  {{
    "english": "How much does this cost?",
    "translated": "यह कितने का है?",
    "hint": "shopping question",
    "type": "English to {data.native_language}"
  }}
]

Make sure:
- All translations are accurate
- Sentences are practical and useful for newcomers to Canada
- Each question is different from the others
- Mix of question types: some English to {data.native_language}, some {data.native_language} to English"""

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

        questions = json.loads(response_text.strip())
        return {"questions": questions[:5]}

    except Exception as e:
        print(f"Translator quiz error: {e}")
        return {"questions": [
            {"english": "How are you?", "translated": "आप कैसे हैं?", "hint": "greeting", "type": f"English to {data.native_language}"},
            {"english": "Where is the nearest hospital?", "translated": "निकटतम अस्पताल कहाँ है?", "hint": "emergency", "type": f"English to {data.native_language}"},
            {"english": "I would like to apply for this job.", "translated": "मैं इस नौकरी के लिए आवेदन करना चाहूंगा।", "hint": "job application", "type": f"English to {data.native_language}"},
            {"english": "How much does this cost?", "translated": "यह कितने का है?", "hint": "shopping", "type": f"English to {data.native_language}"},
            {"english": "Can you help me please?", "translated": "क्या आप मेरी मदद कर सकते हैं?", "hint": "asking for help", "type": f"English to {data.native_language}"},
        ]}

@router.post("/translator-quiz/check")
async def check_answer(data: CheckAnswerRequest):
    try:
        prompt = f"""You are a friendly translation checker.

Original text: "{data.original}"
Correct answer: "{data.correct_answer}"
User's answer: "{data.user_answer}"
Language pair: English / {data.native_language}

Check if the user's answer is correct or close enough.
Be lenient — minor spelling mistakes or extra spaces are fine.

Respond in this exact JSON format:
{{
  "score": 85,
  "correct": true,
  "feedback": "Great job! Your translation is accurate.",
  "correction": "Exact correct answer if wrong",
  "tip": "One useful tip about this phrase"
}}

Score 100 if perfect, 80-99 if very close, 60-79 if partially correct, below 60 if wrong."""

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )

        response_text = completion.choices[0].message.content.strip()
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]

        result = json.loads(response_text.strip())
        return result

    except Exception as e:
        print(f"Check answer error: {e}")
        return {
            "score": 70,
            "correct": True,
            "feedback": "Good attempt! Keep practicing your translations.",
            "correction": data.correct_answer,
            "tip": "Practice makes perfect!"
        }