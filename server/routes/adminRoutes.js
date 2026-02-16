import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  getPendingInstructors,
  approveInstructor,
  rejectInstructor,
} from "../controllers/admin/adminController.js";
import {
  getPendingCourses,
  approveCourse,
  rejectCourse,
} from "../controllers/admin/courseController.js";

const router = express.Router();

router.get(
  "/pending-instructors",
  verifyToken,
  allowRoles("admin"),
  getPendingInstructors
);

router.put("/approve/:id", verifyToken, allowRoles("admin"), approveInstructor);

router.delete(
  "/reject/:id",
  verifyToken,
  allowRoles("admin"),
  rejectInstructor
);

// Pending courses
router.get(
  "/pending-courses",
  verifyToken,
  allowRoles("admin"),
  getPendingCourses
);

// Approve course
router.put(
  "/approve-course/:id",
  verifyToken,
  allowRoles("admin"),
  approveCourse
);

// Reject course
router.delete(
  "/reject-course/:id",
  verifyToken,
  allowRoles("admin"),
  rejectCourse
);

export default router;
