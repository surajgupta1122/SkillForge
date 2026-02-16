import db from "../../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => { 
  
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    // Check user exists
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Instructor approval check
    if (user.role === "instructor" && user.isApproved === 0) {
      return res.status(403).json({ message: "Instructor not approved yet" });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, role: user.role }, // payload
      process.env.JWT_SECRET || "secretkey", // secretkey
      { expiresIn: "1d" }  //expiry {optional}
    );

    //Send response and token
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR 👉", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
