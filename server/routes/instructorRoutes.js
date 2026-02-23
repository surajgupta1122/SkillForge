import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  deleteCourse,
  createCourse,
  getMyCourses,
  getCourseStudents,
} from "../controllers/instructor/courseController.js";

const router = express.Router();

// Create course
router.post(
  "/create-course",
  verifyToken,
  allowRoles("instructor"),
  createCourse,
);

// ✅ GET instructor courses (THIS WAS MISSING)
router.get("/my-courses", verifyToken, allowRoles("instructor"), getMyCourses);

router.get(
  "/course/:id/students",
  verifyToken,
  allowRoles("instructor"),
  getCourseStudents,
);

router.delete(
  "/course/:id",
  verifyToken,
  allowRoles("instructor"),
  deleteCourse,
);
export default router;
