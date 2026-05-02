import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Users,
  BookOpen,
  LogOut,
  Shield,
  Settings,
} from "lucide-react";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 h-screen bg-white text-white flex flex-col justify-between overflow-hidden rounded-3xl">
      {/* 🔥 Top */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b-4 border-blue-500 bg-gradient-to-br from-green-700 to-emerald-500">
          <Shield className="w-8 h-8 text-white" />
          <div>
            <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
            <p className="text-xs text-green-100 mt-0.5">Management System</p>
          </div>
        </div>
        {/* Menu */}
        <ul className="p-4 space-y-2 text-sm text-gray-700">
          {/* Home Button */}
          <li
            onClick={() => navigate("/")}
            className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
              isActive("/")
                ? "bg-gray-100 text-green-700 border-2 border-r-0 border-green-700 shadow-[0_6px_18px_rgba(34,197,94,0.25)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-green-700 after:content-['']"
                : "hover:bg-green-100 hover:shadow-lg hover:text-green-700 rounded-2xl"
            }`}
          >
            <Home className="w-5 h-5" />
            Home
          </li>

          {/* Dashboard */}
          <li
            onClick={() => navigate("/admin")}
            className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
              isActive("/admin")
                ? "bg-gray-100 text-green-700 border-2 border-r-0 border-green-700 shadow-[0_6px_18px_rgba(34,197,94,0.25)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-green-700 after:content-['']"
                : "hover:bg-green-100 hover:shadow-lg hover:text-green-700 rounded-2xl"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </li>

          {/* Users */}
          <li
            onClick={() => navigate("/admin/users")}
            className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
              isActive("/admin/users")
                ? "bg-gray-100 text-green-700 border-2 border-r-0 border-green-700 shadow-[0_6px_18px_rgba(34,197,94,0.25)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-green-700 after:content-['']"
                : "hover:bg-green-100 hover:shadow-lg hover:text-green-700 rounded-2xl"
            }`}
          >
            <Users className="w-5 h-5" />
            Users
          </li>

          {/* Courses */}
          <li
            onClick={() => navigate("/admin/courses")}
            shadow-md
            hover:shadow-lg
            transition
            className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
              isActive("/admin/courses")
                ? "bg-gray-100 text-green-700 border-2 border-r-0 border-green-700 shadow-[0_6px_18px_rgba(34,197,94,0.25)] transition relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-green-700 after:content-['']"
                : "hover:bg-green-100 hover:shadow-lg hover:text-green-700 rounded-2xl"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Courses
          </li>

          {/* Settings */}
          <li
            onClick={() => navigate("/admin/settings")}
            className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
              isActive("/admin/settings")
                ? "bg-gray-100 text-green-700 border-2 border-r-0 border-green-700 shadow-[0_6px_18px_rgba(34,197,94,0.25)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-green-700 after:content-['']"
                : "hover:bg-green-100 hover:shadow-lg hover:text-green-700 rounded-2xl"
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </li>
        </ul>
      </div>

      {/* 🔥 Bottom */}
      <div className="p-4 border-t-3 border-blue-500 bg-gradient-to-br from-green-800 to-emerald-600">
        {/* Profile */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-white text-xl text-green-800 flex items-center justify-center font-bold">
            A
          </div>
          <div>
            <p className="font-semibold">Admin</p>
            <p className="text-xs text-green-100">admin@gmail.com</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full py-1.5 text-lg rounded-xl bg-red-800 hover:bg-red-600 duration-300 transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
