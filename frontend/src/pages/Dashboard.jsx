import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import Navbar from "../components/Navbar.jsx";
import { api } from "../api.js";
import Hero from "../components/Hero";
import GlassCard from "../components/GlassCard";
import { speak } from "../utils/speech";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [quantumResult, setQuantumResult] = useState(null);
  const [quantumStatus, setQuantumStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [xp, setXP] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [profileData, dashboardData, quizData, statusData] = await Promise.all([
          api.getProfile(),
          api.getDashboard(),
          api.listQuizzes(),
          api.getQuantumStatus(),
        ]);
        setProfile(profileData);
        setDashboard(dashboardData);
        setQuizzes(quizData);
        setQuantumStatus(statusData);
        speak(
  `Welcome ${profileData.name}.
  Your AI confidence is ${dashboardData.predicted_score} percent.
  Learning streak ${dashboardData.learning_streak_days} days.
  You currently have ${Number(localStorage.getItem("xp") || 0)} experience points.`
);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
    const savedXP = Number(localStorage.getItem("xp") || 0);
setXP(savedXP);
  }, []);
  useEffect(() => {
  function updateXP() {
    setXP(Number(localStorage.getItem("xp") || 0));
  }

  window.addEventListener("xpUpdated", updateXP);

  return () => {
    window.removeEventListener("xpUpdated", updateXP);
  };
}, []);

  async function runQuantumDemo() {
    if (!quizzes.length) return;
    const subject = quizzes[0].subject;
    const avgScore = quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length;
    const daysSince = Math.max(
      0,
      Math.floor((Date.now() - new Date(quizzes[0].date)) / (1000 * 60 * 60 * 24))
    );
    const result = await api.getQuantumPriority({
      subject,
      days_since_last_revision: daysSince,
      average_score: avgScore,
      quiz_attempts: quizzes.length,
    });
    setQuantumResult(result);
  }

  if (loading) return <CenteredMessage text="Loading your dashboard..." />;
  if (error) return <CenteredMessage text={error} isError />;

  const chartData = [...quizzes]
    .reverse()
    .map((q, i) => ({ attempt: `#${i + 1}`, score: q.score, subject: q.subject }));

  const subjectAverages = Object.values(
  quizzes.reduce((acc, q) => {

    let subject = q.subject;

    // Normalize subject names
    if (subject.toLowerCase() === "math") {
      subject = "Mathematics";
    }

    acc[subject] = acc[subject] || {
      subject,
      total: 0,
      count: 0,
    };

    acc[subject].total += q.score;
    acc[subject].count += 1;

    return acc;
  }, {})
).map((s) => ({
  subject: s.subject,
  avgScore: Math.round(s.total / s.count),
}));

  return (
<div className="min-h-screen bg-gray-100 dark:bg-slate-950 transition-all duration-300">
        <Navbar studentName={profile?.name} />

      <main className="max-w-7xl mx-auto px-8 py-8">

    <Hero
        profile={profile}
        quantumStatus={quantumStatus}
    />

    <div className="grid lg:grid-cols-4 gap-6 mb-8">

        <GlassCard className="p-6">

            <p className="text-cyan-400 text-sm uppercase tracking-wider">

                AI Confidence

            </p>

            <h2 className="text-5xl font-black text-slate-900 dark:text-slate-900 dark:text-white mt-4">

                {dashboard.predicted_score}%

            </h2>

            <p className="text-slate-600 dark:text-slate-600 dark:text-slate-400 mt-3">

                Based on your learning behaviour and quiz history.

            </p>

        </GlassCard>

        <GlassCard className="p-6">

            <p className="text-purple-400 text-sm uppercase tracking-wider">

                Learning Streak

            </p>

            <h2 className="text-5xl font-black text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-white mt-4">

                {dashboard.learning_streak_days}

            </h2>

            <p className="text-slate-600 dark:text-slate-600 dark:text-slate-400 mt-3">

                Consecutive learning days.

            </p>

        </GlassCard>

        <GlassCard className="p-6">

            <p className="text-green-400 text-sm uppercase tracking-wider">

                Quantum Status

            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-900 dark:text-white mt-5">

                {quantumStatus?.active_backend==="qiskit-qsvc"

                ?"Quantum Active"

                :"Classical Mode"}

            </h2>

            <div className="mt-6 flex items-center gap-2">

                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>

                <span className="text-green-300">

                    Live

                </span>

            </div>

        </GlassCard>
        <GlassCard className="p-6">

    <p className="text-yellow-400 text-sm uppercase tracking-wider">
        ⭐ Total XP
    </p>

    <h2 className="text-5xl font-black text-slate-900 dark:text-white mt-4">
        {xp}
    </h2>

    <p className="text-slate-600 dark:text-slate-400 mt-3">
        Experience earned from quizzes.
    </p>

</GlassCard>

    </div>
    


        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-900 dark:text-white">
                📈 Quiz Performance
              </h2>

              <span className="text-cyan-400 text-sm">
                AI Tracking
              </span>
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="attempt" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }} />
                  <Line type="monotone" dataKey="score" stroke="#8b7aff" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartHint />
            )}
          </GlassCard>

          <GlassCard className="p-6">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-900 dark:text-white">
      📚 Subject Analytics
    </h2>

    <span className="text-purple-400 text-sm">
      Live
    </span>
  </div>
            {subjectAverages.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={subjectAverages}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="subject" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }} />
                  <Bar dataKey="avgScore" fill="#6c4fff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartHint />
            )}
          </GlassCard>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <GlassCard className="p-6">

