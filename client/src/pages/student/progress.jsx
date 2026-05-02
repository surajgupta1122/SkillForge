import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import StudentSidebar from "../../components/StudentSidebar.jsx";
import {
  TrendingUp,
  Clock,
  CheckCircle,
  BookOpen,
  Target,
  Calendar,
  Award,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Zap,
  Flame,
  Brain,
  Sparkles,
  ChevronRight,
  PlayCircle,
  Star,
  Users,
  Timer,
  FileText
} from "lucide-react";

export default function Progress() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState({
    overall: 0,
    courses: [],
    recentActivity: [],
    weeklyData: [],
    totalHoursSpent: 0,
    totalLessonsCompleted: 0,
    streakDays: 0,
    badges: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Fetch progress data
  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/progress");
      setProgress(res.data);
    } catch (err) {
      console.error(err);
      // Mock data for demo
      setProgress({
        overall: 68,
        courses: [
          { id: 1, title: "React Mastery", progress: 75, lessonsCompleted: 45, totalLessons: 60, timeSpent: 28, lastAccessed: "2024-03-15", score: 85 },
          { id: 2, title: "Node.js Advanced", progress: 45, lessonsCompleted: 18, totalLessons: 40, timeSpent: 15, lastAccessed: "2024-03-14", score: 72 },
          { id: 3, title: "UI/UX Design Principles", progress: 90, lessonsCompleted: 36, totalLessons: 40, timeSpent: 32, lastAccessed: "2024-03-16", score: 92 },
          { id: 4, title: "Python for Data Science", progress: 30, lessonsCompleted: 12, totalLessons: 40, timeSpent: 10, lastAccessed: "2024-03-10", score: 68 },
          { id: 5, title: "Cloud Computing (AWS)", progress: 60, lessonsCompleted: 24, totalLessons: 40, timeSpent: 20, lastAccessed: "2024-03-12", score: 78 }
        ],
        recentActivity: [
          { id: 1, course: "React Mastery", lesson: "Hooks Deep Dive", completed: "2024-03-15T10:30:00", timeSpent: 45 },
          { id: 2, course: "UI/UX Design", lesson: "Wireframing Basics", completed: "2024-03-14T15:20:00", timeSpent: 30 },
          { id: 3, course: "React Mastery", lesson: "State Management", completed: "2024-03-13T11:00:00", timeSpent: 60 },
          { id: 4, course: "Node.js Advanced", lesson: "Express Framework", completed: "2024-03-12T14:15:00", timeSpent: 50 }
        ],
        weeklyData: [
          { day: "Mon", hours: 4, lessons: 3 },
          { day: "Tue", hours: 3, lessons: 2 },
          { day: "Wed", hours: 5, lessons: 4 },
          { day: "Thu", hours: 2, lessons: 1 },
          { day: "Fri", hours: 4, lessons: 3 },
          { day: "Sat", hours: 6, lessons: 5 },
          { day: "Sun", hours: 3, lessons: 2 }
        ],
        totalHoursSpent: 124,
        totalLessonsCompleted: 135,
        streakDays: 15,
        badges: [
          { name: "Quick Learner", icon: "⚡", description: "Completed 5 lessons in a day" },
          { name: "Dedicated", icon: "🔥", description: "7 day learning streak" },
          { name: "Perfect Score", icon: "⭐", description: "Got 100% on a quiz" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const maxHours = Math.max(...progress.weeklyData.map(d => d.hours), 0);
  const maxLessons = Math.max(...progress.weeklyData.map(d => d.lessons), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-1 pr-0">
      <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-3xl">
        <StudentSidebar />

        <main className="flex-1 overflow-y-auto custom-scroll">
          <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 lg:px-10">
            
            {/* ==================== HEADER SECTION ==================== */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>Learning Analytics</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    My <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Progress</span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">Track your learning journey and achievements</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-sm border border-white/40">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                        <Flame className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Learning Streak</p>
                        <p className="font-bold text-gray-800 text-sm">{progress.streakDays} days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== STATS CARDS ==================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {/* Overall Progress Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition">
                    <Target className="w-6 h-6 text-purple-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{progress.overall}%</span>
                </div>
                <p className="text-gray-500 text-sm">Average</p>
                <p className="text-gray-700 font-semibold mt-1">Overall Progress</p>
                <div className="mt-2 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress.overall}%` }}
                  ></div>
                </div>
              </div>

              {/* Total Hours Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                    <Clock className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{progress.totalHoursSpent}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Hours Spent</p>
              </div>

              {/* Lessons Completed Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{progress.totalLessonsCompleted}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Lessons Completed</p>
              </div>

              {/* Active Courses Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition">
                    <BookOpen className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{progress.courses.length}</span>
                </div>
                <p className="text-gray-500 text-sm">Active</p>
                <p className="text-gray-700 font-semibold mt-1">Active Courses</p>
              </div>
            </div>

            {/* ==================== WEEKLY ACTIVITY CHART ==================== */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-800">Weekly Activity</h2>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Your learning activity over the past week</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-7 gap-2">
                  {progress.weeklyData.map((day, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-xs font-medium text-gray-500 mb-2">{day.day}</div>
                      <div className="relative h-32 flex flex-col justify-end">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-400 to-cyan-600 rounded-lg transition-all duration-500 hover:opacity-80 cursor-pointer group"
                          style={{ height: `${(day.hours / maxHours) * 100}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                            {day.hours} hours
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">{day.hours}h</div>
                      <div className="text-xs text-gray-400">{day.lessons} lessons</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ==================== COURSES PROGRESS ==================== */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-blue-50">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-800">Course Progress</h2>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Detailed progress for each enrolled course</p>
              </div>

              <div className="divide-y divide-gray-100">
                {progress.courses.map((course) => (
                  <div key={course.id} className="p-5 hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedCourse(course)}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-800">{course.title}</h3>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {course.lessonsCompleted}/{course.totalLessons} lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {course.timeSpent} hours spent
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            Score: {course.score}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">{course.progress}%</div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/student/course/${course.id}`); }}
                        className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                      >
                        Continue Learning
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ==================== RECENT ACTIVITY & BADGES ==================== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Your latest learning activities</p>
                </div>

                <div className="divide-y divide-gray-100">
                  {progress.recentActivity.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-gray-50 transition">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <PlayCircle className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{activity.lesson}</p>
                          <p className="text-sm text-gray-500">{activity.course}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.timeSpent} min spent
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(activity.completed).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges Earned */}
              <div className="bg-blue-50 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-800">Badges Earned</h2>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Achievements unlocked on your journey</p>
                </div>

                <div className="p-6">
                  {progress.badges.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Award className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No badges earned yet</p>
                      <p className="text-xs text-gray-400 mt-1">Complete more courses to earn badges!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {progress.badges.map((badge, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 bg-white rounded-xl">
                          <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-2xl">
                            {badge.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{badge.name}</p>
                            <p className="text-xs text-gray-500">{badge.description}</p>
                          </div>
                          <Sparkles className="w-5 h-5 text-blue-500" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Learning Insights */}
            <div className="mt-8 bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-8 h-8" />
                <h3 className="text-xl font-bold">Learning Insights</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm opacity-80">Best Learning Day</p>
                  <p className="text-2xl font-bold mt-1">Saturday</p>
                  <p className="text-xs opacity-75 mt-1">You learn best on weekends!</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm opacity-80">Most Productive</p>
                  <p className="text-2xl font-bold mt-1">{Math.max(...progress.weeklyData.map(d => d.hours))} hours</p>
                  <p className="text-xs opacity-75 mt-1">Your peak learning day</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm opacity-80">Recommended Focus</p>
                  <p className="text-2xl font-bold mt-1">Node.js Advanced</p>
                  <p className="text-xs opacity-75 mt-1">{45}% complete - almost there!</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedCourse(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-slideIn" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{selectedCourse.title}</h2>
              <button onClick={() => setSelectedCourse(null)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="font-bold text-green-600">{selectedCourse.progress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: `${selectedCourse.progress}%` }}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Lessons Completed</p>
                  <p className="text-2xl font-bold text-gray-800">{selectedCourse.lessonsCompleted}/{selectedCourse.totalLessons}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Time Spent</p>
                  <p className="text-2xl font-bold text-gray-800">{selectedCourse.timeSpent} hours</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Average Score</p>
                  <p className="text-2xl font-bold text-gray-800">{selectedCourse.score}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Last Accessed</p>
                  <p className="text-lg font-bold text-gray-800">{new Date(selectedCourse.lastAccessed).toLocaleDateString()}</p>
                </div>
              </div>
              <button 
                onClick={() => { setSelectedCourse(null); navigate(`/student/course/${selectedCourse.id}`); }}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-200"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
          <div className={`backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 flex items-center gap-3 ${
            toast.type === "success" 
              ? "bg-gray-900/95 border-blue-500" 
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