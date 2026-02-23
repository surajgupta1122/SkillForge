import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../service/api";
import InstructorSidebar from "../../components/InstructorSidebar";

export default function CourseStudents() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await api.get(`/instructor/course/${id}/students`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchStudents();
  }, [id]);

  // 🔍 Filter
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <InstructorSidebar />

      <main className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-100">
        {/* 🔥 HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Course Students
            </h1>
            <p className="text-gray-500 text-sm">Manage enrolled students</p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            ⬅ Back
          </button>
        </div>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Total Students</p>
            <h2 className="text-3xl font-bold text-green-600">
              {students.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Course ID</p>
            <h2 className="text-xl font-semibold text-blue-600">#{id}</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Status</p>
            <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
        </div>

        {/* 🔍 SEARCH */}
        <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
          <input
            type="text"
            placeholder="🔍 Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
          />

          <span className="text-sm text-gray-500 ml-4">
            {filteredStudents.length} results
          </span>
        </div>

        {/* 🔥 CONTENT */}
        {loading ? (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="animate-pulse h-12 bg-gray-200 rounded"
              ></div>
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              No Students Found
            </h2>
            <p className="text-gray-500">
              Try changing your search or wait for enrollments.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {/* HEADER */}
            <div className="grid grid-cols-4 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-600 border-b">
              <span>Student</span>
              <span>Email</span>
              <span>Joined</span>
              <span className="text-center">Status</span>
            </div>

            {/* BODY */}
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="grid grid-cols-4 px-6 py-4 border-b items-center hover:bg-gray-50 transition group"
              >
                {/* STUDENT */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white font-bold">
                    {student.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-xs text-gray-400">ID: {student.id}</p>
                  </div>
                </div>

                {/* EMAIL */}
                <span className="text-gray-600 text-sm">{student.email}</span>

                {/* DATE */}
                <span className="text-gray-500 text-sm">
                  {new Date(student.created_at).toLocaleDateString()}
                </span>

                {/* STATUS */}
                <div className="text-center">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    Enrolled
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
