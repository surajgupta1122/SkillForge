import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../service/api";
import InstructorSidebar from "../../components/InstructorSidebar";
import {
  Users,
  BookOpen,
  CalendarCheck,
  ArrowLeft,
  Search,
  X,
  Mail,
  Calendar,
  UserCheck,
  GraduationCap,
  User
} from "lucide-react";

export default function CourseStudents() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await api.get(`/instructor/course/${id}/students`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchStudents();
  }, [id]);

  // Filter students
  const filteredStudents = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

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
                    Course <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Students</span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">Manage students enrolled in your course</p>
                </div>
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">Back</span>
                </button>
              </div>
            </div>

            {/* ==================== STATS CARDS ==================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {/* Total Students Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{students.length}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total Students</p>
              </div>

              {/* Course ID Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-xl font-black text-blue-600 font-mono">#{id}</span>
                </div>
                <p className="text-gray-500 text-sm">Course</p>
                <p className="text-gray-700 font-semibold mt-1">Course ID</p>
              </div>

              {/* Status Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition">
                    <CalendarCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    Active
                  </span>
                </div>
                <p className="text-gray-500 text-sm">Status</p>
                <p className="text-gray-700 font-semibold mt-1">Course Status</p>
              </div>
            </div>

            {/* ==================== SEARCH SECTION ==================== */}
            <div className="bg-orange-50 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-500" />
                    Student Directory
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Browse and search enrolled students</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 px-3 py-1 rounded-full">
                    <span className="text-green-600 text-sm font-medium">{filteredStudents.length} results</span>
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
                </div>
              </div>
            </div>

            {/* ==================== STUDENTS TABLE ==================== */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-3 border-green-500 border-t-transparent"></div>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">No Students Found</h3>
                  <p className="text-gray-400 text-sm">
                    {search ? "Try a different search term" : "No students enrolled in this course yet"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="text-center py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, idx) => (
                        <tr key={student.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${idx !== filteredStudents.length - 1 ? 'border-b' : ''}`}>
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white text-sm font-bold">
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
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-500 text-sm">
                                {new Date(student.created_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-5 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                              <UserCheck className="w-3 h-3" />
                              Enrolled
                            </span>
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
      `}</style>
    </div>
  );
}