"""
Database configuration.
Uses SQLite for the MVP. To move to PostgreSQL later, just change
DATABASE_URL to something like:
    postgresql://user:password@localhost:5432/quantumlearn
and add `psycopg2-binary` to requirements.txt. No other code changes needed
because SQLAlchemy handles the dialect differences.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./quantumlearn.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # needed only for SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a DB session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
