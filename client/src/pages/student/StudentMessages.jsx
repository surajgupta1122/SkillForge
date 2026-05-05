import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import StudentSidebar from "../../components/StudentSidebar";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  ChevronLeft,
  CheckCheck,
  X,
  Plus,
  Users,
  Pin,
  Archive,
  Trash2,
  Star,
  Bell,
  Image,
  Mic,
  File,
  AtSign,
  Gift,
  Menu,
  Filter,
  GraduationCap,
  UserCheck,
  Shield,
  CheckCircle,
} from "lucide-react";

export default function StudentMessages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchUsers, setSearchUsers] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filterRole, setFilterRole] = useState("all");
  const messagesEndRef = useRef(null);

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/messages/conversations");
      setConversations(res.data);
    } catch (err) {
      console.error(err);
      // Mock data for demo
      setConversations([
        { 
          id: 1, 
          name: "Dr. Emily Clarke", 
          role: "instructor", 
          avatar: "E", 
          lastMessage: "Great job on your assignment!", 
          time: "2 min ago", 
          unread: 2, 
          online: true,
          course: "React Mastery"
        },
        { 
          id: 2, 
          name: "Prof. James Wilson", 
          role: "instructor", 
          avatar: "J", 
          lastMessage: "Don't forget about the quiz tomorrow", 
          time: "1 hour ago", 
          unread: 0, 
          online: false,
          course: "Node.js Advanced"
        },
        { 
          id: 3, 
          name: "Sarah Johnson", 
          role: "student", 
          avatar: "S", 
          lastMessage: "Hey! Want to study together?", 
          time: "3 hours ago", 
          unread: 1, 
          online: true,
          course: "React Mastery"
        },
        { 
          id: 4, 
          name: "Michael Chen", 
          role: "student", 
          avatar: "M", 
          lastMessage: "Thanks for your help yesterday!", 
          time: "1 day ago", 
          unread: 0, 
          online: false,
          course: "UI/UX Design"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected chat
  const fetchMessages = async (conversationId) => {
    try {
      const res = await api.get(`/student/messages/${conversationId}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      // Mock messages based on selected chat
      if (selectedChat?.name === "Dr. Emily Clarke") {
        setMessages([
          { id: 1, sender: "Dr. Emily Clarke", senderRole: "instructor", message: "Hello! How are you doing with the React course?", time: "10:30 AM", status: "read", isMine: false },
          { id: 2, sender: "You", senderRole: "student", message: "I'm doing great! Just finished the Hooks module.", time: "10:32 AM", status: "read", isMine: true },
          { id: 3, sender: "Dr. Emily Clarke", senderRole: "instructor", message: "Excellent! Have you tried building a project yet?", time: "10:33 AM", status: "read", isMine: false },
          { id: 4, sender: "You", senderRole: "student", message: "Yes, I built a todo app with custom hooks!", time: "10:35 AM", status: "read", isMine: true },
          { id: 5, sender: "Dr. Emily Clarke", senderRole: "instructor", message: "That's awesome! Keep up the great work 💪", time: "10:36 AM", status: "read", isMine: false },
        ]);
      } else if (selectedChat?.name === "Sarah Johnson") {
        setMessages([
          { id: 1, sender: "Sarah Johnson", senderRole: "student", message: "Hey! Want to study together for the React exam?", time: "9:00 AM", status: "read", isMine: false },
          { id: 2, sender: "You", senderRole: "student", message: "Sure! That sounds great. When do you want to meet?", time: "9:05 AM", status: "read", isMine: true },
          { id: 3, sender: "Sarah Johnson", senderRole: "student", message: "How about tomorrow at 3 PM?", time: "9:10 AM", status: "read", isMine: false },
          { id: 4, sender: "You", senderRole: "student", message: "Perfect! See you then 👋", time: "9:12 AM", status: "read", isMine: true },
        ]);
      } else {
        setMessages([
          { id: 1, sender: selectedChat?.name, senderRole: selectedChat?.role, message: "Hello! How can I help you?", time: "Yesterday", status: "read", isMine: false },
        ]);
      }
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
      // Mark as read
      if (selectedChat.unread > 0) {
        setConversations(prev => prev.map(c => 
          c.id === selectedChat.id ? { ...c, unread: 0 } : c
        ));
      }
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setSending(true);
    const tempMessage = {
      id: Date.now(),
      sender: "You",
      senderRole: "student",
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent",
      isMine: true
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage("");
    
    try {
      await api.post(`/student/messages/${selectedChat.id}/send`, { message: newMessage });
      setMessages(prev => prev.map(m => 
        m.id === tempMessage.id ? { ...m, status: "delivered" } : m
      ));
    } catch (err) {
      console.error(err);
      showToast("Failed to send message", "error");
    } finally {
      setSending(false);
    }
  };

  const handleSearchUsers = async () => {
    if (searchUsers.length < 2) return;
    try {
      const res = await api.get(`/student/messages/search?q=${searchUsers}&role=${filterRole}`);
      setFilteredUsers(res.data);
    } catch (err) {
      // Mock users
      const mockUsers = [];
      if (filterRole === "all" || filterRole === "instructor") {
        mockUsers.push(
          { id: 5, name: "Prof. David Miller", role: "instructor", avatar: "D", email: "david@example.com", course: "Advanced React" },
          { id: 6, name: "Dr. Sarah Lee", role: "instructor", avatar: "S", email: "sarah@example.com", course: "Machine Learning" }
        );
      }
      if (filterRole === "all" || filterRole === "student") {
        mockUsers.push(
          { id: 7, name: "Lisa Park", role: "student", avatar: "L", email: "lisa@example.com" },
          { id: 8, name: "Alex Kumar", role: "student", avatar: "A", email: "alex@example.com" }
        );
      }
      setFilteredUsers(mockUsers);
    }
  };

  const startNewChat = async (user) => {
    try {
      await api.post("/student/messages/start", {
        receiver_id: user.id,
        receiver_role: user.role
      });
      setShowNewChat(false);
      fetchConversations();
      showToast(`Started conversation with ${user.name}`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to start conversation", "error");
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.course && c.course.toLowerCase().includes(search.toLowerCase()))
  );

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread || 0), 0);
  const instructorCount = conversations.filter(c => c.role === "instructor").length;
  const studentCount = conversations.filter(c => c.role === "student").length;

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "instructor": return "bg-orange-100 text-orange-700";
      case "student": return "bg-blue-100 text-blue-700";
      case "admin": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "instructor": return <GraduationCap className="w-3 h-3" />;
      case "student": return <UserCheck className="w-3 h-3" />;
      case "admin": return <Shield className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-1 pr-0">
      <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-3xl">
        <StudentSidebar />

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        <main className="flex-1 flex overflow-hidden">
          {/* Conversations Sidebar */}
          <div className={`
            w-80 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300
            ${isMobileMenuOpen ? 'fixed left-0 top-0 h-full z-50 shadow-xl' : 'hidden md:flex'}
          `}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-blue-50">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                  {totalUnread > 0 && (
                    <span className="text-xs text-red-500">{totalUnread} unread</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowNewChat(true)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition md:hidden"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Stats Row */}
              <div className="flex gap-2 mb-3">
                <div className="flex-1 bg-white rounded-lg px-2 py-1 text-center">
                  <p className="text-xs text-gray-500">Instructors</p>
                  <p className="font-bold text-orange-600">{instructorCount}</p>
                </div>
                <div className="flex-1 bg-white rounded-lg px-2 py-1 text-center">
                  <p className="text-xs text-gray-500">Students</p>
                  <p className="font-bold text-blue-600">{studentCount}</p>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or course..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No conversations yet</p>
                  <button
                    onClick={() => setShowNewChat(true)}
                    className="mt-3 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full"
                  >
                    Start a new chat
                  </button>
                </div>
              ) : (
                filteredConversations.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => handleSelectChat(chat)}
                    className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                      selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center text-white text-lg font-bold">
                          {chat.avatar}
                        </div>
                        {chat.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-semibold text-gray-800 truncate">{chat.name}</p>
                          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{chat.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full capitalize ${getRoleBadgeColor(chat.role)}`}>
                            {getRoleIcon(chat.role)}
                            {chat.role}
                          </span>
                          {chat.course && (
                            <span className="text-xs text-gray-400">{chat.course}</span>
                          )}
                          {chat.unread > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          {selectedChat ? (
            <div className="flex-1 flex flex-col bg-gray-50">
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 bg-gray-100 rounded-full md:hidden"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center text-white font-bold">
                      {selectedChat.avatar}
                    </div>
                    {selectedChat.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{selectedChat.name}</p>
                    <p className="text-xs text-gray-500">
                      {selectedChat.online ? 'Online' : 'Offline'} • 
                      <span className="capitalize ml-1">{selectedChat.role}</span>
                      {selectedChat.course && ` • ${selectedChat.course}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition">
                    <Phone className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition">
                    <Video className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Date Divider */}
                <div className="flex justify-center">
                  <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Today</span>
                </div>
                
                {messages.map((msg, idx) => (
                  <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[70%]">
                      {!msg.isMine && (
                        <div className="flex items-center gap-1 mb-1 ml-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full capitalize ${getRoleBadgeColor(msg.senderRole)}`}>
                            {msg.senderRole === "instructor" ? "👨‍🏫" : msg.senderRole === "student" ? "👨‍🎓" : "👑"} {msg.sender}
                          </span>
                        </div>
                      )}
                      <div className={`rounded-2xl px-4 py-2 ${
                        msg.isMine 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                      }`}>
                        <p className="text-sm break-words">{msg.message}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                        <span>{msg.time}</span>
                        {msg.isMine && msg.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                        {msg.isMine && msg.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                        {msg.isMine && msg.status === 'sent' && <CheckCircle className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    </div>
                  </div>
                </div>
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0">
                    <Paperclip className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0">
                    <Image className="w-5 h-5 text-gray-500" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                  <button className="p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0">
                    <Smile className="w-5 h-5 text-gray-500" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition flex-shrink-0 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // No Chat Selected
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Select a conversation</h3>
                <p className="text-sm text-gray-500">Choose a chat from the sidebar to start messaging</p>
                <button
                  onClick={() => setShowNewChat(true)}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
                >
                  <Plus className="w-4 h-4" />
                  Start New Chat
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-slideIn">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-bold text-gray-800">New Conversation</h3>
              <button 
                onClick={() => setShowNewChat(false)} 
                className="p-1 hover:bg-gray-200 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              {/* Role Filter */}
              <div className="flex gap-2 mb-4">
                {["all", "instructor", "student"].map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      setFilterRole(role);
                      handleSearchUsers();
                    }}
                    className={`flex-1 px-3 py-1.5 text-sm rounded-lg capitalize transition ${
                      filterRole === role 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchUsers}
                  onChange={(e) => {
                    setSearchUsers(e.target.value);
                    handleSearchUsers();
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
                />
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    onClick={() => startNewChat(user)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {user.avatar || user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        {user.course && (
                          <span className="text-xs text-gray-400">• {user.course}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && searchUsers.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No users found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
          <div className={`bg-gray-900/95 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 flex items-center gap-3 ${
            toast.type === "success" ? "border-green-500" : "border-red-500"
          }`}>
            <div className={toast.type === "success" ? "text-green-400" : "text-red-400"}>
              {toast.type === "success" ? "✓" : "✗"}
            </div>
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
        </div>
      )}

      <style>{`
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
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }
        .animate-bounce {
          animation: bounce 1.4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}