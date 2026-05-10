import db from "../../config/db.js";

// Get all withdrawal requests (admin)
export const getWithdrawalRequests = async (req, res) => {
    const { status } = req.query;
    try {
        let query = `
            SELECT w.*, u.name as instructor_name, u.email as instructor_email
            FROM withdrawal_requests w
            JOIN users u ON w.instructor_id = u.id
        `;
        const params = [];
        if (status && status !== 'all') {
            query += ` WHERE w.status = ?`;
            params.push(status);
        }
        query += ` ORDER BY w.requested_at DESC`;
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Approve a withdrawal request
export const approveWithdrawal = async (req, res) => {
    const { id } = req.params;
    const { admin_note } = req.body;
    try {
        await db.query(
            `UPDATE withdrawal_requests 
             SET status = 'approved', admin_note = ?, processed_at = NOW()
             WHERE id = ? AND status = 'pending'`,
            [admin_note || null, id]
        );
        res.json({ message: "Withdrawal approved" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Reject a withdrawal request
export const rejectWithdrawal = async (req, res) => {
    const { id } = req.params;
    const { admin_note } = req.body;
    try {
        await db.query(
            `UPDATE withdrawal_requests 
             SET status = 'rejected', admin_note = ?, processed_at = NOW()
             WHERE id = ? AND status = 'pending'`,
            [admin_note || null, id]
        );
        res.json({ message: "Withdrawal rejected" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Mark as paid (completed)
export const completeWithdrawal = async (req, res) => {
    const { id } = req.params;
    try {
        // First, get the withdrawal details
        const [rows] = await db.query(`SELECT instructor_id, amount FROM withdrawal_requests WHERE id = ?`, [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Not found" });
        const { instructor_id, amount } = rows[0];

        // Update status
        await db.query(
            `UPDATE withdrawal_requests SET status = 'completed', processed_at = NOW() WHERE id = ?`,
            [id]
        );
        // Optionally, create a record in instructor_earnings as 'paid' (or update existing)
        await db.query(
            `UPDATE instructor_earnings SET status = 'paid', paid_at = NOW() WHERE instructor_id = ? AND status = 'pending' AND amount = ?`,
            [instructor_id, amount]
        );
        res.json({ message: "Withdrawal marked as paid" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all platform transactions
export const getAllTransactions = async (req, res) => {
    try {
        const [transactions] = await db.query(`
            SELECT t.*, u.name as student_name, c.title as course_title
            FROM transactions t
            JOIN users u ON t.student_id = u.id
            JOIN courses c ON t.course_id = c.id
            ORDER BY t.created_at DESC
        `);
        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};