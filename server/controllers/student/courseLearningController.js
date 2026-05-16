import db from "../../config/db.js";

// GET /student/course/:id – course details + lessons + user progress
export const getCourseForLearning = async (req, res) => {
    const courseId = req.params.id;
    const studentId = req.user.id;

    try {
        // 1. Verify enrollment
        const [enrollment] = await db.query(
            `SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?`,
            [studentId, courseId]
        );
        if (enrollment.length === 0) {
            return res.status(403).json({ message: "Not enrolled in this course" });
        }

        // 2. Get course details
        const [courseRows] = await db.query(
            `SELECT id, title, description, instructor_id, students_count
             FROM courses WHERE id = ?`,
            [courseId]
        );
        if (courseRows.length === 0) return res.status(404).json({ message: "Course not found" });
        const course = courseRows[0];

        // 3. Get lessons with user's completion status
        const [lessons] = await db.query(
            `SELECT 
                l.id,
                l.title,
                l.description,
                l.video_url,
                l.duration_minutes,
                l.order_index,
                COALESCE(lp.completed, FALSE) as completed
             FROM lessons l
             LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.student_id = ?
             WHERE l.course_id = ?
             ORDER BY l.order_index ASC`,
            [studentId, courseId]
        );

        // 4. Get total progress (percentage of completed lessons)
        const totalLessons = lessons.length;
        const completedCount = lessons.filter(l => l.completed).length;
        const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

        // 5. Update enrollment progress (store in enrollments table)
        await db.query(
            `UPDATE enrollments SET progress = ?, updated_at = NOW() WHERE student_id = ? AND course_id = ?`,
            [progressPercent, studentId, courseId]
        );

        res.json({
            course: { id: course.id, title: course.title, description: course.description, progress: progressPercent },
            lessons
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// POST /student/lesson/:id/complete – mark a lesson as completed
export const completeLesson = async (req, res) => {
    const lessonId = req.params.id;
    const studentId = req.user.id;

    try {
        // Check if already completed
        const [existing] = await db.query(
            `SELECT id FROM lesson_progress WHERE student_id = ? AND lesson_id = ?`,
            [studentId, lessonId]
        );
        if (existing.length === 0) {
            // Insert completion record
            await db.query(
                `INSERT INTO lesson_progress (student_id, lesson_id, completed, completed_at)
                 VALUES (?, ?, TRUE, NOW())`,
                [studentId, lessonId]
            );
        } else {
            // If already exists but marked false, update it
            await db.query(
                `UPDATE lesson_progress SET completed = TRUE, completed_at = NOW() WHERE student_id = ? AND lesson_id = ?`,
                [studentId, lessonId]
            );
        }

        // Recalculate course progress
        const [lessonInfo] = await db.query(
            `SELECT course_id FROM lessons WHERE id = ?`,
            [lessonId]
        );
        const courseId = lessonInfo[0].course_id;

        const [progressData] = await db.query(
            `SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN lp.completed = TRUE THEN 1 ELSE 0 END) as completed
             FROM lessons l
             LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.student_id = ?
             WHERE l.course_id = ?`,
            [studentId, courseId]
        );
        const percent = progressData[0].total > 0 ? Math.round((progressData[0].completed / progressData[0].total) * 100) : 0;

        await db.query(
            `UPDATE enrollments SET progress = ?, updated_at = NOW() WHERE student_id = ? AND course_id = ?`,
            [percent, studentId, courseId]
        );

        res.json({ message: "Lesson marked as completed", progress: percent });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};