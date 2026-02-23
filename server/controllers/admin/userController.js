import db from "../../config/db.js";

// 🔹 Get all users
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, role, isApproved FROM users",
    );

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Update user (name + email)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    await db.query("UPDATE users SET name=?, email=? WHERE id=?", [
      name,
      email,
      id,
    ]);

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM users WHERE id=?", [id]);

    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
