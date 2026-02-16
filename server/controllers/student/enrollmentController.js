import db from "../../config/db.js";

// 🔹 Enroll Course
export const enrollCourse = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID required" });
    }

    // Check already enrolled
    const [existing] = await db.query(
      "SELECT * FROM enrollments WHERE student_id=? AND course_id=?",
      [studentId, courseId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    // Insert
    await db.query(
      "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)",
      [studentId, courseId]
    );

    res.json({ message: "Enrolled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get today's enrollments
export const getTodayEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;

    const [courses] = await db.query(`
      SELECT 
        courses.id,
        courses.title,
        courses.description,
        users.name AS instructor
      FROM enrollments
      JOIN courses ON enrollments.course_id = courses.id
      JOIN users ON courses.instructor_id = users.id
      WHERE enrollments.student_id = ?
      AND DATE(enrollments.created_at) = CURDATE()
    `, [studentId]);

    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get my enrolled courses
export const getMyEnrollments = async (req, res) => {
  const studentId = req.user.id;

  const [courses] = await db.query(`
    SELECT 
      courses.id,
      courses.title,
      courses.description,
      users.name AS instructor
    FROM enrollments
    JOIN courses ON enrollments.course_id = courses.id
    JOIN users ON courses.instructor_id = users.id
    WHERE enrollments.student_id = ?
  `, [studentId]);

  res.json(courses);
};
