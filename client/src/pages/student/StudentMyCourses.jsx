import { useEffect, useState } from "react";
import api from "../../service/api";
import StudentSidebar from "../../components/StudentSidebar.jsx";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
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

  // 🔹 Fetch enrolled courses
  const fetchMyCourses = async () => {
    try {
      const res = await api.get("/student/my-courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  // 🔍 Filter
  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-gray-100 flex h-screen overflow-hidden">
      <StudentSidebar />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* 🔥 Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
          <p className="text-gray-500">
            Continue learning your enrolled courses
          </p>
        </div>

        {/* 🔥 Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Total Courses</p>
            <h2 className="text-3xl font-bold text-blue-600">
              {courses.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Active Learning</p>
            <h2 className="text-3xl font-bold text-green-600">
              {courses.length}
            </h2>
          </div>
        </div>

        {/* 🔍 Search */}
        <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
          <input
            type="text"
            placeholder="🔍 Search your courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
          />

          <span className="text-sm text-gray-500 ml-4">
            {filteredCourses.length} results
          </span>
        </div>

        {/* 🔥 Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl shadow animate-pulse space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>

                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>

                <div className="h-8 bg-gray-200 rounded mt-4"></div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow text-center">
            <div className="text-5xl mb-4">📚</div>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Courses Found
            </h2>

            <p className="text-gray-500 mb-4">
              You haven't enrolled in any courses yet.
            </p>

            <button
              onClick={() => navigate("/student")}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
              >
                {/* 🔥 Header (Avatar + Title) */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    {course.title.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-800">
                      {course.title}
                    </h3>

                    <p className="text-xs text-gray-500">
                      👤 {course.instructor || "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {course.description || "No description available"}
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center mt-auto">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    Enrolled
                  </span>

                  <button
                    onClick={() => showToast(`📘 Opened ${course.title}`)}
                    className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 transition"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* 🎮 Toast */}
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
