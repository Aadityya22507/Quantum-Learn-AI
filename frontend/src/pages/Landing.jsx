import { Link } from "react-router-dom";
import { speak } from "../utils/speech";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="text-xl font-semibold flex items-center gap-2">
          <span className="text-quantum-400">⚛</span> QuantumLearn AI
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 rounded-md text-slate-200 hover:text-white transition">
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-md bg-quantum-500 hover:bg-quantum-600 text-white transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <header className="px-8 pt-16 pb-20 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          AI and Quantum ML for
          <span className="block text-quantum-400">Personalized, Inclusive Learning</span>
        </h1>
        <p className="mt-6 text-slate-400 text-lg max-w-2xl mx-auto">
          Every student learns differently. QuantumLearn AI studies how you learn — your pace,
          your quiz history, your preferences — and builds a study plan around you.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/register"
            className="px-6 py-3 rounded-md bg-quantum-500 hover:bg-quantum-600 font-medium transition"
          >
            Start Learning
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-md border border-slate-700 hover:border-slate-500 font-medium transition"
          >
            I already have an account
          </Link>
        </div>
      </header>

      <section className="px-8 pb-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          icon="🎯"
          title="AI Learning Coach"
          text="Tracks your weak and strong topics automatically and adjusts your plan every day."
        />
        <FeatureCard
          icon="♿"
          title="Built for Everyone"
          text="Accessibility-first design with audio, visual, and sign-language friendly delivery."
        />
        <FeatureCard
          icon="⚛"
          title="Quantum ML Predictions"
          text="A Qiskit-powered model predicts when you're likely to forget a topic, before you do."
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{text}</p>
    </div>
  );
}
