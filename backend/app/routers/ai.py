from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas, auth
from ..database import get_db
from ..ai import recommend

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/dashboard", response_model=schemas.DashboardSummary)
def dashboard_summary(
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(auth.get_current_student),
):
    quizzes = (
        db.query(models.Quiz)
        .filter(models.Quiz.student_id == current_student.id)
        .order_by(models.Quiz.date.asc())
        .all()
    )

    weak_topics, strong_topics = recommend.get_weak_and_strong_topics(quizzes)
    predicted_score = recommend.predict_next_score(quizzes)
    streak = recommend.learning_streak_days(quizzes)
    recommendations = recommend.generate_recommendations(weak_topics, current_student.learning_style or "video")
    motivation = recommend.generate_motivation_message(quizzes, current_student.study_hours or 1.0)

    # Persist a fresh motivation message so it shows up in recommendation history too
    rec = models.Recommendation(student_id=current_student.id, message=motivation, kind="motivation")
    db.add(rec)
    db.commit()

    return schemas.DashboardSummary(
        weak_topics=weak_topics,
        strong_topics=strong_topics,
        predicted_score=round(predicted_score, 1),
        learning_streak_days=streak,
        recommendations=recommendations + [motivation],
    )


@router.get("/recommendations", response_model=list[schemas.RecommendationOut])
def recommendation_history(
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(auth.get_current_student),
):
    return (
        db.query(models.Recommendation)
        .filter(models.Recommendation.student_id == current_student.id)
        .order_by(models.Recommendation.created_at.desc())
        .limit(20)
        .all()
    )
