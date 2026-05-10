import db from "../../config/db.js";

export const getEarningsSummary = async (req, res) => {
  const instructorId = req.user.id;
  try {
    // Total earned from completed transactions (instructor's share = amount - platform_fee)
    const [totalRows] = await db.query(
      `SELECT COALESCE(SUM(t.amount - t.platform_fee), 0) as totalEarned
       FROM transactions t
       JOIN courses c ON t.course_id = c.id
       WHERE c.instructor_id = ? AND t.status = 'completed'`,
      [instructorId]
    );
    const totalEarned = totalRows[0]?.totalEarned || 0;

    // Paid out (sum of completed withdrawal requests)
    const [paidRows] = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as paidOut
       FROM withdrawal_requests
       WHERE instructor_id = ? AND status = 'completed'`,
      [instructorId]
    );
    const paidOut = paidRows[0]?.paidOut || 0;

    const pendingBalance = totalEarned - paidOut;

    // This month's earnings
    const [monthRows] = await db.query(
      `SELECT COALESCE(SUM(t.amount - t.platform_fee), 0) as thisMonth
       FROM transactions t
       JOIN courses c ON t.course_id = c.id
       WHERE c.instructor_id = ? AND t.status = 'completed'
         AND YEAR(t.created_at) = YEAR(CURDATE())
         AND MONTH(t.created_at) = MONTH(CURDATE())`,
      [instructorId]
    );
    const thisMonth = monthRows[0]?.thisMonth || 0;

    res.json({ totalEarned, pendingBalance, paidOut, thisMonth });
  } catch (err) {
    console.error("Error in getEarningsSummary:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getTransactionHistory = async (req, res) => {
  const instructorId = req.user.id;
  try {
    const [rows] = await db.query(
      `SELECT
         t.id,
         c.title AS course,
         u.name AS student,
         (t.amount - t.platform_fee) AS amount,
         DATE(t.created_at) AS date,
         t.status
       FROM transactions t
       JOIN courses c ON t.course_id = c.id
       JOIN users u ON t.student_id = u.id
       WHERE c.instructor_id = ? AND t.status = 'completed'
       ORDER BY t.created_at DESC`,
      [instructorId]
    );
    const transactions = rows.map(row => ({ ...row, type: 'credit' }));
    res.json(transactions);
  } catch (err) {
    console.error("Error in getTransactionHistory:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getWithdrawalHistory = async (req, res) => {
  const instructorId = req.user.id;
  try {
    const [rows] = await db.query(
      `SELECT
         id,
         amount,
         payment_method AS method,
         DATE(requested_at) AS date,
         status
       FROM withdrawal_requests
       WHERE instructor_id = ?
       ORDER BY requested_at DESC`,
      [instructorId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error in getWithdrawalHistory:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const requestWithdrawal = async (req, res) => {
  const instructorId = req.user.id;
  const { amount, method, accountDetails } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    // Verify pending balance
    const [totals] = await db.query(
      `SELECT COALESCE(SUM(t.amount - t.platform_fee),0) as earned,
              COALESCE((SELECT SUM(amount) FROM withdrawal_requests WHERE instructor_id = ? AND status != 'rejected'),0) as withdrawn
       FROM transactions t
       JOIN courses c ON t.course_id = c.id
       WHERE c.instructor_id = ? AND t.status = 'completed'`,
      [instructorId, instructorId]
    );
    const available = (totals[0]?.earned || 0) - (totals[0]?.withdrawn || 0);
    if (amount > available) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    await db.query(
      `INSERT INTO withdrawal_requests (instructor_id, amount, payment_method, account_details, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [instructorId, amount, method, accountDetails || null]
    );
    res.status(201).json({ message: "Withdrawal request submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};