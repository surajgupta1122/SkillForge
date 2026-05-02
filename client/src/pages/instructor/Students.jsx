import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import InstructorSidebar from "../../components/InstructorSidebar";
import {
  Users,
  Search,
  X,
  Mail,
  Calendar,
  UserCheck,
  BookOpen,
  TrendingUp,
  UserPlus,
  Filter,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [courses, setCourses] = useState([]);

  // Toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await api.get("/instructor/students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch instructor courses for filter
  const fetchCourses = async () => {
    try {
      const res = await api.get("/instructor/my-courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  // Filter students by search and course
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name?.toLowerCase().includes(search.toLowerCase()) ||
      student.email?.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = selectedCourse === "all" || student.courseId === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  // Calculate stats
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "active").length;
  const totalEnrollments = students.reduce((sum, s) => sum + (s.coursesCount || 1), 0);
  const avgProgress = students.length > 0 
    ? Math.round(students.reduce((sum, s) => sum + (s.progress || 0), 0) / students.length) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-1 pr-0">
      <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-3xl">
        <InstructorSidebar />

        <main className="flex-1 overflow-y-auto custom-scroll">
          <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 lg:px-10">
            
            {/* ==================== HEADER SECTION ==================== */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>Student Management</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    My <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Students</span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">Manage and track all your enrolled students</p>
                </div>
              </div>
            </div>

            {/* ==================== STATS CARDS ==================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {/* Total Students Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{totalStudents}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total Students</p>
              </div>

              {/* Active Students Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
                    <UserCheck className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{activeStudents}</span>
                </div>
                <p className="text-gray-500 text-sm">Active</p>
                <p className="text-gray-700 font-semibold mt-1">Active Students</p>
              </div>

              {/* Total Enrollments Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{totalEnrollments}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total Enrollments</p>
              </div>

              {/* Avg Progress Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{avgProgress}%</span>
                </div>
                <p className="text-gray-500 text-sm">Average</p>
                <p className="text-gray-700 font-semibold mt-1">Avg Progress</p>
              </div>
            </div>

            {/* ==================== SEARCH & FILTER SECTION ==================== */}
            <div className="bg-orange-50 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Search className="w-5 h-5 text-blue-500" />
                      Student Directory
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">Browse and search all enrolled students</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Course Filter */}
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 cursor-pointer"
                      >
                        <option value="all">All Courses</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Search Box */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 w-64"
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

                    {/* Results Count */}
                    <div className="bg-blue-50 px-3 py-1 rounded-full">
                      <span className="text-blue-600 text-sm font-medium">{filteredStudents.length} results</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== STUDENTS TABLE ==================== */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-3 border-orange-500 border-t-transparent"></div>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">No Students Found</h3>
                  <p className="text-gray-400 text-sm">
                    {search || selectedCourse !== "all" ? "Try adjusting your filters" : "No students enrolled yet"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled</th>
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-center py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                       </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, idx) => (
                        <tr key={student.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${idx !== filteredStudents.length - 1 ? 'border-b' : ''}`}>
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                                {student.name?.charAt(0).toUpperCase() || "S"}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{student.name}</p>
                                <p className="text-xs text-gray-400">ID: {student.id}</p>
                              </div>
                            </div>
                           </td>
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600 text-sm">{student.email}</span>
                            </div>
                           </td>
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-blue-400" />
                              <span className="text-gray-600 text-sm">{student.courseTitle || "Course Name"}</span>
                            </div>
                           </td>
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-500 text-sm">
                                {new Date(student.enrolledAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                           </td>
                          <td className="py-3 px-5">
                            <div className="w-24">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-600">{student.progress || 0}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                                  style={{ width: `${student.progress || 0}%` }}
                                ></div>
                              </div>
                            </div>
                           </td>
                          <td className="py-3 px-5">
                            {student.status === "active" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                <UserCheck className="w-3 h-3" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                                <Clock className="w-3 h-3" />
                                Inactive
                              </span>
                            )}
                           </td>
                          <td className="py-3 px-5">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => navigate(`/instructor/student/${student.id}`)}
                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-200"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => navigate(`/instructor/message/${student.id}`)}
                                className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-all duration-200"
                                title="Send Message"
                              >
                                <MessageSquare className="w-4 h-4" />
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
        </main>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
          <div className={`backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 flex items-center gap-3 ${
            toast.type === "success" 
              ? "bg-gray-900/95 border-green-500" 
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