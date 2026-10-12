from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


# ---------- Auth ----------
class StudentRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    student_class: Optional[str] = None
    learning_style: Optional[str] = "video"
    accessibility_preference: Optional[str] = "none"
    preferred_language: Optional[str] = "English"
    study_hours: Optional[float] = 1.0
    target_score: Optional[float] = 80.0


class StudentLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- Student ----------
class StudentOut(BaseModel):
    id: int
    name: str
    email: str
    student_class: Optional[str]
    learning_style: Optional[str]
    accessibility_preference: Optional[str]
    preferred_language: Optional[str]
    study_hours: Optional[float]
    target_score: Optional[float]

    class Config:
        from_attributes = True


class StudentUpdate(BaseModel):
    learning_style: Optional[str] = None
    accessibility_preference: Optional[str] = None
    preferred_language: Optional[str] = None
    study_hours: Optional[float] = None
    target_score: Optional[float] = None


# ---------- Quiz ----------
class QuizCreate(BaseModel):
    subject: str
    topic: Optional[str] = None
    score: float
    time_taken_minutes: Optional[float] = 0.0


class QuizOut(BaseModel):
    quiz_id: int
    subject: str
    topic: Optional[str]
    score: float
    time_taken_minutes: float
    date: datetime

    class Config:
        from_attributes = True


# ---------- Recommendation ----------
class RecommendationOut(BaseModel):
    recommendation_id: int
    message: str
    kind: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- AI / Dashboard ----------
class DashboardSummary(BaseModel):
    weak_topics: List[str]
    strong_topics: List[str]
    predicted_score: float
    learning_streak_days: int
    recommendations: List[str]


class QuantumPriorityRequest(BaseModel):
    subject: str
    days_since_last_revision: float
    average_score: float
    quiz_attempts: int
