import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  LayoutDashboard, 
  BookOpen,
  Users,
  UserCheck,
  BarChart3,
  Settings,
  LogOut,
  MessageSquare,
} from "lucide-react";

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
    <>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #ffffff;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #d1d5db;
          }
          .custom-scrollbar::-webkit-scrollbar-button {
            display: none;
          }
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #ffffff transparent;
          }
        `}
      </style>
      <aside className="w-64 h-screen bg-white text-white flex flex-col overflow-hidden rounded-3xl">
        {/* 🔥 Top - Fixed */}
        <div className="flex-shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-2 px-4 py-6 border-b-4 border-blue-500 bg-gradient-to-br from-orange-500 to-red-600">
            <div>
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <div className="gap-3">
              <h2 className="text-2xl font-bold text-white">Instructor Panel</h2>
              <p className="text-xs text-orange-100 mt-0.5">Course Management</p>
            </div>
          </div>
        </div>

        {/* 🔥 Center - Scrollable Menu with scrollbar on left */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
          style={{ direction: "rtl" }}
        >
          <ul
            className="p-4 space-y-2 text-sm text-gray-700"
            style={{ direction: "ltr" }}
          >
            {/* Home Button */}
            <li
              onClick={() => navigate("/")}
              className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
                isActive("/")
                  ? "bg-gray-100 text-orange-600 border-2 border-r-0 border-orange-600 shadow-[0_6px_18px_rgba(249,115,22,0.25)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-orange-600 after:content-['']"
                  : "hover:bg-orange-50 hover:shadow-lg hover:text-orange-600 rounded-2xl"
              }`}
            >
              <Home className="w-5 h-5" />
              Home
            </li>

            {/* Dashboard */}
            <li
              onClick={() => navigate("/instructor")}
              className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
                isActive("/instructor")
                  ? "bg-gray-100 text-orange-600 border-2 border-r-0 border-orange-600 shadow-[0_6px_18px_rgba(249,115,22,0.25)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-orange-600 after:content-['']"
                  : "hover:bg-orange-50 hover:shadow-lg hover:text-orange-600 rounded-2xl"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </li>

            {/* My Courses */}
            <li
              onClick={() => navigate("/instructor/courses")}
              className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
                isActive("/instructor/courses")
                  ? "bg-gray-100 text-orange-600 border-2 border-r-0 border-orange-600 shadow-[0_6px_18px_rgba(249,115,22,0.25)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-orange-600 after:content-['']"
                  : "hover:bg-orange-50 hover:shadow-lg hover:text-orange-600 rounded-2xl"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              My Courses
            </li>

            {/* My Students */}
            <li
              onClick={() => navigate("/instructor/students")}
              className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
                isActive("/instructor/students")
                  ? "bg-gray-100 text-orange-600 border-2 border-r-0 border-orange-600 shadow-[0_6px_18px_rgba(249,115,22,0.25)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-orange-600 after:content-['']"
                  : "hover:bg-orange-50 hover:shadow-lg hover:text-orange-600 rounded-2xl"
              }`}
            >
              <Users className="w-5 h-5" />
              My Students
            </li>

            {/* Analytics */}
            <li
              onClick={() => navigate("/instructor/analytics")}
              className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
                isActive("/instructor/analytics")
                  ? "bg-gray-100 text-orange-600 border-2 border-r-0 border-orange-600 shadow-[0_6px_18px_rgba(249,115,22,0.25)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-orange-600 after:content-['']"
                  : "hover:bg-orange-50 hover:shadow-lg hover:text-orange-600 rounded-2xl"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </li>

            {/* Massage */}
            <li
              onClick={() => navigate("/instructor/massage")}
              className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
                isActive("/instructor/massage")
                  ? "bg-gray-100 text-orange-600 border-2 border-r-0 border-orange-600 shadow-[0_6px_18px_rgba(249,115,22,0.25)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-orange-600 after:content-['']"
                  : "hover:bg-orange-50 hover:shadow-lg hover:text-orange-600 rounded-2xl"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Massage
            </li>

            {/* Settings */}
            <li
              onClick={() => navigate("/instructor/settings")}
              className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
                isActive("/instructor/settings")
                  ? "bg-gray-100 text-orange-600 border-2 border-r-0 border-orange-600 shadow-[0_6px_18px_rgba(249,115,22,0.25)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-orange-600 after:content-['']"
                  : "hover:bg-orange-50 hover:shadow-lg hover:text-orange-600 rounded-2xl"
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </li>
          </ul>
        </div>

        {/* 🔥 Bottom - Fixed */}
        <div className="flex-shrink-0 p-4 border-t-3 border-blue-500 bg-gradient-to-br from-orange-600 to-red-500">
          {/* Profile */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white text-xl text-orange-600 flex items-center justify-center font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "I"}
            </div>
            <div>
              <p className="font-semibold text-white">{user?.name || "Instructor"}</p>
              <p className="text-xs text-orange-100">{user?.email || "instructor@gmail.com"}</p>
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
    </>
  );
}