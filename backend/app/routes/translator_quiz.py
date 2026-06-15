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
    native_text: str
    user_answer: str
    correct_answer: str
    native_language: str = "Hindi"

@router.post("/translator-quiz/generate")
async def generate_quiz(data: TranslatorQuizRequest):
    try:
        prompt = f"""You are an English language quiz generator.

Generate exactly 5 translation quiz questions for someone whose native language is {data.native_language}.
Difficulty: {data.difficulty}

Each question gives a sentence in {data.native_language}. The student must translate it INTO English.

Difficulty guidelines:
- Easy: Simple everyday sentences (greetings, shopping, basic needs)
- Medium: Workplace and social sentences
- Hard: Complex professional sentences

Respond ONLY with a valid JSON array of exactly 5 items, no extra text, no markdown:
[
  {{
    "native": "यह कितने का है?",
    "english": "How much does this cost?",
    "hint": "shopping question"
  }}
]

Make sure:
- "native" is written in {data.native_language} script
- "english" is the accurate English translation
- Sentences are practical and useful for newcomers to Canada
- Each question is different from the others
- Return EXACTLY 5 items in the array"""

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1200
        )

        response_text = completion.choices[0].message.content.strip()
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]
            response_text = response_text.strip()
            if response_text.endswith('```'):
                response_text = response_text[:-3]

        questions = json.loads(response_text.strip())

        # Validate structure
        valid_questions = []
        for q in questions:
            if 'native' in q and 'english' in q:
                valid_questions.append({
                    'native': q['native'],
                    'english': q['english'],
                    'hint': q.get('hint', '')
                })

        if len(valid_questions) < 3:
            raise ValueError("Not enough valid questions generated")

        return {"questions": valid_questions[:5]}

    except Exception as e:
        print(f"Translator quiz error: {e}")
        fallback = {
            "Hindi": [
                {"native": "आप कैसे हैं?", "english": "How are you?", "hint": "greeting"},
                {"native": "निकटतम अस्पताल कहाँ है?", "english": "Where is the nearest hospital?", "hint": "emergency"},
                {"native": "मैं इस नौकरी के लिए आवेदन करना चाहूंगा।", "english": "I would like to apply for this job.", "hint": "job application"},
                {"native": "यह कितने का है?", "english": "How much does this cost?", "hint": "shopping"},
                {"native": "क्या आप मेरी मदद कर सकते हैं?", "english": "Can you help me please?", "hint": "asking for help"},
            ]
        }
        default_set = fallback.get(data.native_language, fallback["Hindi"])
        return {"questions": default_set}

@router.post("/translator-quiz/check")
async def check_answer(data: CheckAnswerRequest):
    try:
        prompt = f"""You are a friendly English translation checker.

Original sentence in {data.native_language}: "{data.native_text}"
Correct English translation: "{data.correct_answer}"
Student's English answer: "{data.user_answer}"

Check if the student's English translation is correct or close enough.
Be lenient about minor spelling, capitalization, or punctuation differences.
If the meaning is correct but grammar is slightly off, still give partial credit.

Respond ONLY with valid JSON, no markdown:
{{
  "score": 85,
  "correct": true,
  "feedback": "Feedback in English (2-3 sentences) explaining what was right or wrong",
  "feedback_native": "Same feedback translated into {data.native_language}",
  "correction": "{data.correct_answer}",
  "tip": "One useful grammar or vocabulary tip in English"
}}

Score 100 if perfect, 80-99 if very close (minor errors), 60-79 if partially correct (meaning understood but grammar issues), below 60 if meaning is wrong."""

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400
        )

        response_text = completion.choices[0].message.content.strip()
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]
            response_text = response_text.strip()
            if response_text.endswith('```'):
                response_text = response_text[:-3]

        result = json.loads(response_text.strip())
        return result

    except Exception as e:
        print(f"Check answer error: {e}")
        # Simple fallback comparison
        user_clean = data.user_answer.lower().strip().rstrip('.')
        correct_clean = data.correct_answer.lower().strip().rstrip('.')
        score = 100 if user_clean == correct_clean else 60
        return {
            "score": score,
            "correct": score >= 70,
            "feedback": "Good attempt! Keep practicing your translations.",
            "feedback_native": "",
            "correction": data.correct_answer,
            "tip": "Practice makes perfect!"
        }