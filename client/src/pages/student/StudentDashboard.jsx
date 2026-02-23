import { useEffect, useState } from "react";
import StudentSidebar from "../../components/StudentSidebar.jsx";
import api from "../../service/api";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [todayCourses, setTodayCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔥 Toast
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: "" });
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

  // 🔥 Enroll
  const handleEnroll = async (courseId) => {
    try {
      await api.post("/student/enroll", { courseId });

      showToast("🎉 Course Enrolled");

      fetchTodayCourses();
      fetchEnrolled();
    } catch (err) {
      showToast(err.response?.data?.message || "Error");
    }
  };

  // 🔍 Filter
  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-gray-100 flex h-screen overflow-hidden">
      <StudentSidebar />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-100">
        {/* 🔥 HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Student Dashboard
          </h1>
          <p className="text-gray-500">Explore and enroll in courses</p>
        </div>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Available Courses</p>
            <h2 className="text-3xl font-bold text-blue-600">
              {courses.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Enrolled Courses</p>
            <h2 className="text-3xl font-bold text-green-600">
              {enrolledCourses.length}
            </h2>
          </div>
        </div>

        {/* 🔍 SEARCH */}
        <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
          <input
            type="text"
            placeholder="🔍 Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
          />

          <span className="text-sm text-gray-500 ml-4">
            {filteredCourses.length} results
          </span>
        </div>

        {/* 🔥 AVAILABLE COURSES */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Available Courses</h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 animate-pulse rounded"
                />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <p className="text-gray-500">No courses found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-gray-50 border rounded-xl p-5 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                >
                  {/* Title */}
                  <h3 className="font-semibold text-lg text-gray-800">
                    {course.title}
                  </h3>

                  {/* Instructor */}
                  <p className="text-sm text-gray-500 mb-2">
                    {course.instructor}
                  </p>

                  {/* Price */}
                  <p className="text-green-600 font-semibold mb-4">
                    ₹ {course.price}
                  </p>

                  {/* Button */}
                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={isEnrolled(course.id)}
                    className={`w-full py-2 rounded text-white transition ${
                      isEnrolled(course.id)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {isEnrolled(course.id) ? "Enrolled" : "Enroll Now"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔥 TODAY COURSES */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Today Enrolled Courses</h2>

          {todayCourses.length === 0 ? (
            <p className="text-gray-500">No enrollments today</p>
          ) : (
            <div className="space-y-3">
              {todayCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex justify-between items-center border p-4 rounded-lg hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">{course.title}</p>
                    <p className="text-sm text-gray-500">{course.instructor}</p>
                  </div>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Today
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🎮 TOAST */}
        {toast.show && (
          <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
            <div className="bg-black text-white px-4 py-3 rounded shadow-lg border-l-4 border-green-500 flex items-center gap-3">
              <span className="text-xl">🔔</span>
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
