import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import InstructorSidebar from "../../components/InstructorSidebar";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Search,
  X,
  Users,
  DollarSign,
  Eye,
  Trash2,
  AlertTriangle,
  PlusCircle,
  GraduationCap,
  TrendingUp
} from "lucide-react";

export default function ViewCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Delete Modal
  const [deleteId, setDeleteId] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get("/instructor/my-courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Confirm Delete
  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  // Delete Course
  const deleteCourse = async () => {
    try {
      await api.delete(`/instructor/course/${deleteId}`);
      setCourses((prev) => prev.filter((c) => c.id !== deleteId));
      showToast("✅ Course deleted successfully", "success");
      setDeleteId(null);
    } catch {
      showToast("❌ Failed to delete course", "error");
    }
  };

  // Filter
  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalCourses = courses.length;
  const approvedCourses = courses.filter((c) => c.isApproved).length;
  const pendingCourses = courses.filter((c) => !c.isApproved).length;
  const totalStudents = courses.reduce((sum, c) => sum + (c.students || 0), 0);
  const totalRevenue = courses.reduce((sum, c) => sum + ((c.students || 0) * (c.price || 0)), 0);

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
                    <span>Course Management</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    My <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Courses</span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">Manage and track all your created courses</p>
                </div>
                <button
                  onClick={() => navigate("/instructor")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-orange-400 to-red-600 hover:from-orange-500 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <PlusCircle className="w-4 h-4" />
                  Create New Course
                </button>
              </div>
            </div>

            {/* ==================== STATS CARDS ==================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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

              {/* Total Revenue Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">₹{totalRevenue.toLocaleString()}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total Revenue</p>
              </div>

              {/* Approved Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-2xl font-black text-green-600">{approvedCourses}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Approved</p>
              </div>

              {/* Pending Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center group-hover:bg-yellow-100 transition">
                    <Clock className="w-6 h-6 text-yellow-500" />
                  </div>
                  <span className="text-2xl font-black text-yellow-600">{pendingCourses}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Pending Approval</p>
              </div>
            </div>

            {/* ==================== SEARCH SECTION ==================== */}
            <div className="bg-orange-50 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-500" />
                    Course Directory
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Browse and search all your courses</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 px-3 py-1 rounded-full">
                    <span className="text-blue-600 text-sm font-medium">{filteredCourses.length} results</span>
                  </div>
                  {/* Search Box */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by title or description..."
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
                </div>
              </div>
            </div>

            {/* ==================== COURSES GRID ==================== */}
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent"></div>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No Courses Found</h3>
                <p className="text-gray-400 text-sm">
                  {search ? "Try a different search term" : "Create your first course to get started"}
                </p>
                {!search && (
                  <button
                    onClick={() => navigate("/instructor")}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-orange-400 to-red-600 hover:from-orange-500 hover:to-red-700 text-white text-sm font-medium rounded-lg transition shadow-md"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Create New Course
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                  >
                    {/* Card Header */}
                    <div className="p-4 pb-2 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-1 flex-1">
                          {course.title}
                        </h3>
                        {course.isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            <CheckCircle className="w-3 h-3" />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-2">
                        {course.description || "No description provided"}
                      </p>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-4">
                      {/* Stats Row */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Users className="w-3 h-3 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Students</p>
                            <p className="font-semibold text-gray-800 text-sm">{course.students || 0}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                            <DollarSign className="w-3 h-3 text-green-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Price</p>
                            <p className="font-semibold text-gray-800 text-sm">₹{course.price?.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                            <TrendingUp className="w-3 h-3 text-purple-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Revenue</p>
                            <p className="font-semibold text-gray-800 text-sm">₹{((course.students || 0) * (course.price || 0)).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => navigate(`/instructor/course/${course.id}/students`)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow"
                        >
                          <Eye className="w-4 h-4" />
                          View Students
                        </button>
                        <button
                          onClick={() => confirmDelete(course.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-400 hover:bg-red-500 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 animate-slideIn text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Course?</h2>
            <p className="text-gray-500 text-sm mb-6">
              This action cannot be undone. The course and all its data will be permanently removed.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={deleteCourse}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition shadow-sm hover:shadow flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
          <div className={`backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 flex items-center gap-3 ${
            toast.type === "success" 
              ? "bg-gray-900/95 border-green-500" 
              : "bg-gray-900/95 border-red-500"
          }`}>
            <div className={toast.type === "success" ? "text-green-400" : "text-red-400"}>
              {toast.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
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