import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { api } from "../api.js";
import { speak } from "../utils/speech";
import SpeechDropdown from "../components/SpeechDropdown";

const LEARNING_STYLES = ["video", "reading", "practice", "audio"];
const LANGUAGES = [
  "English",
  "Tamil",
  "Hindi",
  "Telugu",
  "Kannada",
  "Malayalam",
];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [accessibility, setAccessibility] = useState(
  localStorage.getItem("accessibility") === "true"
);

  useEffect(() => {
    api.getProfile().then(setProfile);
  }, []);

  function update(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);

    localStorage.setItem("accessibility", accessibility);
console.log(localStorage.getItem("accessibility"));

    try {
      const updated = await api.updateProfile({
        learning_style: profile.learning_style,
        accessibility_preference: profile.accessibility_preference,
        preferred_language: profile.preferred_language,
        study_hours: profile.study_hours,
        target_score: profile.target_score,
      });

      setProfile(updated);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar studentName={profile.name} />

      <main className="max-w-xl mx-auto px-6 py-8">
        <h1
          onMouseEnter={() => speak("Student Details")}
          className="text-2xl font-semibold text-slate-900 dark:text-white mb-1"
        >
          Student Details
        </h1>

        <p
          onMouseEnter={() => speak(profile.email)}
          className="text-slate-600 dark:text-slate-400 text-sm mb-6"
        >
          {profile.email}
        </p>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">

          <SpeechDropdown
  label="Preferred Language"
  value={profile.preferred_language}
  options={LANGUAGES}
  onChange={(value) => update("preferred_language", value)}
/>
              

          <SpeechDropdown
  label="Learning Style"
  value={profile.learning_style}
  options={LEARNING_STYLES.map(
    (s) => s.charAt(0).toUpperCase() + s.slice(1)
  )}
  onChange={(value) =>
    update("learning_style", value.toLowerCase())
  }
/>
              

          <div className="grid grid-cols-2 gap-4">

            <Field label="Daily study hours">
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={profile.study_hours || 1}
                onMouseEnter={() => speak("Daily Study Hours")}
                onChange={(e) =>
                  update("study_hours", parseFloat(e.target.value))
                }
                className="input"
              />
            </Field>

            <Field label="Target score (%)">
              <input
                type="number"
                min="0"
                max="100"
                value={profile.target_score || 80}
                onMouseEnter={() => speak("Target Score")}
                onChange={(e) =>
                  update("target_score", parseFloat(e.target.value))
                }
                className="input"
              />
            </Field>

          </div>

          <div className="flex items-center justify-between border border-slate-700 rounded-xl p-4">
  <div>
    <h3 className="font-semibold text-slate-900 dark:text-white">
      🔊 Voice Assistance
    </h3>
    <p className="text-sm text-slate-500">
      Enable spoken feedback throughout the app.
    </p>
  </div>

  <input
    type="checkbox"
    checked={accessibility}
    onChange={(e) => {
      const value = e.target.checked;

      setAccessibility(value);

      localStorage.setItem(
        "accessibility",
        value.toString()
      );

      if (value) {
        speak("Voice assistance enabled");
      } else {
        window.speechSynthesis.cancel();
      }
    }}
    className="w-5 h-5 accent-cyan-500"
  />
</div>

          <button
            onMouseEnter={() => speak("Save Changes")}
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 rounded-md bg-quantum-500 hover:bg-quantum-600 disabled:opacity-60 text-slate-900 dark:text-white font-medium transition"
          >
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
          </button>

        </div>
      </main>

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
      <span className="text-sm text-slate-700 dark:text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}