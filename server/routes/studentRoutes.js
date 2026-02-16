import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { getAllCourses } from "../controllers/student/courseController.js";
import {
  enrollCourse,
  getMyEnrollments,
  getTodayEnrollments,
} from "../controllers/student/enrollmentController.js";

const router = express.Router();

// Get all approved courses
router.get(
  "/courses",
  verifyToken, 
  allowRoles("student"), 
  getAllCourses);

// Enroll in a course
router.post(
  "/enroll", 
  verifyToken, 
  allowRoles("student"), 
  enrollCourse);

// Get enrolled courses for the student
router.get(
  "/today-courses",
  verifyToken,
  allowRoles("student"),
  getTodayEnrollments
);
// my enrolled courses 
router.get(
  "/my-courses", 
  verifyToken, 
  allowRoles("student"),
  getMyEnrollments);

export default router;
