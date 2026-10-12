from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/quizzes", tags=["quizzes"])


@router.post("/", response_model=schemas.QuizOut)
def submit_quiz(
    quiz_in: schemas.QuizCreate,
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(auth.get_current_student),
):
    quiz = models.Quiz(
        student_id=current_student.id,
        subject=quiz_in.subject,
        topic=quiz_in.topic or quiz_in.subject,
        score=quiz_in.score,
        time_taken_minutes=quiz_in.time_taken_minutes,
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz


@router.get("/", response_model=List[schemas.QuizOut])
def list_my_quizzes(
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(auth.get_current_student),
):
    return (
        db.query(models.Quiz)
        .filter(models.Quiz.student_id == current_student.id)
        .order_by(models.Quiz.date.desc())
        .all()
    )
