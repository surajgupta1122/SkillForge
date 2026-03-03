import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  Users,
  Award,
  BookOpen,
  Target,
  Heart,
  Shield,
  Globe,
  Rocket,
  Sparkles,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Linkedin,
  Twitter,
  Github,
} from "lucide-react";

export default function About() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50" />

      {/* Hero Section */}
      <div className="relative pt-13 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#03261F] via-[#0A5649] to-[#428746] opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-6 pb-24 lg:pb-32">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Our Story</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Empowering
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#CCDE2F] to-[#0A5649]">
                Tomorrow's Leaders
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
              We're on a mission to make quality education accessible to everyone,
              everywhere. Join us in shaping the future of learning.
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="bg-[#CCDE2F] text-[#03261F] px-8 py-4 rounded-xl font-semibold hover:bg-[#CCDE2F]/90 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
              >
                Join Our Community <Rocket className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all transform hover:scale-105"
              >
                Contact Us
              </button>
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

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Users, label: "Active Students", value: "50K+" },
            { icon: BookOpen, label: "Courses", value: "500+" },
            { icon: Award, label: "Instructors", value: "100+" },
            { icon: Globe, label: "Countries", value: "30+" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              <div className="p-3 bg-gradient-to-br from-[#0A5649]/10 to-[#428746]/10 rounded-xl w-fit mb-4">
                <item.icon className="w-6 h-6 text-[#0A5649]" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{item.value}</p>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Our <span className="text-[#0A5649]">Story</span>
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in 2020, SkillForge began with a simple idea: education
                should be accessible, engaging, and effective. What started as a
                small collection of courses has grown into a global platform
                serving thousands of learners worldwide.
              </p>
              <p>
                We believe that everyone has the potential to learn and grow. Our
                platform brings together expert instructors, cutting-edge
                technology, and a supportive community to create the perfect
                learning environment.
              </p>
              <p>
                Today, we're proud to be one of the fastest-growing ed-tech
                platforms, with students from over 30 countries and partnerships
                with leading industry experts.
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#03261F] to-[#0A5649] border-2 border-white"
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-bold text-[#0A5649]">10,000+</span> happy
                students
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A5649] to-[#428746] rounded-3xl transform rotate-3 opacity-20"></div>
            <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Target, title: "Mission", desc: "Empower learners worldwide" },
                  { icon: Heart, title: "Values", desc: "Quality, Accessibility, Innovation" },
                  { icon: Shield, title: "Trust", desc: "Verified certificates" },
                  { icon: Rocket, title: "Vision", desc: "Future of education" },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-gray-50 rounded-xl">
                    <item.icon className="w-6 h-6 text-[#0A5649] mb-2" />
                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Our <span className="text-[#0A5649]">Values</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: "Student First",
              desc: "Every decision we make puts our students' success first",
            },
            {
              icon: Award,
              title: "Quality Content",
              desc: "We partner with the best instructors to bring you top-notch courses",
            },
            {
              icon: Globe,
              title: "Global Access",
              desc: "Breaking down barriers to make education accessible worldwide",
            },
          ].map((value) => (
            <div
              key={value.title}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A5649] to-[#428746] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -m-1"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg group-hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-[#0A5649]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8 text-[#0A5649]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-[#03261F] via-[#0A5649] to-[#428746] py-20">
        <div className="max-w-4xl mx-auto text-center text-white px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get in Touch
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Have questions? We'd love to hear from you
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                <Mail className="w-5 h-5 text-[#CCDE2F]" />
              </div>
              <p className="font-medium">support@skillforge.com</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                <Phone className="w-5 h-5 text-[#CCDE2F]" />
              </div>
              <p className="font-medium">+91 ********67</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5 text-[#CCDE2F]" />
              </div>
              <p className="font-medium">San Francisco, CA</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/contact")}
            className="bg-[#CCDE2F] text-[#03261F] px-8 py-4 rounded-xl font-semibold hover:bg-[#CCDE2F]/90 transition-all transform hover:scale-105 shadow-xl inline-flex items-center gap-2"
          >
            Contact Us <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
}