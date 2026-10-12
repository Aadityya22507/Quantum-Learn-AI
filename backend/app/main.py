from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from . import models
from .database import engine
from .routers import auth_router, students, quizzes, ai, quantum, advanced, groq

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="QuantumLearn AI API",
    description="AI + Quantum ML powered personalized learning backend",
    version="0.1.0",
)

# Allow the Vite dev server (and any origin during the hackathon demo) to call the API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(students.router)
app.include_router(quizzes.router)
app.include_router(ai.router)
app.include_router(quantum.router)
app.include_router(advanced.router)
app.include_router(groq.router)


@app.get("/")
def root():
    return {"status": "QuantumLearn AI backend is running"}
