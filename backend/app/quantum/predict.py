"""
Quantum Machine Learning demo for QuantumLearn AI.

What this demonstrates (and what to say in the pitch/demo):
We reframe the quantum layer as an "attention and retention predictor":
given how many days since a topic was last revised, how well the student
has historically scored on it, and how many times they've attempted it,
QSVC (Quantum Support Vector Classifier) predicts whether that topic is
HIGH PRIORITY for revision right now or can wait.

QSVC works by mapping classical features into a quantum feature space using
a parameterized quantum circuit (a "feature map"), then computing a kernel
between data points using that circuit. A classical SVM is then trained on
that quantum kernel. The pitch for judges: quantum kernels can represent
certain non-linear feature correlations (e.g. how forgetting interacts with
repetition count and score history) that are expensive for classical
kernels to represent, which is why this is framed as a research-forward,
not yet definitively "better", exploration - shown honestly alongside a
classical fallback.

For hackathon reliability, we train a small QSVC once at startup on
synthetic-but-realistic data, and always keep a classical fallback
(scikit-learn SVC) in case Qiskit isn't available in the demo environment
(e.g. no internet / slow install) so the demo never breaks.
"""
import numpy as np

_qiskit_available = True
try:
    from qiskit.circuit.library import ZZFeatureMap
    from qiskit_machine_learning.kernels import FidelityQuantumKernel
    from qiskit_machine_learning.algorithms import QSVC
except Exception:  # pragma: no cover - environment without qiskit installed
    _qiskit_available = False

from sklearn.svm import SVC
from sklearn.preprocessing import MinMaxScaler

_model = None
_scaler = None
_backend_used = "classical-fallback"


def _make_training_data():
    """
    Synthetic training data standing in for historical student behaviour.
    Features: [days_since_last_revision, average_score, quiz_attempts]
    Label: 1 = high priority to revise now, 0 = can wait
    Rule used to label the synthetic data (a simple forgetting-curve heuristic):
    priority is high when it's been a while since revision AND the score is
    not yet strong, even if attempts are low.
    """
    rng = np.random.default_rng(42)
    n = 120
    days = rng.uniform(0, 20, n)
    scores = rng.uniform(30, 100, n)
    attempts = rng.integers(1, 10, n)

    labels = ((days > 6) & (scores < 75)).astype(int)

    X = np.column_stack([days, scores, attempts])
    y = labels
    return X, y


def _train():
    global _model, _scaler, _backend_used
    X, y = _make_training_data()

    scaler = MinMaxScaler(feature_range=(0, np.pi))
    X_scaled = scaler.fit_transform(X)

    if _qiskit_available:
        try:
            feature_map = ZZFeatureMap(feature_dimension=X.shape[1], reps=2)
            quantum_kernel = FidelityQuantumKernel(feature_map=feature_map)
            model = QSVC(quantum_kernel=quantum_kernel)
            model.fit(X_scaled, y)
            _backend_used = "qiskit-qsvc"
        except Exception:
            model = SVC(kernel="rbf", probability=True)
            model.fit(X_scaled, y)
            _backend_used = "classical-fallback"
    else:
        model = SVC(kernel="rbf", probability=True)
        model.fit(X_scaled, y)
        _backend_used = "classical-fallback"

    _model = model
    _scaler = scaler


def predict_revision_priority(days_since_last_revision: float, average_score: float, quiz_attempts: int):
    """Returns (priority_label, backend_used) where priority_label is 'high' or 'low'."""
    global _model, _scaler
    if _model is None:
        _train()

    X = np.array([[days_since_last_revision, average_score, quiz_attempts]])
    X_scaled = _scaler.transform(X)
    pred = _model.predict(X_scaled)[0]

    return ("high" if pred == 1 else "low"), _backend_used


def get_backend_status():
    """For a status endpoint / dashboard badge showing which engine actually ran."""
    if _model is None:
        _train()
    return {
        "qiskit_available": _qiskit_available,
        "active_backend": _backend_used,
    }
