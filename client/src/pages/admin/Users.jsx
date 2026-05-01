import { useEffect, useState } from "react";
import api from "../../service/api";
import AdminSidebar from "../../components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { 
  Users as UsersIcon, 
  Search, 
  X,
  UserCheck,
  UserCog,
  Shield,
  GraduationCap,
  User,
  Mail,
  CalendarCheck,
  Edit,
  Trash2,
  Save,
  AlertTriangle
} from "lucide-react";

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Edit Modal
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  // Delete Modal
  const [deleteId, setDeleteId] = useState(null);

  // Toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

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

  const openEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
    });
    setIsOpen(true);
  };

  const isChanged =
    selectedUser &&
    (selectedUser.name !== formData.name ||
      selectedUser.email !== formData.email);

  const handleUpdate = async () => {
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
        prev.map((u) => (u.id === selectedUser.id ? { ...u, ...formData } : u))
      );

      setIsOpen(false);
      showToast("✅ User updated successfully");
    } catch (err) {
      console.error(err);
      showToast("❌ Update failed");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/user/${deleteId}`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteId));
      showToast("🗑️ User deleted successfully");
      setDeleteId(null);
    } catch {
      showToast("❌ Delete failed");
    }
  };

  // Filter users
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate stats
  const totalUsers = users.length;
  const admins = users.filter((u) => u.role === "admin").length;
  const instructors = users.filter((u) => u.role === "instructor").length;
  const students = users.filter((u) => u.role === "student").length;

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Role badge colors and icons
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return {
          className: "bg-purple-50 text-purple-700 border-purple-200",
          Icon: Shield
        };
      case "instructor":
        return {
          className: "bg-blue-50 text-blue-700 border-blue-200",
          Icon: UserCheck
        };
      case "student":
        return {
          className: "bg-green-50 text-green-700 border-green-200",
          Icon: GraduationCap
        };
      default:
        return {
          className: "bg-gray-50 text-gray-700 border-gray-200",
          Icon: User
        };
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 backdrop-blur-md p-1 pr-0">
      <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-r-3xl">
        <AdminSidebar onLogout={logout} />

        <main className="flex-1 overflow-y-auto custom-scroll bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 lg:px-10">
            
            {/* ==================== HEADER SECTION ==================== */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>User Management</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    User <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Management</span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">Manage all users in your platform</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-sm border border-white/40">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                        <CalendarCheck className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Today's Date</p>
                        <p className="font-bold text-gray-800 text-sm">
                          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== STATS CARDS ==================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {/* Total Users Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                    <UsersIcon className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{totalUsers}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total Users</p>
              </div>

              {/* Admins Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition">
                    <Shield className="w-6 h-6 text-purple-500" />
                  </div>
                  <span className="text-2xl font-black text-purple-600">{admins}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Admins</p>
              </div>

              {/* Instructors Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                    <UserCheck className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-2xl font-black text-blue-600">{instructors}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Instructors</p>
              </div>

              {/* Students Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
                    <GraduationCap className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-2xl font-black text-green-600">{students}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Students</p>
              </div>
            </div>

            {/* ==================== SEARCH SECTION ==================== */}
            <div className="bg-green-50 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Search className="w-5 h-5 text-indigo-500" />
                    User Directory
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Browse and search all registered users</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 px-3 py-1 rounded-full">
                    <span className="text-indigo-600 text-sm font-medium">{filteredUsers.length} results</span>
                  </div>
                  {/* Search Box */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 w-64"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== USERS TABLE ==================== */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UsersIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">No Users Found</h3>
                  <p className="text-gray-400 text-sm">
                    {search ? "Try a different search term" : "No users available in the system"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-center py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, idx) => {
                        const roleBadge = getRoleBadge(user.role);
                        const RoleIcon = roleBadge.Icon;
                        
                        return (
                          <tr key={user.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${idx !== filteredUsers.length - 1 ? 'border-b' : ''}`}>
                            <td className="py-3 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                                  {user.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">{user.name}</p>
                                  <p className="text-xs text-gray-400">ID: {user.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-5">
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-600 text-sm">{user.email}</span>
                              </div>
                            </td>
                            <td className="py-3 px-5">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${roleBadge.className}`}>
                                <RoleIcon className="w-3 h-3" />
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3 px-5">
                              {user.isApproved ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                  Approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-5">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => openEdit(user)}
                                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center gap-1"
                                >
                                  <Edit className="w-3 h-3" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => confirmDelete(user.id)}
                                  className="px-3 py-1.5 bg-red-400 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* EDIT MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 animate-slideIn">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <UserCog className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Edit User</h2>
                <p className="text-xs text-gray-400">Update user information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={!isChanged}
                className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition flex items-center gap-1 ${
                  isChanged
                    ? "bg-green-500 hover:bg-green-600 shadow-sm hover:shadow"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 animate-slideIn text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Delete User?</h2>
            <p className="text-gray-500 text-sm mb-6">
              This action cannot be undone. The user will be permanently removed from the system.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition shadow-sm hover:shadow flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
          <div className="bg-gray-900/95 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 border-green-500 flex items-center gap-3">
            <div className="text-xl">
              {toast.message.includes("✅") ? "✅" : toast.message.includes("🗑️") ? "🗑️" : "ℹ️"}
            </div>
            <div>
              <p className="text-xs text-gray-400">System Notification</p>
              <p className="text-sm font-semibold">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}