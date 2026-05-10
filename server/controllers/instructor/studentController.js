import db from "../../config/db.js";

// GET /instructor/students – all students enrolled in any course owned by the instructor
export const getInstructorStudents = async (req, res) => {
  // ✅ Safety check – req.user should be set by verifyToken middleware
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized: missing user context" });
  }

  const instructorId = req.user.id;
  try {
    const [students] = await db.query(
      `
      SELECT 
        u.id,
        u.name,
        u.email,
        c.title AS courseTitle,
        c.id AS courseId,
        e.created_at AS enrolledAt,
        COALESCE(e.progress, 0) AS progress,
        CASE 
          WHEN e.is_active = 1 THEN 'active'
          ELSE 'inactive'
        END AS status
      FROM enrollments e
      JOIN users u ON e.student_id = u.id
      JOIN courses c ON e.course_id = c.id
      WHERE c.instructor_id = ?
      ORDER BY e.created_at DESC
      `,
      [instructorId]
    );
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};