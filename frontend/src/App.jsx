import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Quiz from "./pages/Quiz.jsx";
import Profile from "./pages/Profile.jsx";
import LearningHub from "./pages/LearningHub";
import AIAssistant from "./pages/AIAssistant";
import TeacherDashboard from "./pages/TeacherDashboard";
import IntelligenceHub from "./pages/IntelligenceHub.jsx";
import AdaptiveQuiz from "./pages/AdaptiveQuiz.jsx";
import KnowledgeGraph from "./pages/KnowledgeGraph.jsx";
import QuantumLab from "./pages/QuantumLab.jsx";
import AccessibilityNavigator from "./components/AccessibilityNavigator.jsx";




function isAuthenticated() {
  return Boolean(localStorage.getItem("quantumlearn_token"));
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AccessibilityNavigator />
      <Routes>
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/intelligence" element={<ProtectedRoute><IntelligenceHub /></ProtectedRoute>} />
        <Route path="/adaptive-quiz" element={<ProtectedRoute><AdaptiveQuiz /></ProtectedRoute>} />
        <Route path="/knowledge-graph" element={<ProtectedRoute><KnowledgeGraph /></ProtectedRoute>} />
        <Route path="/quantum-lab" element={<ProtectedRoute><QuantumLab /></ProtectedRoute>} />
        
    <Route path="/learning" element={<LearningHub />} />
<Route path="/assistant" element={<AIAssistant />} />
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
