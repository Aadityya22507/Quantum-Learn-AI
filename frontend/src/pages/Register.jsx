import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setToken } from "../api.js";
import { speak } from "../utils/speech";

const LEARNING_STYLES = [
  { value: "video", label: "Videos" },
  { value: "reading", label: "Reading" },
  { value: "practice", label: "Practice Questions" },
  { value: "audio", label: "Audio Lessons" },
];

const ACCESSIBILITY_OPTIONS = [
  { value: "none", label: "None" },
  { value: "dyslexia", label: "Dyslexia" },
  { value: "adhd", label: "ADHD" },
  { value: "color_blindness", label: "Color Blindness" },
  { value: "visual_impairment", label: "Visual Impairment / Blind" },
  { value: "hearing_impairment", label: "Hearing Impairment / Deaf" },
  { value: "speech_impairment", label: "Speech Impairment / Mute" },
  { value: "autism_spectrum", label: "Autism Spectrum" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const LANGUAGES = ["English", "Tamil", "Hindi", "Telugu", "Kannada", "Malayalam"];

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    student_class: "",
    learning_style: "video",
    accessibility_preference: "none",
    preferred_language: "English",
    study_hours: 1,
    target_score: 80,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.register(form);
      const loginData = await api.login({ email: form.email, password: form.password });
      setToken(loginData.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-8">
        <h1 className="text-2xl font-semibold text-white mb-1">Create your learning profile</h1>
        <p className="text-slate-400 text-sm mb-6">
          Used only to personalize your experience — never to diagnose.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-300 bg-red-950/50 border border-red-900 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full name">
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Class / Grade">
              <input
                value={form.student_class}
                onChange={(e) => update("student_class", e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <Field label="Email">
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Preferred language">
            <select
              value={form.preferred_language}
              onChange={(e) => update("preferred_language", e.target.value)}
              className="input"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </Field>

          <Field label="How do you learn best?">
            <select
              value={form.learning_style}
              onChange={(e) => update("learning_style", e.target.value)}
              className="input"
            >
              {LEARNING_STYLES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Accessibility & learning support (optional)">
            <select
              value={form.accessibility_preference}
              onChange={(e) => update("accessibility_preference", e.target.value)}
              className="input"
            >
              {ACCESSIBILITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Daily study hours">
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={form.study_hours}
                onChange={(e) => update("study_hours", parseFloat(e.target.value))}
                className="input"
              />
            </Field>
            <Field label="Target score (%)">
              <input
                type="number"
                min="0"
                max="100"
                value={form.target_score}
                onChange={(e) => update("target_score", parseFloat(e.target.value))}
                className="input"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-quantum-500 hover:bg-quantum-600 disabled:opacity-60 text-white font-medium transition"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-quantum-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>

      <style>{`
        .input {
          margin-top: 0.25rem;
          width: 100%;
          border-radius: 0.375rem;
          background-color: rgb(30 41 59);
          border: 1px solid rgb(51 65 85);
          padding: 0.5rem 0.75rem;
          color: white;
        }
        .input:focus {
          outline: none;
          border-color: #8b7aff;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-300">{label}</span>
      {children}
    </label>
  );
}
