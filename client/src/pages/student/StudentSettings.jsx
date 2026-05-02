import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import StudentSidebar from "../../components/StudentSidebar";
import {
  User,
  Mail,
  Lock,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Smartphone,
  Save,
  CheckCircle,
  XCircle,
  LogOut,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
  BookOpen,
  Settings as SettingsIcon,
  Clock,
  MessageSquare,
  Languages,
  Camera,
  Plus,
  Award
} from "lucide-react";

export default function StudentSettings() {
  const navigate = useNavigate();

  // Active tab state
  const [activeTab, setActiveTab] = useState("profile");

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    phone: "",
    location: "",
    education: "",
    interests: [],
    avatar: ""
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    courseReminders: true,
    newCourseAlerts: true,
    achievementAlerts: true,
    weeklyDigest: false,
    marketingEmails: false
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showProgress: true,
    allowMessages: true,
    showInLeaderboard: true
  });

  // Learning preferences
  const [preferences, setPreferences] = useState({
    defaultLanguage: "english",
    videoQuality: "auto",
    autoPlay: true,
    subtitles: true,
    darkMode: false,
    compactView: false
  });

  // Appearance
  const [appearance, setAppearance] = useState({
    theme: "light",
    fontSize: "medium",
    sidebarCollapsed: false
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // Fetch student profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/profile");
      setProfile(res.data.profile);
      setNotifications(res.data.notifications);
      setPrivacy(res.data.privacy);
      setPreferences(res.data.preferences);
      setAppearance(res.data.appearance);
    } catch (err) {
      console.error(err);
      showToast("Failed to load profile", "error");
      // Mock data for demo
      setProfile({
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        bio: "Passionate learner interested in web development and AI. Always eager to learn new technologies and build amazing projects.",
        phone: "+91 98765 43210",
        location: "Mumbai, India",
        education: "B.Tech Computer Science",
        interests: ["Web Development", "AI/ML", "Cloud Computing"],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/student/profile", profile);
      showToast("Profile updated successfully", "success");
    } catch (err) {
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    setSaving(true);
    try {
      await api.put("/student/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      showToast("Password changed successfully", "success");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      showToast("Failed to change password", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle notification update
  const handleNotificationUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/student/settings/notifications", notifications);
      showToast("Notification settings updated", "success");
    } catch (err) {
      showToast("Failed to update notification settings", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle privacy update
  const handlePrivacyUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/student/settings/privacy", privacy);
      showToast("Privacy settings updated", "success");
    } catch (err) {
      showToast("Failed to update privacy settings", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle preferences update
  const handlePreferencesUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/student/settings/preferences", preferences);
      showToast("Learning preferences updated", "success");
    } catch (err) {
      showToast("Failed to update preferences", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle appearance update
  const handleAppearanceUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/student/settings/appearance", appearance);
      showToast("Appearance settings updated", "success");
      if (appearance.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (err) {
      showToast("Failed to update appearance", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      showToast("Please type DELETE to confirm", "error");
      return;
    }
    try {
      await api.delete("/student/account");
      localStorage.clear();
      navigate("/login");
      showToast("Account deleted successfully", "success");
    } catch (err) {
      showToast("Failed to delete account", "error");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: SettingsIcon },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-1 pr-0">
        <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-3xl">
          <StudentSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent"></div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-1 pr-0">
      <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-3xl">
        <StudentSidebar />

        <main className="flex-1 overflow-y-auto custom-scroll">
          <div className="max-w-6xl mx-auto px-6 py-8 md:px-8 lg:px-10">
            
            {/* ==================== HEADER SECTION ==================== */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>Account Settings</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    Student <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Settings</span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">Manage your account preferences</p>
                </div>
              </div>
            </div>

            {/* ==================== SETTINGS TABS ==================== */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-100 overflow-x-auto">
                <div className="flex px-4 gap-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                          activeTab === tab.id
                            ? "text-blue-600 border-blue-600"
                            : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Profile Settings */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">Profile Information</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Update your personal information</p>
                      </div>
                      <button
                        onClick={handleProfileUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                    {/* Avatar Upload */}
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
                          {profile.name?.charAt(0) || "S"}
                        </div>
                        <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition">
                          <Camera className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Profile Photo</p>
                        <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
                        <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Upload new photo
                        </button>
                      </div>
                    </div>

                    {/* Profile Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={profile.location}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Education
                        </label>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={profile.education}
                            onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                            placeholder="e.g., B.Tech Computer Science"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          rows={4}
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Interests / Learning Goals
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {profile.interests?.map((interest, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full flex items-center gap-1">
                              {interest}
                              <button 
                                onClick={() => setProfile({ ...profile, interests: profile.interests.filter((_, i) => i !== idx) })} 
                                className="hover:text-red-500"
                              >
                                <XCircle className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          <button className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition flex items-center gap-1">
                            <Plus className="w-3 h-3" />
                            Add Interest
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Password Settings */}
                {activeTab === "password" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">Change Password</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Update your password to keep your account secure</p>
                      </div>
                      <button
                        onClick={handlePasswordChange}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Updating..." : "Update Password"}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full pl-9 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                          />
                          <button
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full pl-9 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                          />
                          <button
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl">
                      <p className="text-sm text-blue-800">Password Requirements:</p>
                      <ul className="text-xs text-blue-600 mt-2 space-y-1">
                        <li>• Minimum 6 characters</li>
                        <li>• At least one uppercase letter</li>
                        <li>• At least one number</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">Notification Preferences</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Choose what notifications you want to receive</p>
                      </div>
                      <button
                        onClick={handleNotificationUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {[
                        { key: "emailNotifications", label: "Email Notifications", icon: Mail, desc: "Receive email notifications about your account" },
                        { key: "pushNotifications", label: "Push Notifications", icon: Bell, desc: "Get push notifications in your browser" },
                        { key: "courseReminders", label: "Course Reminders", icon: Clock, desc: "Reminders about upcoming lessons and deadlines" },
                        { key: "newCourseAlerts", label: "New Course Alerts", icon: BookOpen, desc: "Get notified when new courses are available" },
                        { key: "achievementAlerts", label: "Achievement Alerts", icon: Award, desc: "When you earn badges or complete courses" },
                        { key: "weeklyDigest", label: "Weekly Digest", icon: MessageSquare, desc: "Weekly summary of your learning activity" },
                        { key: "marketingEmails", label: "Marketing Emails", icon: Mail, desc: "Receive promotional emails and updates" }
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{item.label}</p>
                              <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={notifications[item.key]}
                              onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-all duration-200"></div>
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5"></div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learning Preferences */}
                {activeTab === "preferences" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">Learning Preferences</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Customize your learning experience</p>
                      </div>
                      <button
                        onClick={handlePreferencesUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Default Language
                        </label>
                        <div className="relative">
                          <Languages className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            value={preferences.defaultLanguage}
                            onChange={(e) => setPreferences({ ...preferences, defaultLanguage: e.target.value })}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                          >
                            <option value="english">English</option>
                            <option value="hindi">Hindi</option>
                            <option value="spanish">Spanish</option>
                            <option value="french">French</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Video Quality
                        </label>
                        <select
                          value={preferences.videoQuality}
                          onChange={(e) => setPreferences({ ...preferences, videoQuality: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        >
                          <option value="auto">Auto</option>
                          <option value="1080p">1080p (High)</option>
                          <option value="720p">720p (Medium)</option>
                          <option value="480p">480p (Low)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-800">Auto-play Videos</p>
                          <p className="text-xs text-gray-500">Automatically play next video in course</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={preferences.autoPlay}
                            onChange={(e) => setPreferences({ ...preferences, autoPlay: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-all duration-200"></div>
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-800">Enable Subtitles</p>
                          <p className="text-xs text-gray-500">Show subtitles/captions by default</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={preferences.subtitles}
                            onChange={(e) => setPreferences({ ...preferences, subtitles: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-all duration-200"></div>
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeTab === "privacy" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">Privacy & Security</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Control who can see your information</p>
                      </div>
                      <button
                        onClick={handlePrivacyUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profile Visibility
                        </label>
                        <div className="space-y-2">
                          {[
                            { value: "public", label: "Public", desc: "Anyone can view your profile" },
                            { value: "students", label: "Students Only", desc: "Only fellow students can view your profile" },
                            { value: "private", label: "Private", desc: "Only you can view your profile" }
                          ].map((option) => (
                            <label key={option.value} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                              <input
                                type="radio"
                                name="profileVisibility"
                                value={option.value}
                                checked={privacy.profileVisibility === option.value}
                                onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                              />
                              <div>
                                <p className="font-medium text-gray-800">{option.label}</p>
                                <p className="text-xs text-gray-500">{option.desc}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-800">Show Email on Profile</p>
                          <p className="text-xs text-gray-500">Display your email address on your public profile</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={privacy.showEmail}
                            onChange={(e) => setPrivacy({ ...privacy, showEmail: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-all duration-200"></div>
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-800">Show Learning Progress</p>
                          <p className="text-xs text-gray-500">Display your course progress on your profile</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={privacy.showProgress}
                            onChange={(e) => setPrivacy({ ...privacy, showProgress: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-all duration-200"></div>
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-800">Allow Messages</p>
                          <p className="text-xs text-gray-500">Let other users send you direct messages</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={privacy.allowMessages}
                            onChange={(e) => setPrivacy({ ...privacy, allowMessages: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-all duration-200"></div>
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeTab === "appearance" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">Appearance</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Customize how the dashboard looks</p>
                      </div>
                      <button
                        onClick={handleAppearanceUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Theme
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { value: "light", label: "Light", icon: Sun },
                            { value: "dark", label: "Dark", icon: Moon },
                            { value: "system", label: "System", icon: Smartphone }
                          ].map((theme) => (
                            <button
                              key={theme.value}
                              onClick={() => setAppearance({ ...appearance, theme: theme.value })}
                              className={`flex items-center justify-center gap-2 p-3 border-2 rounded-xl transition-all duration-200 ${
                                appearance.theme === theme.value
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <theme.icon className={`w-5 h-5 ${appearance.theme === theme.value ? "text-blue-600" : "text-gray-500"}`} />
                              <span className={appearance.theme === theme.value ? "text-blue-600 font-medium" : "text-gray-600"}>{theme.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Font Size
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { value: "small", label: "Small" },
                            { value: "medium", label: "Medium" },
                            { value: "large", label: "Large" }
                          ].map((size) => (
                            <button
                              key={size.value}
                              onClick={() => setAppearance({ ...appearance, fontSize: size.value })}
                              className={`p-3 border-2 rounded-xl transition-all duration-200 ${
                                appearance.fontSize === size.value
                                  ? "border-blue-500 bg-blue-50 text-blue-600 font-medium"
                                  : "border-gray-200 hover:border-gray-300 text-gray-600"
                              }`}
                            >
                              {size.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Danger Zone */}
                {activeTab === "danger" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Irreversible account actions</p>
                    </div>

                    <div className="border border-red-200 rounded-xl overflow-hidden">
                      {/* Logout Button */}
                      <div className="flex items-center justify-between p-4 bg-red-50 border-b border-red-100">
                        <div>
                          <p className="font-medium text-gray-800">Logout from Account</p>
                          <p className="text-xs text-gray-500">Sign out from your current session</p>
                        </div>
                        <button
                          onClick={() => {
                            localStorage.clear();
                            navigate("/login");
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>

                      {/* Delete Account */}
                      <div className="flex items-center justify-between p-4 bg-red-50">
                        <div>
                          <p className="font-medium text-red-600">Delete Account</p>
                          <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
                        </div>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 animate-slideIn text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Account?</h2>
            <p className="text-gray-500 text-sm mb-4">
              This action cannot be undone. All your course progress and data will be permanently deleted.
            </p>
            <div className="bg-yellow-50 p-3 rounded-lg mb-4">
              <p className="text-xs text-yellow-800">
                Type <span className="font-bold">DELETE</span> to confirm
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="mt-2 w-full px-3 py-1.5 border border-yellow-300 rounded-lg focus:outline-none focus:border-red-400 text-sm text-center"
                placeholder="DELETE"
              />
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition shadow-sm hover:shadow"
              >
                Delete Account
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
              ? "bg-gray-900/95 border-green-500" 
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
      `}</style>
    </div>
  );
}