import db from "../../config/db.js";

export const getAllCourses = async (req, res) => {
  try {
    const [courses] = await db.query(`
      SELECT 
        courses.id,
        courses.title,
        courses.description,
        courses.price,
        users.name AS instructor
      FROM courses
      JOIN users ON courses.instructor_id = users.id
      WHERE courses.isApproved = 1
    `);

    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
