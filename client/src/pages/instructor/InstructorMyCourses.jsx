import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import InstructorSidebar from "../../components/InstructorSidebar";

export default function ViewCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // 🔥 Toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  // 🔥 Delete Modal
  const [deleteId, setDeleteId] = useState(null);

  const showToast = (msg) => {
    setToast({ show: true, message: msg });

    setTimeout(() => {
      setToast({ show: false, message: "" });
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

  // 🔥 Confirm Delete
  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  // 🔥 Delete Course
  const deleteCourse = async () => {
    try {
      await api.delete(`/instructor/course/${deleteId}`);

      setCourses((prev) => prev.filter((c) => c.id !== deleteId));

      showToast("🗑️ Course Deleted");

      setDeleteId(null);
    } catch {
      showToast("❌ Delete failed");
    }
  };

  // 🔍 Filter
  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="h-screen flex overflow-hidden">
      <InstructorSidebar />

      <main className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-100">
        {/* 🔥 Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
          <p className="text-gray-500">Manage and track your courses</p>
        </div>

        {/* 🔥 Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Total Courses</p>
            <h2 className="text-3xl font-bold text-blue-600">
              {courses.length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Approved</p>
            <h2 className="text-2xl font-bold text-green-600">
              {courses.filter((c) => c.isApproved).length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Pending</p>
            <h2 className="text-2xl font-bold text-yellow-600">
              {courses.filter((c) => !c.isApproved).length}
            </h2>
          </div>
        </div>

        {/* 🔍 Search */}
        <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
          <input
            type="text"
            placeholder="🔍 Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400"
          />

          <span className="text-sm text-gray-500 ml-4">
            {filteredCourses.length} results
          </span>
        </div>

        {/* 🔥 Content */}
        {loading ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500 animate-pulse">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              No Courses Found
            </h2>
            <p className="text-gray-500">
              Create your first course to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white border rounded-xl p-5 shadow hover:shadow-lg transition flex flex-col justify-between"
              >
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {course.description || "No description"}
                </p>

                <div className="flex justify-between items-center mb-4 text-sm">
                  <span
                    onClick={() =>
                      navigate(`/instructor/course/${course.id}/students`)
                    }
                    className="cursor-pointer bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    👨‍🎓 {course.students || 0}
                  </span>

                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                    ₹ {course.price}
                  </span>
                </div>

                <div className="mb-4">
                  {course.isApproved ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      Approved
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                      Pending
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/instructor/course/${course.id}/students`)
                    }
                    className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
                  >
                    View
                  </button>

                  <button
                    onClick={() => confirmDelete(course.id)}
                    className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔥 DELETE MODAL */}
        {deleteId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
              <div className="text-3xl mb-3">⚠️</div>

              <h2 className="text-xl font-semibold mb-2">Delete Course?</h2>

              <p className="text-gray-500 mb-5 text-sm">
                This action cannot be undone.
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={deleteCourse}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🎮 TOAST */}
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
