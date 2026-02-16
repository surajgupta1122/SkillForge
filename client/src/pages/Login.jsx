import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api"; 

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      setSuccess(res.data.message);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
        setTimeout(() => {
        navigate("/admin");
        }, 1500); 
      } else if (res.data.user.role === "instructor") {
        setTimeout(() => {
        navigate("/instructor");
        }, 1500);
      } else {
        setTimeout(() => {
        navigate("/student");
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 mb-3 rounded">
            {error}
          </p>
        )}

        {/* Success Message */}
        {success && (
          <p className="bg-green-100 text-green-700 p-2 mb-3 rounded">
            {success}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
