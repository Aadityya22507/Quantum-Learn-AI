from datetime import datetime, timedelta
from types import SimpleNamespace
from app.ai.adaptive import topic_stats, build_learning_plan

def q(topic, score, days):
    return SimpleNamespace(topic=topic, subject=topic, score=score, date=datetime.utcnow()-timedelta(days=days))

def test_mastery_and_plan():
    quizzes=[q("Calculus",40,8),q("Calculus",50,4),q("Python",90,1),q("Python",85,0)]
    rows=topic_stats(quizzes)
    assert rows and rows[0]["topic"]=="Calculus"
    assert 0 <= rows[0]["mastery"] <= 100
    plan=build_learning_plan(quizzes,1)
    assert plan["items"]
    assert sum(x["minutes"] for x in plan["items"]) == plan["total_minutes"]
