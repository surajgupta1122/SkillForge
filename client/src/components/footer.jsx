import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  ChevronRight,
  Heart,
  Sparkles,
} from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#03261F] to-[#0A5649] rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800">
                Skill<span className="text-[#0A5649]">Forge</span>
              </span>
            </div>

            <p className="text-gray-600 mb-6 max-w-md">
              Empowering learners worldwide with quality education and
              industry-expert instructors. Join us in shaping the future of
              learning.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 text-[#0A5649]" />
                <span>support@skillforge.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-[#0A5649]" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-[#0A5649]" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Courses", path: "/student" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "FAQ", path: "/faq" },
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-gray-600 hover:text-[#0A5649] transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Categories</h3>
            <ul className="space-y-3">
              {[
                "Web Development",
                "Data Science",
                "Mobile Apps",
                "AI & ML",
                "Cloud Computing",
              ].map((category) => (
                <li key={category}>
                  <button
                    onClick={() => navigate("/student")}
                    className="text-gray-600 hover:text-[#0A5649] transition-colors"
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Support</h3>
            <ul className="space-y-3">
              {[
                "Help Center",
                "Terms of Service",
                "Privacy Policy",
                "Cookie Policy",
                "Accessibility",
              ].map((item) => (
                <li key={item}>
                  <button className="text-gray-600 hover:text-[#0A5649] transition-colors">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 p-8 bg-gradient-to-br from-[#03261F]/5 via-[#0A5649]/5 to-[#428746]/5 rounded-2xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-gray-600">
                Get the latest courses, learning tips, and exclusive offers
                delivered to your inbox.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A5649] focus:border-transparent transition"
              />
              <button className="bg-gradient-to-r from-[#0A5649] to-[#428746] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#03261F] hover:to-[#0A5649] transition-all transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} SkillForge. All rights reserved. Made
              with{" "}
              <Heart className="w-4 h-4 inline text-red-500 fill-current" /> for
              learners worldwide.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                {
                  icon: Linkedin,
                  href: "#",
                  color: "hover:bg-blue-100 hover:text-blue-600",
                },
                {
                  icon: Twitter,
                  href: "#",
                  color: "hover:bg-blue-100 hover:text-blue-400",
                },
                {
                  icon: Facebook,
                  href: "#",
                  color: "hover:bg-blue-100 hover:text-blue-600",
                },
                {
                  icon: Instagram,
                  href: "#",
                  color: "hover:bg-pink-100 hover:text-pink-600",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 bg-gray-100 rounded-lg text-gray-600 ${social.color} transition-all transform hover:scale-110`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Badge */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4 text-[#CCDE2F]" />
              <span>Trusted by 50K+ learners</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-[#0A5649] to-[#428746] text-white p-4 rounded-full shadow-lg hover:from-[#03261F] hover:to-[#0A5649] transition-all transform hover:scale-110 z-50"
        aria-label="Back to top"
      >
        <ChevronRight className="w-5 h-5 rotate-[-90deg]" />
      </button>
    </footer>
  );
}
