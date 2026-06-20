from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
import json
import random
from datetime import datetime

client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))
router = APIRouter()

class DailyTipRequest(BaseModel):
    proficiency_level: str = "Beginner"

@router.post("/daily-tip/generate")
async def generate_daily_tip(data: DailyTipRequest):
    try:
        today = datetime.now().strftime("%Y-%m-%d")
        random_seed = random.randint(1000, 9999)

        prompt = f"""You are a friendly English learning coach for newcomers to Canada.

[Internal variety seed: {random_seed} — do NOT mention this number, ID, or session anywhere in your output. It is only to help you generate a DIFFERENT tip than usual, not content for the tip itself.]

Generate ONE short, practical tip for an English learner at {data.proficiency_level} level. The tip should be about ONE of these topics (pick randomly):
- A practical English learning technique
- Canadian culture, slang, or workplace etiquette
- A pronunciation or grammar tip
- A confidence-building tip for speaking English

Keep it to ONE or TWO sentences max, friendly and encouraging tone, like a quick daily nugget of advice. The tip must read naturally as if written by a human coach — no technical references, IDs, or meta-commentary.

Respond ONLY with valid JSON, no markdown, no extra text:
{{
  "tip": "The tip text here"
}}"""

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
            temperature=1.2
        )

        response_text = completion.choices[0].message.content.strip()
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]
        response_text = response_text.strip()

        tip_data = json.loads(response_text)
        tip_data['date'] = today
        return tip_data

    except Exception as e:
        print(f"Daily tip error: {e}")
        return {
            "tip": "Practice speaking out loud every day, even if just for 5 minutes. Consistency beats duration!",
            "date": datetime.now().strftime("%Y-%m-%d")
        }