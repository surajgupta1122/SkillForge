import { useEffect, useState } from "react";
import api from "../../service/api";
import InstructorSidebar from "../../components/InstructorSidebar";

export default function ViewCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await api.delete(`/instructor/course/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ✅ Reusable Sidebar */}
      <InstructorSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">My Courses</h2>

        {loading ? (
          <p>Loading...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-500">No courses created yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border rounded-lg p-4 shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-600 mb-3">
                  {course.description || "No description"}
                </p>

                <div className="flex justify-between mb-4 text-sm">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    👨‍🎓 {course.students || 0}
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                    ₹ {course.price}
                  </span>
                </div>

                <button
                  onClick={() => deleteCourse(course.id)}
                  className="w-full bg-red-600 text-white py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
