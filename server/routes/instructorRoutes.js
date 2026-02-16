import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  createCourse,
  getMyCourses,
} from "../controllers/instructor/courseController.js";

const router = express.Router();

// Create course
router.post(
  "/create-course",
  verifyToken,
  allowRoles("instructor"),
  createCourse
);

// ✅ GET instructor courses (THIS WAS MISSING)
router.get(
  "/my-courses",
  verifyToken,
  allowRoles("instructor"),
  getMyCourses
);

export default router;
