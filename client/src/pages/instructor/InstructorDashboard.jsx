import { useEffect, useState } from "react";
import api from "../../service/api";
import InstructorSidebar from "../../components/InstructorSidebar";
import {
  BookOpen,
  Users,
  PlusCircle,
  Trash2,
  Save,
  CheckCircle,
  XCircle,
  FileText,
  DollarSign,
  AlignLeft,
  GraduationCap,
  TrendingUp,
  Video,
  Upload,
  Link as LinkIcon,
} from "lucide-react";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // Lessons state (each lesson can have a video file or URL)
  const [lessons, setLessons] = useState([
    {
      title: "",
      description: "",
      videoUrl: "",
      videoFile: null,
      duration: 0,
      order: 1,
    },
  ]);
  // Resources state (each resource can have a document file or URL)
  const [resources, setResources] = useState([
    { name: "", url: "", file: null },
  ]);

  // Drag & drop reordering for lessons
  const [draggedLessonIndex, setDraggedLessonIndex] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get("/instructor/my-courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ---------- Lesson handlers ----------
  const addLesson = () => {
    setLessons([
      ...lessons,
      {
        title: "",
        description: "",
        videoUrl: "",
        videoFile: null,
        duration: 0,
        order: lessons.length + 1,
      },
    ]);
  };

  const removeLesson = (index) => {
    const newLessons = lessons.filter((_, i) => i !== index);
    newLessons.forEach((l, idx) => (l.order = idx + 1));
    setLessons(newLessons);
  };

  const updateLesson = (index, field, value) => {
    const newLessons = [...lessons];
    newLessons[index][field] = value;
    setLessons(newLessons);
  };

  const handleLessonFileDrop = (index, file) => {
    const newLessons = [...lessons];
    newLessons[index].videoFile = file;
    if (file) newLessons[index].videoUrl = "";
    setLessons(newLessons);
  };

  // Drag-and-drop reordering for lessons
  const onDragStart = (e, index) => {
    setDraggedLessonIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedLessonIndex === null || draggedLessonIndex === targetIndex) return;
    const newLessons = [...lessons];
    const [removed] = newLessons.splice(draggedLessonIndex, 1);
    newLessons.splice(targetIndex, 0, removed);
    newLessons.forEach((lesson, idx) => (lesson.order = idx + 1));
    setLessons(newLessons);
    setDraggedLessonIndex(null);
  };

  // ---------- Resource handlers ----------
  const addResource = () => {
    setResources([...resources, { name: "", url: "", file: null }]);
  };

  const removeResource = (index) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const updateResource = (index, field, value) => {
    const newResources = [...resources];
    newResources[index][field] = value;
    setResources(newResources);
  };

  const handleResourceFileDrop = (index, file) => {
    const newResources = [...resources];
    newResources[index].file = file;
    if (file) newResources[index].url = "";
    setResources(newResources);
  };

  // ---------- Form submission (FormData for files) ----------
  const handleAddCourse = async () => {
    if (!title.trim()) {
      showToast("Course title is required", "error");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      showToast("Valid price is required", "error");
      return;
    }

    // Filter lessons with non‑empty title
    const lessonsToSend = lessons.filter(l => l.title.trim() !== "");
    if (lessonsToSend.length === 0) {
      showToast("Add at least one lesson with a title", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("price", parseFloat(price));
    formData.append("description", description || "");

    // Stringify lessons and resources
    formData.append("lessons", JSON.stringify(lessonsToSend));
    formData.append("resources", JSON.stringify(resources.filter(r => r.name.trim() !== "")));

    // Append files – use the index within lessonsToSend for consistency
    lessonsToSend.forEach((lesson, idx) => {
      const originalLesson = lessons.find(l => l === lesson);
      if (originalLesson?.videoFile) {
        formData.append(`lessons[${idx}][videoFile]`, originalLesson.videoFile);
      }
    });
    resources.forEach((res, idx) => {
      if (res.file) {
        formData.append(`resources[${idx}][file]`, res.file);
      }
    });

    try {
      const res = await api.post("/instructor/create-course", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("✅ Course Created Successfully", "success");
      handleClear();
      fetchCourses();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to create course";
      showToast(errorMsg, "error");
    }
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setLessons([
      {
        title: "",
        description: "",
        videoUrl: "",
        videoFile: null,
        duration: 0,
        order: 1,
      },
    ]);
    setResources([{ name: "", url: "", file: null }]);
  };

  // Section completion logic for the progress bar
  const isBasicComplete = !!title && !!price;
  const isLessonsComplete = lessons.some((lesson) => lesson.title.trim() !== "");
  const isResourcesComplete = resources.some((res) => res.name.trim() !== "");
  const filledSections = (isBasicComplete ? 1 : 0) + (isLessonsComplete ? 1 : 0) + (isResourcesComplete ? 1 : 0);
  const progressWidth = (filledSections / 3) * 100;

  // Stats for cards
  const totalStudents = courses.reduce((sum, c) => sum + (c.students || 0), 0);
  const totalRevenue = courses.reduce((sum, c) => sum + (c.students || 0) * (c.price || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-1 pr-0">
      <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-3xl">
        <InstructorSidebar />

        <main className="flex-1 overflow-y-auto custom-scroll">
          <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 lg:px-10">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>Instructor Dashboard</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    Create{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      New Course
                    </span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">
                    Fill course details, add lessons and resources
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-sm border border-white/40">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Courses</p>
                        <p className="font-bold text-gray-800 text-sm">{courses.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{courses.length}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total Courses</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{totalStudents}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total Students</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">₹{totalRevenue.toLocaleString()}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total Revenue</p>
              </div>
            </div>

            {/* Create Course Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-orange-50">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-800">Create New Course</h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">Fill in the course details, then add lessons and resources</p>
              </div>

              <div className="p-6">
                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span className={isBasicComplete ? "text-green-600 font-medium" : ""}>Basic Details</span>
                    <span className={isLessonsComplete ? "text-green-600 font-medium" : ""}>Course Lessons</span>
                    <span className={isResourcesComplete ? "text-green-600 font-medium" : ""}>Resources & Docs</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressWidth}%` }}
                    />
                  </div>
                </div>

                {/* ---------- Basic Details ---------- */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 pt-5 pb-2 border rounded-xl outline-none peer focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                        placeholder=" "
                      />
                      <label
                        className={`absolute left-4 transition-all duration-200 pointer-events-none
                          peer-focus:top-2 peer-focus:text-xs peer-focus:text-orange-600
                          ${title ? "top-2 text-xs text-orange-600" : "top-1/2 -translate-y-1/2 text-gray-500 text-base"}`}
                      >
                        Course Title <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-4 pt-5 pb-2 border rounded-xl outline-none peer focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                        placeholder=" "
                      />
                      <label
                        className={`absolute left-4 transition-all duration-200 pointer-events-none
                          peer-focus:top-2 peer-focus:text-xs peer-focus:text-orange-600
                          ${price ? "top-2 text-xs text-orange-600" : "top-1/2 -translate-y-1/2 text-gray-500 text-base"}`}
                      >
                        Price (₹) <span className="text-red-500">*</span>
                      </label>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 pt-5 pb-2 border rounded-xl outline-none peer focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all resize-none"
                      placeholder=" "
                    />
                    <label
                      className={`absolute left-4 transition-all duration-200 pointer-events-none
                        peer-focus:top-2 peer-focus:text-xs peer-focus:text-orange-600
                        ${description ? "top-2 text-xs text-orange-600" : "top-5 text-gray-500 text-base"}`}
                    >
                      Description
                    </label>
                  </div>
                </div>

                {/* ---------- Lessons Section ---------- */}
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Video className="w-5 h-5 text-blue-600" />
                      Course Lessons
                    </h3>
                    <button
                      type="button"
                      onClick={addLesson}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Lesson
                    </button>
                  </div>

                  {lessons.map((lesson, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={(e) => onDragStart(e, idx)}
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, idx)}
                      className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-gray-500">Lesson {idx + 1}</span>
                        {lessons.length > 1 && (
                          <button onClick={() => removeLesson(idx)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Title + Video URL side by side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Lesson title"
                          value={lesson.title}
                          onChange={(e) => updateLesson(idx, "title", e.target.value)}
                          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400"
                        />
                        <input
                          type="text"
                          placeholder="Video URL (YouTube or direct link)"
                          value={lesson.videoUrl}
                          onChange={(e) => updateLesson(idx, "videoUrl", e.target.value)}
                          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400"
                        />
                      </div>

                      {/* Tall video drop zone */}
                      <div className="mb-4">
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer bg-gray-50"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file && file.type.startsWith("video/")) {
                              handleLessonFileDrop(idx, file);
                            } else {
                              showToast("Please drop a video file", "error");
                            }
                          }}
                          onClick={() => document.getElementById(`lesson-video-${idx}`).click()}
                        >
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            {lesson.videoFile ? lesson.videoFile.name : "Drag & drop a video file here or click to upload"}
                          </p>
                          <input
                            id={`lesson-video-${idx}`}
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files[0]) handleLessonFileDrop(idx, e.target.files[0]);
                            }}
                          />
                        </div>
                      </div>

                      {/* Description + Duration side by side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <textarea
                          rows={2}
                          placeholder="Lesson description"
                          value={lesson.description}
                          onChange={(e) => updateLesson(idx, "description", e.target.value)}
                          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400"
                        />
                        <input
                          type="number"
                          placeholder="Duration (minutes)"
                          value={lesson.duration}
                          onChange={(e) => updateLesson(idx, "duration", parseInt(e.target.value) || 0)}
                          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* ---------- Resources Section ---------- */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      Resources & Documents
                    </h3>
                    <button
                      type="button"
                      onClick={addResource}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm hover:bg-green-100 transition"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Resource
                    </button>
                  </div>

                  {resources.map((res, idx) => (
                    <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-gray-500">Resource {idx + 1}</span>
                        {resources.length > 1 && (
                          <button onClick={() => removeResource(idx)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Resource name + URL side by side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Resource name (e.g., Course Slides)"
                          value={res.name}
                          onChange={(e) => updateResource(idx, "name", e.target.value)}
                          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400"
                        />
                        <input
                          type="text"
                          placeholder="Resource URL (e.g., https://example.com/doc.pdf)"
                          value={res.url}
                          onChange={(e) => updateResource(idx, "url", e.target.value)}
                          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400"
                        />
                      </div>

                      {/* Tall document drop zone */}
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition cursor-pointer bg-gray-50"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files[0];
                          if (file && (file.type === "application/pdf" || file.type.includes("word") || file.type.includes("presentation") || file.name.endsWith(".txt"))) {
                            handleResourceFileDrop(idx, file);
                          } else {
                            showToast("Please drop a valid document (PDF, DOC, PPT, TXT)", "error");
                          }
                        }}
                        onClick={() => document.getElementById(`resource-file-${idx}`).click()}
                      >
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          {res.file ? res.file.name : "Drag & drop a document here or click to upload"}
                        </p>
                        <input
                          id={`resource-file-${idx}`}
                          type="file"
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files[0]) handleResourceFileDrop(idx, e.target.files[0]);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                  <button onClick={handleClear} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200">
                    <Trash2 className="w-4 h-4" /> Clear
                  </button>
                  <button onClick={handleAddCourse} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-br from-orange-400 to-red-600 hover:from-orange-500 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
                    <Save className="w-4 h-4" /> Create Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
          <div
            className={`backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 flex items-center gap-3 ${
              toast.type === "success" ? "bg-gray-900/95 border-green-500" : "bg-gray-900/95 border-red-500"
            }`}
          >
            <div className={toast.type === "success" ? "text-green-400" : "text-red-400"}>
              {toast.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
        </div>
      )}

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}