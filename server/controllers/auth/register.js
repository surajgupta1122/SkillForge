import db from "../../config/db.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Approval logic
    const isApproved = role === "student";

    // 4. Insert user
    const sql =
      "INSERT INTO users (name, email, password, role, isApproved) VALUES (?, ?, ?, ?, ?)";

    await db.query(sql, [
      name,
      email,
      hashedPassword,
      role || "student",
      isApproved,
    ]);

    // 5. Success response
    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    // Duplicate email error
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    console.error("SERVER ERROR 👉", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
