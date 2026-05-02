import { useEffect, useState } from "react";
import api from "../../service/api";
import InstructorSidebar from "../../components/InstructorSidebar";
import {
  BookOpen,
  Users,
  PlusCircle,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  DollarSign,
  AlignLeft,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get("/instructor/my-courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = async () => {
    if (!title || !price) {
      showToast("⚠️ Please fill all required fields", "error");
      return;
    }

    try {
      await api.post("/instructor/create-course", {
        title,
        description,
        price: parseFloat(price),
      });

      handleClear();
      fetchCourses();

      showToast("✅ Course Created Successfully", "success");
    } catch {
      showToast("❌ Failed to create course", "error");
    }
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setPrice("");
  };

  // Step logic
  const filledCount = (title ? 1 : 0) + (price ? 1 : 0) + (description ? 1 : 0);
  const totalStudents = courses.reduce((sum, c) => sum + (c.students || 0), 0);

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
                    <span>Instructor Dashboard</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    Create{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      New Course
                    </span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">
                    Fill course details step by step
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-sm border border-white/40">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Courses</p>
                        <p className="font-bold text-gray-800 text-sm">
                          {courses.length}
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
                  <span className="text-2xl font-black text-gray-800">
                    {courses.length}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">
                  Total Courses
                </p>
              </div>

              {/* Total Students Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">
                    {totalStudents}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">
                  Total Students
                </p>
              </div>

              {/* Revenue Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">
                    ₹
                    {courses
                      .reduce(
                        (sum, c) => sum + (c.students || 0) * (c.price || 0),
                        0,
                      )
                      .toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">
                  Total Revenue
                </p>
              </div>
            </div>

            {/* ==================== CREATE COURSE FORM ==================== */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-orange-50">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-800">
                    Create New Course
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Fill in the course details below
                </p>
              </div>

              <div className="p-6">
                {/* Step Indicators */}
                <div className="flex justify-between mb-6">
                  {[
                    { step: 1, label: "Title", icon: FileText },
                    { step: 2, label: "Price", icon: DollarSign },
                    { step: 3, label: "Description", icon: AlignLeft },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    const isCompleted = filledCount >= item.step;
                    return (
                      <div
                        key={item.step}
                        className="flex flex-col items-center flex-1"
                      >
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300
                            ${
                              isCompleted
                                ? "bg-orange-500 text-white shadow-lg shadow-green-200"
                                : "bg-gray-100 text-gray-400"
                            }
                          `}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            item.step
                          )}
                        </div>
                        <span
                          className={`text-xs mt-2 font-medium ${isCompleted ? "text-orange-600" : "text-gray-400"}`}
                        >
                          <Icon className="w-3 h-3 inline mr-1" />
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      filledCount === 3
                        ? "w-full bg-gradient-to-r from-green-500 to-emerald-500"
                        : filledCount === 2
                          ? "w-2/3 bg-gradient-to-r from-green-500 to-emerald-500"
                          : filledCount === 1
                            ? "w-1/3 bg-gradient-to-r from-green-500 to-emerald-500"
                            : "w-0"
                    }`}
                  ></div>
                </div>

                {/* Input Fields */}
                <div className="space-y-6">
                  {/* Title */}
                  <div className="relative">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 pt-5 pb-2 border rounded-xl outline-none peer focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder=" "
                    />
                    <label
                      className={`absolute left-4 transition-all duration-200 pointer-events-none
                        ${
                         title
                           ? "top-2 text-xs text-orange-600"
                           : "top-1/2 -translate-y-1/2 text-gray-500 text-base"
                        }
                       peer-focus:top-2 peer-focus:text-xs peer-focus:text-orange-600
                      `}
                    >
                      Course Title <span className="text-red-500">*</span>
                    </label>
                  </div>

                  {/* Price */}
                  <div className="relative">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 pt-5 pb-2 border rounded-xl outline-none peer focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder=" "
                    />
                    <label
                      className={`absolute left-4 transition-all duration-200 pointer-events-none
                        ${
                          price
                            ? "top-2 text-xs text-orange-600"
                            : "top-1/2 -translate-y-1/2 text-gray-500 text-base"
                        }
                        peer-focus:top-2 peer-focus:text-xs peer-focus:text-orange-600
                      `}
                    >
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                  </div>

                  {/* Description */}
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 pt-5 pb-2 border rounded-xl outline-none peer focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all resize-none"
                      placeholder=" "
                    />
                    <label
                      className={`absolute left-4 transition-all duration-200 pointer-events-none
                        ${
                          description
                            ? "top-2 text-xs text-orange-600"
                            : "top-5 text-gray-500 text-base"
                        }
                        peer-focus:top-2 peer-focus:text-xs peer-focus:text-orange-600
                      `}
                    >
                      Description
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>

                  <button
                    onClick={handleAddCourse}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-br from-orange-400 to-red-600 hover:from-orange-500 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    Create Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
          <div
            className={`backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-gray-900/95 border-green-500"
                : "bg-gray-900/95 border-red-500"
            }`}
          >
            <div
              className={
                toast.type === "success" ? "text-green-400" : "text-red-400"
              }
            >
              {toast.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
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
