import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api";
import Navbar from "../components/Navbar";

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
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* ✅ Fixed Navbar */}
      <Navbar className="fixed top-0 w-full bg-white shadow-lg shadow-green-500" />

      {/* ✅ Added pt-20 for navbar spacing */}
      <div className="bg-gray-100 min-h-screen pt-20">

        {/* 🔥 HERO */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Upgrade Your Skills 🚀
          </h1>

          <p className="text-lg text-green-100 mb-8">
            Learn from experts and boost your career
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto flex shadow-lg rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-3 text-black outline-none"
            />

            <button
              onClick={() => navigate("/student")}
              className="bg-black px-6 hover:bg-gray-900 transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* 🔥 STATS */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 p-6 -mt-10">
          {[
            { label: "Students", value: "10K+" },
            { label: "Courses", value: "500+" },
            { label: "Instructors", value: "50+" },
            { label: "Success Rate", value: "95%" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white p-5 rounded-xl shadow text-center hover:shadow-lg transition"
            >
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>

        {/* 🔥 CATEGORIES */}
        <div className="max-w-6xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Web Development",
              "App Development",
              "Data Science",
              "AI / ML",
            ].map((cat) => (
              <div
                key={cat}
                className="bg-white p-6 rounded-xl shadow hover:shadow-xl cursor-pointer text-center font-medium transition hover:-translate-y-1"
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* 🔥 COURSES */}
        <div className="max-w-6xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">
            Popular Courses
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="h-40 bg-gray-200 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="bg-white p-10 rounded-xl shadow text-center">
              <p>No courses found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredCourses.slice(0, 6).map((course) => (
                <div
                  key={course.id}
                  className="bg-white p-5 rounded-xl shadow hover:shadow-xl transition hover:-translate-y-1"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {course.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {course.description || "No description"}
                  </p>

                  <p className="text-sm text-gray-500 mb-4">
                    👤 {course.instructor}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-bold">
                      ₹ {course.price}
                    </span>

                    {/* ✅ Gradient button (same as navbar) */}
                    <button
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="bg-gradient-to-r from-green-600 to-green-500 text-white px-3 py-1 rounded-full hover:from-green-700 hover:to-green-600 transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔥 WHY US */}
        <div className="bg-white py-12 mt-10">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-8">
              Why Choose SkillForge?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Expert Instructors",
                  desc: "Learn from industry professionals",
                },
                {
                  title: "Flexible Learning",
                  desc: "Learn anytime, anywhere",
                },
                {
                  title: "Certification",
                  desc: "Get certificates after completion",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 shadow rounded-xl hover:shadow-lg transition"
                >
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🔥 CTA */}
        <div className="bg-green-600 text-white text-center py-12">
          <h2 className="text-2xl font-bold mb-3">
            Start Learning Today
          </h2>

          <p className="mb-5">
            Join SkillForge and grow your career 🚀
          </p>

          {/* ✅ Gradient button */}
          <button
            onClick={() => navigate("/register")}
            className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-2 rounded-full hover:from-green-700 hover:to-green-600 transition"
          >
            Get Started
          </button>
        </div>

      </div>
    </div>
  );
}