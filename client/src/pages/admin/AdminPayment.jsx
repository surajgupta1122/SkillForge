import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import AdminSidebar from "../../components/AdminSidebar";
import {
  DollarSign,
  TrendingUp,
  Users,
  BookOpen,
  CalendarCheck,
  Search,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Filter,
  ChevronDown,
  CreditCard,
  Banknote,
  Wallet,
  AlertCircle,
  MessageSquare,
  RefreshCw,
  UserCheck,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function AdminPayments() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveNote, setApproveNote] = useState("");
  const [stats, setStats] = useState({
    totalRevenue: 0,
    platformFee: 0,
    paidToInstructors: 0,
    pendingPayouts: 0
  });

  // Toast
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  // Fetch real data from backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const [transactionsRes, withdrawalsRes] = await Promise.all([
        api.get("/admin/transactions"),
        api.get("/admin/withdrawals")
      ]);

      // Map transactions
      const mappedTransactions = transactionsRes.data.map(tx => ({
        id: tx.id,
        student: tx.student_name,
        course: tx.course_title,
        amount: tx.amount,
        platformFee: tx.platform_fee,
        instructorEarn: tx.instructor_earn,
        date: new Date(tx.created_at).toISOString().split('T')[0],
        status: tx.status
      }));

      // Map withdrawals
      const mappedWithdrawals = withdrawalsRes.data.map(w => ({
        id: w.id,
        instructor: w.instructor_name,
        amount: w.amount,
        method: w.payment_method,
        account: w.account_details,
        requestDate: new Date(w.requested_at).toISOString().split('T')[0],
        status: w.status,
        note: w.admin_note
      }));

      setTransactions(mappedTransactions);
      setWithdrawals(mappedWithdrawals);

      // Compute stats from real data
      const totalRevenue = mappedTransactions
        .filter(tx => tx.status === 'completed')
        .reduce((sum, tx) => sum + tx.amount, 0);
      const platformFee = mappedTransactions
        .filter(tx => tx.status === 'completed')
        .reduce((sum, tx) => sum + tx.platformFee, 0);
      const paidToInstructors = mappedTransactions
        .filter(tx => tx.status === 'completed')
        .reduce((sum, tx) => sum + tx.instructorEarn, 0);
      const pendingPayouts = mappedWithdrawals
        .filter(w => w.status === 'pending')
        .reduce((sum, w) => sum + w.amount, 0);

      setStats({ totalRevenue, platformFee, paidToInstructors, pendingPayouts });
    } catch (err) {
      console.error(err);
      showToast("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter withdrawals based on status and search
  const filteredWithdrawals = withdrawals.filter(w => {
    if (filterStatus !== "all" && w.status !== filterStatus) return false;
    if (search && !w.instructor.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Approve withdrawal (calls backend)
  const handleApproveWithdrawal = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    if (!selectedWithdrawal) return;
    try {
      await api.put(`/admin/withdrawals/${selectedWithdrawal.id}/approve`, {
        admin_note: approveNote
      });
      // Refresh data
      await fetchData();
      showToast(`✅ Withdrawal of ₹${selectedWithdrawal.amount} approved for ${selectedWithdrawal.instructor}`);
    } catch (err) {
      console.error(err);
      showToast("Failed to approve withdrawal");
    } finally {
      setShowApproveModal(false);
      setApproveNote("");
      setSelectedWithdrawal(null);
    }
  };

  // Reject withdrawal
  const handleRejectWithdrawal = async (id) => {
    try {
      await api.put(`/admin/withdrawals/${id}/reject`, { admin_note: "Rejected by admin" });
      await fetchData();
      showToast(`❌ Withdrawal request rejected`);
    } catch (err) {
      console.error(err);
      showToast("Failed to reject withdrawal");
    }
  };

  // Mark as paid (complete)
  const handleMarkPaid = async (id) => {
    try {
      await api.put(`/admin/withdrawals/${id}/complete`);
      await fetchData();
      showToast(`💰 Withdrawal marked as paid`);
    } catch (err) {
      console.error(err);
      showToast("Failed to mark as paid");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-1 pr-0">
      <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-3xl">
        <AdminSidebar onLogout={logout} />

        <main className="flex-1 overflow-y-auto custom-scroll bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 lg:px-10">
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>Financial Management</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    Payment <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Management</span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">Monitor revenue, transactions, and instructor payouts</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border border-white/40">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                        <CalendarCheck className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Today's Date</p>
                        <p className="font-bold text-gray-800 text-sm">
                          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards (using real stats) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                    <DollarSign className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">₹{stats.totalRevenue.toLocaleString()}</span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Platform Revenue</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">₹{stats.platformFee.toLocaleString()}</span>
                </div>
                <p className="text-gray-500 text-sm">Platform</p>
                <p className="text-gray-700 font-semibold mt-1">Platform Fee (20%)</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">₹{stats.paidToInstructors.toLocaleString()}</span>
                </div>
                <p className="text-gray-500 text-sm">Paid to</p>
                <p className="text-gray-700 font-semibold mt-1">Instructors (Total)</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center group-hover:bg-yellow-100 transition">
                    <Clock className="w-6 h-6 text-yellow-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">₹{stats.pendingPayouts.toLocaleString()}</span>
                </div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-gray-700 font-semibold mt-1">Pending Payouts</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 mb-8 overflow-hidden">
              <div className="border-b border-gray-100">
                <div className="flex px-6 gap-1">
                  <button
                    onClick={() => setSelectedTab("overview")}
                    className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                      selectedTab === "overview"
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-500 border-transparent hover:text-gray-700"
                    }`}
                  >
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Overview
                  </button>
                  <button
                    onClick={() => setSelectedTab("transactions")}
                    className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                      selectedTab === "transactions"
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-500 border-transparent hover:text-gray-700"
                    }`}
                  >
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    Transactions
                  </button>
                  <button
                    onClick={() => setSelectedTab("withdrawals")}
                    className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                      selectedTab === "withdrawals"
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-500 border-transparent hover:text-gray-700"
                    }`}
                  >
                    <Wallet className="w-4 h-4 inline mr-2" />
                    Withdrawal Requests
                  </button>
                </div>
              </div>

              {/* Overview Tab */}
              {selectedTab === "overview" && (
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Revenue Chart Placeholder (can be replaced with real chart later) */}
                    <div className="border border-gray-100 rounded-xl shadow-md">
                      <div className="bg-green-50 p-4 border-b border-gray-100 rounded-t-xl">
                        <h3 className="font-semibold text-gray-800">Monthly Revenue Trend</h3>
                      </div>
                      <div className="space-y-3 px-4 py-4">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => (
                          <div key={month} className="group">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">{month}</span>
                              <span className="text-green-600">₹{(22500 + i * 5500).toLocaleString()}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{ width: `${(22500 + i * 5500) / 60000 * 100}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Revenue Breakdown */}
                    <div className="border border-gray-100 rounded-xl shadow-md">
                      <div className="bg-green-50 p-4 border-b border-gray-100 rounded-t-xl">
                        <h3 className="font-semibold text-gray-800">Revenue Breakdown</h3>
                      </div>
                      <div className="space-y-4 px-4 py-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Platform Fee (20%)</span>
                            <span className="font-medium text-purple-600">₹{stats.platformFee.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '20%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Instructor Earnings (80%)</span>
                            <span className="font-medium text-green-600">₹{stats.paidToInstructors.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4">
                        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                          <p className="text-xs text-gray-500">Total paid to instructors: <span className="font-bold text-gray-800">₹{stats.paidToInstructors.toLocaleString()}</span></p>
                          <p className="text-xs text-gray-500 mt-1">Pending payouts: <span className="font-bold text-yellow-600">₹{stats.pendingPayouts.toLocaleString()}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Transactions Tab */}
              {selectedTab === "transactions" && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search transactions..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                      />
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-100">
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500">Student</th>
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500">Course</th>
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500">Amount</th>
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500">Platform Fee</th>
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500">Instructor Earn</th>
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500">Date</th>
                          <th className="text-center py-4 px-4 text-xs font-semibold text-gray-500">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-800">{tx.student}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{tx.course}</td>
                            <td className="py-3 px-4 text-sm font-medium text-gray-800">₹{tx.amount.toLocaleString()}</td>
                            <td className="py-3 px-4 text-sm text-purple-600">₹{tx.platformFee.toLocaleString()}</td>
                            <td className="py-3 px-4 text-sm text-green-600">₹{tx.instructorEarn.toLocaleString()}</td>
                            <td className="py-3 px-4 text-sm text-gray-500">{tx.date}</td>
                            <td className="py-3 px-4 text-center">
                              {tx.status === "completed" && <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" /> Completed</span>}
                              {tx.status === "refunded" && <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-100 text-red-700"><XCircle className="w-3 h-3" /> Refunded</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Withdrawals Tab */}
              {selectedTab === "withdrawals" && (
                <div className="p-6">
                  <div className="flex flex-wrap gap-3 mb-4 justify-between items-center">
                    <div className="flex gap-2">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search instructor..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white w-48"
                        />
                      </div>
                    </div>
                    <button onClick={fetchData} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-100">
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500">Instructor</th>
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500">Amount</th>
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500">Method</th>
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500">Request Date</th>
                          <th className="text-center py-4 px-4 text-xs font-semibold text-gray-500">Status</th>
                          <th className="text-center py-4 px-4 text-xs font-semibold text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWithdrawals.map((w) => (
                          <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium text-gray-800">{w.instructor}</td>
                            <td className="py-3 px-4 font-semibold text-gray-800">₹{w.amount.toLocaleString()}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{w.method}<br/><span className="text-xs text-gray-400">{w.account}</span></td>
                            <td className="py-3 px-4 text-sm text-gray-500">{w.requestDate}</td>
                            <td className="py-3 px-4 text-center">
                              {w.status === "pending" && <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3" /> Pending</span>}
                              {w.status === "approved" && <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700"><CheckCircle className="w-3 h-3" /> Approved</span>}
                              {w.status === "completed" && <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" /> Paid</span>}
                              {w.status === "rejected" && <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-100 text-red-700"><XCircle className="w-3 h-3" /> Rejected</span>}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {w.status === "pending" && (
                                  <>
                                    <button onClick={() => handleApproveWithdrawal(w)} className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition" title="Approve">
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleRejectWithdrawal(w.id)} className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition" title="Reject">
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                                {w.status === "approved" && (
                                  <button onClick={() => handleMarkPaid(w.id)} className="p-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition" title="Mark as Paid">
                                    <DollarSign className="w-4 h-4" />
                                  </button>
                                )}
                                <button className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition" title="View Details">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideIn">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <h3 className="text-lg font-bold text-gray-800">Approve Withdrawal</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Instructor: <span className="font-semibold">{selectedWithdrawal.instructor}</span></p>
                <p className="text-sm text-gray-600">Amount: <span className="font-semibold text-green-600">₹{selectedWithdrawal.amount.toLocaleString()}</span></p>
                <p className="text-sm text-gray-600">Method: {selectedWithdrawal.method}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Add Note (Optional)</label>
                <textarea
                  rows={2}
                  value={approveNote}
                  onChange={(e) => setApproveNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                  placeholder="Internal note..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowApproveModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">Cancel</button>
                <button onClick={confirmApprove} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">Approve & Send</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
          <div className="bg-gray-900/95 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 border-green-500 flex items-center gap-3">
            <div className="text-green-400 text-xl">✅</div>
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
        </div>
      )}

      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slideIn { animation: slideIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
}