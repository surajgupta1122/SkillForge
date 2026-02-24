import { useState, useEffect } from "react";
import api from "../service/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import RegisterImg from "../assets/Signup.jpg";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", formData);
      setSuccess(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar className="fixed top-0 w-full bg-white shadow-lg shadow-green-500" />

      <div className="py-[3.3%] flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-200">

        {/* MAIN CARD */}
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">

          {/* LEFT SIDE (FORM) */}
          <div className="flex items-center justify-center p-8">
            <form onSubmit={handleSubmit} className="w-full max-w-sm">

              <h2 className="text-3xl font-bold text-center mb-4 text-gray-700">Create Account</h2>

              {error && (
                <p className="bg-red-100 text-red-700 p-2 mb-3 rounded-lg">
                  {error}
                </p>
              )}

              {success && (
                <p className="bg-green-100 text-green-700 p-2 mb-3 rounded-lg">
                  {success}
                </p>
              )}
              
              <label className="text-gray-600 block">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full mb-2 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                value={formData.name}
                onChange={handleChange}
              />

              <label className="text-gray-600 block">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full mb-2 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                value={formData.email}
                onChange={handleChange}
              />

              <label className="text-gray-600 block">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full mb-2 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                value={formData.password}
                onChange={handleChange}
              />

              {/* Radio */}
              <label className="text-gray-600 block">Role</label>
              <div className="mb-5 flex items-center gap-5">
                <label
                className={`border-2 rounded-lg px-7 font-medium text-lg py-2 cursor-pointer transition ${
                    formData.role === "student"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === "student"}
                    onChange={handleChange}
                    className="mr-1"
                  />
                  Student
                </label>

                <label className={`border-2 rounded-lg px-7 font-medium text-lg py-2 cursor-pointer transition ${
                    formData.role === "instructor"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-gray-300"
                  }`}>
                  <input
                    type="radio"
                    name="role"
                    value="instructor"
                    checked={formData.role === "instructor"}
                    onChange={handleChange}
                    className="mr-1"
                  />
                  Instructor
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white text-xl font-semibold p-2 rounded-xl hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>

            </form>
          </div>

          {/* RIGHT SIDE (IMAGE) */}
          <div className="hidden md:flex">
            <img
              src={RegisterImg}
              alt="Register"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </div>
    </div>
  );
}