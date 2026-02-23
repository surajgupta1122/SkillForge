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
    await db.query("UPDATE courses SET isApproved = 1 WHERE id = ?", [
      req.params.id,
    ]);

    res.json({ message: "Course approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// REJECT course
export const rejectCourse = async (req, res) => {
  try {
    await db.query("DELETE FROM courses WHERE id = ?", [req.params.id]);

    res.json({ message: "Course rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET all courses (for admin dashboard)
export const getAllCourses = async (req, res) => {
  try {
    const [courses] = await db.query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.price,
        c.isApproved,
        u.name AS instructor,
        COUNT(e.id) AS students
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      GROUP BY c.id
      ORDER BY c.id DESC
    `);

    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
