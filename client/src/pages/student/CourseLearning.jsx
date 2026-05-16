import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../service/api";
import {
  PlayCircle,
  CheckCircle,
  ChevronRight,
  Clock,
  BookOpen,
  FileText,
  Download,
  ArrowLeft,
} from "lucide-react";

export default function CourseLearning() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const res = await api.get(`/student/course/${id}`);
      setCourse(res.data.course);
      setLessons(res.data.lessons);
      if (res.data.lessons.length > 0) {
        setSelectedLesson(res.data.lessons[0]);
      }
      // If your backend returns documents for each lesson, set them here.
      // For now, we'll simulate documents (you can replace with real API call).
      setDocuments([
        { id: 1, title: "Course Slides", url: "#", type: "pdf" },
        { id: 2, title: "Exercise Files", url: "#", type: "zip" },
      ]);
    } catch (err) {
      console.error(err);
      showToast("Failed to load course content. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const markLessonComplete = async (lessonId) => {
    try {
      const res = await api.post(`/student/lesson/${lessonId}/complete`);
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        )
      );
      setCourse((prev) => ({ ...prev, progress: res.data.progress }));
      showToast("Lesson completed! 🎉", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to mark lesson as completed", "error");
    }
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!course) return null;

  const completedCount = lessons.filter((l) => l.completed).length;
  const totalLessons = lessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => navigate("/student/my-courses")}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to My Courses</span>
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold text-gray-800">{course.title}</h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">{progressPercent}% complete</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Left Sidebar – Lesson List */}
        <div className="w-full md:w-80 bg-white border-r border-gray-200 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Course Content ({totalLessons} lessons)
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                  selectedLesson?.id === lesson.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">#{idx + 1}</span>
                      <h3 className="font-medium text-gray-800">{lesson.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.duration_minutes || 15} min
                      </span>
                      {lesson.video_url && (
                        <span className="flex items-center gap-1 text-blue-500">
                          <PlayCircle className="w-3 h-3" />
                          Video
                        </span>
                      )}
                    </div>
                  </div>
                  {lesson.completed && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
            {lessons.length === 0 && (
              <div className="p-8 text-center text-gray-500">No lessons available</div>
            )}
          </div>
        </div>

        {/* Right Area – Video + Documents */}
        <div className="flex-1 p-6 overflow-y-auto h-[calc(100vh-64px)]">
          {selectedLesson ? (
            <>
              {/* Video / Content Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                  {selectedLesson.video_url ? (
                    <video
                      src={selectedLesson.video_url}
                      controls
                      className="w-full h-full"
                      poster="/api/placeholder/1280/720"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <PlayCircle className="w-16 h-16 mx-auto mb-2" />
                      <p>Video preview not available</p>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-gray-800">{selectedLesson.title}</h2>
                    {!selectedLesson.completed && (
                      <button
                        onClick={() => markLessonComplete(selectedLesson.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1"
                      >
                        Mark Complete
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                    {selectedLesson.completed && (
                      <span className="inline-flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </span>
                    )}
                  </div>
                  {selectedLesson.description && (
                    <p className="text-gray-600">{selectedLesson.description}</p>
                  )}
                </div>
              </div>

              {/* Documents / Resources Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                      Resources & Materials
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{doc.title}</span>
                      </div>
                      <a
                        href={doc.url}
                        download
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  ))}
                  {documents.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No resources available</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a lesson from the sidebar to start learning
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
          <div
            className={`bg-gray-900/95 text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 flex items-center gap-3 ${
              toast.type === "success" ? "border-green-500" : "border-red-500"
            }`}
          >
            <div className={toast.type === "success" ? "text-green-400" : "text-red-400"}>
              {toast.type === "success" ? "✓" : "✗"}
            </div>
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
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slideIn { animation: slideIn 0.2s ease-out forwards; }
        .aspect-video { aspect-ratio: 16 / 9; }
      `}</style>
    </div>
  );
}