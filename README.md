# QuantumLearn AI

AI + Quantum Machine Learning for Personalized and Inclusive Education.

This is a working MVP: a FastAPI backend (auth, quiz tracking, AI recommendations,
a real Qiskit QSVC quantum model) and a React + Vite + Tailwind frontend
(landing page, register/login, dashboard with charts, quiz page, profile page).

Both halves have been tested end-to-end in this build: register → login →
submit quizzes → AI dashboard → Qiskit quantum priority prediction all work.

---

## Folder Structure

```
QuantumLearnAI/
├── backend/           # FastAPI app
│   ├── app/
│   │   ├── main.py            # app entrypoint
│   │   ├── database.py        # SQLite/PostgreSQL setup
│   │   ├── models.py          # SQLAlchemy tables
│   │   ├── schemas.py         # Pydantic request/response models
│   │   ├── auth.py            # JWT + password hashing
│   │   ├── routers/           # auth, students, quizzes, ai, quantum
│   │   ├── ai/recommend.py    # classical AI logic (weak topics, predicted score, motivation)
│   │   └── quantum/predict.py # Qiskit QSVC revision-priority model
│   └── requirements.txt
│
├── frontend/           # React + Vite + Tailwind
│   └── src/
│       ├── pages/       # Landing, Login, Register, Dashboard, Quiz, Profile
│       ├── components/  # Navbar, ChartCard
│       └── api.js       # fetch wrapper for the backend
│
└── docs/
```

---

## Running the Backend

```bash
cd backend
pip install -r requirements.txt --break-system-packages   # or use a venv
uvicorn app.main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`. Interactive docs (Swagger UI)
are automatically available at `http://localhost:8000/docs` — useful for
demoing the API directly to judges if needed.

SQLite is used by default (`quantumlearn.db` is created automatically on first
run, no setup needed). To switch to PostgreSQL later, only one line changes in
`app/database.py` (`DATABASE_URL`) — the rest of the code is unchanged because
SQLAlchemy abstracts the database dialect.

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`. The Vite dev server proxies any request to
`/api/*` straight through to the FastAPI backend on port 8000 (see
`vite.config.js`), so the two just need to be running side by side — no
extra configuration.

---

## What's actually implemented (not just planned)

- **Register / Login** with JWT auth and hashed passwords
- **Student profile**: learning style, accessibility preference, preferred
  language, study hours, target score — editable after registration
- **Quiz submission**: sample MCQs for Physics and Math wired to a real
  `/quizzes` endpoint that stores attempts in the database
- **AI dashboard** (`/ai/dashboard`):
  - Weak / strong topics grouped from real quiz history (pandas groupby)
  - Predicted next score via a linear trend fit (numpy polyfit)
  - Learning streak counter
  - Rule-based, zero-pressure motivation messages
- **Quantum ML** (`/quantum/priority`): a QSVC (Quantum Support Vector
  Classifier) built with Qiskit + Qiskit Machine Learning, trained at startup
  on a synthetic forgetting-curve dataset, predicting whether a topic is high
  or low priority to revise right now. Falls back to a classical SVM
  automatically if Qiskit isn't available in the run environment, so the demo
  never breaks — the frontend shows a badge indicating which engine actually
  ran (`/quantum/status`).
- **Dashboard charts** (Recharts): quiz score progress over attempts, average
  score by subject

## What's scaffolded as roadmap (mentioned in the pitch, not built for the demo)

- Teacher and Parent dashboards (student dashboard is fully built; the same
  API/data model extends naturally to these — described in the pitch deck)
- Tanglish/regional language content generation (Bhashini/IndicTrans2
  integration point is documented but not wired up)
- Sign language video/avatar delivery
- Voice AI tutor, AR/VR modules, wearable integration

Being upfront about this split is intentional — it's a stronger position in
front of judges than claiming everything is built when only the core loop is.

---

# QuantumLearn AI 2.0 additions

The original MVP flow is preserved. New capabilities are implemented as additive `/intelligence/*` APIs and separate React routes.

### Phase 1 — Knowledge / Mastery Engine
- Explainable topic mastery score using historical performance, recent performance, consistency and practice count.
- Revision gap, error rate, trend and priority score per topic.

### Phase 2 — Adaptive Learning Plan
- Generates a daily plan from the student's current mastery and revision priority.
- Study duration respects the student's saved study-hours preference.

### Phase 3 — AI / Adaptive Personalized Quizzes
- Generates a lightweight adaptive quiz targeted at the student's highest-priority topics.
- Results feed back into the existing quiz history and therefore update the learning model.

### Phase 4 — Knowledge Graph
- Represents prerequisite relationships between concepts.
- Mastery is displayed on each concept node; curriculum mappings can be expanded without changing the student-data model.

### Phase 5 — Teacher Dashboard + Early Warning
- Live class analytics from the database rather than hard-coded demo numbers.
- At-risk signals based on mastery, declining trend, revision gaps and practice volume.
- Class weakness map and student-level signals.

### Phase 6 — Quantum vs Classical Experiment
- Controlled synthetic benchmark comparing an RBF SVM with the active QSVC/fallback engine.
- Accuracy and F1 are shown transparently.
- The benchmark explicitly does **not** claim quantum advantage; it is an experiment dashboard.

### Phase 7 — Product / Deployment / Evaluation
- Added backend Dockerfile and environment templates.
- Added automated tests for the new adaptive intelligence layer.
- Added a deployment-ready project structure while retaining SQLite for zero-setup demos.

## New routes
- `/intelligence` — Learning Intelligence Center
- `/adaptive-quiz` — Personalized adaptive quiz
- `/knowledge-graph` — Concept graph
- `/quantum-lab` — Model comparison experiment
- `/teacher` — Live teacher intelligence dashboard

## Local run
Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Frontend:
```bash
cd frontend
npm install
npm run dev
```

For production, set a strong `SECRET_KEY`, configure `DATABASE_URL`, build the frontend with `npm run build`, and serve the generated `dist` through a static host/reverse proxy. Do not expose a real Groq API key in a public frontend build; the existing client-side tutor integration is retained for backward compatibility and should be moved server-side before public deployment.

## Groq AI setup (secure)

Groq is called from the FastAPI backend so the API key is never exposed in the React bundle or browser console.

1. Copy `backend/.env.example` to `backend/.env`.
2. Put a **newly generated/rotated** Groq API key in `GROQ_API_KEY`.
3. Restart FastAPI after changing the key.
4. Start the React frontend normally.

The frontend uses `/api/ai/chat` and `/api/ai/study-plan`; Vite proxies these requests to FastAPI.

> Security: never commit or paste a real Groq key into `frontend/.env`, React source code, GitHub, or screenshots.

### Windows

```cmd
cd QuantumLearnAI\QuantumLearnAI\backend
copy .env.example .env
notepad .env
python -m uvicorn app.main:app --reload --port 8000
```

In another CMD window:

```cmd
cd QuantumLearnAI\QuantumLearnAI\frontend
npm install
npm run dev
```
