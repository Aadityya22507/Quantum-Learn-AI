import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setToken } from "../api.js";
import { speak } from "../utils/speech";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      setToken(data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-8">
        <h1 className="text-2xl font-semibold text-white mb-1">Welcome back</h1>
        <p className="text-slate-400 text-sm mb-6">Log in to continue your learning plan.</p>

        {error && (
          <div className="mb-4 text-sm text-red-300 bg-red-950/50 border border-red-900 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-quantum-400"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-quantum-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-quantum-500 hover:bg-quantum-600 disabled:opacity-60 text-white font-medium transition"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-400 text-center">
          New here?{" "}
          <Link to="/register" className="text-quantum-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
