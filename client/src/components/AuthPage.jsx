import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    const { data } = await api.post(endpoint, form);

    setMessage(`✔ ${data.message || "Success!"}`);

    if (isLogin && data.token) {
      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      window.location.href = "/";
    }

    if (!isLogin) {
      setForm({ name: "", email: "", password: "" });
    }

  } catch (err) {
    setMessage(
      err.response?.data?.message || "❌ Something went wrong!"
    );
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-200 to-red-200 p-6">
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-96 text-center">
        
        <h1 className="text-4xl font-extrabold text-rose-700 mb-4">
          🍰 Sweet Heaven
        </h1>

        <h2 className="text-2xl font-semibold text-rose-600 mb-6">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        {message && (
          <div className="mb-3 text-sm font-semibold text-rose-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border-2 border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border-2 border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border-2 border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-500 to-red-500 text-white py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition"
          >
            {isLogin ? "Login 🍪" : "Register 🍩"}
          </button>
        </form>

        <p className="mt-5 text-rose-700 font-medium">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <span
            className="cursor-pointer text-red-600 font-bold underline"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin ? "Create Account" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
