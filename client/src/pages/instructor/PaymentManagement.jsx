import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import InstructorSidebar from "../../components/InstructorSidebar";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  CalendarCheck,
  Search,
  X,
  CheckCircle,
  Clock,
  Eye,
  Download,
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Receipt,
  Landmark,
  AlertCircle,
  MessageSquare,
  PlusCircle,
  ChevronDown,
} from "lucide-react";

export default function PaymentManagement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState({
    totalEarned: 0,
    pendingBalance: 0,
    paidOut: 0,
    thisMonth: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [search, setSearch] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [accountDetails, setAccountDetails] = useState("");

  // Toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  // Fetch data from backend
  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const [earningsRes, transactionsRes, withdrawalsRes] = await Promise.all([
        api.get("/instructor/earnings"),
        api.get("/instructor/transactions"),
        api.get("/instructor/withdrawals"),
      ]);
      setEarnings(earningsRes.data);
      setTransactions(transactionsRes.data);
      setWithdrawals(withdrawalsRes.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load earnings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  // Submit withdrawal request
  const handleWithdrawRequest = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      showToast("Please enter a valid amount", "error");
      return;
    }
    if (parseFloat(withdrawAmount) > earnings.pendingBalance) {
      showToast("Amount exceeds pending balance", "error");
      return;
    }

    try {
      await api.post("/instructor/withdraw", {
        amount: parseFloat(withdrawAmount),
        method:
          withdrawMethod === "bank"
            ? "Bank Transfer"
            : withdrawMethod === "upi"
            ? "UPI"
            : "PayPal",
        accountDetails: accountDetails,
      });
      // Refresh data
      await fetchEarnings();
      setShowWithdrawModal(false);
      setWithdrawAmount("");
      setAccountDetails("");
      showToast(`Withdrawal request of ₹${withdrawAmount} submitted`, "success");
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.message || "Failed to submit withdrawal request",
        "error",
      );
    }
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.course?.toLowerCase().includes(search.toLowerCase()) ||
      t.student?.toLowerCase().includes(search.toLowerCase()),
  );

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-1 pr-0">
      <div className="flex h-[calc(100vh-8px)] overflow-hidden rounded-3xl">
        <InstructorSidebar onLogout={logout} />

        <main className="flex-1 overflow-y-auto custom-scroll bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 lg:px-10">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>Financial Dashboard</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    My{" "}
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                      Earnings
                    </span>
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">
                    Track your revenue and manage withdrawals
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Request Withdrawal
                  </button>
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border border-white/40">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                        <CalendarCheck className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Today's Date</p>
                        <p className="font-bold text-gray-800 text-sm">
                          {new Date().toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                    <DollarSign className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">
                    ₹{earnings.totalEarned.toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-gray-700 font-semibold mt-1">Total Earned</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center group-hover:bg-yellow-100 transition">
                    <Clock className="w-6 h-6 text-yellow-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">
                    ₹{earnings.pendingBalance.toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-gray-700 font-semibold mt-1">
                  Pending Balance
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
                    <Wallet className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">
                    ₹{earnings.paidOut.toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">Paid</p>
                <p className="text-gray-700 font-semibold mt-1">
                  Total Paid Out
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                  <span className="text-2xl font-black text-gray-800">
                    ₹{earnings.thisMonth.toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">This Month</p>
                <p className="text-gray-700 font-semibold mt-1">
                  This Month's Earnings
                </p>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 mb-8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-orange-50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <History className="w-5 h-5 text-green-600" />
                      Transaction History
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      All course earnings and credits
                    </p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by course or student..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-center py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-10">
                          <div className="flex flex-col items-center justify-center gap-3">
                            {search ? (
                              <Search
                                className="w-28 h-28 text-gray-300 bg-gray-50 rounded-full p-2"
                                strokeWidth={1.5}
                              />
                            ) : (
                              <Receipt
                                className="w-12 h-12 text-gray-300"
                                strokeWidth={1.5}
                              />
                            )}
                            <p className="text-gray-400 font-medium">
                              {search
                                ? "No transactions match your search."
                                : "No transactions found."}
                            </p>
                            {search && (
                              <button
                                onClick={() => setSearch("")}
                                className="text-sm text-blue-500 hover:text-blue-600 font-medium mt-1"
                              >
                                Clear search
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((tx, idx) => (
                        <tr
                          key={tx.id}
                          className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${idx !== filteredTransactions.length - 1 ? "border-b" : ""}`}
                        >
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <Receipt className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="font-medium text-gray-800">
                                {tx.course}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-5 text-gray-600 text-sm">
                            {tx.student}
                          </td>
                          <td className="py-3 px-5 font-semibold text-green-600">
                            ₹{tx.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-5 text-gray-500 text-sm">
                            {tx.date}
                          </td>
                          <td className="py-3 px-5 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                              <CheckCircle className="w-3 h-3" />
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Withdrawal History */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-orange-50">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Withdrawal History
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Track your payout requests
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-center py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((w, idx) => (
                      <tr
                        key={w.id}
                        className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${idx !== withdrawals.length - 1 ? "border-b" : ""}`}
                      >
                        <td className="py-3 px-5 font-semibold text-gray-800">
                          ₹{w.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-5 text-gray-600 text-sm">
                          {w.method}
                        </td>
                        <td className="py-3 px-5 text-gray-500 text-sm">
                          {w.date}
                        </td>
                        <td className="py-3 px-5 text-center">
                          {w.status === "pending" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                              <CheckCircle className="w-3 h-3" /> Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {withdrawals.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-8 text-gray-500"
                        >
                          No withdrawal requests yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideIn">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                Request Withdrawal
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Available: ₹{earnings.pendingBalance.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                >
                  <option value="bank">Bank Transfer (****1234)</option>
                  <option value="upi">UPI (instructor@okhdfcbank)</option>
                  <option value="paypal">PayPal (instructor@paypal.com)</option>
                </select>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-xs text-yellow-800">
                  Withdrawals are processed within 2-3 business days.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdrawRequest}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
          <div
            className={`bg-gray-900/95 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 flex items-center gap-3 ${
              toast.type === "success" ? "border-green-500" : "border-red-500"
            }`}
          >
            <div
              className={
                toast.type === "success" ? "text-green-400" : "text-red-400"
              }
            >
              {toast.type === "success" ? "✓" : "✗"}
            </div>
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