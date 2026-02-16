import { useEffect, useState } from "react";
import StudentSidebar from "../../components/StudentSidebar.jsx";
import api from "../../service/api";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [todayCourses, setTodayCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const isEnrolled = (courseId) => {
  return enrolledCourses.some((course) => course.id === courseId);
};

  // 🔹 Fetch my enrolled courses
  const fetchEnrolled = async () => {
  try {
    const res = await api.get("/student/my-courses");
    setEnrolledCourses(res.data);
  } catch (err) {
    console.error(err);
  }
  };

  // 🔹 Fetch courses from backend
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

  // 🔹 Fetch today's enrolled courses
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

  // 🔹 Handle course enrollment
  const handleEnroll = async (courseId) => {
  try {
    await api.post("/student/enroll", { courseId });

    alert("Enrolled successfully");

    fetchTodayCourses();
    fetchEnrolled();

  } catch (err) {
    alert(err.response?.data?.message || "Error");
  }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-5 rounded shadow">
            <h3 className="text-gray-500">Available Courses</h3>
            <p className="text-3xl font-bold">{courses.length}</p>
          </div>

          <div className="bg-white p-5 rounded shadow">
            <h3 className="text-gray-500">Enrolled Courses</h3>
            <p className="text-3xl font-bold">{enrolledCourses.length}</p>
          </div>
        </div>

        {/* Available Courses */}
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Available Courses</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="border border-gray-300 p-4 rounded shadow-sm"
                >
                  <h3 className="font-bold text-lg">{course.title}</h3>

                  <p className="text-gray-600 mb-2">
                    Instructor: {course.instructor}
                  </p>

                  <p className="text-gray-600 mb-3">
                    Price: ₹ {course.price}
                  </p>

                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={isEnrolled(course.id)}
                    className={`px-4 py-2 rounded text-white ${
                      isEnrolled(course.id)
                        ? "bg-gray-400"
                        : "bg-green-600"
                    }`}
                  >
                    {isEnrolled(course.id)
                      ? "Enrolled"
                      : "Enroll"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Today Enrolled Courses</h2>

          {todayCourses.length === 0 ? (
            <p className="text-gray-500">Today you are not enrolled in any course</p>
          ) : (
            <ul className="space-y-3">
              {todayCourses.map((course) => (
                <li
                  key={course.id}
                  className="border p-3 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{course.title}</p>
                    <p className="text-sm text-gray-600">
                      {course.instructor}
                    </p>
                  </div>

                  <span className="text-green-600 font-semibold">
                    Today
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
