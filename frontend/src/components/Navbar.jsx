import { Link, useNavigate } from "react-router-dom";
import { clearToken } from "../api.js";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { speak } from "../utils/speech";

export default function Navbar({ studentName }) {
  const navigate = useNavigate();
  

  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });
  const [accessibility, setAccessibility] = useState(() => {
  return localStorage.getItem("accessibility") === "true";
});

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4
                    bg-white dark:bg-slate-900
                    border-b border-slate-200 dark:border-slate-800
                    transition-all duration-300">

      <Link
  to="/dashboard"
  onMouseEnter={() => speak("Quantum Learn A I")}
  className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white"
>
  <span className="text-cyan-400 text-2xl">⚛</span>
  QuantumLearn AI
</Link>

<div className="flex items-center gap-6">

        <Link
  to="/dashboard"
  onMouseEnter={() => speak("Dashboard")}
  className="text-slate-600 dark:text-slate-300 hover:text-cyan-400 transition"
>
  Dashboard
</Link>

        <Link
  to="/quiz"
  onMouseEnter={() => speak("Quiz")}
>
  Quiz
</Link>

        <Link
  to="/profile"
  onMouseEnter={() => speak("Profile")}
>
  Profile
</Link>

<Link
  to="/teacher"
  onMouseEnter={() => speak("Teacher Dashboard")}
>
  Teacher
</Link>

        <span className="text-slate-500 dark:text-slate-400">
          Hi, {studentName}
        </span>

        {/* Theme Button */}

        <button
  onMouseEnter={() => speak("Toggle Dark Mode")}
  onClick={() => setDark(!dark)}
  className="w-10 h-10 rounded-full
             bg-slate-200 dark:bg-slate-800
             flex items-center justify-center
             hover:scale-110 transition"
>
  {dark ? (
    <Sun size={18} className="text-yellow-400" />
  ) : (
    <Moon size={18} className="text-slate-700" />
  )}
</button>
       <button
  onMouseEnter={() => speak("Accessibility Mode")}
  onClick={() => {
    const newValue = !accessibility;

    setAccessibility(newValue);

    localStorage.setItem(
      "accessibility",
      newValue.toString()
    );

    // Notify every page
    window.dispatchEvent(
      new Event("accessibilityChanged")
    );

    if (newValue) {
      speak("Accessibility mode activated.");
    } else {
      window.speechSynthesis.cancel();
    }
  }}
  className={`px-4 py-2 rounded-lg font-medium transition ${
    accessibility
      ? "bg-green-600 hover:bg-green-700 text-white"
      : "bg-slate-700 hover:bg-slate-800 text-white"
  }`}
>
  ♿ {accessibility ? "ON" : "OFF"}
</button>

        <button
  onMouseEnter={() => speak("Logout")}
  onClick={handleLogout}
  className="px-4 py-2 rounded-lg
             bg-cyan-500 hover:bg-cyan-600
             text-white font-medium transition"
>
  Logout
</button>


      </div>
    </nav>
  );
}