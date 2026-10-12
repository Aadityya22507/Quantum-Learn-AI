import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { speak } from "../utils/speech";
import { api } from "../api";

export default function LearningHub() {
  const navigate = useNavigate();

  const [showVideos, setShowVideos] = useState(false);
  const [studyPlan, setStudyPlan] = useState("");


  const icons = {
  Mathematics: "📐",
  Physics: "⚛️",
  Chemistry: "🧪",
  "Computer Science": "💻",
  "English Grammar": "📖",
  "General Aptitude": "🧠",
};

  const videos = {
  Mathematics: "https://www.youtube.com/@KhanAcademy",
  Physics: "https://www.youtube.com/@PW-Foundation",
  Chemistry: "https://www.youtube.com/@KhanAcademy",
  "Computer Science": "https://www.youtube.com/@freecodecamp",
  "English Grammar": "https://www.youtube.com/@BBCLearningEnglish",
  "General Aptitude": "https://www.youtube.com/results?search_query=Aptitude+Placement+Preparation",
};

async function generateStudyPlan() {
  try {
    setStudyPlan("Generating your AI study plan... 📅");
    const result = await api.generateStudyPlan();
    const plan = result?.content || "No study plan was returned.";
    setStudyPlan(plan);
    speak(plan);
  } catch (err) {
    console.error(err);
    setStudyPlan(`❌ ${err.message}`);
  }
}
  

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 transition-all duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-10">

        <h1 className="text-5xl font-black text-slate-900 dark:text-white">
          📚 Continue Learning
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mt-3">
          Choose your preferred learning method.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">

          {/* Video */}

          <div
  onMouseEnter={() => speak("Video Learning")}
  onClick={() => setShowVideos(!showVideos)}
            className="cursor-pointer rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:scale-105 hover:border-cyan-400 transition"
          >
            <div className="text-6xl mb-6">🎥</div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Video Learning
            </h2>

            <p className="mt-3 text-slate-500">
              Watch recommended YouTube lessons.
            </p>
          </div>

          {/* Notes */}

<div
  onMouseEnter={() => speak("Notes")}
  onClick={() => alert("📄 Notes will be added soon.")}
  className="cursor-pointer rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:scale-105 hover:border-purple-400 transition"
>
  <div className="text-6xl mb-6">📄</div>

  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
    Notes
  </h2>

  <p className="mt-3 text-slate-500">
    Read AI-generated study notes.
  </p>
</div>

          {/* Quiz */}

<div
  onMouseEnter={() => speak("Quiz")}
  onClick={() => navigate("/quiz")}
  className="cursor-pointer rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:scale-105 hover:border-green-400 transition"
>
  <div className="text-6xl mb-6">📝</div>

  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
    Quiz
  </h2>

  <p className="mt-3 text-slate-500">
    Test your knowledge with AI quizzes.
  </p>
</div>

          {/* AI */}

<div
  onMouseEnter={() => speak("AI Assistant")}
  onClick={() => navigate("/assistant")}
  className="cursor-pointer rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:scale-105 hover:border-cyan-400 transition"
>
  <div className="text-6xl mb-6">🤖</div>

  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
    AI Assistant
  </h2>

  <p className="mt-3 text-slate-500">
    Ask your personal AI tutor anything.
  </p>
</div>

{/* CLOSE THE GRID */}
</div>

        {/* Today's AI Recommendation */}

<div
  onMouseEnter={() => speak("Today's AI Recommendation")}
  className="mt-16 rounded-3xl bg-gradient-to-r from-cyan-500 to-purple-600 p-10 text-white"
>
  <h2 className="text-3xl font-bold">
    🎯 Today's AI Recommendation
  </h2>

  <p className="mt-4 text-lg">
    Based on your latest quiz performance,
    we recommend revising <b>Mathematics</b> for 30 minutes,
    followed by one aptitude quiz.
  </p>
</div>

{/* AI Study Planner */}

<div className="mt-10 rounded-3xl bg-white dark:bg-slate-900 border border-cyan-500/30 p-8">

  <div className="flex justify-between items-center">

    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
      📅 AI Study Planner
    </h2>

    <button
      onClick={generateStudyPlan}
      className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
    >
      Generate New Plan
    </button>

  </div>

  {studyPlan ? (
    <>
      <div className="mt-6 whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-8">
        {studyPlan}
      </div>

      <button
        onClick={() => speak(studyPlan)}
        className="mt-6 px-5 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-black font-semibold"
      >
        🔊 Read Plan
      </button>
    </>
  ) : (
    <p className="mt-6 text-slate-500 dark:text-slate-400">
      Click <b>Generate New Plan</b> to create today's AI-powered study schedule.
    </p>
  )}

</div>

{/* Video Section */}

{showVideos && (

<div className="mt-12">

  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
    🎥 Select a Subject
  </h2>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

    {Object.entries(videos).map(([subject, link]) => (

      <button
        key={subject}
        onMouseEnter={() => speak(subject)}
        onClick={() => window.open(link, "_blank")}
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-6 hover:bg-cyan-500 hover:text-white transition duration-300 shadow-lg"
      >

        <h3 className="text-xl font-bold flex items-center gap-2">
          <span>{icons[subject]}</span>
          <span>{subject}</span>
        </h3>

        <p className="mt-2 text-sm">
          ▶ Watch Playlist
        </p>

      </button>

    ))}

  </div>

</div>

)}
      </main>
      </div>
    
  );
}