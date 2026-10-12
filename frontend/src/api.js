// All requests go through the /api prefix, which vite.config.js proxies to
// the FastAPI backend running on http://localhost:8000. This means the
// frontend code never needs to know the backend's real host/port.
const BASE = "/api";

function getToken() {
  return localStorage.getItem("quantumlearn_token");
}

export function setToken(token) {
  localStorage.setItem("quantumlearn_token", token);
}

export function clearToken() {
  localStorage.removeItem("quantumlearn_token");
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = data?.detail || "Something went wrong. Please try again.";
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }
  return data;
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),

  getProfile: () => request("/students/me", { auth: true }),
  updateProfile: (payload) => request("/students/me", { method: "PUT", body: payload, auth: true }),

  submitQuiz: (payload) => request("/quizzes/", { method: "POST", body: payload, auth: true }),
  listQuizzes: () => request("/quizzes/", { auth: true }),

  getDashboard: () => request("/ai/dashboard", { auth: true }),
  getRecommendationHistory: () => request("/ai/recommendations", { auth: true }),

  getQuantumStatus: () => request("/quantum/status"),
  getQuantumPriority: (payload) => request("/quantum/priority", { method: "POST", body: payload, auth: true }),

  getMastery: () => request("/intelligence/mastery", { auth: true }),
  getLearningPlan: () => request("/intelligence/plan", { auth: true }),
  getMLAnalysis: () => request("/intelligence/ml-analysis", { auth: true }),
  getAdaptiveQuiz: () => request("/intelligence/quiz", { auth: true }),
  getKnowledgeGraph: () => request("/intelligence/graph", { auth: true }),
  getQuantumExperiment: () => request("/intelligence/quantum-experiment"),
  getTeacherAnalytics: () => request("/intelligence/teacher"),
  aiChat: (payload) => request("/ai/chat", { method: "POST", body: payload }),
  generateStudyPlan: () => request("/ai/study-plan", { method: "POST" }),

};
