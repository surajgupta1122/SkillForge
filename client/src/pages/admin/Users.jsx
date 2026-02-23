import { useEffect, useState } from "react";
import api from "../../service/api";
import AdminSidebar from "../../components/AdminSidebar";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔹 Edit Modal
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  // 🔹 Delete Modal
  const [deleteId, setDeleteId] = useState(null);

  // 🔹 Toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  // 🔹 Toast function
  const showToast = (msg) => {
    setToast({ show: true, message: msg });

    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  // 🔹 Fetch users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Open edit modal
  const openEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
    });
    setIsOpen(true);
  };

  // 🔹 Check if form changed
  const isChanged =
    selectedUser &&
    (selectedUser.name !== formData.name ||
      selectedUser.email !== formData.email);

  // 🔹 Update user
  const handleUpdate = async () => {
    // ❌ no changes
    if (!isChanged) {
      showToast("⚠️ No changes made");
      return;
    }

    try {
      await api.put(`/admin/user/${selectedUser.id}`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, ...formData } : u)),
      );

      setIsOpen(false);

      showToast("👤✅ User updated successfully");
    } catch (err) {
      console.error(err);
      showToast("❌ Update failed");
    }
  };

  // 🔹 Delete confirm
  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  // 🔹 Delete user
  const handleDelete = async () => {
    try {
      await api.delete(`/admin/user/${deleteId}`);

      setUsers((prev) => prev.filter((u) => u.id !== deleteId));

      showToast("🗑️ User deleted");

      setDeleteId(null);
    } catch {
      showToast("❌ Delete failed");
    }
  };

  // 🔍 Filter users
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-gray-100 flex h-screen overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* 🔥 Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500">Manage all users in your platform</p>
        </div>

        {/* 🔥 Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Total Users</p>
            <h2 className="text-3xl font-bold">{users.length}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Admins</p>
            <h2 className="text-xl font-bold text-purple-600">
              {users.filter((u) => u.role === "admin").length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Instructors</p>
            <h2 className="text-xl font-bold text-blue-600">
              {users.filter((u) => u.role === "instructor").length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Students</p>
            <h2 className="text-xl font-bold text-green-600">
              {users.filter((u) => u.role === "student").length}
            </h2>
          </div>
        </div>

        {/* 🔍 Search */}
        <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
          <input
            type="text"
            placeholder="🔍 Search users..."
            className="w-full md:w-80 border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="text-sm text-gray-500 ml-4">
            {filteredUsers.length} results
          </span>
        </div>

        {/* 🔥 Table */}
        {loading ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            Loading...
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="grid grid-cols-5 bg-gray-100 p-3 text-sm font-semibold text-gray-600">
              <span>User</span>
              <span>Email</span>
              <span>Role</span>
              <span>Status</span>
              <span className="text-center">Actions</span>
            </div>

            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-5 p-3 border-t items-center hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{user.name}</span>
                </div>

                <span className="text-gray-600 text-sm">{user.email}</span>

                <span className="capitalize text-blue-800">{user.role}</span>

                <div>
                  {user.isApproved ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      Approved
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  )}
                </div>

                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => openEdit(user)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => confirmDelete(user.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔥 EDIT MODAL */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Edit User</h2>

              <input
                type="text"
                className="w-full mb-3 p-2 border rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                type="email"
                className="w-full mb-4 p-2 border rounded"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  disabled={!isChanged}
                  className={`px-3 py-1 rounded text-white ${
                    isChanged
                      ? "bg-green-600"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  💾 Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🔥 DELETE MODAL */}
        {deleteId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
              <div className="text-3xl mb-3">⚠️</div>

              <h2 className="text-xl font-semibold mb-2">Delete User?</h2>

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
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🔥 TOAST */}
        {toast.show && (
          <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
            <div className="bg-black text-white px-4 py-3 rounded shadow-lg border-l-4 border-green-500 flex items-center gap-3">
              <div className="text-green-400 text-xl">🔔</div>
              <div>
                <p className="text-xs text-gray-400">Message</p>
                <p className="text-sm font-semibold">{toast.message}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
