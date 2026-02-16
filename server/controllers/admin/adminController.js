import db from "../../config/db.js";

// Get pending instructors
export const getPendingInstructors = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email FROM users WHERE role='instructor' AND isApproved=0"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Approve instructor
export const approveInstructor = async (req, res) => {
  try {
    await db.query(
      "UPDATE users SET isApproved=1 WHERE id=?",
      [req.params.id]
    );
    res.json({ message: "Instructor approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Reject instructor
export const rejectInstructor = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM users WHERE id=? AND role='instructor'",
      [req.params.id]
    );
    res.json({ message: "Instructor rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
