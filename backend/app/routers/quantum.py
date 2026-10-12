from fastapi import APIRouter, Depends

from .. import models, schemas, auth
from ..quantum import predict as quantum_predict

router = APIRouter(prefix="/quantum", tags=["quantum"])


@router.post("/priority")
def revision_priority(
    request: schemas.QuantumPriorityRequest,
    current_student: models.Student = Depends(auth.get_current_student),
):
    priority, backend = quantum_predict.predict_revision_priority(
        request.days_since_last_revision,
        request.average_score,
        request.quiz_attempts,
    )
    return {
        "subject": request.subject,
        "priority": priority,
        "engine": backend,
    }


@router.get("/status")
def quantum_status():
    """Lets the frontend show a badge: 'Running on Qiskit QSVC' vs classical fallback."""
    return quantum_predict.get_backend_status()
