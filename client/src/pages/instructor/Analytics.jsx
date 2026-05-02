import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import InstructorSidebar from "../../components/InstructorSidebar";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  DollarSign,
  Calendar,
  Eye,
  Clock,
  Star,
  Award,
  BarChart3,
  LineChart,
  PieChart,
  Download,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function Analytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month"); // week, month, year
  const [analytics, setAnalytics] = useState({
    overview: {
      totalStudents: 0,
      totalCourses: 0,
      totalRevenue: 0,
      avgProgress: 0,
      completionRate: 0,
      satisfactionRate: 0
    },
    trends: {
      studentsGrowth: 0,
      revenueGrowth: 0,
      enrollmentGrowth: 0
    },
    recentData: [],
    topCourses: [],
    monthlyData: []
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/instructor/analytics?range=${timeRange}`);
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load analytics data", "error");
      // Set mock data for demo
      setAnalytics({
        overview: {
          totalStudents: 245,
          totalCourses: 12,
          totalRevenue: 84500,
          avgProgress: 68,
          completionRate: 72,
          satisfactionRate: 4.8
        },
        trends: {
          studentsGrowth: 23,
          revenueGrowth: 31,
          enrollmentGrowth: 18
        },
        topCourses: [
          { id: 1, title: "React Mastery", students: 89, revenue: 44500, progress: 76 },
          { id: 2, title: "Node.js Advanced", students: 67, revenue: 33500, progress: 68 },
          { id: 3, title: "UI/UX Design", students: 54, revenue: 27000, progress: 82 },
          { id: 4, title: "Python for Data Science", students: 35, revenue: 17500, progress: 58 }
        ],
        monthlyData: [
          { month: "Jan", students: 45, revenue: 22500, enrollments: 52 },
          { month: "Feb", students: 58, revenue: 29000, enrollments: 48 },
          { month: "Mar", students: 72, revenue: 36000, enrollments: 65 },
          { month: "Apr", students: 89, revenue: 44500, enrollments: 78 },
          { month: "May", students: 112, revenue: 56000, enrollments: 95 },
          { month: "Jun", students: 145, revenue: 72500, enrollments: 112 },
          { month: "Jul", students: 178, revenue: 89000, enrollments: 135 },
          { month: "Aug", students: 210, revenue: 105000, enrollments: 158 },
          { month: "Sep", students: 235, revenue: 117500, enrollments: 175 },
          { month: "Oct", students: 245, revenue: 122500, enrollments: 188 },
          { month: "Nov", students: 248, revenue: 124000, enrollments: 192 },
          { month: "Dec", students: 250, revenue: 125000, enrollments: 195 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return "text-green-600 bg-green-50";
    if (growth < 0) return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4" />;
    if (growth < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  const maxRevenue = Math.max(...analytics.monthlyData.map(d => d.revenue), 0);
  const maxStudents = Math.max(...analytics.monthlyData.map(d => d.students), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-1 pr-0">
      <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-3xl">
        <InstructorSidebar />

        <main className="flex-1 overflow-y-auto custom-scroll">
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
                    Performance <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Analytics</span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">Track your course performance and student engagement</p>
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
                  
                  <button
                    onClick={() => fetchAnalytics()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-orange-400 to-red-600 hover:from-orange-500 hover:to-red-700 transition-all text-white font-medium rounded-xl transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* ==================== OVERVIEW STATS CARDS ==================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {/* Total Revenue */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
                    <DollarSign className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-gray-800">{formatCurrency(analytics.overview.totalRevenue)}</span>
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-2 ${getGrowthColor(analytics.trends.revenueGrowth)}`}>
                      {getGrowthIcon(analytics.trends.revenueGrowth)}
                      {Math.abs(analytics.trends.revenueGrowth)}%
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total Revenue</p>
              </div>

              {/* Total Students */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-gray-800">{analytics.overview.totalStudents}</span>
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-2 ${getGrowthColor(analytics.trends.studentsGrowth)}`}>
                      {getGrowthIcon(analytics.trends.studentsGrowth)}
                      {Math.abs(analytics.trends.studentsGrowth)}%
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total Students</p>
              </div>

              {/* Total Courses */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition">
                    <BookOpen className="w-6 h-6 text-purple-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{analytics.overview.totalCourses}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Active Courses</p>
              </div>
            </div>

            {/* ==================== SECONDARY STATS CARDS ==================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {/* Average Progress */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{analytics.overview.avgProgress}%</span>
                </div>
                <p className="text-gray-500 text-sm">Average</p>
                <p className="text-gray-700 font-semibold mt-1">Student Progress</p>
                <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300"
                    style={{ width: `${analytics.overview.avgProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition">
                    <Award className="w-6 h-6 text-teal-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{analytics.overview.completionRate}%</span>
                </div>
                <p className="text-gray-500 text-sm">Average</p>
                <p className="text-gray-700 font-semibold mt-1">Course Completion Rate</p>
                <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${analytics.overview.completionRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Satisfaction Rate */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center group-hover:bg-yellow-100 transition">
                    <Star className="w-6 h-6 text-yellow-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{analytics.overview.satisfactionRate}</span>
                </div>
                <p className="text-gray-500 text-sm">Rating</p>
                <p className="text-gray-700 font-semibold mt-1">Student Satisfaction</p>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`w-4 h-4 ${star <= Math.floor(analytics.overview.satisfactionRate) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ==================== CHART SECTION ==================== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue & Students Trend */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <LineChart className="w-5 h-5 text-indigo-500" />
                      Growth Trends
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Revenue and student growth over time</p>
                  </div>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {analytics.monthlyData.slice(-6).map((data, idx) => (
                    <div key={idx} className="group">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-600">{data.month}</span>
                        <div className="flex gap-4">
                          <span className="text-green-600">₹{Math.round(data.revenue/1000)}k</span>
                          <span className="text-blue-600">{data.students} students</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500 group-hover:opacity-80"
                            style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500 group-hover:opacity-80"
                            style={{ width: `${(data.students / maxStudents) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performing Courses */}
              <div className="bg-orange-50 rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                      Top Courses
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Best performing courses by enrollment</p>
                  </div>
                  <Award className="w-5 h-5 text-yellow-500" />
                </div>
                
                <div className="space-y-4">
                  {analytics.topCourses.map((course, idx) => (
                    <div key={course.id} className="group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition" onClick={() => navigate(`/instructor/course/${course.id}/analytics`)}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            idx === 0 ? "bg-yellow-100 text-yellow-700" :
                            idx === 1 ? "bg-gray-100 text-gray-600" :
                            idx === 2 ? "bg-orange-100 text-orange-600" :
                            "bg-blue-100 text-blue-600"
                          }`}>
                            {idx + 1}
                          </div>
                          <span className="font-medium text-gray-800">{course.title}</span>
                        </div>
                        <span className="font-bold text-gray-800">{course.students} students</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Revenue: {formatCurrency(course.revenue)}</span>
                        <span>Progress: {course.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                          style={{ width: `${(course.students / analytics.topCourses[0]?.students) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ==================== RECENT ACTIVITIES ==================== */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-800">Recent Activities</h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Latest student enrollments and course completions</p>
              </div>
              
              <div className="divide-y divide-gray-100">
                {[
                  { action: "New enrollment", student: "Sarah Johnson", course: "React Mastery", time: "2 hours ago", type: "enrollment" },
                  { action: "Course completed", student: "Mike Chen", course: "Node.js Advanced", time: "5 hours ago", type: "completion" },
                  { action: "Certificate issued", student: "Emma Watson", course: "UI/UX Design", time: "1 day ago", type: "certificate" },
                  { action: "New review", student: "Alex Kumar", course: "Python for Data Science", time: "2 days ago", type: "review" },
                  { action: "Assignment submitted", student: "Lisa Park", course: "React Mastery", time: "3 days ago", type: "submission" },
                ].map((activity, idx) => (
                  <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activity.type === "enrollment" ? "bg-green-50" :
                        activity.type === "completion" ? "bg-blue-50" :
                        activity.type === "certificate" ? "bg-purple-50" :
                        activity.type === "review" ? "bg-yellow-50" : "bg-orange-50"
                      }`}>
                        {activity.type === "enrollment" && <Users className="w-5 h-5 text-green-500" />}
                        {activity.type === "completion" && <Award className="w-5 h-5 text-blue-500" />}
                        {activity.type === "certificate" && <CheckCircle className="w-5 h-5 text-purple-500" />}
                        {activity.type === "review" && <Star className="w-5 h-5 text-yellow-500" />}
                        {activity.type === "submission" && <Clock className="w-5 h-5 text-orange-500" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {activity.action}: <span className="text-gray-600">{activity.student}</span>
                          <span className="text-gray-400 mx-2">•</span>
                          <span className="text-sm text-gray-500">{activity.course}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
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
          <div className={`backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 flex items-center gap-3 ${
            toast.type === "success" 
              ? "bg-gray-900/95 border-green-500" 
              : "bg-gray-900/95 border-red-500"
          }`}>
            <div className={toast.type === "success" ? "text-green-400" : "text-red-400"}>
              {toast.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
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