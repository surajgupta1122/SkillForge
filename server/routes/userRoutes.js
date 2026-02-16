import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", verifyToken, (req, res) => {
  res.json({
    message: "User profile",
    user: req.user,
  });
});

export default router;
