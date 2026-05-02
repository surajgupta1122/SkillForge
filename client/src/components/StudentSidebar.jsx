import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  LayoutDashboard, 
  BookOpen,
  Award,
  Clock,
  Settings,
  LogOut,
  GraduationCap,
  TrendingUp,
  UserCheck,
  MessageSquare,
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
          <div className="flex items-center gap-2 px-4 py-6 border-b-4 border-blue-500 bg-gradient-to-br from-blue-600 to-cyan-800">
            <div>
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Student Panel</h2>
              <p className="text-xs text-blue-100 mt-0.5">Learning Dashboard</p>
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
                  ? "bg-gray-100 text-blue-600 border-2 border-r-0 border-blue-600 shadow-[0_8px_22px_rgba(37,99,235,0.35)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-blue-600 after:content-['']"
                  : "hover:bg-blue-100 hover:shadow-lg hover:text-blue-600 rounded-2xl"
              }`}
            >
              <Home className="w-5 h-5" />
              Home
            </li>

            {/* Dashboard */}
            <li
              onClick={() => navigate("/student")}
              className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
                isActive("/student")
                  ? "bg-gray-100 text-blue-600 border-2 border-r-0 border-blue-600 shadow-[0_8px_22px_rgba(37,99,235,0.35)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-blue-600 after:content-['']"
                  : "hover:bg-blue-100 hover:shadow-lg hover:text-blue-600 rounded-2xl"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </li>

            {/* My Courses */}
            <li
              onClick={() => navigate("/student/my-courses")}
              className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
                isActive("/student/my-courses")
                  ? "bg-gray-100 text-blue-600 border-2 border-r-0 border-blue-600 shadow-[0_8px_22px_rgba(37,99,235,0.35)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-blue-600 after:content-['']"
                  : "hover:bg-blue-100 hover:shadow-lg hover:text-blue-600 rounded-2xl"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              My Courses
            </li>

            {/* My Certificates */}
            <li
              onClick={() => navigate("/student/certificates")}
              className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
                isActive("/student/certificates")
                  ? "bg-gray-100 text-blue-600 border-2 border-r-0 border-blue-600 shadow-[0_8px_22px_rgba(37,99,235,0.35)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-blue-600 after:content-['']"
                  : "hover:bg-blue-100 hover:shadow-lg hover:text-blue-600 rounded-2xl"
              }`}
            >
              <Award className="w-5 h-5" />
              Certificates
            </li>

            {/* Massage */}
            <li
              onClick={() => navigate("/student/massage")}
              className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
                isActive("/student/massage")
                  ? "bg-gray-100 text-blue-600 border-2 border-r-0 border-blue-600 shadow-[0_8px_22px_rgba(37,99,235,0.35)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-blue-600 after:content-['']"
                  : "hover:bg-blue-100 hover:shadow-lg hover:text-blue-600 rounded-2xl"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Massage
            </li>

            {/* Learning Progress */}
            <li
              onClick={() => navigate("/student/progress")}
              className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
                isActive("/student/progress")
                  ? "bg-gray-100 text-blue-600 border-2 border-r-0 border-blue-600 shadow-[0_8px_22px_rgba(37,99,235,0.35)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-blue-600 after:content-['']"
                  : "hover:bg-blue-100 hover:shadow-lg hover:text-blue-600 rounded-2xl"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              My Progress
            </li>

            {/* Settings */}
            <li
              onClick={() => navigate("/student/settings")}
              className={`px-4 py-2.5 rounded-l-2xl font-semibold text-lg cursor-pointer duration-300 transition flex items-center gap-2 ${
                isActive("/student/settings")
                  ? "bg-gray-100 text-blue-600 border-2 border-r-0 border-blue-600 shadow-[0_8px_22px_rgba(37,99,235,0.35)] relative after:absolute after:-right-4 after:top--1 after:h-[110%] after:w-4 after:border-t-2 after:border-b-2 after:bg-gray-100 after:border-blue-600 after:content-['']"
                  : "hover:bg-blue-100 hover:shadow-lg hover:text-blue-600 rounded-2xl"
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </li>
          </ul>
        </div>

        {/* 🔥 Bottom - Fixed */}
        <div className="flex-shrink-0 p-4 border-t-3 border-blue-500 bg-gradient-to-br from-blue-800 to-cyan-900">
          {/* Profile */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white text-xl text-blue-600 flex items-center justify-center font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <div>
              <p className="font-semibold text-white">{user?.name || "Student"}</p>
              <p className="text-xs text-blue-100">{user?.email || "student@gmail.com"}</p>
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