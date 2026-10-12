import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { api } from "../api.js";
import { quizData } from "../data/quizQuestions";
import { speak } from "../utils/speech";
import SignLanguage from "../components/SignLanguage";



export default function Quiz() {
  const [subject, setSubject] = useState("Mathematics");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [currentSign, setCurrentSign] = useState("study");
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  useEffect(() => {
  const randomQuestions = [...quizData[subject]]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  setQuestions(randomQuestions);
  setAnswers({});
  setSubmitted(false);
  setResult(null);
}, [subject]);
useEffect(() => {
  if (questions.length === 0) return;

  speak(
    `Question one.
    ${questions[0].question}.
    Option one ${questions[0].options[0]}.
    Option two ${questions[0].options[1]}.
    Option three ${questions[0].options[2]}.
    Option four ${questions[0].options[3]}.`
  );
}, [questions]);

  function selectAnswer(qIndex, optionIndex) {
  setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));

  speak(`Selected ${questions[qIndex].options[optionIndex]}`);

  setCurrentSign("hello");
}

  async function handleSubmit() {
    const total = questions.length;
    const correct = questions.reduce(
  (sum, q, i) =>
    sum + (q.options[answers[i]] === q.answer ? 1 : 0),
  0
);
    const score = Math.round((correct / total) * 100);

    if (score >= 70) {
    setCurrentSign("correct");
} else {
    setCurrentSign("wrong");
}

    // Save XP
const currentXP = Number(localStorage.getItem("xp") || 0);
const earnedXP = correct * 10;

localStorage.setItem("xp", currentXP + earnedXP);

// 🔥 Notify Dashboard to refresh XP
window.dispatchEvent(new Event("xpUpdated"));
    const topic = subject;
    setCurrentSign("submit");

    try {
      await api.submitQuiz({ subject, topic, score, time_taken_minutes: 5 });
      setResult({ score, correct, total });
      setSubmitted(true);
    } catch (err) {
      alert(err.message);
    }
  }

  function resetQuiz() {
  const randomQuestions = [...quizData[subject]]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  setQuestions(randomQuestions);
  setAnswers({});
  setSubmitted(false);
  setResult(null);
  setCurrentSign("hello");
}

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Quiz</h1>

        <div className="flex gap-2 mb-6">
          {Object.keys(quizData).map((subj) => (
            <button
  key={subj}
  onMouseEnter={() => speak(subj)}
  onClick={() => {
    setSubject(subj);
  }}
  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
    subject === subj
      ? "bg-quantum-500 text-slate-900 dark:text-white"
      : "bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-700"
  }`}
>
  {subj}
</button>
          ))}
        </div>

        {!submitted ? (
  <>
          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                <p
  onMouseEnter={() =>
    speak(
      `${q.question}.
      Option one ${q.options[0]}.
      Option two ${q.options[1]}.
      Option three ${q.options[2]}.
      Option four ${q.options[3]}`
    )
  }
  className="text-slate-900 dark:text-white font-medium mb-3"
>
  {qIndex + 1}. {q.question}
</p>
                <div className="space-y-2">
                  {q.options.map((opt, optIndex) => (
                    <label
                      key={optIndex}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer border transition ${
                        answers[qIndex] === optIndex
                          ? "border-quantum-400 bg-quantum-500/10"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${qIndex}`}
                        checked={answers[qIndex] === optIndex}
                        onChange={() => selectAnswer(qIndex, optIndex)}
                        className="accent-quantum-500"
                      />
                      <span
  onMouseEnter={() => speak(opt)}
  className="text-slate-200 text-sm"
>
  {opt}
</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== questions.length}
              className="w-full py-3 rounded-md bg-quantum-500 hover:bg-quantum-600 disabled:opacity-50 text-slate-900 dark:text-white font-medium transition"
            >
              Submit Quiz
            </button>
          </div>
          <div className="mt-8 flex justify-center">
  {localStorage.getItem("accessibility") === "true" && (
    <SignLanguage sign={currentSign} />
  )}
</div>



</>
) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center">
            <p className="text-4xl mb-2">{result.score >= 70 ? "🎉" : "💪"}</p>
            <p className="text-slate-900 dark:text-slate-900 dark:text-white text-xl font-semibold mb-1">
              You scored {result.score}% ({result.correct}/{result.total})
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              Your AI dashboard has been updated with this attempt.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={resetQuiz}
                className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm transition"
              >
                Try Another
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded-md bg-quantum-500 hover:bg-quantum-600 text-slate-900 dark:text-slate-900 dark:text-white text-sm font-medium transition"
              >
                View Dashboard
              </button>
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}
