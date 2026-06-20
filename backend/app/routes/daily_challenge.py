from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
import json
from datetime import datetime

client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))
router = APIRouter()

class GenerateChallengeRequest(BaseModel):
    native_language: str = "English"
    proficiency_level: str = "Beginner"
    weakest_skill: str = ""
    weakest_avg: float = 0

class SubmitChallengeRequest(BaseModel):
    challenge_type: str
    challenge_text: str
    user_response: str
    native_language: str = "English"

@router.post("/daily-challenge/generate")
async def generate_challenge(data: GenerateChallengeRequest):
    try:
        today = datetime.now().strftime("%A, %B %d, %Y")

        adaptive_instruction = ""
        if data.weakest_skill:
            adaptive_instruction = f"""
IMPORTANT — Adaptive personalization:
This student's performance data shows their weakest skill is "{data.weakest_skill}" with an average score of {data.weakest_avg}%.
At least ONE of the 3 challenges today MUST specifically target and help improve "{data.weakest_skill}".
For example, if the weak skill is Pronunciation, make the Speaking challenge focus on words/sounds that are commonly mispronounced. If it's Grammar, make the Writing challenge focus on a grammar structure they likely struggle with. If it's Vocabulary, make the Vocabulary challenge words slightly more challenging and tied to real usage.
Briefly mention in that challenge's "tip" field that this challenge was chosen to help with their {data.weakest_skill}.
"""

        prompt = f"""You are an English learning coach for newcomers to Canada.

Today is {today}.
Student's native language: {data.native_language}
Student's level: {data.proficiency_level}
{adaptive_instruction}

Generate exactly 3 daily English challenges for today. Make them practical and useful for someone living in Canada.

Challenge types to include:
1. Speaking Challenge — a topic to speak about for 30-60 seconds
2. Writing Challenge — a short writing task (1-3 sentences)
3. Vocabulary Challenge — learn and use 3 new words in sentences

Respond ONLY in this exact JSON format:
{{
  "date": "{today}",
  "adapted_for": "{data.weakest_skill if data.weakest_skill else ''}",
  "challenges": [
    {{
      "type": "Speaking",
      "icon": "🗣️",
      "title": "Short title",
      "instruction": "Clear instruction for the student",
      "example": "An example response",
      "tip": "A helpful tip",
      "xp": 30
    }},
    {{
      "type": "Writing",
      "icon": "✍️",
      "title": "Short title",
      "instruction": "Clear instruction for the student",
      "example": "An example response",
      "tip": "A helpful tip",
      "xp": 20
    }},
    {{
      "type": "Vocabulary",
      "icon": "📖",
      "title": "Short title",
      "instruction": "Clear instruction for the student",
      "words": ["word1", "word2", "word3"],
      "example": "An example using the words",
      "tip": "A helpful tip",
      "xp": 25
    }}
  ]
}}

Make challenges:
- Relevant to daily Canadian life (work, shopping, healthcare, social)
- Appropriate for {data.proficiency_level} level
- Different every day since today is {today}
- Practical and immediately useful"""
        
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

        result = json.loads(response_text.strip())
        return result

    except Exception as e:
        print(f"Daily challenge error: {e}")
        return {
            "date": datetime.now().strftime("%A, %B %d, %Y"),
            "adapted_for": "",
            "challenges": [
                {
                    "type": "Speaking",
                    "icon": "🗣️",
                    "title": "Introduce Yourself",
                    "instruction": "Introduce yourself in English for 30 seconds. Include your name, where you are from, and what you do.",
                    "example": "Hi, my name is Raj. I am from India and I moved to Canada 6 months ago. I am currently looking for a job in IT.",
                    "tip": "Speak slowly and clearly. Make eye contact!",
                    "xp": 30
                },
                {
                    "type": "Writing",
                    "icon": "✍️",
                    "title": "Write a Thank You Email",
                    "instruction": "Write 2-3 sentences thanking your manager for helping you at work.",
                    "example": "Dear Sarah, Thank you so much for taking the time to help me today. I really appreciate your patience and guidance.",
                    "tip": "Always start with Dear and end with Thank you or Best regards.",
                    "xp": 20
                },
                {
                    "type": "Vocabulary",
                    "icon": "📖",
                    "title": "Workplace Words",
                    "instruction": "Learn these 3 words and use each one in a sentence.",
                    "words": ["Collaborate", "Deadline", "Feedback"],
                    "example": "I love to collaborate with my team to meet our deadline and get feedback from our manager.",
                    "tip": "Try to use these words in real conversations today!",
                    "xp": 25
                }
            ]
        }

@router.post("/daily-challenge/submit")
async def submit_challenge(data: SubmitChallengeRequest):
    try:
        prompt = f"""You are a friendly English coach for newcomers to Canada.

Challenge type: {data.challenge_type}
Challenge: "{data.challenge_text}"
Student's response: "{data.user_response}"
Student's native language: {data.native_language}

Evaluate the response and provide feedback. Be encouraging!

Respond in this exact JSON format:
{{
  "score": 85,
  "feedback": "Encouraging feedback in English (2-3 sentences)",
  "feedback_native": "Same feedback in {data.native_language}",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1"],
  "corrected": "Corrected version if needed, otherwise same as input",
  "xp_earned": 25
}}

Score 90-100 for excellent, 70-89 for good, 50-69 for average, below 50 for needs work."""

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

        result = json.loads(response_text.strip())
        return result

    except Exception as e:
        print(f"Submit challenge error: {e}")
        return {
            "score": 75,
            "feedback": "Good effort! Keep practicing every day to improve your English.",
            "feedback_native": "",
            "strengths": ["You completed the challenge!", "Good effort!"],
            "improvements": ["Keep practicing daily"],
            "corrected": data.user_response,
            "xp_earned": 20
        }