"use client";

import { useState } from "react";
import Link from "next/link";
import api from "../../lib/api";

export default function LoginPage({ initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("sales");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        username,
        password,
      };

      if (isSignup) {
        payload.role = role;
      }

      const res = await api.post(isSignup ? "/signup" : "/login", payload);

      localStorage.setItem("token", res.data.token);
      window.location.href = res.data.redirectTo || "/dashboard";
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          (isSignup ? "Could not create this account" : "Invalid username or password")
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 md:px-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-950">
            LeadSense AI
          </Link>
          <div className="flex rounded-full border border-slate-300 bg-white p-1 text-sm shadow-sm">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-full px-4 py-2 font-semibold transition ${
                !isSignup ? "bg-slate-950 text-white" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-full px-4 py-2 font-semibold transition ${
                isSignup ? "bg-slate-950 text-white" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              Sign up
            </button>
          </div>
        </header>

        <main className="grid flex-1 items-center gap-8 py-10 md:grid-cols-[1fr_420px]">
          <section className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              AI lead intelligence
            </p>
            <h1 className="text-4xl font-bold leading-tight text-slate-950 md:text-6xl">
              Predict the leads that actually convert.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">
              Create a working account instantly, then use the dashboard to manage leads,
              prioritize prospects, and act on AI scoring.
            </p>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {["Score leads", "Track pipeline", "AI outreach"].map((item) => (
                <div key={item} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
            <h2 className="text-2xl font-bold text-slate-950">
              {isSignup ? "Create account" : "Sign in"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {isSignup
                ? "Choose a username and password. The app will sign you in immediately."
                : "Use your saved credentials or create a new account."}
            </p>

            {!isSignup && (
              <div className="mt-5 rounded-lg border border-teal-200 bg-teal-50 p-3 text-xs leading-5 text-slate-700">
                Admin login: <span className="font-semibold">admin / 1234</span>. Customer login:{" "}
                <span className="font-semibold">customer / 1234</span>.
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Username</span>
                <input
                  type="text"
                  value={username}
                  placeholder="Enter username"
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-teal-600 focus:bg-white"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
                <input
                  type="password"
                  value={password}
                  placeholder={isSignup ? "Minimum 4 characters" : "Enter password"}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-teal-600 focus:bg-white"
                  required
                />
              </label>

              {isSignup && (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Account type</span>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-teal-600 focus:bg-white"
                  >
                    <option value="sales">Dashboard user</option>
                    <option value="customer">Customer website user</option>
                  </select>
                </label>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-teal-700 px-4 py-3 font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? "Please wait..." : isSignup ? "Create and sign in" : "Sign in"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setError("");
                setMode(isSignup ? "login" : "signup");
              }}
              className="mt-5 w-full text-center text-sm font-semibold text-teal-700 hover:text-teal-900"
            >
              {isSignup ? "Already have an account? Sign in" : "Need an account? Create one"}
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
