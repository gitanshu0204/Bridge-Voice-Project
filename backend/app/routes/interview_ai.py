from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
import json

client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))
router = APIRouter()

class InterviewQuestionsRequest(BaseModel):
    job_title: str
    difficulty: str = "Medium"
    company: str = ""

class InterviewFeedbackRequest(BaseModel):
    job_title: str
    question: str
    answer: str
    company: str = ""

@router.post("/interview/questions")
async def generate_questions(data: InterviewQuestionsRequest):
    try:
        company_context = f"at {data.company}" if data.company else ""
        company_specific = f"""
The company is {data.company}.
- Generate questions specific to {data.company}'s culture and values
- Include questions about why the candidate wants to work at {data.company}
- Reference real aspects of {data.company}'s business and work environment
""" if data.company else ""

        prompt = f"""You are an expert Canadian interview coach.

Generate exactly 5 realistic interview questions for:
- Position: {data.job_title} {company_context}
- Difficulty: {data.difficulty}
{company_specific}

Respond ONLY with a valid JSON array:
[
  {{
    "question": "Tell me about yourself and your experience.",
    "tip": "Use the STAR method: Situation, Task, Action, Result",
    "type": "General"
  }}
]

Make questions realistic and commonly asked in Canadian job interviews.
Include a mix of behavioral, situational and skill-based questions.
Questions should feel natural and specific to the role{f' at {data.company}' if data.company else ''}."""

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
        print(f"Interview questions error: {e}")
        return {"questions": [
            {"question": "Tell me about yourself.", "tip": "Keep it professional and relevant", "type": "General"},
            {"question": "What are your greatest strengths?", "tip": "Give specific examples", "type": "Behavioral"},
            {"question": "Why do you want this job?", "tip": "Research the company first", "type": "Motivational"},
            {"question": "Describe a challenge you overcame.", "tip": "Use the STAR method", "type": "Behavioral"},
            {"question": "Do you have any questions for us?", "tip": "Always prepare 2-3 questions", "type": "Closing"},
        ]}

@router.post("/interview/feedback")
async def interview_feedback(data: InterviewFeedbackRequest):
    try:
        company_context = f"at {data.company}" if data.company else ""

        prompt = f"""You are an expert Canadian interview coach.

Job: {data.job_title} {company_context}
Interview Question: "{data.question}"
Candidate's Answer: "{data.answer}"

Evaluate this interview answer and provide:
1. Score out of 100
2. What they did well (2 points)
3. What to improve (2 points)
4. A better sample answer (2-3 sentences)
5. One key tip specific to Canadian workplace culture{f' and {data.company}' if data.company else ''}

Respond in this exact JSON format:
{{
  "score": 75,
  "feedback": "Overall encouraging feedback in 1-2 sentences",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "sample_answer": "Here is a stronger version of this answer...",
  "canadian_tip": "In Canadian workplaces specifically..."
}}"""

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
        print(f"Interview feedback error: {e}")
        return {
            "score": 70,
            "feedback": "Good effort! Keep practicing to improve your interview skills.",
            "strengths": ["You attempted the question", "You showed willingness to try"],
            "improvements": ["Add more specific examples", "Use the STAR method"],
            "sample_answer": "Try to structure your answer with a specific situation, what you did, and the result.",
            "canadian_tip": "Canadian interviewers appreciate honesty and specific real-life examples."
        }