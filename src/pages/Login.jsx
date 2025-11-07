import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = (
    import.meta.env.VITE_API_URL ?? "http://localhost:5234/"
  ).replace(/\/$/, "");

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      setLoading(true);
      await login(form.username.trim(), form.password);
      nav("/books");
    } catch (ex) {
      setErr(
        ex?.response?.data?.detail ||
          ex?.response?.data?.title ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-sm">
      <h1 className="text-xl mb-4">Login</h1>
      {err && <div className="mb-3 text-red-600">{err}</div>}
      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1">
          <span>Username</span>
          <input
            className="border p-2 rounded"
            value={form.username}
            onChange={(e) => setField("username", e.target.value)}
          />
        </label>
        <label className="grid gap-1">
          <span>Password</span>
          <input
            type="password"
            className="border p-2 rounded"
            value={form.password}
            onChange={(e) => setField("password", e.target.value)}
          />
        </label>
        <button
          className="px-4 py-2 rounded bg-black text-white"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <a
          className="px-4 py-2 rounded border inline-block"
          href={`${API_BASE}/api/ExternalAuth/google`}
        >
          Continue with Google
        </a>
      </form>
    </div>
  );
}
