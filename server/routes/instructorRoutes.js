import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { uploadCourseFiles } from "../middleware/upload.js";
import {
  deleteCourse,
  createCourse,
  createFullCourse,          // new function
  getMyCourses,
  getCourseStudents,
} from "../controllers/instructor/courseController.js";
import { getInstructorStudents } from "../controllers/instructor/studentController.js";
import {
  getEarningsSummary,
  getTransactionHistory,
  getWithdrawalHistory,
  requestWithdrawal,
} from "../controllers/instructor/paymentController.js";
import { getInstructorAnalytics } from "../controllers/instructor/analyticsController.js";

const router = express.Router();

router.use(verifyToken, allowRoles("instructor"));

// Course routes
router.post("/create-course", uploadCourseFiles, createFullCourse);    // full version with lessons/resources
router.post("/create-course-simple", createCourse);                   // simple version (backward compat)
router.get("/my-courses", getMyCourses);
router.get("/course/:id/students", getCourseStudents);
router.delete("/course/:id", deleteCourse);

// Student routes
router.get("/students", getInstructorStudents);

// Earnings / payment routes
router.get("/earnings", getEarningsSummary);
router.get("/transactions", getTransactionHistory);
router.get("/withdrawals", getWithdrawalHistory);
router.post("/withdraw", requestWithdrawal);

// Analytics
router.get("/analytics", getInstructorAnalytics);

export default router;