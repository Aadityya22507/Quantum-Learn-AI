"""Explainable classical ML layer for QuantumLearn AI.

This module is additive: it does not replace the existing recommendation logic.
It trains lightweight models from the student's quiz history when enough data
is available and returns a transparent fallback for very small histories.
"""
from collections import defaultdict
from datetime import datetime
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline


def _rows(quizzes):
    grouped = defaultdict(list)
    for q in quizzes:
        grouped[q.topic or q.subject].append(q)

    out = []
    now = datetime.utcnow()
    for topic, qs in grouped.items():
        qs = sorted(qs, key=lambda q: q.date)
        scores = [float(q.score) for q in qs]
        avg = float(np.mean(scores))
        recent = float(np.mean(scores[-3:]))
        trend = recent - avg
        days = max(0, (now - qs[-1].date).days)
        attempts = len(qs)
        mastery = max(0, min(100, 0.55 * avg + 0.25 * recent + 0.20 * min(100, attempts * 10)))
        priority = max(0, min(100, (100 - mastery) * 0.55 + min(days * 6, 36) + (100 - avg) * 0.20))
        out.append({
            "topic": topic, "average_score": avg, "recent_score": recent,
            "trend": trend, "days_since_revision": days, "attempts": attempts,
            "mastery": mastery, "priority_score": priority,
        })
    return out


def analyze(quizzes):
    rows = _rows(quizzes)
    if not rows:
        return {"status": "no_data", "models": [], "topics": []}

    X = np.array([[r["average_score"], r["recent_score"], r["trend"], r["days_since_revision"], r["attempts"]] for r in rows], dtype=float)
    y_mastery = np.array([r["mastery"] for r in rows], dtype=float)
    y_priority = np.array([1 if r["priority_score"] >= 55 else 0 for r in rows], dtype=int)

    # There may be only a few topics in a real student's early history. Fit
    # models on a tiny dataset safely; models are supplemental, not blocking.
    if len(rows) >= 3:
        rf = RandomForestRegressor(n_estimators=80, random_state=42, min_samples_leaf=1).fit(X, y_mastery)
        gb = GradientBoostingRegressor(random_state=42, n_estimators=60, max_depth=2).fit(X, y_mastery)
        models = ["Random Forest — performance/mastery signal", "Gradient Boosting — mastery trend signal"]
        rf_pred = rf.predict(X)
        gb_pred = gb.predict(X)
    else:
        rf_pred = y_mastery.copy()
        gb_pred = y_mastery.copy()
        models = ["Random Forest — awaiting more topic history", "Gradient Boosting — awaiting more topic history"]

    if len(np.unique(y_priority)) >= 2 and len(rows) >= 4:
        clf = Pipeline([("scale", StandardScaler()), ("rf", RandomForestClassifier(n_estimators=80, random_state=42, class_weight="balanced"))])
        clf.fit(X, y_priority)
        priority_pred = clf.predict(X)
        classifier_name = "Random Forest Classification — revision priority"
    else:
        priority_pred = y_priority.copy()
        classifier_name = "Revision Priority Classification — rule-backed fallback until more labels exist"

    topics = []
    for i, r in enumerate(rows):
        ml_mastery = float(np.mean([rf_pred[i], gb_pred[i]]))
        topics.append({
            **r,
            "ml_mastery": round(max(0, min(100, ml_mastery)), 1),
            "revision_priority": "HIGH" if int(priority_pred[i]) else "NORMAL",
        })

    return {
        "status": "trained" if len(rows) >= 3 else "cold_start",
        "models": models + [classifier_name],
        "features": ["average score", "recent score", "trend", "days since revision", "attempt count"],
        "topics": sorted(topics, key=lambda x: x["priority_score"], reverse=True),
        "note": "Models are student-specific and explainable; they supplement the existing learning engine rather than replacing it."
    }
