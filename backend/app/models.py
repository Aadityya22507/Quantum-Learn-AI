from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    student_class = Column(String, nullable=True)          # "class" is a Python keyword
    learning_style = Column(String, nullable=True)          # video / reading / practice / audio
    accessibility_preference = Column(String, nullable=True)  # dyslexia / adhd / blind / deaf / mute / none ...
    preferred_language = Column(String, default="English")
    study_hours = Column(Float, default=1.0)
    target_score = Column(Float, default=80.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    quizzes = relationship("Quiz", back_populates="student", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="student", cascade="all, delete-orphan")


class Quiz(Base):
    __tablename__ = "quizzes"

    quiz_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    subject = Column(String, nullable=False)
    topic = Column(String, nullable=True)
    score = Column(Float, nullable=False)     # 0-100
    time_taken_minutes = Column(Float, default=0.0)
    date = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="quizzes")


class Recommendation(Base):
    __tablename__ = "recommendations"

    recommendation_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    message = Column(String, nullable=False)
    kind = Column(String, default="study_plan")  # study_plan / motivation / weak_topic / quantum_priority
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="recommendations")


class Teacher(Base):
    __tablename__ = "teachers"

    teacher_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
