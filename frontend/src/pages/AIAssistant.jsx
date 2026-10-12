import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { speak } from "../utils/speech";
import { api } from "../api";

export default function AIAssistant() {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // History
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  // Load history
  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("doubtHistory") || "[]"
    );

    setHistory(saved);
  }, []);

  const filteredHistory = history.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase())
  );

  async function askAI() {

    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    try {

      window.speechSynthesis.cancel();

      setAnswer("Thinking... 🤔");

      const result = await api.aiChat({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are QuantumLearn AI, an educational tutor.

Rules:
- Explain in simple English.
- Keep answers between 100 and 200 words.
- Use headings.
- Use bullet points.
- Give one simple example.
- End with a short summary.
- Don't write huge paragraphs.`,
          },
          { role: "user", content: question },
        ],
      });

      const response = result?.content || "No response was returned.";

      setAnswer(response);

      // Save history
      const newHistory = [
        {
          question,
          answer: response,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        },
        ...history,
      ];

      setHistory(newHistory);

      localStorage.setItem(
        "doubtHistory",
        JSON.stringify(newHistory)
      );

      setTimeout(() => {
        window.speechSynthesis.cancel();
        speak(response);
      }, 500);

    } catch (err) {

      console.error(err);

      setAnswer(`❌ ${err.message}`);
    }

  }
  

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 transition-all duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-10">

  <h1
    onMouseEnter={() => speak("Quantum AI Coach")}
    className="text-5xl font-black text-slate-900 dark:text-white"
  >
    🤖 Quantum AI Coach
  </h1>

  <p
    onMouseEnter={() => speak("Ask anything related to your studies")}
    className="text-slate-600 dark:text-slate-400 mt-3"
  >
    Ask anything related to your studies.
  </p>

  {/* NEW GRID */}
  <div className="grid lg:grid-cols-3 gap-8 mt-10">

    {/* LEFT SIDE */}
    <div className="lg:col-span-2">


        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">

          <textarea
  rows="5"
  value={question}
  onChange={(e) => setQuestion(e.target.value)}
  onMouseEnter={() => speak("Question input")}
  placeholder="Example: Explain Quantum Computing..."
  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-4 text-slate-900 dark:text-white outline-none"
/>

          <button
  onMouseEnter={() => speak("Ask AI")}
  onClick={askAI}
  className="mt-6 px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition"
>
  Ask AI
</button>

        </div>

        {answer && (
          <div
  onMouseEnter={() => speak("AI Response")}
  className="mt-10 rounded-3xl bg-white dark:bg-slate-900 border border-cyan-500/30 p-8"
>

            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              AI Response
            </h2>

            <p className="text-slate-700 dark:text-slate-300 leading-8">
              {answer}
            </p>

          </div>
        )}

        <div className="grid md:grid-cols-4 gap-6 mt-12">

          <button
  onMouseEnter={() => speak("Quantum")}
  onClick={() => setQuestion("Explain Quantum Computing")}
  className="rounded-2xl bg-cyan-500 p-5 font-semibold text-black hover:scale-105 transition"
>
  ⚛ Quantum
</button>

          <button
  onMouseEnter={() => speak("Physics")}
  onClick={() => setQuestion("Explain Newton Law")}
  className="rounded-2xl bg-green-500 p-5 font-semibold text-black hover:scale-105 transition"
>
  📘 Physics
</button>

          <button
  onMouseEnter={() => speak("Python")}
  onClick={() => setQuestion("Explain Python")}
  className="rounded-2xl bg-purple-500 p-5 font-semibold text-white hover:scale-105 transition"
>
  🐍 Python
</button>

          <button
  onMouseEnter={() => speak("Artificial Intelligence")}
  onClick={() => setQuestion("What is AI?")}
  className="rounded-2xl bg-orange-500 p-5 font-semibold text-black hover:scale-105 transition"
>
  🤖 AI
</button>

        </div>
            </div>

    {/* RIGHT SIDE */}
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sticky top-24">

      <h2 className="text-2xl font-bold mb-4">
        📚 Doubt History
      </h2>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-3 mb-5"
      />

      <div className="space-y-4 max-h-[500px] overflow-y-auto">

  {filteredHistory.length === 0 ? (

    <p className="text-center text-slate-500 py-8">
      No doubts yet.
    </p>

  ) : (

    filteredHistory.map((item, index) => (

      <div
        key={index}
        className="rounded-xl border border-slate-300 dark:border-slate-700 p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      >

        <h3 className="font-semibold">
          ❓ {item.question}
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          {item.date} • {item.time}
        </p>

        <div className="flex gap-2 mt-3">

          <button
            onClick={() => {
              setQuestion(item.question);
              setAnswer(item.answer);
            }}
            className="text-sm px-3 py-1 rounded-lg bg-cyan-500 text-black"
          >
            ↻ Open
          </button>

          <button
            onClick={() => speak(item.answer)}
            className="text-sm px-3 py-1 rounded-lg bg-green-500 text-black"
          >
            🔊 Read
          </button>

        </div>

      </div>

    ))

  )}

</div>

      <button
        onClick={() => {
          localStorage.removeItem("doubtHistory");
          setHistory([]);
        }}
        className="mt-6 w-full rounded-xl bg-red-500 py-3 text-white font-semibold"
      >
        🗑 Clear History
      </button>

    </div>

  </div>

      </main>
    </div>
  );
}