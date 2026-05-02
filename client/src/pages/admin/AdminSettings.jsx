import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import AdminSidebar from "../../components/AdminSidebar";
import {
  User,
  Mail,
  Lock,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Server,
  Database,
  Users,
  DollarSign,
  Smartphone,
  Save,
  CheckCircle,
  XCircle,
  LogOut,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
  Activity,
  Settings as SettingsIcon,
  Clock,
  FileText,
  MessageSquare,
  BarChart3,
  Download,
  RefreshCw,
  Plus,
  X,
  Edit2
} from "lucide-react";

export default function AdminSettings() {
  const navigate = useNavigate();

  // Active tab state
  const [activeTab, setActiveTab] = useState("general");

  // General settings
  const [general, setGeneral] = useState({
    siteName: "SkillForge",
    siteDescription: "Online Learning Platform",
    siteLogo: "",
    contactEmail: "admin@skillforge.com",
    supportEmail: "support@skillforge.com",
    timezone: "Asia/Kolkata",
    dateFormat: "MM/DD/YYYY"
  });

  // Admin profile
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "admin",
    avatar: "",
    phone: "",
    department: "Administration"
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    encryption: "tls",
    fromEmail: "",
    fromName: "SkillForge"
  });

  // Platform settings
  const [platform, setPlatform] = useState({
    allowRegistration: true,
    requireEmailVerification: true,
    requireAdminApproval: false,
    maintenanceMode: false,
    maxCoursePrice: 100000,
    minCoursePrice: 0,
    defaultUserRole: "student"
  });

  // Feature toggles
  const [features, setFeatures] = useState({
    enableChat: true,
    enableReviews: true,
    enableCertificates: true,
    enableAnalytics: true,
    enableBlog: false,
    enableForum: true
  });

  // Appearance
  const [appearance, setAppearance] = useState({
    theme: "light",
    primaryColor: "#4f46e5",
    sidebarCollapsed: false,
    compactView: false
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    adminAlerts: true,
    userRegistrations: true,
    courseApprovals: true,
    instructorApprovals: true,
    paymentAlerts: true,
    systemErrors: true,
    weeklyReport: true
  });

  // Backup settings
  const [backup, setBackup] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    backupTime: "02:00",
    backupRetention: 30
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordExpiry: 90,
    ipWhitelist: [],
    allowedOrigins: []
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ipInput, setIpInput] = useState("");
  const [originInput, setOriginInput] = useState("");

  // Toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // Fetch settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/settings");
      setGeneral(res.data.general);
      setProfile(res.data.profile);
      setEmailSettings(res.data.email);
      setPlatform(res.data.platform);
      setFeatures(res.data.features);
      setAppearance(res.data.appearance);
      setNotifications(res.data.notifications);
      setBackup(res.data.backup);
      setSecurity(res.data.security);
    } catch (err) {
      console.error(err);
      showToast("Failed to load settings", "error");
      // Mock data will keep the default values
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle general update
  const handleGeneralUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/admin/settings/general", general);
      showToast("General settings updated", "success");
    } catch (err) {
      showToast("Failed to update settings", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/admin/profile", profile);
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
      await api.put("/admin/change-password", {
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

  // Handle platform update
  const handlePlatformUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/admin/settings/platform", platform);
      showToast("Platform settings updated", "success");
    } catch (err) {
      showToast("Failed to update platform settings", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle feature update
  const handleFeatureUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/admin/settings/features", features);
      showToast("Feature settings updated", "success");
    } catch (err) {
      showToast("Failed to update feature settings", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle email update
  const handleEmailUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/admin/settings/email", emailSettings);
      showToast("Email settings updated", "success");
    } catch (err) {
      showToast("Failed to update email settings", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle appearance update
  const handleAppearanceUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/admin/settings/appearance", appearance);
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

  // Handle notification update
  const handleNotificationUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/admin/settings/notifications", notifications);
      showToast("Notification settings updated", "success");
    } catch (err) {
      showToast("Failed to update notification settings", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle backup update
  const handleBackupUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/admin/settings/backup", backup);
      showToast("Backup settings updated", "success");
    } catch (err) {
      showToast("Failed to update backup settings", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle security update
  const handleSecurityUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/admin/settings/security", security);
      showToast("Security settings updated", "success");
    } catch (err) {
      showToast("Failed to update security settings", "error");
    } finally {
      setSaving(false);
    }
  };

  // Add IP to whitelist
  const addIpAddress = () => {
    if (ipInput && !security.ipWhitelist.includes(ipInput)) {
      setSecurity({
        ...security,
        ipWhitelist: [...security.ipWhitelist, ipInput]
      });
      setIpInput("");
    }
  };

  // Remove IP from whitelist
  const removeIpAddress = (ip) => {
    setSecurity({
      ...security,
      ipWhitelist: security.ipWhitelist.filter(i => i !== ip)
    });
  };

  // Add origin to allowed list
  const addOrigin = () => {
    if (originInput && !security.allowedOrigins.includes(originInput)) {
      setSecurity({
        ...security,
        allowedOrigins: [...security.allowedOrigins, originInput]
      });
      setOriginInput("");
    }
  };

  // Remove origin
  const removeOrigin = (origin) => {
    setSecurity({
      ...security,
      allowedOrigins: security.allowedOrigins.filter(o => o !== origin)
    });
  };

  // Trigger manual backup
  const handleManualBackup = async () => {
    try {
      await api.post("/admin/backup");
      showToast("Backup initiated successfully", "success");
    } catch (err) {
      showToast("Failed to create backup", "error");
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "platform", label: "Platform", icon: Globe },
    { id: "features", label: "Features", icon: Activity },
    { id: "email", label: "Email", icon: Mail },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "backup", label: "Backup", icon: Database },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-1 pr-0">
      <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-3xl">
        <AdminSidebar />

        <main className="flex-1 overflow-y-auto custom-scroll">
          <div className="max-w-6xl mx-auto px-6 py-8 md:px-8 lg:px-10">
            
            {/* ==================== HEADER SECTION ==================== */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>System Configuration</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    Admin <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Settings</span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">Configure and manage your platform settings</p>
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
                {/* General Settings */}
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">General Settings</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Basic platform configuration</p>
                      </div>
                      <button
                        onClick={handleGeneralUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-green-400 to-emerald-500 hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-600 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Site Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={general.siteName}
                          onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Site Description
                        </label>
                        <input
                          type="text"
                          value={general.siteDescription}
                          onChange={(e) => setGeneral({ ...general, siteDescription: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            value={general.contactEmail}
                            onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Support Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            value={general.supportEmail}
                            onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Timezone
                        </label>
                        <select
                          value={general.timezone}
                          onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        >
                          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                          <option value="America/New_York">America/New_York (EST)</option>
                          <option value="Europe/London">Europe/London (GMT)</option>
                          <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date Format
                        </label>
                        <select
                          value={general.dateFormat}
                          onChange={(e) => setGeneral({ ...general, dateFormat: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Profile Settings */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">Admin Profile</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Update your personal information</p>
                      </div>
                      <button
                        onClick={handleProfileUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-green-400 to-emerald-500 hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-600 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                    <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold">
                          {profile.name?.charAt(0) || "A"}
                        </div>
                        <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition">
                          <Camera className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Profile Photo</p>
                        <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
                        <button className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium">
                          Upload new photo
                        </button>
                      </div>
                    </div>

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
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
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
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
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
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          value={profile.department}
                          onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        />
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
                        <p className="text-xs text-gray-400 mt-0.5">Update your admin password</p>
                      </div>
                      <button
                        onClick={handlePasswordChange}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
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
                            className="w-full pl-9 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
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
                            className="w-full pl-9 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
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
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Platform Settings */}
                {activeTab === "platform" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">Platform Settings</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Configure platform-wide rules</p>
                      </div>
                      <button
                        onClick={handlePlatformUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-800">Allow Registration</p>
                          <p className="text-xs text-gray-500">Allow new users to register on the platform</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={platform.allowRegistration}
                            onChange={(e) => setPlatform({ ...platform, allowRegistration: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-all duration-200"></div>
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-800">Require Email Verification</p>
                          <p className="text-xs text-gray-500">Users must verify their email before accessing the platform</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={platform.requireEmailVerification}
                            onChange={(e) => setPlatform({ ...platform, requireEmailVerification: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-all duration-200"></div>
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-800">Require Admin Approval</p>
                          <p className="text-xs text-gray-500">Admin must approve instructor applications</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={platform.requireAdminApproval}
                            onChange={(e) => setPlatform({ ...platform, requireAdminApproval: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 transition-all duration-200"></div>
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-800">Maintenance Mode</p>
                          <p className="text-xs text-gray-500">Put the platform in maintenance mode</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={platform.maintenanceMode}
                            onChange={(e) => setPlatform({ ...platform, maintenanceMode: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-red-600 transition-all duration-200"></div>
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5"></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Min Course Price (₹)
                          </label>
                          <input
                            type="number"
                            value={platform.minCoursePrice}
                            onChange={(e) => setPlatform({ ...platform, minCoursePrice: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Course Price (₹)
                          </label>
                          <input
                            type="number"
                            value={platform.maxCoursePrice}
                            onChange={(e) => setPlatform({ ...platform, maxCoursePrice: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Default User Role
                        </label>
                        <select
                          value={platform.defaultUserRole}
                          onChange={(e) => setPlatform({ ...platform, defaultUserRole: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        >
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Settings */}
                {activeTab === "features" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">Feature Toggles</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Enable or disable platform features</p>
                      </div>
                      <button
                        onClick={handleFeatureUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {[
                        { key: "enableChat", label: "Live Chat", desc: "Enable real-time chat between students and instructors" },
                        { key: "enableReviews", label: "Course Reviews", desc: "Allow students to leave reviews and ratings" },
                        { key: "enableCertificates", label: "Certificates", desc: "Generate certificates upon course completion" },
                        { key: "enableAnalytics", label: "Analytics Dashboard", desc: "Show analytics and reports to users" },
                        { key: "enableBlog", label: "Blog", desc: "Enable blog section on the platform" },
                        { key: "enableForum", label: "Discussion Forum", desc: "Enable community discussion forums" }
                      ].map((feature) => (
                        <div key={feature.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-800">{feature.label}</p>
                            <p className="text-xs text-gray-500">{feature.desc}</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={features[feature.key]}
                              onChange={(e) => setFeatures({ ...features, [feature.key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-all duration-200"></div>
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Email Settings */}
                {activeTab === "email" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">Email Configuration</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Configure SMTP settings for sending emails</p>
                      </div>
                      <button
                        onClick={handleEmailUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SMTP Host
                        </label>
                        <input
                          type="text"
                          value={emailSettings.smtpHost}
                          onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                          placeholder="smtp.gmail.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SMTP Port
                        </label>
                        <input
                          type="text"
                          value={emailSettings.smtpPort}
                          onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SMTP Username
                        </label>
                        <input
                          type="text"
                          value={emailSettings.smtpUser}
                          onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SMTP Password
                        </label>
                        <input
                          type="password"
                          value={emailSettings.smtpPassword}
                          onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Encryption
                        </label>
                        <select
                          value={emailSettings.encryption}
                          onChange={(e) => setEmailSettings({ ...emailSettings, encryption: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        >
                          <option value="tls">TLS</option>
                          <option value="ssl">SSL</option>
                          <option value="none">None</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          From Email
                        </label>
                        <input
                          type="email"
                          value={emailSettings.fromEmail}
                          onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          From Name
                        </label>
                        <input
                          type="text"
                          value={emailSettings.fromName}
                          onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        />
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
                        <p className="text-xs text-gray-400 mt-0.5">Customize the platform look and feel</p>
                      </div>
                      <button
                        onClick={handleAppearanceUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
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
                                  ? "border-green-500 bg-green-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <theme.icon className={`w-5 h-5 ${appearance.theme === theme.value ? "text-green-600" : "text-gray-500"}`} />
                              <span className={appearance.theme === theme.value ? "text-green-600 font-medium" : "text-gray-600"}>{theme.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={appearance.primaryColor}
                            onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })}
                            className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={appearance.primaryColor}
                            onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-800">Compact View</p>
                          <p className="text-xs text-gray-500">Reduce spacing and padding for more content</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={appearance.compactView}
                            onChange={(e) => setAppearance({ ...appearance, compactView: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-all duration-200"></div>
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">Admin Notifications</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Configure what notifications you receive</p>
                      </div>
                      <button
                        onClick={handleNotificationUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {[
                        { key: "adminAlerts", label: "Admin Alerts", desc: "Important system alerts and updates" },
                        { key: "userRegistrations", label: "User Registrations", desc: "When new users register" },
                        { key: "courseApprovals", label: "Course Approvals", desc: "When courses need approval" },
                        { key: "instructorApprovals", label: "Instructor Approvals", desc: "When instructors apply for approval" },
                        { key: "paymentAlerts", label: "Payment Alerts", desc: "Payment successful/failed notifications" },
                        { key: "systemErrors", label: "System Errors", desc: "System error notifications" },
                        { key: "weeklyReport", label: "Weekly Report", desc: "Weekly platform performance report" }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-800">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={notifications[item.key]}
                              onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-all duration-200"></div>
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">Security Settings</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Configure platform security options</p>
                      </div>
                      <button
                        onClick={handleSecurityUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                          <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={security.twoFactorAuth}
                            onChange={(e) => setSecurity({ ...security, twoFactorAuth: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-all duration-200"></div>
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5"></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Session Timeout (minutes)
                          </label>
                          <input
                            type="number"
                            value={security.sessionTimeout}
                            onChange={(e) => setSecurity({ ...security, sessionTimeout: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Login Attempts
                          </label>
                          <input
                            type="number"
                            value={security.maxLoginAttempts}
                            onChange={(e) => setSecurity({ ...security, maxLoginAttempts: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password Expiry (days)
                          </label>
                          <input
                            type="number"
                            value={security.passwordExpiry}
                            onChange={(e) => setSecurity({ ...security, passwordExpiry: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                          />
                        </div>
                      </div>

                      {/* IP Whitelist */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          IP Whitelist
                        </label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={ipInput}
                            onChange={(e) => setIpInput(e.target.value)}
                            placeholder="Enter IP address"
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                          />
                          <button
                            onClick={addIpAddress}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {security.ipWhitelist.map((ip) => (
                            <span key={ip} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg">
                              {ip}
                              <button onClick={() => removeIpAddress(ip)} className="hover:text-red-500">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Allowed Origins */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Allowed Origins (CORS)
                        </label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={originInput}
                            onChange={(e) => setOriginInput(e.target.value)}
                            placeholder="Enter URL"
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                          />
                          <button
                            onClick={addOrigin}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {security.allowedOrigins.map((origin) => (
                            <span key={origin} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg">
                              {origin}
                              <button onClick={() => removeOrigin(origin)} className="hover:text-red-500">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Backup Settings */}
                {activeTab === "backup" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">Backup Settings</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Configure automatic backups</p>
                      </div>
                      <button
                        onClick={handleManualBackup}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Manual Backup
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-800">Auto Backup</p>
                          <p className="text-xs text-gray-500">Automatically backup the database</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={backup.autoBackup}
                            onChange={(e) => setBackup({ ...backup, autoBackup: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-all duration-200"></div>
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5"></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Backup Frequency
                          </label>
                          <select
                            value={backup.backupFrequency}
                            onChange={(e) => setBackup({ ...backup, backupFrequency: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Backup Time
                          </label>
                          <input
                            type="time"
                            value={backup.backupTime}
                            onChange={(e) => setBackup({ ...backup, backupTime: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Retention Period (days)
                          </label>
                          <input
                            type="number"
                            value={backup.backupRetention}
                            onChange={(e) => setBackup({ ...backup, backupRetention: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                      <div>
                        <p className="font-medium text-green-800">Recent Backups</p>
                        <p className="text-xs text-green-600">Last backup: Today at 2:00 AM</p>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
                        <Download className="w-4 h-4" />
                        Download Latest
                      </button>
                    </div>
                  </div>
                )}

                {/* Danger Zone */}
                {activeTab === "danger" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Irreversible system actions</p>
                    </div>

                    <div className="border border-red-200 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between p-4 bg-red-50 border-b border-red-100">
                        <div>
                          <p className="font-medium text-gray-800">Clear System Cache</p>
                          <p className="text-xs text-gray-500">Clear all cached data from the system</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition">
                          <RefreshCw className="w-4 h-4" />
                          Clear Cache
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-red-50 border-b border-red-100">
                        <div>
                          <p className="font-medium text-gray-800">Reset Platform</p>
                          <p className="text-xs text-gray-500">Reset all platform settings to default</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition">
                          <SettingsIcon className="w-4 h-4" />
                          Reset Settings
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-red-50">
                        <div>
                          <p className="font-medium text-red-600">Delete All Data</p>
                          <p className="text-xs text-gray-500">Permanently delete all platform data</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                          Delete All
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