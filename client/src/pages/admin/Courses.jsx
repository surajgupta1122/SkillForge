import { useEffect, useState, useRef } from "react";
import api from "../../service/api";
import AdminSidebar from "../../components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Search, 
  X,
  CalendarCheck,
  CheckCircle,
  Clock,
  GraduationCap,
  Users
} from "lucide-react";

export default function Courses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get("/admin/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 🔍 Filter
  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor?.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate stats
  const totalCourses = courses.length;
  const approvedCourses = courses.filter((c) => c.isApproved).length;
  const pendingCourses = courses.filter((c) => !c.isApproved).length;

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-blue-100 backdrop-blur-md p-1 pr-0">
      <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-r-3xl">
        <AdminSidebar onLogout={logout} />

        <main className="flex-1 overflow-y-auto custom-scroll bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 lg:px-10">
            
            {/* ==================== HEADER SECTION ==================== */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>Course Management</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    All <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Courses</span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">Manage all courses in the system</p>
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

            {/* ==================== STATS CARDS ==================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {/* Total Courses Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{totalCourses}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total Courses</p>
              </div>

              {/* Approved Courses Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-2xl font-black text-green-600">{approvedCourses}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Approved Courses</p>
              </div>

              {/* Pending Courses Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center group-hover:bg-yellow-100 transition">
                    <Clock className="w-6 h-6 text-yellow-500" />
                  </div>
                  <span className="text-2xl font-black text-yellow-600">{pendingCourses}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Pending Courses</p>
              </div>
            </div>

            {/* ==================== SEARCH SECTION ==================== */}
            <div className="bg-green-50 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Search className="w-5 h-5 text-indigo-500" />
                    Course Directory
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Browse and search all courses in the platform</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 px-3 py-1 rounded-full">
                    <span className="text-indigo-600 text-sm font-medium">{filteredCourses.length} results</span>
                  </div>
                  {/* Search Box */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by title or instructor..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 w-64"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== COURSES TABLE ==================== */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent"></div>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">No Courses Found</h3>
                  <p className="text-gray-400 text-sm">
                    {search ? "Try a different search term" : "No courses available in the system"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Instructor</th>
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Students</th>
                        <th className="text-center py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.map((course, idx) => (
                        <tr key={course.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${idx !== filteredCourses.length - 1 ? 'border-b' : ''}`}>
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{course.title}</p>
                                <p className="text-xs text-gray-400">ID: {course.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                {course.instructor?.charAt(0).toUpperCase() || "U"}
                              </div>
                              <span className="text-gray-700 text-sm">{course.instructor}</span>
                            </div>
                          </td>
                          <td className="py-3 px-5">
                            <span className="font-semibold text-gray-800">₹{course.price?.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-blue-600 font-medium">{course.students || 0}</span>
                            </div>
                          </td>
                          <td className="py-3 px-5 text-center">
                            {course.isApproved ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
          <div className="bg-gray-900/95 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 border-green-500 flex items-center gap-3">
            <div className="text-green-400 text-xl">✅</div>
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
      `}</style>
    </div>
  );
}