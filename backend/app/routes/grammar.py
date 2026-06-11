from fastapi import APIRouter
from pydantic import BaseModel
import requests
from groq import Groq
import os
import json

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))

class GrammarRequest(BaseModel):
    text: str
    native_language: str = "English"

@router.post("/grammar")
async def check_grammar(data: GrammarRequest):
    try:
        # Step 1 — LanguageTool checks grammar
        response = requests.post(
            'https://api.languagetool.org/v2/check',
            data={
                'text': data.text,
                'language': 'en-CA',
            }
        )
        lt_data = response.json()

        errors = []
        corrected = data.text

        for match in lt_data.get('matches', []):
            if match['replacements']:
                wrong = data.text[match['offset']:match['offset'] + match['length']]
                correct = match['replacements'][0]['value']
                rule = match['message']
                errors.append({
                    'wrong': wrong,
                    'correct': correct,
                    'rule': rule,
                    'offset': match['offset'],
                    'length': match['length']
                })

        # Apply corrections
        offset_adjust = 0
        for error in errors:
            start = error['offset'] + offset_adjust
            end = start + error['length']
            corrected = corrected[:start] + error['correct'] + corrected[end:]
            offset_adjust += len(error['correct']) - error['length']

        score = max(0, 100 - (len(errors) * 15))

        # Step 2 — Groq explains errors and translates
        if errors and data.native_language != "English":
            try:
                error_list = "\n".join([
                    f"- Wrong: '{e['wrong']}' → Correct: '{e['correct']}' | Rule: {e['rule']}"
                    for e in errors[:5]
                ])

                prompt = f"""You are a friendly English grammar coach.

The student's native language is: {data.native_language}
Their original text: "{data.text}"
Corrected text: "{corrected}"

Grammar errors found:
{error_list}

Please provide:
1. A brief encouraging feedback (1-2 sentences in English)
2. Explanation of the main errors in {data.native_language} (simple and clear)
3. One grammar tip specific to {data.native_language} speakers

Respond in this JSON format:
{{
  "feedback_english": "encouraging feedback in English",
  "feedback_native": "explanation in {data.native_language}",
  "grammar_tip": "specific tip for {data.native_language} speakers"
}}"""

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

                ai_feedback = json.loads(response_text.strip())

                return {
                    "corrected": corrected,
                    "errors": errors,
                    "score": score,
                    "feedback": ai_feedback.get("feedback_english", ""),
                    "feedback_native": ai_feedback.get("feedback_native", ""),
                    "grammar_tip": ai_feedback.get("grammar_tip", ""),
                    "native_language": data.native_language
                }

            except Exception as e:
                print(f"Groq error: {e}")

        # Default feedback without translation
        if score >= 90:
            feedback = "Excellent! Your grammar is very good. Keep it up!"
        elif score >= 70:
            feedback = "Good effort! You made a few mistakes but overall good."
        else:
            feedback = "Keep practicing! Grammar takes time to master."

        return {
            "corrected": corrected,
            "errors": errors,
            "score": score,
            "feedback": feedback,
            "feedback_native": "",
            "grammar_tip": "",
            "native_language": data.native_language
        }

    except Exception as e:
        print(f"Grammar error: {e}")
        return {
            "corrected": data.text,
            "errors": [],
            "score": 100,
            "feedback": "Could not check grammar. Please try again.",
            "feedback_native": "",
            "grammar_tip": ""
        }