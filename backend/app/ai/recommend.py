"""
Classical AI layer for QuantumLearn AI.

For the MVP this uses simple, explainable statistics (grouped averages and a
linear trend fit) rather than a black-box model, because for a hackathon demo
it is more important that judges can see *why* a recommendation was made than
to have a marginally more accurate but opaque model. This module is the
natural place to later drop in a trained scikit-learn model
(e.g. GradientBoostingRegressor on historical student data).
"""
from datetime import datetime
from typing import List, Dict
import numpy as np
import pandas as pd


def build_quiz_dataframe(quizzes) -> pd.DataFrame:
    """Convert a list of Quiz ORM objects into a pandas DataFrame."""
    if not quizzes:
        return pd.DataFrame(columns=["subject", "topic", "score", "date"])
    return pd.DataFrame(
        [
            {
                "subject": q.subject,
                "topic": q.topic or q.subject,
                "score": q.score,
                "date": q.date,
            }
            for q in quizzes
        ]
    )


def get_weak_and_strong_topics(quizzes, weak_threshold: float = 60.0, strong_threshold: float = 80.0):
    """Group quiz scores by topic and classify them as weak / strong."""
    df = build_quiz_dataframe(quizzes)
    if df.empty:
        return [], []

    grouped = df.groupby("topic")["score"].mean().sort_values()
    weak_topics = grouped[grouped < weak_threshold].index.tolist()
    strong_topics = grouped[grouped >= strong_threshold].index.tolist()
    return weak_topics, strong_topics


def predict_next_score(quizzes) -> float:
    """
    Fit a simple linear trend (numpy polyfit, degree 1) over the student's
    quiz scores ordered by time, then project the next likely score.
    This is intentionally lightweight so it works even with very few data
    points, which is the reality in a live demo.
    """
    df = build_quiz_dataframe(quizzes)
    if df.empty:
        return 0.0
    if len(df) == 1:
        return float(df["score"].iloc[0])

    df = df.sort_values("date")
    x = np.arange(len(df))
    y = df["score"].values

    coeffs = np.polyfit(x, y, deg=1)
    next_x = len(df)
    predicted = np.polyval(coeffs, next_x)

    # Clip to a realistic 0-100 range
    return float(np.clip(predicted, 0, 100))


def learning_streak_days(quizzes) -> int:
    """Count consecutive days (up to today) on which the student attempted at least one quiz."""
    df = build_quiz_dataframe(quizzes)
    if df.empty:
        return 0

    dates = sorted({d.date() for d in df["date"]}, reverse=True)
    streak = 0
    expected = datetime.utcnow().date()
    for d in dates:
        if d == expected:
            streak += 1
            expected = expected.fromordinal(expected.toordinal() - 1)
        else:
            break
    return streak


def generate_motivation_message(quizzes, study_hours: float) -> str:
    """
    Rule-based emotional-support layer. Deliberately never says 'you failed'
    or shows anything discouraging; it always proposes a smaller, achievable
    next step, per the product's 'zero-pressure' design principle.
    """
    df = build_quiz_dataframe(quizzes)
    if df.empty:
        return "Welcome! Let's start with a quick 5-minute lesson to build your first streak."

    df = df.sort_values("date")
    recent = df.tail(3)["score"].mean()
    days_since_last = (datetime.utcnow() - df["date"].max()).days

    if days_since_last >= 3:
        return "It's been a few days — no worries. Want to ease back in with a quick 5-minute lesson instead of a full chapter?"
    if recent < 50:
        return "Recent topics have been tough. Let's switch to easier revision and smaller daily goals for a bit."
    if recent >= 80:
        return "Great momentum! You're ready for a slightly harder challenge if you'd like one."
    return "Steady progress. Keep going with today's plan — small consistent steps add up."


def generate_recommendations(weak_topics: List[str], learning_style: str) -> List[str]:
    """Turn weak topics into concrete, style-aware recommendations."""
    style_action = {
        "video": "watch a short video lesson on",
        "reading": "read a simplified summary of",
        "practice": "attempt 5 practice questions on",
        "audio": "listen to an audio lesson on",
    }.get(learning_style, "review")

    return [f"Recommended: {style_action} {topic}" for topic in weak_topics[:5]] or [
        "No weak topics detected yet — keep attempting quizzes so the AI can build your profile."
    ]
