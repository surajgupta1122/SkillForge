import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api";
import Navbar from "../components/Navbar";
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Search,
  Star,
  ChevronRight,
  Sparkles,
  Rocket,
  Globe,
  Zap,
  Clock,
  Shield,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/student/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50" />

      {/* Hero Section - Custom Gradient */}
      <div className="relative pt-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#03261F] via-[#0A5649] to-[#428746] opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-6 pb-24 lg:pb-32">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                Welcome to the future of learning
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Unlock Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#CCDE2F] to-[#0A5649]">
                Potential Today
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Join millions of learners worldwide and master in-demand skills
              with industry experts
            </p>

            {/* Search Bar - Modern Design */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center bg-white rounded-2xl p-1 shadow-2xl">
                <div className="flex-1 flex items-center px-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="What do you want to learn today?"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-3 text-gray-800 outline-none bg-transparent"
                  />
                </div>
                <button
                  onClick={() => navigate("/student")}
                  className="bg-gradient-to-r from-[#03261F] to-[#0A5649] text-white px-8 py-3 rounded-xl hover:from-[#0A5649] hover:to-[#428746] transition-all transform hover:scale-105 font-medium"
                >
                  Explore
                </button>
              </div>

              <div className="flex gap-4 mt-6 text-sm text-white/80 justify-center">
                <span>Popular:</span>
                <span className="hover:text-[#CCDE2F] cursor-pointer transition-colors">
                  Web Development
                </span>
                <span className="hover:text-[#CCDE2F] cursor-pointer transition-colors">
                  Data Science
                </span>
                <span className="hover:text-[#CCDE2F] cursor-pointer transition-colors">
                  AI & ML
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Stats Section - Modern Cards */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              icon: Users,
              label: "Active Students",
              value: "50K+",
              change: "+25%",
            },
            {
              icon: BookOpen,
              label: "Courses Available",
              value: "500+",
              change: "+50",
            },
            {
              icon: Award,
              label: "Certifications",
              value: "100+",
              change: "New",
            },
            {
              icon: TrendingUp,
              label: "Success Rate",
              value: "95%",
              change: "+5%",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#0A5649]/10 to-[#428746]/10 rounded-xl">
                  <item.icon className="w-6 h-6 text-[#0A5649]" />
                </div>
                <span className="text-xs font-semibold text-[#428746] bg-[#428746]/10 px-2 py-1 rounded-full">
                  {item.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{item.value}</p>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Explore Top Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover courses in various categories taught by industry experts
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              name: "Web Development",
              icon: Globe,
              color: "from-[#03261F] to-[#0A5649]",
              bg: "bg-[#0A5649]/10",
            },
            {
              name: "Mobile Development",
              icon: Rocket,
              color: "from-[#0A5649] to-[#428746]",
              bg: "bg-[#428746]/10",
            },
            {
              name: "Data Science",
              icon: TrendingUp,
              color: "from-[#428746] to-[#CCDE2F]",
              bg: "bg-[#CCDE2F]/10",
            },
            {
              name: "Artificial Intelligence",
              icon: Zap,
              color: "from-[#03261F] to-[#CCDE2F]",
              bg: "bg-[#03261F]/10",
            },
            {
              name: "Cloud Computing",
              icon: Globe,
              color: "from-[#0A5649] to-[#CCDE2F]",
              bg: "bg-[#0A5649]/10",
            },
            {
              name: "Cybersecurity",
              icon: Shield,
              color: "from-[#03261F] to-[#428746]",
              bg: "bg-[#428746]/10",
            },
            {
              name: "DevOps",
              icon: Rocket,
              color: "from-[#428746] to-[#0A5649]",
              bg: "bg-[#0A5649]/10",
            },
            {
              name: "UI/UX Design",
              icon: Sparkles,
              color: "from-[#CCDE2F] to-[#428746]",
              bg: "bg-[#CCDE2F]/10",
            },
          ].map((cat) => (
            <div
              key={cat.name}
              className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity`}
              ></div>
              <div
                className={`${cat.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <cat.icon className="w-6 h-6 text-[#03261F]" />
              </div>
              <h3 className="font-semibold text-gray-800">{cat.name}</h3>
              <p className="text-sm text-gray-500 mt-1">24+ courses</p>
              <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 text-gray-400 group-hover:text-[#0A5649] transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Featured Courses */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Featured Courses
              </h2>
              <p className="text-gray-600">
                Most popular courses loved by our students
              </p>
            </div>
            <button
              onClick={() => navigate("/student")}
              className="text-[#0A5649] font-semibold hover:text-[#03261F] flex items-center gap-2 transition-colors"
            >
              View all courses <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-lg">
                  <div className="h-48 bg-gray-200 animate-pulse rounded-xl mb-4" />
                  <div className="h-6 bg-gray-200 animate-pulse rounded mb-2" />
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3 mb-4" />
                  <div className="h-10 bg-gray-200 animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No courses found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredCourses.slice(0, 6).map((course) => (
                <div
                  key={course.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden"
                >
                  <div className="h-48 bg-gradient-to-br from-[#03261F] via-[#0A5649] to-[#428746] relative">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-[#0A5649]">
                      ₹ {course.price}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-[#CCDE2F] text-[#CCDE2F]" />
                        <Star className="w-4 h-4 fill-[#CCDE2F] text-[#CCDE2F]" />
                        <Star className="w-4 h-4 fill-[#CCDE2F] text-[#CCDE2F]" />
                        <Star className="w-4 h-4 fill-[#CCDE2F] text-[#CCDE2F]" />
                        <Star className="w-4 h-4 fill-[#CCDE2F] text-[#CCDE2F]" />
                      </div>
                      <span className="text-sm text-gray-500">(4.9)</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#0A5649] transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {course.description ||
                        "Master the fundamentals and advance your career with this comprehensive course"}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#03261F] to-[#0A5649] rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {course.instructor?.charAt(0) || "T"}
                        </div>
                        <span className="text-sm text-gray-600">
                          {course.instructor || "Expert Instructor"}
                        </span>
                      </div>

                      <button
                        onClick={() => navigate(`/course/${course.id}`)}
                        className="bg-gradient-to-r from-[#0A5649] to-[#428746] text-white px-4 py-2 rounded-xl hover:from-[#03261F] hover:to-[#0A5649] transition-all transform hover:scale-105 text-sm font-medium"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Why Choose SkillForge?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide the best learning experience with industry experts and
            cutting-edge technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: "Expert Instructors",
              desc: "Learn from industry professionals with years of experience",
              color: "from-[#03261F] to-[#0A5649]",
              bg: "bg-[#0A5649]/10",
            },
            {
              icon: Clock,
              title: "Flexible Learning",
              desc: "Access courses anytime, anywhere at your own pace",
              color: "from-[#0A5649] to-[#428746]",
              bg: "bg-[#428746]/10",
            },
            {
              icon: Award,
              title: "Industry Certification",
              desc: "Earn certificates recognized by top companies worldwide",
              color: "from-[#428746] to-[#CCDE2F]",
              bg: "bg-[#CCDE2F]/10",
            },
          ].map((item) => (
            <div key={item.title} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A5649] to-[#428746] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -m-1"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg group-hover:shadow-xl transition-all">
                <div
                  className={`${item.bg} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <item.icon className="w-8 h-8 text-[#03261F]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-[#03261F] via-[#0A5649] to-[#428746] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative max-w-4xl mx-auto text-center text-white px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students who have already transformed their
            careers with SkillForge
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="bg-[#CCDE2F] text-[#03261F] px-8 py-4 rounded-xl font-semibold hover:bg-[#CCDE2F]/90 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
            >
              Get Started Free <Rocket className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/student")}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all transform hover:scale-105"
            >
              Browse Courses
            </button>
          </div>
          <p className="text-sm text-white/80 mt-6">
            No credit card required • 7-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}