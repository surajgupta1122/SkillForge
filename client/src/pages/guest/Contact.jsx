import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Sparkles,
  MessageSquare,
  User,
  CheckCircle,
  AlertCircle,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  ChevronRight,
  HelpCircle,
  BookOpen,
  Users,
  Globe,
  Award,
} from "lucide-react";

export default function Contact() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate form submission
    setFormStatus({ submitted: true, success: false, message: "" });

    try {
      // Here you would typically make an API call to send the message
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setFormStatus({
        submitted: false,
        success: true,
        message: "Message sent successfully! We'll get back to you soon.",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      setFormStatus({
        submitted: false,
        success: false,
        message: "Failed to send message. Please try again.",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50" />

      {/* Hero Section */}
      <div className="relative pt-27 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#03261F] via-[#0A5649] to-[#428746] opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-6 pb-28 lg:pb-37">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Get in Touch</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              We'd Love to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#CCDE2F] to-[#0A5649]">
                Hear From You
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Have questions about our courses? Need help with your account?
              Our team is here to help you 24/7.
            </p>
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

      {/* Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: Mail,
              title: "Email Us",
              value: "support@skillforge.com",
              action: "Send a message",
              color: "from-blue-600 to-cyan-600",
            },
            {
              icon: Phone,
              title: "Call Us",
              value: "+91 ********67",
              action: "Mon-Fri, 9am-6pm",
              color: "from-purple-600 to-pink-600",
            },
            {
              icon: MapPin,
              title: "Visit Us",
              value: "-----------",
              action: "Get directions",
              color: "from-green-600 to-emerald-600",
            },
            {
              icon: Clock,
              title: "Response Time",
              value: "Within 24 hours",
              action: "Quick support",
              color: "from-orange-600 to-red-600",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              <div className={`p-3 bg-gradient-to-br ${item.color} rounded-xl w-fit mb-4`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{item.value}</p>
              <p className="text-[#0A5649] text-sm font-medium cursor-pointer hover:text-[#03261F] transition-colors">
                {item.action} <ChevronRight className="w-4 h-4 inline" />
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Contact Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Left Side - Contact Form */}
          <div className="space-y-15">
            {/* Heading */}
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Send Us a <span className="text-[#0A5649]">Message</span>
            </h2>
            <p className="text-gray-600 mb-8">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            {formStatus.success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-700">{formStatus.message}</p>
              </div>
            )}

            {formStatus.message && !formStatus.success && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700">{formStatus.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A5649] focus:border-transparent transition`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A5649] focus:border-transparent transition`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className={`w-full px-4 py-3 border ${
                    errors.subject ? "border-red-500" : "border-gray-300"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A5649] focus:border-transparent transition`}
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell us more about your inquiry..."
                  className={`w-full px-4 py-3 border ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A5649] focus:border-transparent transition resize-none`}
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={formStatus.submitted}
                className="w-full bg-gradient-to-r from-[#0A5649] to-[#428746] text-white py-4 rounded-xl font-semibold hover:from-[#03261F] hover:to-[#0A5649] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {formStatus.submitted ? (
                  <>Sending...</>
                ) : (
                  <>
                    Send Message <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Social Links */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Connect With Us
              </h3>
              <p className="text-gray-600 mb-6">
                Follow us on social media for updates and learning tips
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Linkedin, color: "hover:bg-blue-100 hover:text-blue-600" },
                  { icon: Twitter, color: "hover:bg-blue-100 hover:text-blue-400" },
                  { icon: Facebook, color: "hover:bg-blue-100 hover:text-blue-600" },
                  { icon: Instagram, color: "hover:bg-pink-100 hover:text-pink-600" },
                ].map((social, index) => (
                  <button
                    key={index}
                    className={`p-3 bg-gray-100 rounded-xl text-gray-600 ${social.color} transition-all transform hover:scale-110`}
                  >
                    <social.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - FAQ and Info */}
          <div className="space-y-8">
            {/* Quick Help */}
            <div className="bg-gradient-to-br from-[#03261F] via-[#0A5649] to-[#428746] rounded-3xl p-8 text-white">
              <HelpCircle className="w-12 h-12 mb-4 text-[#CCDE2F]" />
              <h3 className="text-2xl font-bold mb-2">Quick Help</h3>
              <p className="text-white/80 mb-6">
                Check out our FAQ section for instant answers to common questions.
              </p>
              <button
                onClick={() => navigate("/faq")}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all transform hover:scale-105 inline-flex items-center gap-2"
              >
                View FAQs <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Common Topics */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Common Topics
              </h3>
              <div className="space-y-4">
                {[
                  { icon: BookOpen, text: "Course Enrollment Issues" },
                  { icon: Users, text: "Account & Billing" },
                  { icon: Award, text: "Certificates & Grades" },
                  { icon: Globe, text: "Technical Support" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group"
                  >
                    <div className="p-2 bg-[#0A5649]/10 rounded-lg group-hover:bg-[#0A5649]/20 transition-colors">
                      <item.icon className="w-5 h-5 text-[#0A5649]" />
                    </div>
                    <span className="text-gray-700 group-hover:text-[#0A5649] transition-colors">
                      {item.text}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-[#0A5649] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
             
            {/* Office Hours */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Office Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium text-gray-800">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium text-gray-800">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-gray-800">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Find Us <span className="text-[#0A5649]">Here</span>
            </h2>
            <p className="text-gray-600">
              Visit our headquarters in the heart of San Francisco
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-96">
            <div className="w-full h-full bg-gradient-to-br from-[#03261F] via-[#0A5649] to-[#428746] flex items-center justify-center">
              <div className="text-center text-white">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-[#CCDE2F]" />
                <h3 className="text-2xl font-bold mb-2">SkillForge Headquarters</h3>
                <p className="text-white/80">
                  123 Learning Street<br />
                  San Francisco, CA 94105<br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support CTA */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-[#03261F] to-[#0A5649] rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Immediate Assistance?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Our support team is available 24/7 to help you with any urgent issues
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-[#CCDE2F] text-[#03261F] px-8 py-4 rounded-xl font-semibold hover:bg-[#CCDE2F]/90 transition-all transform hover:scale-105 flex items-center gap-2">
              Live Chat <MessageSquare className="w-5 h-5" />
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all transform hover:scale-105">
              Call Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}