"""QuantumLearn 2.0 adaptive intelligence helpers.
Keeps the original MVP logic untouched and adds a richer, explainable student model.
"""
from collections import defaultdict
from datetime import datetime
from typing import Dict, List
import math


def topic_stats(quizzes) -> List[dict]:
    grouped = defaultdict(list)
    dates = defaultdict(list)
    for q in quizzes:
        topic = q.topic or q.subject
        grouped[topic].append(float(q.score))
        dates[topic].append(q.date)

    rows = []
    now = datetime.utcnow()
    for topic, scores in grouped.items():
        avg = sum(scores) / len(scores)
        recent = sum(scores[-3:]) / min(3, len(scores))
        trend = recent - avg
        last = max(dates[topic])
        days = max(0, (now - last).days)
        consistency = max(0.0, 100.0 - (max(scores) - min(scores)))
        # Explainable mastery model: performance, recency, consistency and practice.
        mastery = (
            avg * 0.55
            + recent * 0.20
            + min(consistency, 100) * 0.10
            + min(len(scores) * 5, 15) * 0.15
        )
        mastery = max(0.0, min(100.0, mastery))
        error_rate = 100.0 - avg
        priority = min(100.0, max(0.0,
            (100 - mastery) * 0.55 + min(days * 6, 36) + min(error_rate * 0.25, 25)
        ))
        rows.append({
            "topic": topic, "average_score": round(avg, 1), "recent_score": round(recent, 1),
            "trend": round(trend, 1), "mastery": round(mastery, 1),
            "days_since_revision": days, "attempts": len(scores),
            "error_rate": round(error_rate, 1), "priority_score": round(priority, 1),
            "level": "Mastered" if mastery >= 80 else "Developing" if mastery >= 60 else "Needs Attention",
        })
    return sorted(rows, key=lambda x: x["mastery"])


def build_learning_plan(quizzes, study_hours: float = 1.0) -> dict:
    stats = topic_stats(quizzes)
    minutes = max(20, int(float(study_hours or 1) * 60))
    if not stats:
        return {"total_minutes": minutes, "items": [{"topic": "Start a baseline quiz", "minutes": min(20, minutes), "reason": "No learning history yet"}]}
    ranked = sorted(stats, key=lambda x: x["priority_score"], reverse=True)
    slots = []
    remaining = minutes
    for row in ranked[:5]:
        if remaining <= 0: break
        block = min(25, remaining) if row["priority_score"] >= 45 else min(15, remaining)
        slots.append({"topic": row["topic"], "minutes": block,
                      "reason": f"{row['level']} · mastery {row['mastery']}% · {row['days_since_revision']} day(s) since revision"})
        remaining -= block
    if remaining > 0:
        slots.append({"topic": "Mixed revision quiz", "minutes": remaining, "reason": "Check retention after focused practice"})
    return {"total_minutes": minutes, "items": slots}


def early_risk(row: dict) -> tuple[int, List[str]]:
    reasons = []
    risk = 0
    if row["mastery"] < 50: risk += 35; reasons.append("low mastery")
    elif row["mastery"] < 65: risk += 20; reasons.append("developing mastery")
    if row["trend"] < -10: risk += 25; reasons.append("declining recent performance")
    if row["days_since_revision"] >= 7: risk += 20; reasons.append("long revision gap")
    if row["attempts"] < 2: risk += 10; reasons.append("limited practice")
    return min(100, risk), reasons
