import { useEffect, useState, useRef } from "react";
import api from "../../service/api";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  UserCheck, 
  FileText, 
  Clock, 
  CalendarCheck,
  ChartLine,
  Search,
  X,
  CheckCircle,
  XCircle,
  GraduationCap,
  User,
  Mail,
  Shield,
  UserCog,
  LayoutDashboard,
  Bell
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search states
  const [instructorSearch, setInstructorSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  // Refs for scrolling to sections
  const instructorSectionRef = useRef(null);
  const courseSectionRef = useRef(null);

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  const fetchPendingInstructors = async () => {
    const res = await api.get("/admin/pending-instructors");
    setPendingInstructors(res.data);
  };

  const fetchPendingCourses = async () => {
    const res = await api.get("/admin/pending-courses");
    setPendingCourses(res.data);
  };

  useEffect(() => {
    Promise.all([fetchPendingInstructors(), fetchPendingCourses()])
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, []);

  const approveInstructor = async (id) => {
    await api.put(`/admin/approve/${id}`);
    setPendingInstructors((prev) => prev.filter((i) => i.id !== id));
    showToast("✅ Instructor Approved");
  };

  const rejectInstructor = async (id) => {
    await api.delete(`/admin/reject/${id}`);
    setPendingInstructors((prev) => prev.filter((i) => i.id !== id));
    showToast("❌ Instructor Rejected");
  };

  const approveCourse = async (id) => {
    await api.put(`/admin/approve-course/${id}`);
    setPendingCourses((prev) => prev.filter((c) => c.id !== id));
    showToast("✅ Course Approved");
  };

  const rejectCourse = async (id) => {
    await api.delete(`/admin/reject-course/${id}`);
    setPendingCourses((prev) => prev.filter((c) => c.id !== id));
    showToast("❌ Course Rejected");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Filter instructors based on search
  const filteredInstructors = pendingInstructors.filter((inst) =>
    inst.name?.toLowerCase().includes(instructorSearch.toLowerCase()) ||
    inst.email?.toLowerCase().includes(instructorSearch.toLowerCase())
  );

  // Filter courses based on search
  const filteredCourses = pendingCourses.filter((course) =>
    course.title?.toLowerCase().includes(courseSearch.toLowerCase()) ||
    course.instructor?.toLowerCase().includes(courseSearch.toLowerCase())
  );

  // Calculate stats
  const totalRequests = pendingInstructors.length + pendingCourses.length;
  const todayRequests = totalRequests > 0 ? Math.max(1, Math.floor(totalRequests * 0.6)) : 0;
  const userRequests = pendingInstructors.length;
  const courseRequests = pendingCourses.length;

  // Scroll to section functions
  const scrollToInstructors = () => {
    instructorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToCourses = () => {
    courseSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-blue-100 backdrop-blur-md p-1 pr-0">
      <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-r-3xl">
        <AdminSidebar onLogout={logout} />

        <main className="flex-1 overflow-y-auto custom-scroll bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 lg:px-10">
            
            {/* ==================== WELCOME SECTION ==================== */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>Dashboard Overview</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    Hello <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Admin</span>,
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">Welcome back! Your dashboard is ready</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-sm border border-white/40">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                        <CalendarCheck className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Today's Date</p>
                        <p className="font-bold text-gray-800 text-sm">
                          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== STATS CARDS with Click Navigation ==================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {/* Total Requests Card */}
              <div 
                onClick={totalRequests > 0 ? () => {
                  if (userRequests > 0) scrollToInstructors();
                  if (courseRequests > 0) scrollToCourses();
                } : undefined}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group ${
                  totalRequests > 0 ? "cursor-pointer hover:shadow-md hover:scale-[1.02]" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                    <FileText className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{totalRequests}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total Requests</p>
                {totalRequests > 0 && (
                  <p className="text-xs text-blue-500 mt-2 opacity-0 group-hover:opacity-100 transition">
                    Click to view requests →
                  </p>
                )}
              </div>

              {/* Today Total Request Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition">
                    <Clock className="w-6 h-6 text-purple-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">
                    {todayRequests > 0 ? todayRequests : 0}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">Today</p>
                <p className="text-gray-700 font-semibold mt-1">Today Total Request</p>
                {todayRequests > 0 && (
                  <div className="mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-green-600">New requests today!</span>
                  </div>
                )}
              </div>

              {/* Total User Request (Instructors) Card */}
              <div 
                onClick={userRequests > 0 ? scrollToInstructors : undefined}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group ${
                  userRequests > 0 ? "cursor-pointer hover:shadow-md hover:scale-[1.02]" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition">
                    <Users className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{userRequests}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total User Request</p>
                {userRequests > 0 && (
                  <p className="text-xs text-orange-500 mt-2 opacity-0 group-hover:opacity-100 transition">
                    Click to see instructors →
                  </p>
                )}
              </div>

              {/* Total Courses Request Card */}
              <div 
                onClick={courseRequests > 0 ? scrollToCourses : undefined}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group ${
                  courseRequests > 0 ? "cursor-pointer hover:shadow-md hover:scale-[1.02]" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
                    <BookOpen className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{courseRequests}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total Courses Request</p>
                {courseRequests > 0 && (
                  <p className="text-xs text-green-500 mt-2 opacity-0 group-hover:opacity-100 transition">
                    Click to see courses →
                  </p>
                )}
              </div>
            </div>

            {/* ==================== INSTRUCTOR SECTION with Search ==================== */}
            <div ref={instructorSectionRef} className="bg-green-50 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden scroll-mt-20">
              <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-blue-500" />
                    Instructor Approval Requests
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Review and manage pending instructor applications</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 px-3 py-1 rounded-full">
                    <span className="text-blue-600 text-sm font-medium">{filteredInstructors.length} pending</span>
                  </div>
                  {/* Search Box for Instructors */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search instructor..."
                      value={instructorSearch}
                      onChange={(e) => setInstructorSearch(e.target.value)}
                      className="pl-9 pr-8 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 w-48"
                    />
                    {instructorSearch && (
                      <button
                        onClick={() => setInstructorSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                  </div>
                ) : filteredInstructors.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <UserCheck className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">
                      {instructorSearch ? "No matching instructors found" : "No pending instructors"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {instructorSearch ? "Try a different search term" : "All caught up! ✨"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Instructor</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInstructors.map((inst, idx) => (
                          <tr key={inst.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${idx !== filteredInstructors.length - 1 ? 'border-b' : ''}`}>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                  {inst.name?.charAt(0) || "U"}
                                </div>
                                <span className="font-medium text-gray-800">{inst.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-500 text-sm">{inst.email}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                                Pending
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => approveInstructor(inst.id)}
                                  className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => rejectInstructor(inst.id)}
                                  className="px-4 py-1.5 bg-red-400 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center gap-1"
                                >
                                  <XCircle className="w-3 h-3" />
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* ==================== COURSE SECTION with Search ==================== */}
            <div ref={courseSectionRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-20">
              <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-green-50">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-500" />
                    Course Approval Requests
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Review new course submissions from instructors</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 px-3 py-1 rounded-full">
                    <span className="text-indigo-600 text-sm font-medium">{filteredCourses.length} pending</span>
                  </div>
                  {/* Search Box for Courses */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search course..."
                      value={courseSearch}
                      onChange={(e) => setCourseSearch(e.target.value)}
                      className="pl-9 pr-8 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 w-48"
                    />
                    {courseSearch && (
                      <button
                        onClick={() => setCourseSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {filteredCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">
                      {courseSearch ? "No matching courses found" : "No pending courses"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {courseSearch ? "Try a different search term" : "All courses are reviewed!"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Instructor</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCourses.map((course, idx) => (
                          <tr key={course.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${idx !== filteredCourses.length - 1 ? 'border-b' : ''}`}>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                  <BookOpen className="w-4 h-4 text-indigo-500" />
                                </div>
                                <span className="font-medium text-gray-800">{course.title}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-500 text-sm">{course.instructor}</td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-gray-800">₹{course.price?.toLocaleString()}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                                Pending
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => approveCourse(course.id)}
                                  className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => rejectCourse(course.id)}
                                  className="px-4 py-1.5 bg-red-400 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center gap-1"
                                >
                                  <XCircle className="w-3 h-3" />
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
          <div className="bg-gray-900/95 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 border-green-500 flex items-center gap-3">
            <div className="text-green-400 text-xl">{toast.message.includes("Approved") ? "✅" : "❌"}</div>
            <div>
              <p className="text-xs text-gray-400">System Notification</p>
              <p className="text-sm font-semibold">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        .scroll-mt-20 {
          scroll-margin-top: 5rem;
        }
      `}</style>
    </div>
  );
}