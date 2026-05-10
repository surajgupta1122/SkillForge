import db from "../../config/db.js";

export const getCertificates = async (req, res) => {
  const studentId = req.user.id;
  try {
    const [rows] = await db.query(
      `SELECT 
        c.id,
        c.course_id AS courseId,
        c.certificate_id AS certificateId,
        c.issue_date AS issueDate,
        c.grade,
        c.score,
        co.title AS courseTitle,
        u.name AS instructor,
        co.duration
       FROM certificates c
       JOIN courses co ON c.course_id = co.id
       JOIN users u ON co.instructor_id = u.id
       WHERE c.student_id = ?
       ORDER BY c.issue_date DESC`,
      [studentId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const downloadCertificate = async (req, res) => {
  const studentId = req.user.id;
  const certificateId = req.params.id;
  try {
    const [rows] = await db.query(
      `SELECT c.*, co.title as courseTitle
       FROM certificates c
       JOIN courses co ON c.course_id = co.id
       WHERE c.id = ? AND c.student_id = ?`,
      [certificateId, studentId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    const cert = rows[0];
    const content = `Certificate of Completion: ${cert.courseTitle} – Grade: ${cert.grade}`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=certificate_${cert.certificate_id}.pdf`
    );
    res.send(Buffer.from(content));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};