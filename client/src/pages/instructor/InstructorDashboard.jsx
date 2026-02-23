import { useEffect, useState } from "react";
import api from "../../service/api";
import InstructorSidebar from "../../components/InstructorSidebar";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
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
      showToast("⚠️ Fill required fields");
      return;
    }

    try {
      await api.post("/instructor/create-course", {
        title,
        description,
        price,
      });

      handleClear();
      fetchCourses();

      showToast("🎉 Course Created Successfully");
    } catch {
      showToast("❌ Failed to create course");
    }
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setPrice("");
  };

  // 🔥 Step logic
  const filledCount = (title ? 1 : 0) + (price ? 1 : 0) + (description ? 1 : 0);

  return (
    <div className="flex h-screen overflow-hidden">
      <InstructorSidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-100">
        {/* 🔥 Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Create Course</h1>
          <p className="text-gray-500">Fill course details step by step</p>
        </div>

        {/* 🔥 Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Total Courses</p>
            <h2 className="text-3xl font-bold text-blue-600">
              {courses.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Total Students</p>
            <h2 className="text-3xl font-bold text-green-600">
              {courses.reduce((sum, c) => sum + (c.students || 0), 0)}
            </h2>
          </div>
        </div>

        {/* 🔥 FORM */}
        <div className="ml-[7%] bg-white p-8 rounded-2xl shadow-lg max-w-4xl border">
          {/* 🔥 Step Indicators */}
          <div className="flex justify-between mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold
                    ${filledCount >= step ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}
                  `}
                >
                  {step}
                </div>
                <span className="text-xs mt-1">Step {step}</span>
              </div>
            ))}
          </div>

          {/* 🔥 Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                filledCount === 3
                  ? "w-full bg-green-500"
                  : filledCount === 2
                    ? "w-2/3 bg-green-500"
                    : filledCount === 1
                      ? "w-1/3 bg-green-500"
                      : "w-0"
              }`}
            ></div>
          </div>

          {/* 🔥 Inputs */}
          <div className="space-y-6">
            {/* Title */}
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-3 border rounded-lg outline-none peer
                  ${title ? "border-green-500" : "border-gray-300"}
                  focus:ring-2 focus:ring-green-400`}
                placeholder=" "
              />
              <label className="absolute left-3 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs">
                Course Title
              </label>
            </div>

            {/* Price */}
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full p-3 border rounded-lg outline-none peer
                  ${price ? "border-green-500" : "border-gray-300"}
                  focus:ring-2 focus:ring-green-400`}
                placeholder=" "
              />
              <label className="absolute left-3 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs">
                Price (₹)
              </label>
            </div>

            {/* Description */}
            <div className="relative">
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full p-3 border rounded-lg outline-none peer
                  ${description ? "border-green-500" : "border-gray-300"}
                  focus:ring-2 focus:ring-green-400`}
                placeholder=" "
              />
              <label className="absolute left-3 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs">
                Description
              </label>
            </div>
          </div>

          {/* 🔥 Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Clear
            </button>

            <button
              onClick={handleAddCourse}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow"
            >
              Create Course
            </button>
          </div>
        </div>

        {/* 🎮 Toast */}
        {toast.show && (
          <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
            <div className="bg-black text-white px-4 py-3 rounded shadow-lg border-l-4 border-green-500 flex items-center gap-3">
              <div className="text-green-400 text-xl">🔔</div>
              <div>
                <p className="text-xs text-gray-400">massage</p>
                <p className="text-sm font-semibold">{toast.message}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
