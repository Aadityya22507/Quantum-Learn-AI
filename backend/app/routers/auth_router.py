from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=schemas.StudentOut)
def register(student_in: schemas.StudentRegister, db: Session = Depends(get_db)):
    existing = db.query(models.Student).filter(models.Student.email == student_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    student = models.Student(
        name=student_in.name,
        email=student_in.email,
        hashed_password=auth.hash_password(student_in.password),
        student_class=student_in.student_class,
        learning_style=student_in.learning_style,
        accessibility_preference=student_in.accessibility_preference,
        preferred_language=student_in.preferred_language,
        study_hours=student_in.study_hours,
        target_score=student_in.target_score,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.StudentLogin, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.email == credentials.email).first()
    if not student or not auth.verify_password(credentials.password, student.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = auth.create_access_token(data={"sub": str(student.id)})
    return {"access_token": token, "token_type": "bearer"}
