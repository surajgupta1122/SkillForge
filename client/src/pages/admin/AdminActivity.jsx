import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import AdminSidebar from "../../components/AdminSidebar";
import {
  Activity,
  CalendarCheck,
  Search,
  X,
  UserPlus,
  BookOpen,
  DollarSign,
  UserCheck,
  Clock,
  Filter,
  Download,
  Eye,
  TrendingUp,
  Users,
  GraduationCap,
  MessageSquare,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function AdminActivity() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  // Helper to get readable entity type
  const getEntityType = (entity_type) => {
    if (entity_type === "user") return "user";
    if (entity_type === "course") return "course";
    if (entity_type === "transaction") return "payment";
    if (entity_type === "withdrawal") return "payment";
    if (entity_type === "approval") return "approval";
    return entity_type || "other";
  };

  // Helper to extract extra info from details JSON (if any)
  const parseDetails = (details) => {
    try {
      return JSON.parse(details);
    } catch {
      return { text: details };
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/activities", {
        params: { type: filterType !== "all" ? filterType : undefined, dateRange }
      });
      const data = res.data;
      // Map backend fields to frontend expected shape
      const mapped = data.map(act => {
        const entity = getEntityType(act.entity_type);
        const detailsObj = parseDetails(act.details);
        return {
          id: act.id,
          type: entity,
          action: act.action,
          user: detailsObj.user || act.user_role,
          course: detailsObj.course,
          instructor: detailsObj.instructor,
          role: detailsObj.role,
          amount: detailsObj.amount ? `$${detailsObj.amount}` : null,
          time: new Date(act.time).toLocaleString(),
          date: new Date(act.time).toISOString().split('T')[0],
          details: detailsObj.text || act.details
        };
      });
      setActivities(mapped);
    } catch (err) {
      console.error(err);
      // Mock data fallback (keep existing mock)
      setActivities([
        { id: 1, type: "user", action: "New user registered", user: "John Doe", role: "student", time: "2 minutes ago", date: "2025-05-09", details: "john@example.com" },
        // ... rest of your mock data
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [filterType, dateRange]);

  // Filter by search (local)
  const filteredActivities = activities.filter(activity => {
    const matchesSearch =
      (activity.user?.toLowerCase().includes(search.toLowerCase())) ||
      (activity.course?.toLowerCase().includes(search.toLowerCase())) ||
      (activity.action?.toLowerCase().includes(search.toLowerCase())) ||
      (activity.instructor?.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  // Stats (only from currently loaded activities)
  const totalActivities = activities.length;
  const todayActivities = activities.filter(a => {
    const today = new Date().toDateString();
    return new Date(a.date).toDateString() === today;
  }).length;
  const pendingActions = activities.filter(a => a.action.toLowerCase().includes("pending") || a.details?.toLowerCase().includes("pending")).length;

  const getActivityIcon = (type) => {
    switch (type) {
      case "user": return <UserPlus className="w-5 h-5 text-blue-500" />;
      case "course": return <BookOpen className="w-5 h-5 text-green-500" />;
      case "payment": return <DollarSign className="w-5 h-5 text-purple-500" />;
      case "approval": return <CheckCircle className="w-5 h-5 text-orange-500" />;
      case "message": return <MessageSquare className="w-5 h-5 text-pink-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "user": return "bg-blue-100 text-blue-700";
      case "course": return "bg-green-100 text-green-700";
      case "payment": return "bg-purple-100 text-purple-700";
      case "approval": return "bg-orange-100 text-orange-700";
      case "message": return "bg-pink-100 text-pink-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-1 pr-0">
      <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-3xl">
        <AdminSidebar onLogout={logout} />

        <main className="flex-1 overflow-y-auto custom-scroll bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 lg:px-10">
            
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>System Logs</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    Activity <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Logs</span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">Monitor all platform activities and events</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border border-white/40">
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

            {/* Stats Cards (unchanged) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                    <Activity className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{totalActivities}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total Activities</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
                    <Clock className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{todayActivities}</span>
                </div>
                <p className="text-gray-500 text-sm">Today</p>
                <p className="text-gray-700 font-semibold mt-1">Today's Activities</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center group-hover:bg-yellow-100 transition">
                    <Clock className="w-6 h-6 text-yellow-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{pendingActions}</span>
                </div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-gray-700 font-semibold mt-1">Pending Actions</p>
              </div>
            </div>

            {/* Filter and Search Section (fixed background) */}
            <div className=" rounded-2xl shadow-md border border-gray-100 mb-8 overflow-hidden">
              <div className="bg-green-50 px-6 py-5 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Filter className="w-5 h-5 text-blue-500" />
                      Activity Filters
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">Filter and search activity logs</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search by user, course, action..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
                      />
                      {search && (
                        <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                          <X className="w-3 h-3 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Type:</span>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="bg-white px-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="all">All</option>
                      <option value="user">User</option>
                      <option value="course">Course</option>
                      <option value="payment">Payment</option>
                      <option value="approval">Approval</option>
                      <option value="message">Message</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Date:</span>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="bg-white px-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">Last 7 Days</option>
                      <option value="month">Last 30 Days</option>
                    </select>
                  </div>
                  <div className="flex-1"></div>
                  <div className="text-sm text-gray-500">
                    {filteredActivities.length} results
                  </div>
                </div>
              </div>
            </div>

            {/* Activities Table */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent"></div>
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">No Activities Found</h3>
                  <p className="text-gray-400 text-sm">
                    {search ? "Try a different search term" : "No activities recorded yet"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Activity</th>
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                        <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="text-center py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="text-center py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredActivities.map((activity, idx) => (
                        <tr key={activity.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${idx !== filteredActivities.length - 1 ? 'border-b' : ''}`}>
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                {getActivityIcon(activity.type)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{activity.action}</p>
                                {activity.user && <p className="text-xs text-gray-500">User: {activity.user}</p>}
                                {activity.course && <p className="text-xs text-gray-500">Course: {activity.course}</p>}
                                {activity.instructor && <p className="text-xs text-gray-500">Instructor: {activity.instructor}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-5">
                            <p className="text-sm text-gray-600">{activity.details || "—"}</p>
                            {activity.amount && <p className="text-xs font-medium text-green-600 mt-1">{activity.amount}</p>}
                            {activity.role && <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-gray-100">{activity.role}</span>}
                          </td>
                          <td className="py-3 px-5">
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-600">{activity.time}</span>
                              <span className="text-xs text-gray-400">{activity.date}</span>
                            </div>
                          </td>
                          <td className="py-3 px-5 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(activity.type)}`}>
                              {activity.type}
                            </span>
                          </td>
                          <td className="py-3 px-5 text-center">
                            <button className="p-1.5 text-gray-400 hover:text-gray-600 transition">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
          <div className="bg-gray-900/95 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 border-green-500 flex items-center gap-3">
            <div className="text-green-400 text-xl">✅</div>
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
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}