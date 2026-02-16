import { useNavigate, useLocation } from "react-router-dom";

export default function StudentSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-green-600 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">Student Panel</h2>

      <ul className="space-y-4 text-xl">
        <li
          onClick={() => navigate("/student")}
          className={`p-2 rounded cursor-pointer ${
            location.pathname === "/student"
              ? "bg-blue-500"
              : "hover:bg-blue-400"
          }`}
        >
          Dashboard
        </li>

        <li
          onClick={() => navigate("/student/my-courses")}
          className={`p-2 rounded cursor-pointer ${
            location.pathname === "/student/my-courses"
              ? "bg-blue-500"
              : "hover:bg-blue-400"
          }`}
        >
          My Courses
        </li>

        <li
          onClick={logout}
          className="hover:bg-red-500 p-2 rounded cursor-pointer"
        >
          Logout
        </li>
      </ul>
    </aside>
  );
}
