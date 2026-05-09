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
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
      // Mock data for demo (cleaned & safe)
      setAnalytics({
        overview: {
          totalUsers: 1250,
          totalCourses: 48,
          totalRevenue: 245000,
          totalStudents: 1150,
          totalInstructors: 100,
          avgCoursePrice: 5104,
        },
        trends: {
          usersGrowth: 23,
          coursesGrowth: 15,
          revenueGrowth: 31,
        },
        topCourses: [
          {
            id: 1,
            title: "React Mastery",
            instructor: "Dr. Emily Clarke",
            students: 245,
            revenue: 122500,
            rating: 4.8,
          },
          {
            id: 2,
            title: "Node.js Advanced",
            instructor: "Prof. James Wilson",
            students: 189,
            revenue: 94500,
            rating: 4.7,
          },
          {
            id: 3,
            title: "UI/UX Design Principles",
            instructor: "Maria Garcia",
            students: 156,
            revenue: 78000,
            rating: 4.9,
          },
          {
            id: 4,
            title: "Python for Data Science",
            instructor: "Dr. Sarah Lee",
            students: 134,
            revenue: 67000,
            rating: 4.6,
          },
          {
            id: 5,
            title: "Cloud Computing (AWS)",
            instructor: "Prof. David Kim",
            students: 98,
            revenue: 49000,
            rating: 4.5,
          },
        ],
        recentActivities: [
          {
            id: 1,
            action: "New Course Added",
            course: "Machine Learning Basics",
            instructor: "Dr. Andrew Ng",
            time: "2 hours ago",
            type: "course",
          },
          {
            id: 2,
            action: "New User Registered",
            user: "John Doe",
            role: "student",
            time: "3 hours ago",
            type: "user",
          },
          {
            id: 3,
            action: "Course Approved",
            course: "Advanced React Patterns",
            instructor: "Dr. Emily Clarke",
            time: "5 hours ago",
            type: "course",
          },
          {
            id: 4,
            action: "Payment Received",
            amount: "$499",
            user: "Sarah Johnson",
            time: "1 day ago",
            type: "payment",
          },
        ],
        monthlyData: [
          { month: "Jan", users: 450, courses: 8, revenue: 22500 },
          { month: "Feb", users: 520, courses: 10, revenue: 28000 },
          { month: "Mar", users: 610, courses: 12, revenue: 34000 },
          { month: "Apr", users: 720, courses: 14, revenue: 41000 },
          { month: "May", users: 850, courses: 16, revenue: 48000 },
          { month: "Jun", users: 980, courses: 18, revenue: 55000 },
          { month: "Jul", users: 1100, courses: 20, revenue: 62000 },
          { month: "Aug", users: 1250, courses: 22, revenue: 70000 },
          { month: "Sep", users: 1380, courses: 24, revenue: 78000 },
          { month: "Oct", users: 1500, courses: 26, revenue: 85000 },
          { month: "Nov", users: 1580, courses: 28, revenue: 90000 },
          { month: "Dec", users: 1650, courses: 30, revenue: 95000 },
        ],
      });
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
    }).format(amount);
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-600";
  };

  // Safe max values (avoid -Infinity when monthlyData is empty)
  const maxRevenue =
    analytics.monthlyData.length > 0
      ? Math.max(...analytics.monthlyData.map((d) => d.revenue))
      : 0;
  const maxUsers =
    analytics.monthlyData.length > 0
      ? Math.max(...analytics.monthlyData.map((d) => d.users))
      : 0;
  const maxCourses =
    analytics.monthlyData.length > 0
      ? Math.max(...analytics.monthlyData.map((d) => d.courses))
      : 0;

  // Loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

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
            {/* ==================== HEADER SECTION ==================== */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>Analytics Dashboard</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    Platform{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Analytics
                    </span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">
                    Monitor platform performance and growth
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Time Range Filter */}
                  <div className="relative">
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 cursor-pointer appearance-none"
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

            {/* ==================== STATS CARDS ==================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {/* Total Users Card */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-gray-800">
                      {analytics.overview.totalUsers}
                    </span>
                    <div
                      className={`text-xs font-medium ${getGrowthColor(
                        analytics.trends.usersGrowth
                      )}`}
                    >
                      {analytics.trends.usersGrowth > 0 ? "+" : ""}
                      {analytics.trends.usersGrowth}%
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total Users</p>
              </div>

              {/* Total Courses Card */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
                    <BookOpen className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-gray-800">
                      {analytics.overview.totalCourses}
                    </span>
                    <div
                      className={`text-xs font-medium ${getGrowthColor(
                        analytics.trends.coursesGrowth
                      )}`}
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

              {/* Total Revenue Card */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition">
                    <DollarSign className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-gray-800">
                      {formatCurrency(analytics.overview.totalRevenue)}
                    </span>
                    <div
                      className={`text-xs font-medium ${getGrowthColor(
                        analytics.trends.revenueGrowth
                      )}`}
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

              {/* Avg Course Price Card */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition">
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

            {/* ==================== GROWTH CHARTS ==================== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Growth Chart */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <LineChart className="w-5 h-5 text-green-600" />
                      Revenue Growth
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Monthly revenue trend
                    </p>
                  </div>
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </div>

                <div className="space-y-4">
                  {analytics.monthlyData.slice(-6).map((data, idx) => (
                    <div key={idx} className="group">
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
                          className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500 group-hover:opacity-80"
                          style={{
                            width: `${
                              maxRevenue ? (data.revenue / maxRevenue) * 100 : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Growth Chart */}
              <div className="bg-green-50 rounded-2xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      User Growth
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Monthly user registration trend
                    </p>
                  </div>
                  <Activity className="w-5 h-5 text-gray-400" />
                </div>

                <div className="space-y-4">
                  {analytics.monthlyData.slice(-6).map((data, idx) => (
                    <div key={idx} className="group">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-600">
                          {data.month}
                        </span>
                        <span className="text-blue-600">{data.users} users</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500 group-hover:opacity-80"
                          style={{
                            width: `${
                              maxUsers ? (data.users / maxUsers) * 100 : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ==================== COURSE GROWTH & USER BREAKDOWN ==================== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Course Growth Chart */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      Course Growth
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Monthly course addition trend
                    </p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>

                <div className="space-y-4">
                  {analytics.monthlyData.slice(-6).map((data, idx) => (
                    <div key={idx} className="group">
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
                          className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-500 group-hover:opacity-80"
                          style={{
                            width: `${
                              maxCourses ? (data.courses / maxCourses) * 100 : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Breakdown */}
              <div className="bg-green-50 rounded-2xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-orange-600" />
                      User Breakdown
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Distribution by role
                    </p>
                  </div>
                  <Users className="w-5 h-5 text-gray-400" />
                </div>

                <div className="space-y-4">
                  {/* Students */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-600 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-500" />
                        Students
                      </span>
                      <span className="text-blue-600 font-semibold">
                        {analytics.overview.totalStudents}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"
                        style={{
                          width: `${
                            analytics.overview.totalUsers
                              ? (analytics.overview.totalStudents /
                                  analytics.overview.totalUsers) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Instructors */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-600 flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-orange-500" />
                        Instructors
                      </span>
                      <span className="text-orange-600 font-semibold">
                        {analytics.overview.totalInstructors}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                        style={{
                          width: `${
                            analytics.overview.totalUsers
                              ? (analytics.overview.totalInstructors /
                                  analytics.overview.totalUsers) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">
                        {analytics.overview.totalUsers
                          ? Math.round(
                              (analytics.overview.totalStudents /
                                analytics.overview.totalUsers) *
                                100
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
                                100
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

            {/* ==================== TOP COURSES ==================== */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 mb-8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-green-50">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
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
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Instructor
                      </th>
                      <th className="text-center py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Students
                      </th>
                      <th className="text-center py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="text-center py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topCourses.map((course, idx) => (
                      <tr
                        key={course.id}
                        className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${
                          idx !== analytics.topCourses.length - 1
                            ? "border-b"
                            : ""
                        }`}
                      >
                        <td className="py-3 px-5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              idx === 0
                                ? "bg-yellow-100 text-yellow-700"
                                : idx === 1
                                ? "bg-gray-100 text-gray-600"
                                : idx === 2
                                ? "bg-orange-100 text-orange-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {idx + 1}
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <p className="font-medium text-gray-800">
                            {course.title}
                          </p>
                        </td>
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                              {course.instructor?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-600 text-sm">
                              {course.instructor}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-800">
                              {course.students}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-center">
                          <span className="font-semibold text-green-600">
                            {formatCurrency(course.revenue)}
                          </span>
                        </td>
                        <td className="py-3 px-5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-medium text-gray-800">
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

            {/* ==================== RECENT ACTIVITIES ==================== */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-green-50">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Recent Activities
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Latest platform activities and updates
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {analytics.recentActivities.map((activity) => (
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
                ))}
              </div>
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