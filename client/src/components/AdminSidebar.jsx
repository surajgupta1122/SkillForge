import { useNavigate, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-green-600 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

      <ul className="space-y-4 text-xl">
        <li
          onClick={() => navigate("/admin")}
          className={`p-2 rounded-lg cursor-pointer ${
            location.pathname === "/admin"
              ? "bg-blue-500"
              : "hover:bg-blue-400"
          }`}
        >
          Dashboard
        </li>

        <li className="hover:bg-blue-400 p-2 rounded-lg cursor-pointer">
          Users
        </li>

        <li className="hover:bg-blue-400 p-2 rounded-lg cursor-pointer">
          Courses
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
