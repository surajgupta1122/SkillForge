import { useNavigate, useLocation } from "react-router-dom";

export default function InstructorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-green-600 text-white flex flex-col justify-between">
      {/* Top */}
      <div>
        <div className="p-6 border-b border-green-500">
          <h2 className="text-2xl font-bold">Instructor Panel</h2>
        </div>

        <ul className="p-4 space-y-2 text-sm">
          <li
            onClick={() => navigate("/instructor")}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              isActive("/instructor")
                ? "bg-white text-green-600 font-semibold"
                : "hover:bg-green-500"
            }`}
          >
            Dashboard
          </li>

          <li
            onClick={() => navigate("/instructor/courses")}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              isActive("/instructor/courses")
                ? "bg-white text-green-600 font-semibold"
                : "hover:bg-green-500"
            }`}
          >
            My Courses
          </li>
        </ul>
      </div>

      {/* Bottom */}
      <div className="p-4 border-t border-green-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-white text-green-600 flex items-center justify-center font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "I"}
          </div>

          <div>
            <p className="text-sm font-semibold">
              {user?.name || "Instructor"}
            </p>
            <p className="text-xs text-green-200">
              {user?.email || "No email"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-2 rounded-lg bg-green-700 hover:bg-green-800"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
