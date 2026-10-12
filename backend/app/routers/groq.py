import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/ai", tags=["ai"])

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


class ChatMessage(BaseModel):
    role: str = Field(pattern="^(system|user|assistant)$")
    content: str = Field(min_length=1, max_length=12000)


class GroqRequest(BaseModel):
    messages: list[ChatMessage]
    model: str = "llama-3.3-70b-versatile"
    temperature: float = 0.4
    max_tokens: int = 900


def _call_groq(payload: dict) -> dict:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Groq AI is not configured. Add GROQ_API_KEY to backend/.env and restart the backend.",
        )

    body = json.dumps(payload).encode("utf-8")
    request = Request(
        GROQ_URL,
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
    )

    try:
        with urlopen(request, timeout=45) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        try:
            detail = json.loads(exc.read().decode("utf-8"))
            message = detail.get("error", {}).get("message", "Groq request failed")
        except Exception:
            message = "Groq request failed"
        if exc.code == 401:
            raise HTTPException(status_code=502, detail="Groq rejected the API key. Check/rotate GROQ_API_KEY.")
        raise HTTPException(status_code=502, detail=message)
    except URLError:
        raise HTTPException(status_code=502, detail="Unable to reach Groq right now. Check your internet connection.")


@router.post("/chat")
def chat(request: GroqRequest):
    result = _call_groq(request.model_dump())
    content = result.get("choices", [{}])[0].get("message", {}).get("content")
    if not content:
        raise HTTPException(status_code=502, detail="Groq returned an empty response.")
    return {"content": content}


@router.post("/study-plan")
def study_plan():
    result = _call_groq(
        {
            "model": "llama-3.3-70b-versatile",
            "temperature": 0.4,
            "max_tokens": 700,
            "messages": [
                {
                    "role": "system",
                    "content": "Create a one-day study timetable for a college student. Include time slots, subjects, short breaks, revision, and one motivational tip. Keep it practical and well formatted.",
                },
                {"role": "user", "content": "Create today's study plan."},
            ],
        }
    )
    content = result.get("choices", [{}])[0].get("message", {}).get("content")
    return {"content": content or "No study plan was returned."}
