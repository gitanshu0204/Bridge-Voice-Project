from fastapi import APIRouter
from pydantic import BaseModel
from app.database import get_db
from app.models import Conversation
from sqlalchemy.orm import Session
from fastapi import Depends
import json

router = APIRouter()

class SaveConversationRequest(BaseModel):
    user_email: str
    scenario: str
    messages: list

@router.post("/conversations/save")
async def save_conversation(data: SaveConversationRequest, db: Session = Depends(get_db)):
    try:
        conversation = Conversation(
            user_email=data.user_email,
            scenario=data.scenario,
            messages=json.dumps(data.messages)
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        return {"message": "Conversation saved successfully", "id": conversation.id}
    except Exception as e:
        print(f"Save conversation error: {e}")
        return {"message": "Could not save conversation"}

@router.get("/conversations/{email}")
async def get_conversations(email: str, db: Session = Depends(get_db)):
    try:
        conversations = db.query(Conversation).filter(
            Conversation.user_email == email
        ).order_by(Conversation.created_at.desc()).all()

        result = []
        for conv in conversations:
            result.append({
                "id": conv.id,
                "scenario": conv.scenario,
                "messages": json.loads(conv.messages),
                "created_at": conv.created_at.strftime("%B %d, %Y at %I:%M %p")
            })
        return result
    except Exception as e:
        print(f"Get conversations error: {e}")
        return []

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: int, db: Session = Depends(get_db)):
    try:
        conversation = db.query(Conversation).filter(
            Conversation.id == conversation_id
        ).first()
        if conversation:
            db.delete(conversation)
            db.commit()
        return {"message": "Deleted successfully"}
    except Exception as e:
        print(f"Delete conversation error: {e}")
        return {"message": "Could not delete"}