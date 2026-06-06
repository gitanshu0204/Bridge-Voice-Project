from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
import json

client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))
router = APIRouter()

class ChallengeRequest(BaseModel):
    challenge_type: str
    challenge_title: str
    content: str

@router.post("/daily-challenge")
async def daily_challenge(data: ChallengeRequest):
    try:
        if data.challenge_type == "speaking":
            prompt = f"""You are a friendly English speaking coach.

The student completed a speaking challenge: "{data.challenge_title}"
What they said: "{data.content}"
Word count: {len(data.content.split())} words

Analyse their speaking and respond in this exact JSON format:
{{
  "score": 75,
  "feedback": "2-3 sentences of encouraging feedback about their speaking",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "xp_earned": 50
}}

Score based on: length (more words = higher score), vocabulary variety, coherence."""

        elif data.challenge_type == "writing":
            prompt = f"""You are a friendly English writing coach.

The student completed a writing challenge: "{data.challenge_title}"
What they wrote: "{data.content}"
Word count: {len(data.content.split())} words

Analyse their writing and respond in this exact JSON format:
{{
  "score": 75,
  "feedback": "2-3 sentences of encouraging feedback about their writing",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "xp_earned": 40
}}

Score based on: grammar, vocabulary, sentence structure, length."""

        else:
            prompt = f"""You are a friendly English vocabulary coach.

The student completed a vocabulary challenge: "{data.challenge_title}"
What they wrote: "{data.content}"

Analyse if they used the words correctly and respond in this exact JSON format:
{{
  "score": 75,
  "feedback": "2-3 sentences of encouraging feedback about their vocabulary usage",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "xp_earned": 30
}}

Score based on: correct usage of vocabulary words, grammar, creativity."""

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400
        )

        response_text = completion.choices[0].message.content
        clean = response_text.strip()
        if clean.startswith('```'):
            clean = clean.split('```')[1]
            if clean.startswith('json'):
                clean = clean[4:]
        result = json.loads(clean.strip())
        return result

    except Exception as e:
        print(f"Daily challenge error: {e}")
        return {
            "score": 70,
            "feedback": "Great effort on completing today's challenge! Keep practicing every day to improve your English skills.",
            "strengths": ["You completed the challenge!", "You are building good habits"],
            "improvements": ["Try to use more varied vocabulary", "Practice writing longer responses"],
            "xp_earned": 20
        }