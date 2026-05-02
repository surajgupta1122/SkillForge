import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import StudentSidebar from "../../components/StudentSidebar.jsx";
import {
  Award,
  Download,
  Search,
  X,
  Calendar,
  CheckCircle,
  Trophy,
  Sparkles,
  Medal,
  Star,
  Share2,
  Eye,
  FileText,
  Clock,
  GraduationCap,
  Users,
  TrendingUp
} from "lucide-react";

export default function Certificates() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Fetch certificates
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/certificates");
      setCertificates(res.data);
    } catch (err) {
      console.error(err);
      // Mock data for demo
      setCertificates([
        {
          id: 1,
          courseTitle: "React Mastery",
          courseId: 101,
          issueDate: "2024-03-15",
          certificateId: "CERT-REACT-2024-001",
          instructor: "Dr. Emily Clarke",
          grade: "A",
          score: 92,
          duration: "40 hours",
          imageUrl: "https://via.placeholder.com/800x600/4f46e5/white?text=Certificate"
        },
        {
          id: 2,
          courseTitle: "Node.js Advanced",
          courseId: 102,
          issueDate: "2024-02-28",
          certificateId: "CERT-NODE-2024-002",
          instructor: "Prof. James Wilson",
          grade: "A+",
          score: 96,
          duration: "35 hours",
          imageUrl: "https://via.placeholder.com/800x600/10b981/white?text=Certificate"
        },
        {
          id: 3,
          courseTitle: "UI/UX Design Principles",
          courseId: 103,
          issueDate: "2024-01-20",
          certificateId: "CERT-UIUX-2024-003",
          instructor: "Maria Garcia",
          grade: "B+",
          score: 85,
          duration: "30 hours",
          imageUrl: "https://via.placeholder.com/800x600/8b5cf6/white?text=Certificate"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // Filter certificates
  const filteredCertificates = certificates.filter((cert) =>
    cert.courseTitle?.toLowerCase().includes(search.toLowerCase()) ||
    cert.certificateId?.toLowerCase().includes(search.toLowerCase())
  );

  // Download certificate
  const handleDownload = async (certificate) => {
    try {
      // API call to download certificate
      // const response = await api.get(`/student/certificate/${certificate.id}/download`, {
      //   responseType: 'blob'
      // });
      
      // Create download link
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', `certificate_${certificate.certificateId}.pdf`);
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
      
      showToast(`📜 Downloading certificate for ${certificate.courseTitle}`, "success");
    } catch (err) {
      showToast("Failed to download certificate", "error");
    }
  };

  // Share certificate
  const handleShare = async (certificate) => {
    try {
      await navigator.share({
        title: `Certificate of Completion - ${certificate.courseTitle}`,
        text: `I have successfully completed ${certificate.courseTitle} course!`,
        url: window.location.href,
      });
      showToast("Shared successfully!", "success");
    } catch (err) {
      showToast("Share cancelled or failed", "error");
    }
  };

  // View certificate
  const handleView = (certificate) => {
    setSelectedCertificate(certificate);
  };

  // Close modal
  const closeModal = () => {
    setSelectedCertificate(null);
  };

  // Stats
  const totalCertificates = certificates.length;
  const averageScore = certificates.length > 0
    ? Math.round(certificates.reduce((sum, cert) => sum + (cert.score || 0), 0) / certificates.length)
    : 0;
  const topGrade = certificates.length > 0
    ? certificates.reduce((best, cert) => {
        const gradeOrder = { "A+": 5, "A": 4, "B+": 3, "B": 2, "C": 1 };
        return gradeOrder[best.grade] > gradeOrder[cert.grade] ? best : cert;
      }).grade
    : "N/A";

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
                    <span>My Achievements</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    My <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Certificates</span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">Your course completion certificates</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-sm border border-white/40">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Earned</p>
                        <p className="font-bold text-gray-800 text-sm">{totalCertificates} Certificates</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== STATS CARDS ==================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {/* Total Certificates Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                    <Award className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{totalCertificates}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Certificates Earned</p>
              </div>

              {/* Average Score Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
                    <Star className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{averageScore}%</span>
                </div>
                <p className="text-gray-500 text-sm">Average</p>
                <p className="text-gray-700 font-semibold mt-1">Average Score</p>
              </div>

              {/* Top Grade Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition">
                    <Medal className="w-6 h-6 text-purple-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">{topGrade}</span>
                </div>
                <p className="text-gray-500 text-sm">Highest</p>
                <p className="text-gray-700 font-semibold mt-1">Top Grade Achieved</p>
              </div>

              {/* Completion Rate Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">
                    {certificates.length > 0 ? "100" : "0"}%
                  </span>
                </div>
                <p className="text-gray-500 text-sm">Success</p>
                <p className="text-gray-700 font-semibold mt-1">Completion Rate</p>
              </div>
            </div>

            {/* ==================== SEARCH SECTION ==================== */}
            <div className="bg-blue-50 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-500" />
                    Certificate Gallery
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">View and download your earned certificates</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <span className="text-green-600 text-sm font-medium">{filteredCertificates.length} certificates</span>
                  </div>
                  {/* Search Box */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by course or certificate ID..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 w-64"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== CERTIFICATES GRID ==================== */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-5">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="flex gap-2">
                          <div className="h-8 bg-gray-200 rounded flex-1"></div>
                          <div className="h-8 bg-gray-200 rounded flex-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCertificates.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Certificates Found</h3>
                <p className="text-gray-400 text-sm mb-6">
                  {search ? "Try a different search term" : "Complete courses to earn certificates"}
                </p>
                {!search && (
                  <button
                    onClick={() => navigate("/student")}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Browse Courses
                    <GraduationCap className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCertificates.map((certificate) => (
                  <div
                    key={certificate.id}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Certificate Preview */}
                    <div 
                      className="h-48 bg-gradient-to-br from-blue-600 to-cyan-700 relative cursor-pointer overflow-hidden"
                      onClick={() => handleView(certificate)}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <Award className="w-16 h-16 mb-2 opacity-80" />
                        <p className="text-sm font-medium">Certificate of Completion</p>
                        <p className="text-xs opacity-75 mt-1">Click to view</p>
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                          <span className="text-xs font-bold text-gray-800">{certificate.grade}</span>
                        </div>
                      </div>
                    </div>

                    {/* Certificate Info */}
                    <div className="p-5">
                      <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">
                        {certificate.courseTitle}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FileText className="w-4 h-4" />
                          <span>ID: {certificate.certificateId}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Users className="w-4 h-4" />
                          <span>Instructor: {certificate.instructor}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>Duration: {certificate.duration}</span>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-lg">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold text-yellow-600">Score: {certificate.score}%</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(certificate)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all duration-200"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownload(certificate)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-all duration-200"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button
                          onClick={() => handleShare(certificate)}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-all duration-200"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Certificate Preview Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideIn" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Certificate of Completion</h2>
                <p className="text-sm text-gray-500">{selectedCertificate.courseTitle}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Certificate Content */}
            <div className="p-8">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-8 border-2 border-blue-200">
                {/* Certificate Header */}
                <div className="text-center mb-8">
                  <Sparkles className="w-16 h-16 text-blue-500 mx-auto mb-3" />
                  <h1 className="text-3xl font-bold text-gray-800">Certificate of Completion</h1>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-500 mx-auto mt-3"></div>
                </div>

                {/* Certificate Body */}
                <div className="text-center mb-8">
                  <p className="text-gray-600 mb-2">This certificate is proudly presented to</p>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">[Student Name]</h2>
                  <p className="text-gray-600">for successfully completing the course</p>
                  <h3 className="text-xl font-semibold text-gray-800 mt-2 mb-4">{selectedCertificate.courseTitle}</h3>
                  <p className="text-gray-600">with a grade of <span className="font-bold text-blue-600">{selectedCertificate.grade}</span></p>
                </div>

                {/* Certificate Details */}
                <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500">Certificate ID</p>
                    <p className="font-mono text-xs text-gray-700">{selectedCertificate.certificateId}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Issue Date</p>
                    <p className="font-medium text-gray-700">{new Date(selectedCertificate.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Final Score</p>
                    <p className="font-bold text-green-600">{selectedCertificate.score}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Course Duration</p>
                    <p className="font-medium text-gray-700">{selectedCertificate.duration}</p>
                  </div>
                </div>

                {/* Signatures */}
                <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
                  <div className="text-center">
                    <div className="w-32 h-0.5 bg-gray-300 mb-2"></div>
                    <p className="text-sm text-gray-600">Instructor Signature</p>
                    <p className="text-xs text-gray-500">{selectedCertificate.instructor}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-0.5 bg-gray-300 mb-2"></div>
                    <p className="text-sm text-gray-600">Authorized Signatory</p>
                    <p className="text-xs text-gray-500">SkillForge Academy</p>
                  </div>
                </div>

                {/* Seal */}
                <div className="text-center mt-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-blue-500 bg-blue-50">
                    <CheckCircle className="w-10 h-10 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(selectedCertificate)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition"
              >
                <Download className="w-4 h-4" />
                Download PDF
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
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}