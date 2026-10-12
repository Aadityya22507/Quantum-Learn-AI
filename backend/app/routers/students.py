from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/students", tags=["students"])


@router.get("/me", response_model=schemas.StudentOut)
def get_me(current_student: models.Student = Depends(auth.get_current_student)):
    return current_student


@router.put("/me", response_model=schemas.StudentOut)
def update_me(
    update: schemas.StudentUpdate,
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(auth.get_current_student),
):
    data = update.dict(exclude_unset=True)
    for field, value in data.items():
        setattr(current_student, field, value)
    db.commit()
    db.refresh(current_student)
    return current_student
