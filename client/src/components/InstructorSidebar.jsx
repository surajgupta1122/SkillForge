import { useNavigate, useLocation } from "react-router-dom";

export default function InstructorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-green-600 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">Instructor Panel</h2>

      <ul className="space-y-4 text-xl">
        <li
          onClick={() => navigate("/instructor")}
          className={`p-2 rounded-lg cursor-pointer ${
            location.pathname === "/instructor"
              ? "bg-blue-500"
              : "hover:bg-blue-400"
          }`}
        >
          Dashboard
        </li>

        <li
          onClick={() => navigate("/instructor/courses")}
          className={`p-2 rounded-lg cursor-pointer ${
            location.pathname === "/instructor/courses"
              ? "bg-blue-500"
              : "hover:bg-blue-400"
          }`}
        >
          My Courses
        </li>

        <li
          onClick={logout}
          className="hover:bg-red-500 p-2 rounded-lg cursor-pointer"
        >
          Logout
        </li>
      </ul>
    </aside>
  );
}
