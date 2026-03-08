import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Camera,
  Save,
  X,
  Edit2,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // Load user data
  useEffect(() => {
    setTimeout(() => {
      const userData = JSON.parse(localStorage.getItem("user")) || {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        role: "student",
        avatar: null,
      };

      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
      });
      setLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
    });
    setIsEditing(false);
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase() || "U";
  };

  const getRoleColor = (role) => {
    switch(role) {
      case "admin": return "bg-purple-100 text-purple-600";
      case "instructor": return "bg-blue-100 text-blue-600";
      default: return "bg-green-100 text-green-600";
    }
  };

  const getDashboardPath = () => {
    switch(user?.role) {
      case "admin": return "/admin";
      case "instructor": return "/instructor";
      default: return "/student";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0A5649] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#03261F] to-[#0A5649] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <button
            onClick={() => navigate(getDashboardPath())}
            className="text-white text-lg transition-colors text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Avatar & Role */}
            <div className="md:w-1/3 bg-gradient-to-b from-[#0A5649] to-[#03261F] p-8 text-white">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full bg-white border-4 border-white/30 mx-auto flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-[#0A5649]">
                        {getInitials(user?.name)}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-white text-[#0A5649] rounded-full hover:bg-gray-100 transition shadow-lg">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Name */}
                <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>

                {/* Role Badge */}
                <div className="flex justify-center">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getRoleColor(user?.role)}`}>
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </span>
                </div>

                {/* Member Since (Optional) */}
                <p className="text-white/60 text-sm mt-6">
                  Member since 2024
                </p>
              </div>
            </div>

            {/* Right Side - Edit & Information */}
            <div className="md:w-2/3 p-8">
              {/* Header with Edit Button */}
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800">Profile Information</h3>
                
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0A5649] text-white rounded-lg hover:bg-[#03261F] transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-[#0A5649] text-white rounded-lg hover:bg-[#03261F] transition"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                )}
              </div>

              {/* Information Form */}
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A5649]"
                        placeholder="Enter your name"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-800">{user?.name}</span>
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A5649]"
                        placeholder="Enter your email"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-800">{user?.email}</span>
                    </div>
                  )}
                </div>

                {/* Helper Text when Editing */}
                {isEditing && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">
                      ✏️ You are in edit mode. Click Save to update your information.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}