import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  LayoutDashboard, 
  BookOpen,
  Award,
  Clock,
  Settings,
  LogOut
} from "lucide-react";

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
    <aside className="w-66 h-screen bg-green-600 text-white flex flex-col justify-between border-r-2 border-white">
      {/* 🔥 Top */}
      <div>
        {/* Header */}
        <div className="p-6 border-b-2 border-white bg-green-700">
          <h2 className="text-2xl font-bold">Student Panel</h2>
          <p className="text-xs text-green-100 mt-1">Learning Dashboard</p>
        </div>

        {/* Menu */}
        <ul className="p-4 space-y-2 text-sm">
          {/* Home Button */}
          <li
            onClick={() => navigate("/")}
            className={`px-4 py-1.5 rounded-lg font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
              isActive("/")
                ? "bg-white text-green-600"
                : "hover:bg-white hover:text-green-600"
            }`}
          >
            <Home className="w-5 h-5" />
            Home
          </li>

          {/* Dashboard */}
          <li
            onClick={() => navigate("/student")}
            className={`px-4 py-1.5 rounded-lg font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
              isActive("/student")
                ? "bg-white text-green-600"
                : "hover:bg-white hover:text-green-600"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </li>

          {/* My Courses */}
          <li
            onClick={() => navigate("/student/my-courses")}
            className={`px-4 py-1.5 rounded-lg font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
              isActive("/student/my-courses")
                ? "bg-white text-green-600"
                : "hover:bg-white hover:text-green-600"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            My Courses
          </li>
        </ul>
      </div>

      {/* 🔥 Bottom */}
      <div className="p-4 border-t-2 border-white bg-green-700">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-white text-xl text-green-800 flex items-center justify-center font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>
          <div>
            <p className="font-semibold">{user?.name || "Student"}</p>
            <p className="text-xs text-green-100">{user?.email || "No email"}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full py-1.5 text-lg rounded-lg bg-red-800 hover:bg-red-600 duration-300 transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}