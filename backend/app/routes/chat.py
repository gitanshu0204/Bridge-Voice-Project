from fastapi import APIRouter
from pydantic import BaseModel
import os
from groq import Groq
import json

client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    scenario: str = "General Conversation"

@router.post("/chat")
async def chat(data: ChatMessage):
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": f"""You are a friendly English conversation coach helping people practice English.
Current scenario: {data.scenario}
Keep responses short (2-3 sentences max), encouraging, and conversational.
If the user makes grammar mistakes, gently correct them.
Always end with a question to keep the conversation going."""
                },
                {
                    "role": "user",
                    "content": data.message
                }
            ],
            max_tokens=200
        )
        reply = completion.choices[0].message.content
        return {"reply": reply}
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"reply": f"Error: {str(e)}"}
        return {"reply": "I'm having trouble right now. Please try again!"}
    
@router.post("/chat/insights")
async def generate_insights(data: dict):
    try:
        prompt = f"""You are an expert English learning coach analyzing a student's performance data.

Student Profile:
- Proficiency Level: {data.get('proficiency_level', 'Beginner')}
- Native Language: {data.get('native_language', 'Unknown')}
- Total Sessions: {data.get('total_sessions', 0)}
- Overall Average Score: {data.get('overall_score', 0)}%
- Current Streak: {data.get('streak', 0)} days
- Total XP Earned: {data.get('total_xp', 0)}
- Weekly Trend: {data.get('weekly_trend', 'stable')}
- Strongest Skill: {data.get('strongest_skill', 'Unknown')}
- Weakest Skill: {data.get('weakest_skill', 'Unknown')}

Skill Performance:
{data.get('skill_summary', 'No data')}

Recent Sessions (last 10):
{data.get('recent_sessions', 'No data')}

Analyze this data deeply and provide personalized insights. Be specific — reference actual scores and skills, not generic advice.

Respond ONLY with valid JSON, no markdown:
{{
  "overall_assessment": "2-3 sentence honest assessment of where this student is in their English learning journey, referencing their actual data",
  "strengths": ["specific strength 1 with data reference", "specific strength 2", "specific strength 3"],
  "areas_to_improve": ["specific weakness 1 with data reference", "specific weakness 2"],
  "trend_analysis": "2 sentences analyzing whether scores are improving, declining or stable, and why based on the data pattern",
  "weekly_focus": ["Day 1-2: specific actionable task", "Day 3-4: specific actionable task", "Day 5-7: specific actionable task"],
  "motivational_message": "1-2 sentence personalized encouraging message that references something specific from their data",
  "recommended_action": "single most important thing they should do right now"
}}"""

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800,
            temperature=0.7
        )

        response_text = completion.choices[0].message.content.strip()
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]
        response_text = response_text.strip()

        return json.loads(response_text)

    except Exception as e:
        print(f"Insights error: {e}")
        return {
            "overall_assessment": "Keep practicing daily to build your English skills. Consistency is the key to improvement!",
            "strengths": ["You are showing up and practicing regularly", "You have completed multiple sessions"],
            "areas_to_improve": ["Try to practice all skill areas for balanced improvement"],
            "trend_analysis": "Continue practicing to build enough data for a detailed trend analysis.",
            "weekly_focus": ["Practice Grammar Check daily", "Try Pronunciation Scorer", "Complete Daily Challenges"],
            "motivational_message": "Every session brings you closer to fluency. Keep going!",
            "recommended_action": "Complete your Daily Challenge today"
        }