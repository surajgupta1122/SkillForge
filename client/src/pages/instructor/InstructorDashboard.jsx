import { useEffect, useState } from "react";
import api from "../../service/api";
import InstructorSidebar from "../../components/InstructorSidebar";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // 🔹 Fetch instructor courses (for stats only)
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

  // 🔹 Create course
  const handleAddCourse = async () => {
    if (!title || !price) return;

    try {
      await api.post("/instructor/create-course", {
        title,
        description,
        price,
      });

      setTitle("");
      setDescription("");
      setPrice("");
      fetchCourses();
    } catch {
      alert("Failed to create course");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ✅ Reusable Sidebar */}
      <InstructorSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-5 rounded shadow">
            <h3 className="text-gray-500">Total Courses</h3>
            <p className="text-3xl font-bold">{courses.length}</p>
          </div>

          <div className="bg-white p-5 rounded shadow">
            <h3 className="text-gray-500">Total Students</h3>
            <p className="text-3xl font-bold">
              {courses.reduce((sum, c) => sum + (c.students || 0), 0)}
            </p>
          </div>
        </div>

        {/* Add Course */}
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Course</h2>

          <input
            type="text"
            placeholder="Course Title"
            className="w-full mb-3 p-2 border border-gray-300 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Course Description"
            className="w-full mb-3 p-2 border border-gray-300 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full mb-3 p-2 border border-gray-300 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button
            onClick={handleAddCourse}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Course
          </button>
        </div>
      </main>
    </div>
  );
}
