import { useEffect, useState } from "react";
import api from "../../service/api";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch pending instructors
  const fetchPendingInstructors = async () => {
    const res = await api.get("/admin/pending-instructors");
    setPendingInstructors(res.data);
  };

  // 🔹 Fetch pending courses
  const fetchPendingCourses = async () => {
    const res = await api.get("/admin/pending-courses");
    setPendingCourses(res.data);
  };

  useEffect(() => {
    Promise.all([fetchPendingInstructors(), fetchPendingCourses()])
      .catch((err) => {
        console.error(err);
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Approve instructor
  const approveInstructor = async (id) => {
    await api.put(`/admin/approve/${id}`);
    setPendingInstructors((prev) =>
      prev.filter((inst) => inst.id !== id)
    );
  };

  // 🔹 Reject instructor
  const rejectInstructor = async (id) => {
    await api.delete(`/admin/reject/${id}`);
    setPendingInstructors((prev) =>
      prev.filter((inst) => inst.id !== id)
    );
  };

  // 🔹 Approve course
  const approveCourse = async (id) => {
    await api.put(`/admin/approve-course/${id}`);
    setPendingCourses((prev) =>
      prev.filter((c) => c.id !== id)
    );
  };

  // 🔹 Reject course
  const rejectCourse = async (id) => {
    await api.delete(`/admin/reject-course/${id}`);
    setPendingCourses((prev) =>
      prev.filter((c) => c.id !== id)
    );
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar onLogout={logout} />

      <main className="flex-1 p-8 space-y-8">

        {/* 🔹 Instructor Approvals */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">
            Instructor Approval Requests
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : pendingInstructors.length === 0 ? (
            <p className="text-gray-500">No pending instructors</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingInstructors.map((inst) => (
                  <tr key={inst.id}>
                    <td className="p-2 border">{inst.name}</td>
                    <td className="p-2 border">{inst.email}</td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => approveInstructor(inst.id)}
                        className="bg-green-600 text-white px-3 py-1 mr-2 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectInstructor(inst.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 🔹 Course Approvals */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">
            Course Approval Requests
          </h2>

          {pendingCourses.length === 0 ? (
            <p className="text-gray-500">No pending courses</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Course</th>
                  <th className="p-2">Instructor</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingCourses.map((course) => (
                  <tr key={course.id}>
                    <td className="p-2 border">{course.title}</td>
                    <td className="p-2 border">{course.instructor}</td>
                    <td className="p-2 border">₹ {course.price}</td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => approveCourse(course.id)}
                        className="bg-green-600 text-white px-3 py-1 mr-2 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectCourse(course.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  );
}
