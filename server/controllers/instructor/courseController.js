import db from "../../config/db.js";

export const createCourse = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const instructorId = req.user.id;

    if (!title || !description || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await db.query(
      `INSERT INTO courses (title, description, price, instructor_id, isApproved)
       VALUES (?, ?, ?, ?, false)`,
      [title, description, price || null, instructorId],
    );

    res.status(201).json({
      message: "Course created successfully",
      courseId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const [courses] = await db.query(
      `
      SELECT 
        c.id,
        c.title,
        c.description,
        c.price,
        c.isApproved,
        COUNT(e.id) AS students
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE c.instructor_id = ?
      GROUP BY c.id
    `,
      [instructorId],
    );

    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCourseStudents = async (req, res) => {
  try {
    const courseId = req.params.id;
    const instructorId = req.user.id;

    // 🔒 Make sure instructor owns this course
    const [course] = await db.query(
      "SELECT * FROM courses WHERE id = ? AND instructor_id = ?",
      [courseId, instructorId],
    );

    if (course.length === 0) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 🔹 Get students
    const [students] = await db.query(
      `
      SELECT 
        users.id,
        users.name,
        users.email,
        enrollments.created_at
      FROM enrollments
      JOIN users ON enrollments.student_id = users.id
      WHERE enrollments.course_id = ?
    `,
      [courseId],
    );

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const instructorId = req.user.id;

    // 🔒 Check ownership
    const [course] = await db.query(
      "SELECT * FROM courses WHERE id = ? AND instructor_id = ?",
      [courseId, instructorId],
    );

    if (course.length === 0) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 🔥 DELETE CHILD RECORDS FIRST
    await db.query("DELETE FROM enrollments WHERE course_id = ?", [courseId]);

    // 🔥 DELETE COURSE
    await db.query("DELETE FROM courses WHERE id = ?", [courseId]);

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: err.message });
  }
};
