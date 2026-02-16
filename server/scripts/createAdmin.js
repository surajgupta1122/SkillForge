import db from "../config/db.js";
import bcrypt from "bcrypt";

const createAdmin = async () => {
  const password = await bcrypt.hash("admin123", 10); // default password

  const sql = `
    INSERT INTO users (name, email, password, role, isApproved)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    ["Admin", "admin@gmail.com", password, "admin", 1], //email:
    (err) => {
      if (err) console.log(err);
      else console.log("Admin created successfully");
      process.exit();
    }
  );
};

createAdmin();