<h2 className="text-xl font-bold text-red-300 mb-5">
⚠ Weak Topics
</h2>
            {dashboard.weak_topics.length > 0 ? (
              <ul className="space-y-2">
                {dashboard.weak_topics.map((t) => (
                  <li key={t} className="text-sm text-red-300 bg-red-950/40 rounded-md px-3 py-2">
                    {t}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-600 dark:text-slate-500 text-sm">None yet — attempt a few quizzes to see this.</p>
            )}
          </GlassCard>

          <GlassCard className="p-6">

<h2 className="text-xl font-bold text-green-300 mb-5">
✅ Strong Topics
</h2>
            {dashboard.strong_topics.length > 0 ? (
              <ul className="space-y-2">
                {dashboard.strong_topics.map((t) => (
                  <li key={t} className="text-sm text-green-300 bg-green-950/40 rounded-md px-3 py-2">
                    {t}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-600 dark:text-slate-500 text-sm">Keep going — your strong topics will show up here.</p>
            )}
          </GlassCard>
        </div>

        <GlassCard className="p-6 mb-8">

          <div className="flex items-center gap-3 mb-5">

          <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-2xl">
          
          </div>

          <div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-white">
          AI Learning Coach
          </h2>

          <p className="text-slate-600 dark:text-slate-600 dark:text-slate-400 text-sm">
          Personalized recommendations
          </p>

          </div>

          </div>
          <ul className="space-y-2">
            {dashboard.recommendations.map((r, i) => (
              <li key={i} className="text-sm text-slate-200 bg-slate-800/60 rounded-md px-3 py-2">
                {r}
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-6 mt-8">

<div className="flex justify-between items-center mb-5">

<div>

<h2 className="text-2xl font-bold text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-white">
 Quantum ML Prediction
</h2>

<p className="text-slate-600 dark:text-slate-600 dark:text-slate-400">
Revision Priority Engine
</p>

</div>

<div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse"></div>

</div>
          <p className="text-sm text-slate-600 dark:text-slate-600 dark:text-slate-400 mb-3">
            Engine active:{" "}
            <span className="text-quantum-400 font-medium">
              {quantumStatus?.active_backend === "qiskit-qsvc" ? "Qiskit QSVC (quantum kernel)" : "Classical fallback"}
            </span>
          </p>
          <button
            onClick={runQuantumDemo}
            disabled={!quizzes.length}
            className="px-4 py-2 rounded-md bg-quantum-500 hover:bg-quantum-600 disabled:opacity-50 text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-white text-sm font-medium transition"
          >
            Run Prediction on My Data
          </button>
          {quantumResult && (
            <div className="mt-4 text-sm text-slate-200 bg-slate-800/60 rounded-md px-3 py-3">
              Subject <span className="font-medium">{quantumResult.subject}</span> is{" "}
              <span className={quantumResult.priority === "high" ? "text-red-300 font-semibold" : "text-green-300 font-semibold"}>
                {quantumResult.priority.toUpperCase()} PRIORITY
              </span>{" "}
              for revision right now.
            </div>
          )}
          {!quizzes.length && (
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-500">Attempt a quiz first so the model has data to work with.</p>
          )}
        </GlassCard>
      </main>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? "bg-quantum-500/10 border-quantum-500/40" : "bg-white dark:bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"}`}>
      <p className="text-xs text-slate-600 dark:text-slate-600 dark:text-slate-600 dark:text-slate-400">{label}</p>
      <p className={`text-xl font-semibold ${accent ? "text-quantum-300" : "text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-white"}`}>{value}</p>
    </div>
  );
}

function EmptyChartHint() {
  return <p className="text-slate-600 dark:text-slate-500 text-sm py-12 text-center">Attempt a quiz to see your progress here.</p>;
}

function CenteredMessage({ text, isError }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className={isError ? "text-red-300" : "text-slate-600 dark:text-slate-600 dark:text-slate-600 dark:text-slate-400"}>{text}</p>
    </div>
  );
}
