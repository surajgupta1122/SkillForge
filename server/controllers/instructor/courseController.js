import db from "../../config/db.js";

export const createCourse = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const instructorId = req.user.id;

    if (!title || !description || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await db.query(
      `INSERT INTO courses (title, description, price, category, instructor_id, isApproved)
       VALUES (?, ?, ?, ?, ?, false)`,
      [title, description, price, category || null, instructorId]
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
      `SELECT 
        id,
        title,
        description,
        price,
        isApproved
       FROM courses
       WHERE instructor_id = ?`,
      [instructorId]
    );

    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
