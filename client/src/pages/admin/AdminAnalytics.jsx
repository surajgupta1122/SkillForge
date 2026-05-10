import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import AdminSidebar from "../../components/AdminSidebar";
import {
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  CalendarCheck,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Award,
  Star,
  Clock,
  UserCheck,
  GraduationCap,
  ChevronDown,
  Eye,
  Loader2,
} from "lucide-react";

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      totalCourses: 0,
      totalRevenue: 0,
      totalStudents: 0,
      totalInstructors: 0,
      avgCoursePrice: 0,
    },
    trends: {
      usersGrowth: 0,
      coursesGrowth: 0,
      revenueGrowth: 0,
    },
    topCourses: [],
    recentActivities: [],
    monthlyData: [],
  });

  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/analytics?range=${timeRange}`);
      // Ensure data structure matches expected format
      const data = res.data;
      setAnalytics({
        overview: data.overview || analytics.overview,
        trends: data.trends || analytics.trends,
        topCourses: data.topCourses || [],
        recentActivities: data.recentActivities || [],
        monthlyData: data.monthlyData || [],
      });
    } catch (err) {
      console.error("Analytics API error:", err);
      showToast("Failed to load analytics data");
      // Keep mock data as fallback (already set in state)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-600";
  };

  // Safe max values – prevent -Infinity when monthlyData is empty
  const monthlyData = analytics.monthlyData;
  const maxRevenue = monthlyData.length
    ? Math.max(...monthlyData.map((d) => d.revenue))
    : 0;
  const maxUsers = monthlyData.length
    ? Math.max(...monthlyData.map((d) => d.users))
    : 0;
  const maxCourses = monthlyData.length
    ? Math.max(...monthlyData.map((d) => d.courses))
    : 0;

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-1 pr-0">
      <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-3xl">
        <AdminSidebar onLogout={logout} />

        <main className="flex-1 overflow-y-auto custom-scroll bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 lg:px-10">
            {/* HEADER */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium mb-1">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                    <span>Analytics Dashboard</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    Platform{" "}
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Analytics
                    </span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">
                    Monitor platform performance and growth
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 cursor-pointer appearance-none"
                    >
                      <option value="week">Last 7 Days</option>
                      <option value="month">Last 30 Days</option>
                      <option value="year">Last 12 Months</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border border-white/40">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                        <CalendarCheck className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Today's Date</p>
                        <p className="font-bold text-gray-800 text-sm">
                          {new Date().toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-gray-800">
                      {analytics.overview.totalUsers}
                    </span>
                    <div
                      className={`text-xs font-medium ${getGrowthColor(analytics.trends.usersGrowth)}`}
                    >
                      {analytics.trends.usersGrowth > 0 ? "+" : ""}
                      {analytics.trends.usersGrowth}%
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total Users</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-gray-800">
                      {analytics.overview.totalCourses}
                    </span>
                    <div
                      className={`text-xs font-medium ${getGrowthColor(analytics.trends.coursesGrowth)}`}
                    >
                      {analytics.trends.coursesGrowth > 0 ? "+" : ""}
                      {analytics.trends.coursesGrowth}%
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">
                  Total Courses
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-gray-800">
                      {formatCurrency(analytics.overview.totalRevenue)}
                    </span>
                    <div
                      className={`text-xs font-medium ${getGrowthColor(analytics.trends.revenueGrowth)}`}
                    >
                      {analytics.trends.revenueGrowth > 0 ? "+" : ""}
                      {analytics.trends.revenueGrowth}%
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">
                  Total Revenue
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">
                    {formatCurrency(analytics.overview.avgCoursePrice)}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">Average</p>
                <p className="text-gray-700 font-semibold mt-1">
                  Avg Course Price
                </p>
              </div>
            </div>

            {/* GROWTH CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Growth */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <LineChart className="w-5 h-5 text-green-600" />
                      Revenue Growth
                    </h3>
                    <p className="text-xs text-gray-400">
                      Monthly revenue trend
                    </p>
                  </div>
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {monthlyData.slice(-6).map((data, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-600">
                          {data.month}
                        </span>
                        <span className="text-green-600">
                          {formatCurrency(data.revenue)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all"
                          style={{
                            width: `${maxRevenue ? (data.revenue / maxRevenue) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Growth */}
              <div className="bg-gray-200 rounded-2xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      User Growth
                    </h3>
                    <p className="text-xs text-gray-400">
                      Monthly user registration trend
                    </p>
                  </div>
                  <Activity className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {monthlyData.slice(-6).map((data, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-600">
                          {data.month}
                        </span>
                        <span className="text-blue-600">
                          {data.users} users
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all"
                          style={{
                            width: `${maxUsers ? (data.users / maxUsers) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COURSE GROWTH & USER BREAKDOWN */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Course Growth */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      Course Growth
                    </h3>
                    <p className="text-xs text-gray-400">
                      Monthly course addition trend
                    </p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {monthlyData.slice(-6).map((data, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-600">
                          {data.month}
                        </span>
                        <span className="text-purple-600">
                          {data.courses} courses
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all"
                          style={{
                            width: `${maxCourses ? (data.courses / maxCourses) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Breakdown */}
              <div className="bg-gray-200 rounded-2xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-orange-600" />
                      User Breakdown
                    </h3>
                    <p className="text-xs text-gray-400">
                      Distribution by role
                    </p>
                  </div>
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-600 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-green-500" />
                        Students
                      </span>
                      <span className="text-green-600 font-semibold">
                        {analytics.overview.totalStudents}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                        style={{
                          width: `${analytics.overview.totalUsers ? (analytics.overview.totalStudents / analytics.overview.totalUsers) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-600 flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-blue-500" />
                        Instructors
                      </span>
                      <span className="text-blue-600 font-semibold">
                        {analytics.overview.totalInstructors}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                        style={{
                          width: `${analytics.overview.totalUsers ? (analytics.overview.totalInstructors / analytics.overview.totalUsers) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">
                        {analytics.overview.totalUsers
                          ? Math.round(
                              (analytics.overview.totalStudents /
                                analytics.overview.totalUsers) *
                                100,
                            )
                          : 0}
                        %
                      </p>
                      <p className="text-xs text-gray-500">
                        Students Percentage
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">
                        {analytics.overview.totalUsers
                          ? Math.round(
                              (analytics.overview.totalInstructors /
                                analytics.overview.totalUsers) *
                                100,
                            )
                          : 0}
                        %
                      </p>
                      <p className="text-xs text-gray-500">
                        Instructors Percentage
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TOP COURSES */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 mb-8 overflow-hidden">
              <div className="px-6 py-5 bg-green-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Top Performing Courses
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Most popular courses by enrollment
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="text-left py-4 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="text-left py-4 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="text-left py-4 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Instructor
                      </th>
                      <th className="text-center py-4 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Students
                      </th>
                      <th className="text-center py-4 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="text-center py-4 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topCourses.map((course, idx) => (
                      <tr
                        key={course.id}
                        className="border-b border-gray-100 hover:bg-indigo-50/30 transition-all duration-200 group"
                      >
                        {/* Rank with medal colors */}
                        <td className="py-3 px-5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                              idx === 0
                                ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white"
                                : idx === 1
                                  ? "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800"
                                  : idx === 2
                                    ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {idx + 1}
                          </div>
                        </td>
                        {/* Course title */}
                        <td className="py-3 px-5">
                          <p className="font-semibold text-gray-800 group-hover:text-indigo-700 transition">
                            {course.title}
                          </p>
                        </td>
                        {/* Instructor with avatar */}
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                              {course.instructor?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-700 text-sm">
                              {course.instructor}
                            </span>
                          </div>
                        </td>
                        {/* Students count with icon */}
                        <td className="py-3 px-5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Users className="w-4 h-4 text-indigo-400" />
                            <span className="font-semibold text-gray-800">
                              {course.students}
                            </span>
                          </div>
                        </td>
                        {/* Revenue */}
                        <td className="py-3 px-5 text-center">
                          <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
                            {formatCurrency(course.revenue)}
                          </span>
                        </td>
                        {/* Rating with stars */}
                        <td className="py-3 px-5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold text-gray-800">
                              {course.rating}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RECENT ACTIVITIES */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-green-50 border-b-gray-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Recent Activities
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Latest platform activities and updates
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {analytics.recentActivities.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No recent activities
                  </div>
                ) : (
                  analytics.recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            activity.type === "course"
                              ? "bg-green-50"
                              : activity.type === "user"
                                ? "bg-blue-50"
                                : activity.type === "payment"
                                  ? "bg-purple-50"
                                  : "bg-orange-50"
                          }`}
                        >
                          {activity.type === "course" && (
                            <BookOpen className="w-5 h-5 text-green-500" />
                          )}
                          {activity.type === "user" && (
                            <Users className="w-5 h-5 text-blue-500" />
                          )}
                          {activity.type === "payment" && (
                            <DollarSign className="w-5 h-5 text-purple-500" />
                          )}
                          {!activity.type && (
                            <Activity className="w-5 h-5 text-orange-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {activity.action}
                            {activity.course && (
                              <span className="text-gray-600">
                                : {activity.course}
                              </span>
                            )}
                            {activity.user && (
                              <span className="text-gray-600">
                                : {activity.user}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                      <Eye className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
          <div className="bg-gray-900/95 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 border-green-500 flex items-center gap-3">
            <div className="text-green-400 text-xl">✅</div>
            <p className="text-sm font-semibold">{toast.message}</p>
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
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
