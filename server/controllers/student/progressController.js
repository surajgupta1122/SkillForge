import { useEffect, useState, useCallback } from "react";
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
  FileText,
  X // Added missing X
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
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Toast (with cleanup)
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = useCallback((msg, type = "success") => {
    setToast({ show: true, message: msg, type });
  }, []);

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.show]);

  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/student/progress");
      setProgress(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load progress data", "error");
      setError("Could not load progress. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Safe calculations for weekly chart
  const weeklyData = progress.weeklyData || [];
  const maxHours = Math.max(...weeklyData.map(d => d.hours), 1);
  const maxLessons = Math.max(...weeklyData.map(d => d.lessons), 1);

  // Best learning day and peak hours (fallbacks)
  const bestDay = weeklyData.length ? weeklyData.reduce((max, d) => d.hours > max.hours ? d : max, weeklyData[0]) : null;
  const peakHours = bestDay ? bestDay.hours : 0;

  // Find course with lowest progress for recommendation
  const recommendedCourse = progress.courses.length ? progress.courses.reduce((min, c) => c.progress < min.progress ? c : min) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-1 pr-0">
      <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-3xl">
        <StudentSidebar />

        <main className="flex-1 overflow-y-auto custom-scroll">
          <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 lg:px-10">
            {/* Header, stats cards, weekly chart, course progress, recent activity & badges, learning insights */}
            {/* ... keep all JSX exactly as you had, with the following adjustments: */}

            {/* Add error banner */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            {/* In the "Best Learning Day" and "Most Productive" sections, use fallbacks */}
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-sm opacity-80">Best Learning Day</p>
              <p className="text-2xl font-bold mt-1">{bestDay ? bestDay.day : "N/A"}</p>
              <p className="text-xs opacity-75 mt-1">You learn best on weekends!</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-sm opacity-80">Most Productive</p>
              <p className="text-2xl font-bold mt-1">{peakHours} hours</p>
              <p className="text-xs opacity-75 mt-1">Your peak learning day</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-sm opacity-80">Recommended Focus</p>
              <p className="text-2xl font-bold mt-1">{recommendedCourse ? recommendedCourse.title : "None"}</p>
              <p className="text-xs opacity-75 mt-1">
                {recommendedCourse ? `${recommendedCourse.progress}% complete - almost there!` : "Enroll in a course"}
              </p>
            </div>

            {/* Modal now uses X icon (imported) */}
            {/* ... */}
          </div>
        </main>
      </div>

      {/* ... Toast notification (no changes) ... */}
    </div>
  );
}