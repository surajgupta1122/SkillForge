import { useEffect, useState } from "react";
import api from "../../service/api";
import StudentSidebar from "../../components/StudentSidebar.jsx";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">My Enrolled Courses</h2>

        {loading ? (
          <p>Loading...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-500">No enrolled courses</p>
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

                <p className="text-gray-700 mb-2">
                  Instructor: {course.instructor || "Unknown"}
                </p>

                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                  Enrolled
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
