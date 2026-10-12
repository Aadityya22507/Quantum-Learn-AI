from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from collections import defaultdict
from datetime import datetime
import numpy as np
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier

from .. import models, auth, schemas
from ..database import get_db
from ..ai.adaptive import topic_stats, build_learning_plan, early_risk
from ..ai.ml_engine import analyze as ml_analyze
from ..quantum.predict import predict_revision_priority, get_backend_status

router = APIRouter(prefix="/intelligence", tags=["adaptive intelligence"])


def get_quizzes(db, student_id):
    return db.query(models.Quiz).filter(models.Quiz.student_id == student_id).order_by(models.Quiz.date.asc()).all()

@router.get("/ml-analysis")
def ml_analysis(db: Session = Depends(get_db), current_student: models.Student = Depends(auth.get_current_student)):
    """Classical ML layer: Random Forest + Gradient Boosting + revision classifier."""
    return ml_analyze(get_quizzes(db, current_student.id))

@router.get("/mastery")
def mastery(db: Session = Depends(get_db), current_student: models.Student = Depends(auth.get_current_student)):
    rows = topic_stats(get_quizzes(db, current_student.id))
    return {"topics": rows, "overall_mastery": round(sum(r["mastery"] for r in rows)/len(rows), 1) if rows else 0}

@router.get("/plan")
def plan(db: Session = Depends(get_db), current_student: models.Student = Depends(auth.get_current_student)):
    return build_learning_plan(get_quizzes(db, current_student.id), current_student.study_hours or 1)

@router.get("/quiz")
def adaptive_quiz(db: Session = Depends(get_db), current_student: models.Student = Depends(auth.get_current_student)):
    stats = topic_stats(get_quizzes(db, current_student.id))
    targets = [r["topic"] for r in sorted(stats, key=lambda x: x["priority_score"], reverse=True)[:3]]
    if not targets:
        targets = ["Fundamentals", "Problem Solving", "Revision"]
    questions = []
    templates = [
        ("Which action is most likely to improve your mastery of {topic}?", ["Focused practice", "Skip the topic", "Only reread the title", "Stop attempting questions"], 0),
        ("If your recent performance in {topic} is falling, what should the adaptive system do first?", ["Increase targeted revision", "Delete the history", "Ignore the trend", "Randomize every subject"], 0),
        ("Why does {topic} receive a higher priority when the revision gap increases?", ["Retention can decay without practice", "The topic becomes easier automatically", "Scores are no longer relevant", "Attempts are deleted"], 0),
        ("Which metric best represents current mastery of {topic}?", ["A combination of recent and historical performance", "Only the first quiz", "Only time spent logged in", "Only the student's name"], 0),
        ("What is the goal of a personalized quiz on {topic}?", ["Target the student's current learning need", "Give everyone identical questions", "Remove feedback", "Avoid weak areas"], 0),
    ]
    for i in range(5):
        topic = targets[i % len(targets)]
        q, opts, ans = templates[i]
        questions.append({"id": i + 1, "topic": topic, "question": q.format(topic=topic), "options": opts, "answer_index": ans, "difficulty": "adaptive"})
    return {"mode": "adaptive", "targets": targets, "questions": questions}

@router.get("/graph")
def knowledge_graph(db: Session = Depends(get_db), current_student: models.Student = Depends(auth.get_current_student)):
    rows = topic_stats(get_quizzes(db, current_student.id))
    edges = []
    for r in rows:
        # Lightweight prerequisite graph; real curriculum mappings can replace this dictionary later.
        prereq = {"Integration": "Derivatives", "Differential Equations": "Integration", "Trees": "Linked Lists", "Recursion": "Functions"}.get(r["topic"])
        if prereq:
            edges.append({"from": prereq, "to": r["topic"]})
    nodes = [{"id": r["topic"], "mastery": r["mastery"], "level": r["level"]} for r in rows]
    known = {n["id"] for n in nodes}
    for e in edges:
        if e["from"] not in known:
            nodes.append({"id": e["from"], "mastery": 0, "level": "Prerequisite"})
    return {"nodes": nodes, "edges": edges, "description": "A concept relationship map showing prerequisite dependencies and mastery."}

@router.get("/quantum-experiment")
def quantum_experiment():
    rng = np.random.default_rng(42)
    X = np.column_stack([rng.uniform(0, 20, 160), rng.uniform(30, 100, 160), rng.integers(1, 10, 160)])
    y = ((X[:,0] > 6) & (X[:,1] < 75)).astype(int)
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=.25, random_state=42, stratify=y)
    scaler = MinMaxScaler(feature_range=(0, np.pi))
    a, b = scaler.fit_transform(Xtr), scaler.transform(Xte)
    classical = SVC(kernel="rbf").fit(a, ytr)
    rows = [{"model":"RBF SVM", "accuracy":round(accuracy_score(yte, classical.predict(b)),3), "f1":round(f1_score(yte, classical.predict(b)),3), "engine":"classical"}]
    status = get_backend_status()
    # The QSVC is already trained on the same feature design; use a fresh prediction probe and report availability.
    if status["active_backend"] == "qiskit-qsvc":
        from ..quantum.predict import _model as qmodel
        try:
            qp = qmodel.predict(b)
            rows.append({"model":"QSVC", "accuracy":round(accuracy_score(yte, qp),3), "f1":round(f1_score(yte, qp),3), "engine":"quantum"})
        except Exception:
            pass
    else:
        rows.append({"model":"QSVC / fallback SVM", "accuracy":rows[0]["accuracy"], "f1":rows[0]["f1"], "engine":"fallback"})
    return {"backend": status, "results": rows, "note":"Metrics are a controlled synthetic benchmark for model comparison, not a claim of quantum advantage."}

@router.get("/teacher")
def teacher_analytics(db: Session = Depends(get_db)):
    students = db.query(models.Student).all()
    all_rows, topic_scores = [], defaultdict(list)
    for s in students:
        rows = topic_stats(s.quizzes)
        if not rows: continue
        for r in rows: topic_scores[r["topic"]].append(r["average_score"])
        overall = sum(r["mastery"] for r in rows)/len(rows)
        risk = max([early_risk(r)[0] for r in rows] or [0])
        reasons = sorted({x for r in rows for x in early_risk(r)[1]})
        all_rows.append({"id":s.id,"name":s.name,"email":s.email,"mastery":round(overall,1),"risk":risk,"reasons":reasons})
    weak = sorted(({"topic":k,"average":round(sum(v)/len(v),1)} for k,v in topic_scores.items()), key=lambda x:x["average"])
    return {"total_students":len(students),"active_students":len(all_rows),"at_risk":[s for s in all_rows if s["risk"]>=50],"students":all_rows,"weak_topics":weak[:10]}
