# QuantumLearn AI 2.0 Upgrade Map

## What stayed unchanged
The original authentication, student profile, original quiz submission API, original AI dashboard, original quantum priority API, existing charts, accessibility helpers, and existing routes remain in place.

## New additive layer
1. `backend/app/ai/adaptive.py` — mastery, priority, risk and adaptive-plan calculations.
2. `backend/app/routers/advanced.py` — new `/intelligence/*` APIs.
3. `frontend/src/pages/IntelligenceHub.jsx` — learning intelligence center.
4. `frontend/src/pages/AdaptiveQuiz.jsx` — personalized quiz.
5. `frontend/src/pages/KnowledgeGraph.jsx` — concept/prerequisite view.
6. `frontend/src/pages/QuantumLab.jsx` — classical-vs-quantum experiment dashboard.
7. `TeacherDashboard.jsx` — replaces the old placeholder numbers with live database analytics.

## Demo flow
Login → Dashboard → Intelligence Center → Mastery → Adaptive Plan → Adaptive Quiz → Knowledge Graph → Quantum Lab → Teacher Dashboard.

## Production notes
- Set `SECRET_KEY` through environment variables.
- Move the Groq request server-side before exposing the application publicly.
- Replace SQLite with PostgreSQL for multi-user production deployments.
- Replace the lightweight prerequisite dictionary with a curriculum-authoring system.
- Replace the controlled synthetic benchmark with a labeled real-world educational dataset before making model-performance claims.

## Accessibility Navigation Layer (added)

The existing accessibility toggle remains unchanged as the user-facing switch. When enabled, the new navigation layer:
- Announces buttons, links, headings, images, and form controls as the mouse hovers over them.
- Announces keyboard-focused controls for users who navigate without sight.
- Warns when the pointer reaches the top, bottom, left, or right edge of the browser viewport.
- Announces touch interaction when a touch pointer is detected.
- Uses the existing browser Speech Synthesis API; no API key is required for voice navigation.

This is an accessibility aid, not a replacement for a full screen reader. The project continues to work normally when Accessibility Mode is OFF.

## Hybrid AI architecture

The learning intelligence is layered so existing features remain available:
1. **Classical ML:** Random Forest, Gradient Boosting, and revision-priority classification analyze quiz-derived learning signals.
2. **Learning intelligence:** mastery, adaptive plan, personalized quiz, knowledge graph, and teacher early-warning logic continue to operate.
3. **Quantum ML:** QSVC/classical comparison remains available in Quantum Lab as a controlled experiment.
4. **LLM:** the AI tutor/explanation layer is served through the FastAPI backend; secrets remain outside the frontend.
5. **Voice/accessibility:** browser Speech Synthesis provides the accessibility narration layer.
