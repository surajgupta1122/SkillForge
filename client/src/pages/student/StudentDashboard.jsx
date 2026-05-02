import { useEffect, useState } from "react";
import StudentSidebar from "../../components/StudentSidebar.jsx";
import api from "../../service/api";
import {
  BookOpen,
  GraduationCap,
  Search,
  X,
  DollarSign,
  User,
  Calendar,
  Trophy,
  TrendingUp,
  Clock,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Star,
  Users
} from "lucide-react";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [todayCourses, setTodayCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some((c) => c.id === courseId);
  };

  // Fetch
  const fetchEnrolled = async () => {
    try {
      const res = await api.get("/student/my-courses");
      setEnrolledCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get("/student/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayCourses = async () => {
    try {
      const res = await api.get("/student/today-courses");
      setTodayCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchTodayCourses();
    fetchEnrolled();
  }, []);

  // Enroll
  const handleEnroll = async (courseId) => {
    try {
      await api.post("/student/enroll", { courseId });
      showToast("✅ Course Enrolled Successfully", "success");
      fetchTodayCourses();
      fetchEnrolled();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to enroll", "error");
    }
  };

  // Filter
  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor?.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const totalAvailable = courses.length;
  const totalEnrolled = enrolledCourses.length;
  const completionRate = enrolledCourses.length > 0 
    ? Math.round((enrolledCourses.filter(c => c.progress > 80).length / enrolledCourses.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-1 pr-0">
      <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-3xl">
        <StudentSidebar />

        <main className="flex-1 overflow-y-auto custom-scroll">
          <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 lg:px-10">
            
            {/* ==================== WELCOME SECTION ==================== */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>Learning Platform</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    Welcome Back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Student!</span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">Continue your learning journey</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-sm border border-white/40">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
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
              {/* Available Courses Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{totalAvailable}</span>
                </div>
                <p className="text-gray-500 text-sm">Available</p>
                <p className="text-gray-700 font-semibold mt-1">Available Courses</p>
              </div>

              {/* Enrolled Courses Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
                    <GraduationCap className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{totalEnrolled}</span>
                </div>
                <p className="text-gray-500 text-sm">Enrolled</p>
                <p className="text-gray-700 font-semibold mt-1">Enrolled Courses</p>
              </div>

              {/* Completion Rate Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition">
                    <Trophy className="w-6 h-6 text-purple-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{completionRate}%</span>
                </div>
                <p className="text-gray-500 text-sm">Completion</p>
                <p className="text-gray-700 font-semibold mt-1">Completion Rate</p>
              </div>
            </div>

            {/* ==================== AVAILABLE COURSES ==================== */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
              <div className="flex items-center justify-between mb-3 px-6 py-5 border-b border-gray-100 bg-blue-50">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-800">Available Courses</h2>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Browse and enroll in new courses</p>
              </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <span className="text-green-600 text-sm font-medium">{filteredCourses.length} courses</span>
                  </div>
                  {/* Search Box */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by title or instructor..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 w-64"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-48 bg-gray-200 rounded-xl"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">No Courses Found</h3>
                    <p className="text-gray-400 text-sm">
                      {search ? "Try a different search term" : "New courses will appear here"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        {/* Course Image/Header */}
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-cyan-600 relative">
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>
                          <div className="absolute top-3 right-3">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-bold text-gray-800">
                              <DollarSign className="w-3 h-3" />
                              {course.price}
                            </span>
                          </div>
                        </div>

                        {/* Course Content */}
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">
                            {course.title}
                          </h3>
                          
                          <div className="flex items-center gap-1 mb-3">
                            <User className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-500">{course.instructor}</p>
                          </div>

                          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                            {course.description || "Learn valuable skills and advance your career with this comprehensive course."}
                          </p>

                          {/* Course Stats */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{course.duration || "10 hours"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              <span className="text-xs text-gray-600">{course.rating || "4.5"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{course.students || 0} enrolled</span>
                            </div>
                          </div>

                          {/* Enroll Button */}
                          <button
                            onClick={() => handleEnroll(course.id)}
                            disabled={isEnrolled(course.id)}
                            className={`w-full py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                              isEnrolled(course.id)
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg"
                            }`}
                          >
                            {isEnrolled(course.id) ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Enrolled
                              </>
                            ) : (
                              <>
                                Enroll Now
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ==================== TODAY ENROLLMENTS ==================== */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-800">Today's Enrollments</h2>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Courses you've enrolled in today</p>
              </div>

              <div className="p-6">
                {todayCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No enrollments today</p>
                    <p className="text-xs text-gray-400 mt-1">Start exploring courses above!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{course.title}</p>
                            <p className="text-sm text-gray-500">{course.instructor}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Today
                          </span>
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                        </div>
                      </div>
                    ))}
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
          <div className={`backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 flex items-center gap-3 ${
            toast.type === "success" 
              ? "bg-gray-900/95 border-blue-500" 
              : "bg-gray-900/95 border-red-500"
          }`}>
            <div className={toast.type === "success" ? "text-green-400" : "text-red-400"}>
              {toast.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
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
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.2s ease-out forwards;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}