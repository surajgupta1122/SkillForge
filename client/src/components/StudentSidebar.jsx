import { useNavigate, useLocation } from "react-router-dom";

export default function StudentSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 h-screen bg-green-600 text-white flex flex-col justify-between">
      {/* 🔥 TOP */}
      <div>
        {/* Header */}
        <div className="p-6 border-b border-green-500">
          <h2 className="text-2xl font-bold">Student Panel</h2>
        </div>

        {/* Menu */}
        <ul className="p-4 space-y-2 text-sm">
          <li
            onClick={() => navigate("/student")}
            className={`px-4 py-2 rounded-lg cursor-pointer transition ${
              isActive("/student")
                ? "bg-white text-green-600 font-semibold"
                : "hover:bg-green-500"
            }`}
          >
            Dashboard
          </li>

          <li
            onClick={() => navigate("/student/my-courses")}
            className={`px-4 py-2 rounded-lg cursor-pointer transition ${
              isActive("/student/my-courses")
                ? "bg-white text-green-600 font-semibold"
                : "hover:bg-green-500"
            }`}
          >
            My Courses
          </li>
        </ul>
      </div>

      {/* 🔥 BOTTOM */}
      <div className="p-4 border-t border-green-500">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-white text-green-600 flex items-center justify-center font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>

          <div>
            <p className="text-sm font-semibold">{user?.name || "Student"}</p>
            <p className="text-xs text-green-200">
              {user?.email || "No email"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full py-2 rounded-lg bg-green-700 hover:bg-green-800 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
