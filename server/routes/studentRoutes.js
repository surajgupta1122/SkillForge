import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { getAllCourses } from "../controllers/student/courseController.js";
import {
  enrollCourse,
  getMyEnrollments,
  getTodayEnrollments,
} from "../controllers/student/enrollmentController.js";
import { getCertificates, downloadCertificate } from "../controllers/student/certificateController.js";
import { getStudentProgress } from "../controllers/student/progressController.js";

const router = express.Router();

// Get all approved courses
router.get("/courses", verifyToken, allowRoles("student"), getAllCourses);

// Enroll in a course
router.post("/enroll", verifyToken, allowRoles("student"), enrollCourse);

// Get today's courses
router.get(
  "/today-courses",
  verifyToken,
  allowRoles("student"),
  getTodayEnrollments,
);

// Get my enrolled courses
router.get("/my-courses", verifyToken, allowRoles("student"), getMyEnrollments);

// Get certificates list
router.get("/certificates", verifyToken, allowRoles("student"), getCertificates);

// Download a specific certificate
router.get(
  "/certificate/:id/download",
  verifyToken,
  allowRoles("student"),
  downloadCertificate
);

// Get student progress
router.get("/progress", verifyToken, allowRoles("student"), getStudentProgress);

export default router;