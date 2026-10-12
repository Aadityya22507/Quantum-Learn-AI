import { useNavigate } from "react-router-dom";
import { speak } from "../utils/speech";
export default function Hero({ profile, quantumStatus }) {

  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-8 mb-8">

      {/* Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>

      <div className="absolute -bottom-32 -left-24 w-80 h-80 bg-purple-600/20 blur-3xl rounded-full animate-pulse"></div>

      <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">

        <div>

          <p className="text-cyan-400 font-semibold tracking-widest uppercase text-sm">
            QuantumLearn AI
          </p>

          <h1 className="text-5xl font-black text-white mt-3 leading-tight">
            Learning...
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Personalized by AI
            </span>
          </h1>

          <p className="text-slate-400 mt-5 leading-7 max-w-xl">
            Welcome back{" "}
            <span className="text-white font-semibold">
              {profile?.name}
            </span>

            <br />

            Your AI tutor is ready to create today's perfect learning plan.
          </p>

          <div className="flex gap-4 mt-8">

            <button
  onMouseEnter={() => speak("Continue Learning")}
  onClick={() => navigate("/learning")}
  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition font-semibold text-black"
>
  Continue Learning
</button>

            <button
  onMouseEnter={() => speak("AI Assistant")}
  onClick={() => navigate("/assistant")}
  className="px-6 py-3 rounded-xl border border-cyan-500 text-cyan-300 hover:bg-cyan-500/10 transition"
>
  AI Assistant
</button>

          </div>

        </div>

        <div className="flex justify-center">

          <div className="relative">

            <div className="w-60 h-60 rounded-full bg-cyan-500/20 blur-3xl absolute animate-pulse"></div>

            <div
  onMouseEnter={() =>
    speak(
      quantumStatus?.active_backend === "qiskit-qsvc"
        ? "Quantum Engine. Q S V C Active."
        : "Quantum Engine. Classical Mode."
    )
  }
  className="relative w-52 h-52 rounded-full border border-cyan-400/40 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center"
              style={{
                animation: "float 6s ease-in-out infinite"
              }}
            >

              <h2 className="text-6xl">⚛️</h2>

              <p className="mt-3 text-cyan-300 font-bold">

                Quantum Engine

              </p>

              <p className="text-sm text-slate-400">

                {quantumStatus?.active_backend === "qiskit-qsvc"
                  ? "QSVC Active"
                  : "Classical Mode"}

              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}