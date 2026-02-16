import db from "../../config/db.js";

// GET pending courses
export const getPendingCourses = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        courses.id,
        courses.title,
        courses.price,
        users.name AS instructor
      FROM courses
      JOIN users ON courses.instructor_id = users.id
      WHERE courses.isApproved = 0
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// APPROVE course
export const approveCourse = async (req, res) => {
  try {
    await db.query(
      "UPDATE courses SET isApproved = 1 WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "Course approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// REJECT course
export const rejectCourse = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM courses WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "Course rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
