import db from "../../config/db.js";

// Simple course creation (no lessons/resources) – kept for backward compatibility
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

    const [course] = await db.query(
      "SELECT * FROM courses WHERE id = ? AND instructor_id = ?",
      [courseId, instructorId],
    );

    if (course.length === 0) {
      return res.status(403).json({ message: "Unauthorized" });
    }

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

    const [course] = await db.query(
      "SELECT * FROM courses WHERE id = ? AND instructor_id = ?",
      [courseId, instructorId],
    );

    if (course.length === 0) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await db.query("DELETE FROM enrollments WHERE course_id = ?", [courseId]);
    await db.query("DELETE FROM courses WHERE id = ?", [courseId]);

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// FULL COURSE CREATION WITH LESSONS, RESOURCES AND FILE UPLOADS
export const createFullCourse = async (req, res) => {
  const instructorId = req.user.id;
  const { title, price, description, lessons, resources } = req.body;

  if (!title || !price) {
    return res.status(400).json({ message: "Title and price are required" });
  }

  let lessonsArray = [];
  let resourcesArray = [];
  try {
    if (lessons) lessonsArray = JSON.parse(lessons);
    if (resources) resourcesArray = JSON.parse(resources);
  } catch (err) {
    return res.status(400).json({ message: "Invalid lessons or resources data" });
  }

  for (let i = 0; i < lessonsArray.length; i++) {
    if (!lessonsArray[i].title) {
      return res.status(400).json({ message: `Lesson ${i + 1} must have a title` });
    }
  }

  const files = req.files || [];
  const videoFileMap = {};
  const docFileMap = {};

  files.forEach(file => {
    const lessonMatch = file.fieldname.match(/lessons\[(\d+)\]\[videoFile\]/);
    if (lessonMatch) {
      const idx = parseInt(lessonMatch[1]);
      if (!videoFileMap[idx]) videoFileMap[idx] = [];
      videoFileMap[idx].push(file);
    } else {
      const resourceMatch = file.fieldname.match(/resources\[(\d+)\]\[file\]/);
      if (resourceMatch) {
        const idx = parseInt(resourceMatch[1]);
        if (!docFileMap[idx]) docFileMap[idx] = [];
        docFileMap[idx].push(file);
      }
    }
  });

  for (const idx in videoFileMap) {
    const file = videoFileMap[idx][0];
    lessonsArray[idx].videoUrl = `/uploads/videos/${file.filename}`;
  }
  for (const idx in docFileMap) {
    const file = docFileMap[idx][0];
    resourcesArray[idx].file_url = `/uploads/documents/${file.filename}`;
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [courseResult] = await connection.query(
      `INSERT INTO courses (title, description, price, instructor_id, isApproved)
       VALUES (?, ?, ?, ?, 0)`,
      [title, description, price, instructorId]
    );
    const courseId = courseResult.insertId;

    // Insert lessons – note: column name is 'duration_minutes', not 'duration'
    for (let i = 0; i < lessonsArray.length; i++) {
      const lesson = lessonsArray[i];
      await connection.query(
        `INSERT INTO lessons (course_id, title, description, video_url, duration_minutes, order_index)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [courseId, lesson.title, lesson.description || null, lesson.videoUrl || null, lesson.duration || 0, lesson.order || i + 1]
      );
    }

    // Insert resources
    if (resourcesArray.length) {
      for (let i = 0; i < resourcesArray.length; i++) {
        const resItem = resourcesArray[i];
        await connection.query(
          `INSERT INTO course_resources (course_id, name, file_url, url)
           VALUES (?, ?, ?, ?)`,
          [courseId, resItem.name, resItem.file_url || null, resItem.url || null]
        );
      }
    }

    await connection.commit();
    res.status(201).json({ message: "Course created successfully", courseId });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};