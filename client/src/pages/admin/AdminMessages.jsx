import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import { initializeSocket, getSocket, disconnectSocket } from "../../service/socket";
import AdminSidebar from "../../components/AdminSidebar";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  CheckCheck,
  X,
  Plus,
  Menu,
  GraduationCap,
  MessageSquare,
  Image as ImageIcon,   // ✅ alias to avoid conflict with DOM Image
} from "lucide-react";

export default function AdminMessages() {
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
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [socket, setSocket] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // ---------- API calls ----------
  const fetchConversations = async () => {
    try {
      const res = await api.get("/messages/conversations");
      // Admin only shows conversations with instructors (backend may already filter)
      setConversations(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load conversations", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const res = await api.get(`/messages/conversation/${conversationId}`);
      setMessages(res.data);
      scrollToBottom();
    } catch (err) {
      console.error(err);
      showToast("Failed to load messages", "error");
    }
  };

  const handleSearchUsers = async () => {
    if (searchUsers.length < 2) return;
    try {
      // Admin only searches for instructors (role=instructor)
      const res = await api.get(`/messages/search?q=${searchUsers}&role=instructor`);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error(err);
      showToast("Search failed", "error");
    }
  };

  const startNewChat = async (user) => {
    try {
      await api.post("/messages/start", {
        receiver_id: user.id,
        receiver_role: user.role,
      });
      setShowNewChat(false);
      fetchConversations();
      showToast(`Started conversation with ${user.name}`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to start conversation", "error");
    }
  };

  // ---------- Socket events ----------
  useEffect(() => {
    if (!currentUser) return;
    fetchConversations();

    const newSocket = initializeSocket(currentUser.id, currentUser.role);
    setSocket(newSocket);

    newSocket.on("new_message", (data) => {
      if (selectedChat && data.conversationId === selectedChat.id) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.id,
            sender_id: data.senderId,
            sender_role: data.senderRole,
            message: data.message,
            created_at: data.time,
            isMine: data.senderId === currentUser.id,
            status: "delivered",
          },
        ]);
        scrollToBottom();
        if (data.senderId !== currentUser.id) {
          newSocket.emit("mark_as_read", {
            messageIds: [data.id],
            conversationId: data.conversationId,
            userId: currentUser.id,
            userRole: currentUser.role,
          });
        }
      }
      fetchConversations(); // update last message & unread
    });

    newSocket.on("user_online", ({ userId, userRole }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.other_user_id === userId && c.other_user_role === userRole
            ? { ...c, online: true }
            : c
        )
      );
    });

    newSocket.on("user_offline", ({ userId, userRole }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.other_user_id === userId && c.other_user_role === userRole
            ? { ...c, online: false }
            : c
        )
      );
    });

    return () => {
      newSocket.off("new_message");
      newSocket.off("user_online");
      newSocket.off("user_offline");
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedChat.id ? { ...c, unread_count: 0 } : c
        )
      );
      if (socket) {
        const unreadIds = messages.filter(m => !m.is_read && m.receiver_id === currentUser.id).map(m => m.id);
        if (unreadIds.length) {
          socket.emit("mark_as_read", {
            messageIds: unreadIds,
            conversationId: selectedChat.id,
            userId: currentUser.id,
            userRole: currentUser.role,
          });
        }
      }
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    if (window.innerWidth < 768) setIsMobileMenuOpen(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !socket) return;
    setSending(true);
    const tempId = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        sender_id: currentUser.id,
        sender_role: currentUser.role,
        message: newMessage,
        created_at: new Date(),
        isMine: true,
        status: "sending",
      },
    ]);
    const messageText = newMessage;
    setNewMessage("");
    scrollToBottom();

    socket.emit("send_message", {
      receiverId: selectedChat.other_user_id,
      receiverRole: selectedChat.other_user_role,
      message: messageText,
      senderId: currentUser.id,
      senderRole: currentUser.role,
    });
    setSending(false);
  };

  const filteredConversations = conversations.filter((c) =>
    c.other_user_name?.toLowerCase().includes(search.toLowerCase()) ||
    (c.course_name?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);
  const instructorCount = conversations.filter(c => c.other_user_role === "instructor").length;

  const getRoleBadgeColor = (role) => {
    return "bg-orange-100 text-orange-700"; // instructor badge for admin
  };

  return (
    <div className="min-h-screen bg-gray-100 p-1 pr-0">
      <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-3xl">
        <AdminSidebar />

        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        <main className="flex-1 flex overflow-hidden">
          {/* Conversations Sidebar */}
          <div className={`
            w-80 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300
            ${isMobileMenuOpen ? 'fixed left-0 top-0 h-full z-50 shadow-xl' : 'hidden md:flex'}
          `}>
            <div className="p-4 border-b border-gray-200 bg-green-50">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Instructor Messages</h2>
                  {totalUnread > 0 && <span className="text-xs text-red-500 ml-2">{totalUnread} unread</span>}
                </div>
                <button onClick={() => setShowNewChat(true)} className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-white rounded-lg px-3 py-2 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-orange-600" />
                    <p className="text-sm font-medium text-gray-700">
                      {instructorCount} Active Instructors
                    </p>
                  </div>
                  {totalUnread > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {totalUnread} new
                    </span>
                  )}
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or course..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="animate-pulse flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1"><div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div><div className="h-3 bg-gray-200 rounded w-1/2"></div></div>
                    </div>
                  ))}
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No conversations yet</p>
                  <button onClick={() => setShowNewChat(true)} className="mt-3 bg-green-600 text-white px-4 py-2 rounded-full">+ Start new chat</button>
                </div>
              ) : (
                filteredConversations.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => handleSelectChat(chat)}
                    className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${selectedChat?.id === chat.id ? 'bg-green-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-lg font-bold">
                          {chat.other_user_name?.charAt(0).toUpperCase()}
                        </div>
                        {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-semibold text-gray-800 truncate">{chat.other_user_name}</p>
                          <span className="text-xs text-gray-400 ml-2">{new Date(chat.last_message_time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{chat.last_message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                            <GraduationCap className="w-3 h-3" /> Instructor
                          </span>
                          {chat.course_name && <span className="text-xs text-gray-400 truncate">{chat.course_name}</span>}
                          {chat.unread_count > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-auto">{chat.unread_count}</span>}
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
              <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-gray-100 rounded-full md:hidden">
                    <Menu className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                      {selectedChat.other_user_name?.charAt(0)}
                    </div>
                    {selectedChat.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{selectedChat.other_user_name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500">{selectedChat.online ? 'Online' : 'Offline'}</p>
                      <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                        <GraduationCap className="w-3 h-3" /> Instructor
                      </span>
                      {selectedChat.course_name && <span className="text-xs text-gray-400">• {selectedChat.course_name}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded-full"><Phone className="w-4 h-4 text-gray-500" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-full"><Video className="w-4 h-4 text-gray-500" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-full"><MoreVertical className="w-4 h-4 text-gray-500" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="flex justify-center"><span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Today</span></div>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[70%]">
                      {msg.sender_id !== currentUser.id && (
                        <div className="flex items-center gap-1 mb-1 ml-2">
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                            👨‍🏫 {msg.sender_role}
                          </span>
                        </div>
                      )}
                      <div className={`rounded-2xl px-4 py-2 ${msg.sender_id === currentUser.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow-sm border border-gray-100'}`}>
                        <p className="text-sm break-words">{msg.message}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
                        {msg.sender_id === currentUser.id && msg.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                        {msg.sender_id === currentUser.id && msg.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full"><Paperclip className="w-5 h-5 text-gray-500" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-full"><ImageIcon className="w-5 h-5 text-gray-500" /></button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-400"
                  />
                  <button className="p-2 hover:bg-gray-100 rounded-full"><Smile className="w-5 h-5 text-gray-500" /></button>
                  <button onClick={handleSendMessage} disabled={sending || !newMessage.trim()} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full disabled:opacity-50">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Instructor Message Center</h3>
                <p className="text-sm text-gray-500">Chat with course instructors</p>
                <button onClick={() => setShowNewChat(true)} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-xl">+ Start New Chat</button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-slideIn">
            <div className="p-4 border-b border-gray-100 bg-green-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">New Conversation with Instructor</h3>
              <button onClick={() => setShowNewChat(false)} className="p-1 hover:bg-gray-200 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4">
              <div className="mb-4 bg-green-50 rounded-lg p-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Select an instructor to start chatting</span>
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
                  <div key={user.id} onClick={() => startNewChat(user)} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">👨‍🏫 Instructor</span>
                        {user.course && <span className="text-xs text-gray-400">• {user.course}</span>}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && searchUsers.length > 0 && (
                  <div className="text-center py-8">
                    <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No instructors found</p>
                  </div>
                )}
                {filteredUsers.length === 0 && searchUsers.length === 0 && (
                  <div className="text-center py-8">
                    <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Search for an instructor by name</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
          <div className={`bg-gray-900/95 text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 flex items-center gap-3 ${toast.type === "success" ? "border-green-500" : "border-red-500"}`}>
            <div className={toast.type === "success" ? "text-green-400" : "text-red-400"}>{toast.type === "success" ? "✓" : "✗"}</div>
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateY(20px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
        .animate-slideIn { animation: slideIn 0.2s ease-out forwards; }
        .animate-bounce { animation: bounce 1.4s infinite ease-in-out; }
        @keyframes bounce { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-10px); } }
      `}</style>
    </div>
  );
}