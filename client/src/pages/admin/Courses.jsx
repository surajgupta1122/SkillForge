import { useEffect, useState } from "react";
import api from "../../service/api";
import AdminSidebar from "../../components/AdminSidebar";
import { useNavigate } from "react-router-dom";

export default function Courses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCourses = async () => {
    try {
      const res = await api.get("/admin/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 🔍 Filter
  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-gray-100 flex h-screen overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-100">
        {/* 🔥 Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Courses</h1>
          <p className="text-gray-500">Manage all courses in the system</p>
        </div>

        {/* 🔥 Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Total Courses</p>
            <h2 className="text-3xl font-bold">{courses.length}</h2>
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
            className="w-full md:w-80 border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <span className="text-sm text-gray-500 ml-4">
            {filteredCourses.length} results
          </span>
        </div>

        {/* 🔥 Table */}
        {loading ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            Loading...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              No Courses Found
            </h2>
            <p className="text-gray-500">
              Try different search or create new course
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-5 bg-gray-100 p-3 text-sm font-semibold text-gray-600">
              <span>Course</span>
              <span>Instructor</span>
              <span>Price</span>
              <span>Students</span>
              <span>Status</span>
            </div>

            {/* Body */}
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="grid grid-cols-5 p-3 border-t items-center hover:bg-gray-50"
              >
                {/* Course */}
                <div>
                  <p className="font-medium text-gray-800">{course.title}</p>
                  <p className="text-xs text-gray-500">#{course.id}</p>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                    {course.instructor?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 text-sm">
                    {course.instructor}
                  </span>
                </div>

                {/* Price */}
                <span className="font-medium">₹ {course.price}</span>

                {/* Students */}
                <span className="text-blue-600 font-medium">
                  {course.students}
                </span>

                {/* Status */}
                <span>
                  {course.isApproved ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      Approved
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                      Pending
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
