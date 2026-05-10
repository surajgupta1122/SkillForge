import db from "../../config/db.js";

export const getStudentProgress = async (req, res) => {
  const studentId = req.user.id;
  try {
    // 1. Overall progress (percentage of completed lessons)
    const [overallRow] = await db.query(
      `SELECT 
         COALESCE(
           ROUND(
             (SUM(CASE WHEN lp.completed = 1 THEN 1 ELSE 0 END) / 
              NULLIF(COUNT(lp.id), 0)) * 100
           ), 0
         ) as overall
       FROM lesson_progress lp
       JOIN lessons l ON lp.lesson_id = l.id
       JOIN courses c ON l.course_id = c.id
       WHERE lp.student_id = ? AND c.isApproved = 1`,
      [studentId]
    );
    const overall = overallRow[0]?.overall || 0;

    // 2. Per‑course progress
    const [courses] = await db.query(
      `SELECT 
         c.id,
         c.title,
         COUNT(l.id) as totalLessons,
         SUM(CASE WHEN lp.completed = 1 THEN 1 ELSE 0 END) as completedLessons,
         COALESCE(SUM(l.duration_minutes), 0) as totalDuration,
         COALESCE(SUM(CASE WHEN lp.completed = 1 THEN l.duration_minutes ELSE 0 END), 0) as timeSpentMinutes,
         COALESCE(e.score, 0) as score,
         MAX(lp.completed_at) as lastAccessed
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       LEFT JOIN lessons l ON l.course_id = c.id
       LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = ?
       WHERE e.student_id = ? AND c.isApproved = 1
       GROUP BY c.id, e.score
       ORDER BY lastAccessed DESC`,
      [studentId, studentId]
    );

    const courseList = courses.map((c) => ({
      id: c.id,
      title: c.title,
      totalLessons: c.totalLessons,
      lessonsCompleted: c.completedLessons,
      progress: c.totalLessons
        ? Math.round((c.completedLessons / c.totalLessons) * 100)
        : 0,
      timeSpent: Math.round(c.timeSpentMinutes / 60) || 0,   // hours
      lastAccessed: c.lastAccessed
        ? new Date(c.lastAccessed).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      score: c.score || 0,
    }));

    // 3. Recent activity (last 10 completed lessons)
    const [recent] = await db.query(
      `SELECT 
         l.title as lesson,
         c.title as course,
         l.duration_minutes as timeSpent,
         lp.completed_at as completed
       FROM lesson_progress lp
       JOIN lessons l ON lp.lesson_id = l.id
       JOIN courses c ON l.course_id = c.id
       WHERE lp.student_id = ? AND lp.completed = 1
       ORDER BY lp.completed_at DESC
       LIMIT 10`,
      [studentId]
    );

    const recentActivity = recent.map((r, idx) => ({
      id: idx + 1,
      course: r.course,
      lesson: r.lesson,
      completed: r.completed,
      timeSpent: r.timeSpent,   // minutes
    }));

    // 4. Weekly data (last 7 days)
    const [weekly] = await db.query(
      `SELECT 
         DAYNAME(lp.completed_at) as day,
         COUNT(*) as lessons,
         COALESCE(SUM(l.duration_minutes), 0) as totalMinutes
       FROM lesson_progress lp
       JOIN lessons l ON lp.lesson_id = l.id
       WHERE lp.student_id = ? AND lp.completed = 1
         AND lp.completed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DAYNAME(lp.completed_at)`,
      [studentId]
    );

    const dayOrder = {
      Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4,
      Friday: 5, Saturday: 6, Sunday: 7,
    };
    const allDays = [
      "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"
    ];
    const weeklyData = allDays.map((day) => {
      const found = weekly.find((w) => w.day === day);
      return {
        day: day.slice(0, 3),
        hours: found ? Math.round(found.totalMinutes / 60) : 0,
        lessons: found ? found.lessons : 0,
      };
    });

    // 5. Totals
    const [totalRow] = await db.query(
      `SELECT 
         COUNT(*) as totalLessonsCompleted,
         COALESCE(SUM(l.duration_minutes), 0) as totalMinutesSpent
       FROM lesson_progress lp
       JOIN lessons l ON lp.lesson_id = l.id
       WHERE lp.student_id = ? AND lp.completed = 1`,
      [studentId]
    );
    const totalLessonsCompleted = totalRow[0]?.totalLessonsCompleted || 0;
    const totalHoursSpent = Math.round((totalRow[0]?.totalMinutesSpent || 0) / 60);

    // 6. Streak (consecutive days)
    const [streakData] = await db.query(
      `SELECT DISTINCT DATE(lp.completed_at) as compDate
       FROM lesson_progress lp
       WHERE lp.student_id = ? AND lp.completed = 1
       ORDER BY compDate DESC
       LIMIT 30`,
      [studentId]
    );

    let streakDays = 0;
    if (streakData.length > 0) {
      const oneDay = 24 * 60 * 60 * 1000;
      let expected = new Date(streakData[0].compDate);
      for (let i = 0; i < streakData.length; i++) {
        const cur = new Date(streakData[i].compDate);
        const diff = Math.round((expected - cur) / oneDay);
        if (diff === 0) {
          streakDays++;
          expected = new Date(expected.getTime() - oneDay);
        } else if (diff === 1) {
          streakDays++;
          expected = new Date(cur.getTime() - oneDay);
        } else {
          break;
        }
      }
    }

    // 7. Badges
    const [badges] = await db.query(
      `SELECT b.name, b.icon, b.description
       FROM user_badges ub
       JOIN badges b ON ub.badge_id = b.id
       WHERE ub.user_id = ?`,
      [studentId]
    );

    res.json({
      overall,
      courses: courseList,
      recentActivity,
      weeklyData,
      totalHoursSpent,
      totalLessonsCompleted,
      streakDays,
      badges,
    });
  } catch (err) {
    console.error("Progress error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};