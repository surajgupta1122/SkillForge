import db from "../../config/db.js";

export const getInstructorAnalytics = async (req, res) => {
  const instructorId = req.user.id;

  try {
    // ---------- 1. Overview ----------
    const [[{ totalStudents }]] = await db.query(
      `SELECT COUNT(DISTINCT e.student_id) as totalStudents
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE c.instructor_id = ?`,
      [instructorId]
    );

    const [[{ totalCourses }]] = await db.query(
      `SELECT COUNT(*) as totalCourses
       FROM courses
       WHERE instructor_id = ? AND isApproved = 1`,
      [instructorId]
    );

    const [[{ totalRevenue }]] = await db.query(
      `SELECT COALESCE(SUM(t.instructor_earn), 0) as totalRevenue
       FROM transactions t
       JOIN courses c ON t.course_id = c.id
       WHERE c.instructor_id = ? AND t.status = 'completed'`,
      [instructorId]
    );

    const [[{ avgProgress }]] = await db.query(
      `SELECT COALESCE(AVG(e.progress), 0) as avgProgress
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE c.instructor_id = ?`,
      [instructorId]
    );

    const [[{ totalEnrollments }]] = await db.query(
      `SELECT COUNT(*) as totalEnrollments
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE c.instructor_id = ?`,
      [instructorId]
    );
    const [[{ completedEnrollments }]] = await db.query(
      `SELECT COUNT(*) as completedEnrollments
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE c.instructor_id = ? AND e.progress >= 100`,
      [instructorId]
    );
    const completionRate = totalEnrollments ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

    // Satisfaction rate – reviews table not present yet, default to 0
    const satisfactionRate = 0;

    // ---------- 2. Trends (30‑day vs preceding 30‑day) ----------
    const [[{ currentStudents }]] = await db.query(
      `SELECT COUNT(DISTINCT e.student_id) as currentStudents
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE c.instructor_id = ? AND e.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`,
      [instructorId]
    );
    const [[{ previousStudents }]] = await db.query(
      `SELECT COUNT(DISTINCT e.student_id) as previousStudents
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE c.instructor_id = ? AND e.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 2 MONTH) AND DATE_SUB(NOW(), INTERVAL 1 MONTH)`,
      [instructorId]
    );
    const studentsGrowth = previousStudents ? Math.round(((currentStudents - previousStudents) / previousStudents) * 100) : 0;

    const [[{ currentRevenue }]] = await db.query(
      `SELECT COALESCE(SUM(t.instructor_earn), 0) as currentRevenue
       FROM transactions t
       JOIN courses c ON t.course_id = c.id
       WHERE c.instructor_id = ? AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) AND t.status='completed'`,
      [instructorId]
    );
    const [[{ previousRevenue }]] = await db.query(
      `SELECT COALESCE(SUM(t.instructor_earn), 0) as previousRevenue
       FROM transactions t
       JOIN courses c ON t.course_id = c.id
       WHERE c.instructor_id = ? AND t.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 2 MONTH) AND DATE_SUB(NOW(), INTERVAL 1 MONTH) AND t.status='completed'`,
      [instructorId]
    );
    const revenueGrowth = previousRevenue ? Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100) : 0;

    const [[{ currentEnrollments }]] = await db.query(
      `SELECT COUNT(*) as currentEnrollments
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE c.instructor_id = ? AND e.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`,
      [instructorId]
    );
    const [[{ previousEnrollments }]] = await db.query(
      `SELECT COUNT(*) as previousEnrollments
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE c.instructor_id = ? AND e.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 2 MONTH) AND DATE_SUB(NOW(), INTERVAL 1 MONTH)`,
      [instructorId]
    );
    const enrollmentGrowth = previousEnrollments ? Math.round(((currentEnrollments - previousEnrollments) / previousEnrollments) * 100) : 0;

    // ---------- 3. Top Courses (by students count) ----------
    const [topCourses] = await db.query(
      `SELECT
         c.id,
         c.title,
         COUNT(e.id) as students,
         COALESCE(SUM(t.instructor_earn), 0) as revenue,
         COALESCE(AVG(e.progress), 0) as progress
       FROM courses c
       LEFT JOIN enrollments e ON c.id = e.course_id
       LEFT JOIN transactions t ON c.id = t.course_id AND t.status='completed'
       WHERE c.instructor_id = ?
       GROUP BY c.id
       ORDER BY students DESC
       LIMIT 5`,
      [instructorId]
    );

    // ---------- 4. Monthly Data (last 12 months) – fixed GROUP BY ----------
    let [monthlyData] = await db.query(
      `SELECT
         DATE_FORMAT(MIN(e.created_at), '%b') as month,
         COUNT(DISTINCT e.student_id) as students,
         COALESCE(SUM(t.instructor_earn), 0) as revenue,
         COUNT(e.id) as enrollments
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       LEFT JOIN transactions t ON e.course_id = t.course_id AND t.status='completed' AND MONTH(t.created_at) = MONTH(e.created_at)
       WHERE c.instructor_id = ? AND e.created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
       GROUP BY YEAR(e.created_at), MONTH(e.created_at)
       ORDER BY MIN(e.created_at) ASC`,
      [instructorId]
    );

    if (monthlyData.length === 0) {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      monthlyData = months.map(m => ({ month: m, students: 0, revenue: 0, enrollments: 0 }));
    }

    // ---------- 5. Recent Activities (latest enrollments) ----------
    const [recentActiv] = await db.query(
      `SELECT
         'New enrollment' as action,
         u.name as student,
         c.title as course,
         e.created_at as time,
         'enrollment' as type
       FROM enrollments e
       JOIN users u ON e.student_id = u.id
       JOIN courses c ON e.course_id = c.id
       WHERE c.instructor_id = ?
       ORDER BY e.created_at DESC
       LIMIT 10`,
      [instructorId]
    );

    const recentActivities = recentActiv.map(a => ({
      action: a.action,
      student: a.student,
      course: a.course,
      time: new Date(a.time).toLocaleString(),
      type: a.type
    }));

    res.json({
      overview: {
        totalStudents: totalStudents || 0,
        totalCourses: totalCourses || 0,
        totalRevenue: totalRevenue || 0,
        avgProgress: Math.round(avgProgress || 0),
        completionRate: completionRate || 0,
        satisfactionRate: satisfactionRate
      },
      trends: {
        studentsGrowth,
        revenueGrowth,
        enrollmentGrowth
      },
      topCourses,
      monthlyData,
      recentActivities
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};