import db from "../../config/db.js";

export const getPlatformAnalytics = async (req, res) => {
  try {
    // Helper to safely get a single numeric value
    const safeQuery = async (sql, defaultValue = 0) => {
      try {
        const [rows] = await db.query(sql);
        const val = rows[0] ? Object.values(rows[0])[0] : defaultValue;
        return val ?? defaultValue;
      } catch {
        return defaultValue;
      }
    };

    // ---------- Overview ----------
    const totalUsers = await safeQuery("SELECT COUNT(*) as count FROM users");
    const totalCourses = await safeQuery("SELECT COUNT(*) as count FROM courses WHERE isApproved = 1");
    const totalRevenue = await safeQuery("SELECT COALESCE(SUM(amount),0) as sum FROM transactions WHERE status = 'completed'");
    const totalStudents = await safeQuery("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
    const totalInstructors = await safeQuery("SELECT COUNT(*) as count FROM users WHERE role = 'instructor' AND isApproved = 1");
    const avgCoursePrice = await safeQuery("SELECT COALESCE(AVG(price),0) as avg FROM courses WHERE isApproved = 1");

    // ---------- Trends (month-over-month) ----------
    const currentUsers = await safeQuery("SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)");
    const previousUsers = await safeQuery("SELECT COUNT(*) as count FROM users WHERE created_at BETWEEN DATE_SUB(NOW(), INTERVAL 2 MONTH) AND DATE_SUB(NOW(), INTERVAL 1 MONTH)");
    const usersGrowth = previousUsers ? ((currentUsers - previousUsers) / previousUsers * 100).toFixed(0) : 0;

    const currentCourses = await safeQuery("SELECT COUNT(*) as count FROM courses WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)");
    const previousCourses = await safeQuery("SELECT COUNT(*) as count FROM courses WHERE created_at BETWEEN DATE_SUB(NOW(), INTERVAL 2 MONTH) AND DATE_SUB(NOW(), INTERVAL 1 MONTH)");
    const coursesGrowth = previousCourses ? ((currentCourses - previousCourses) / previousCourses * 100).toFixed(0) : 0;

    const currentRevenue = await safeQuery("SELECT COALESCE(SUM(amount),0) as sum FROM transactions WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) AND status='completed'");
    const previousRevenue = await safeQuery("SELECT COALESCE(SUM(amount),0) as sum FROM transactions WHERE created_at BETWEEN DATE_SUB(NOW(), INTERVAL 2 MONTH) AND DATE_SUB(NOW(), INTERVAL 1 MONTH) AND status='completed'");
    const revenueGrowth = previousRevenue ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(0) : 0;

    // ---------- Top Courses (safe, may be empty) ----------
    let topCourses = [];
    try {
      const [rows] = await db.query(`
        SELECT c.id, c.title, u.name AS instructor, 
               COUNT(e.id) AS students, 
               COALESCE(SUM(t.amount),0) AS revenue, 
               COALESCE(c.rating, 0) AS rating
        FROM courses c
        JOIN users u ON c.instructor_id = u.id
        LEFT JOIN enrollments e ON c.id = e.course_id
        LEFT JOIN transactions t ON c.id = t.course_id AND t.status = 'completed'
        WHERE c.isApproved = 1
        GROUP BY c.id
        ORDER BY students DESC
        LIMIT 5
      `);
      topCourses = rows;
    } catch {
      // fallback empty array
    }

    // ---------- Recent Activities (from activity_logs) ----------
    let recentActivities = [];
    try {
      const [rows] = await db.query(`
        SELECT id, action, entity_type, details, created_at as time
        FROM activity_logs
        ORDER BY created_at DESC
        LIMIT 10
      `);
      recentActivities = rows.map(a => ({
        id: a.id,
        action: a.action,
        type: a.entity_type || 'system',
        time: a.time,
        ...(a.details ? JSON.parse(a.details || '{}') : {})
      }));
    } catch {
      // fallback
    }

    // ---------- Monthly Data (last 12 months) ----------
    let monthlyData = [];
    try {
      const [rows] = await db.query(`
        SELECT 
          DATE_FORMAT(created_at, '%b') as month,
          COUNT(DISTINCT student_id) as users,
          COUNT(DISTINCT course_id) as courses,
          COALESCE(SUM(amount),0) as revenue
        FROM transactions
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY YEAR(created_at), MONTH(created_at)
        ORDER BY MIN(created_at) ASC
      `);
      if (rows.length) monthlyData = rows;
      else {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        monthlyData = months.map(m => ({ month: m, users: 0, courses: 0, revenue: 0 }));
      }
    } catch {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      monthlyData = months.map(m => ({ month: m, users: 0, courses: 0, revenue: 0 }));
    }

    res.json({
      overview: {
        totalUsers,
        totalCourses,
        totalRevenue,
        totalStudents,
        totalInstructors,
        avgCoursePrice: parseFloat(avgCoursePrice)
      },
      trends: {
        usersGrowth: parseInt(usersGrowth),
        coursesGrowth: parseInt(coursesGrowth),
        revenueGrowth: parseInt(revenueGrowth)
      },
      topCourses,
      recentActivities,
      monthlyData
    });
  } catch (err) {
    console.error("Analytics error:", err);
    // Ultimate fallback – frontend will see zeros instead of crash
    res.status(200).json({
      overview: {
        totalUsers: 0,
        totalCourses: 0,
        totalRevenue: 0,
        totalStudents: 0,
        totalInstructors: 0,
        avgCoursePrice: 0
      },
      trends: { usersGrowth: 0, coursesGrowth: 0, revenueGrowth: 0 },
      topCourses: [],
      recentActivities: [],
      monthlyData: []
    });
  }
};