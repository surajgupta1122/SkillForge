import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../service/api";
import LoginImg from "../assets/login.jpg";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ AUTO CLEAR ERROR / SUCCESS AFTER 3 SEC
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // ✅ clear old messages when typing
    setError("");
    setSuccess("");
  };

  const redirectUser = (role) => {
    const routes = {
      admin: "/admin",
      instructor: "/instructor",
      student: "/student",
    };
    navigate(routes[role] || "/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      const { token, user, message } = res.data;

      setSuccess(message);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ delay redirect so user can see message
      setTimeout(() => {
        redirectUser(user.role);
      }, 1000);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navbar (unchanged) */}
      <Navbar className="fixed top-0 w-full bg-white shadow-lg shadow-green-500" />

      {/* Background */}
      <div className="py-[6%] flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-200 px-4">

        {/* MAIN CARD */}
        <div className="w-full max-w-3xl py-2 bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">

          {/* LEFT PANEL */}
          <div className="hidden md:flex flex-col justify-center bg-white ">
            <img src={LoginImg} alt="Logo" className="w-full h-full object-cover" />
          </div>

          {/* RIGHT PANEL */}
          <div className="flex items-center justify-center p-8">

            <form
              onSubmit={handleSubmit}
              className="w-full max-w-sm"
            >
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">
                User Login
              </h2>

              {/* Error */}
              {error && (
                <p className="bg-red-50 text-red-600 p-3 mb-4 rounded-lg text-sm border border-red-100">
                  {error}
                </p>
              )}

              {/* Success */}
              {success && (
                <p className="bg-green-50 text-green-600 p-3 mb-4 rounded-lg text-sm border border-green-100">
                  {success}
                </p>
              )}

              {/* Email */}
              <div className="mb-4">
                <label className="text-sm text-gray-600">User Name</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-5">
                <label className="text-sm text-gray-600">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Button */}
              <button
                disabled={loading}
                className={`w-full py-2.5 rounded-xl text-white text-xl font-medium transition ${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 hover:shadow-md active:scale-[0.98]"
                }`}
              >
                {loading ? "Logging in..." : "Log in"}
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}