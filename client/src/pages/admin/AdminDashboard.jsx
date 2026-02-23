import { useEffect, useState } from "react";
import api from "../../service/api";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  // 🔥 Toast function
  const showToast = (msg) => {
    setToast({ show: true, message: msg });

    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  // 🔹 Fetch
  const fetchPendingInstructors = async () => {
    const res = await api.get("/admin/pending-instructors");
    setPendingInstructors(res.data);
  };

  const fetchPendingCourses = async () => {
    const res = await api.get("/admin/pending-courses");
    setPendingCourses(res.data);
  };

  useEffect(() => {
    Promise.all([fetchPendingInstructors(), fetchPendingCourses()])
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Actions
  const approveInstructor = async (id) => {
    await api.put(`/admin/approve/${id}`);

    setPendingInstructors((prev) => prev.filter((i) => i.id !== id));

    showToast("🎉 Instructor Approved");
  };

  const rejectInstructor = async (id) => {
    await api.delete(`/admin/reject/${id}`);

    setPendingInstructors((prev) => prev.filter((i) => i.id !== id));

    showToast("❌ Instructor Rejected");
  };

  const approveCourse = async (id) => {
    await api.put(`/admin/approve-course/${id}`);

    setPendingCourses((prev) => prev.filter((c) => c.id !== id));

    showToast("🎉 Course Approved");
  };

  const rejectCourse = async (id) => {
    await api.delete(`/admin/reject-course/${id}`);

    setPendingCourses((prev) => prev.filter((c) => c.id !== id));

    showToast("❌ Course Rejected");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <AdminSidebar onLogout={logout} />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto bg-gray-100">
        {/* 🔥 HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">
            Manage instructors and courses approvals
          </p>
        </div>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Pending Instructors</p>
            <h2 className="text-3xl font-bold text-blue-600">
              {pendingInstructors.length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Pending Courses</p>
            <h2 className="text-3xl font-bold text-green-600">
              {pendingCourses.length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Total Requests</p>
            <h2 className="text-3xl font-bold text-purple-600">
              {pendingCourses.length + pendingInstructors.length}
            </h2>
          </div>
        </div>

        {/* 🔹 Instructor Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Instructor Approval Requests
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : pendingInstructors.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No pending instructors
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {pendingInstructors.map((inst) => (
                    <tr
                      key={inst.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-medium">{inst.name}</td>
                      <td className="p-3 text-gray-600">{inst.email}</td>

                      <td className="p-3 text-center">
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                          Pending
                        </span>
                      </td>

                      <td className="p-3 text-center space-x-2">
                        <button
                          onClick={() => approveInstructor(inst.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => rejectInstructor(inst.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 🔹 Course Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Course Approval Requests
          </h2>

          {pendingCourses.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No pending courses
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Course</th>
                    <th className="p-3 text-left">Instructor</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {pendingCourses.map((course) => (
                    <tr
                      key={course.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-medium">{course.title}</td>
                      <td className="p-3 text-gray-600">{course.instructor}</td>
                      <td className="p-3">₹ {course.price}</td>

                      <td className="p-3 text-center">
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                          Pending
                        </span>
                      </td>

                      <td className="p-3 text-center space-x-2">
                        <button
                          onClick={() => approveCourse(course.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => rejectCourse(course.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 🔥 TOAST */}
        {toast.show && (
          <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
            <div className="bg-black text-white px-4 py-3 rounded shadow-lg border-l-4 border-green-500 flex items-center gap-3">
              <div className="text-green-400 text-xl">🔔</div>
              <div>
                <p className="text-xs text-gray-400">masster</p>
                <p className="text-sm font-semibold">{toast.message}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
