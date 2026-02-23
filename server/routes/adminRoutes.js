import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/admin/userController.js";
import {
  getPendingInstructors,
  approveInstructor,
  rejectInstructor,
} from "../controllers/admin/adminController.js";
import {
  getAllCourses,
  getPendingCourses,
  approveCourse,
  rejectCourse,
} from "../controllers/admin/courseController.js";

const router = express.Router();

// Pending instructors
router.get(
  "/pending-instructors",
  verifyToken,
  allowRoles("admin"),
  getPendingInstructors,
);

// Approve instructor
router.put("/approve/:id", verifyToken, allowRoles("admin"), approveInstructor);

// Reject instructor
router.delete(
  "/reject/:id",
  verifyToken,
  allowRoles("admin"),
  rejectInstructor,
);

// Pending courses
router.get(
  "/pending-courses",
  verifyToken,
  allowRoles("admin"),
  getPendingCourses,
);

// Approve course
router.put(
  "/approve-course/:id",
  verifyToken,
  allowRoles("admin"),
  approveCourse,
);

// Reject course
router.delete(
  "/reject-course/:id",
  verifyToken,
  allowRoles("admin"),
  rejectCourse,
);

// Admin dashboard - all courses
router.get("/courses", verifyToken, allowRoles("admin"), getAllCourses);

// Users management
router.get("/users", verifyToken, allowRoles("admin"), getAllUsers);

// Update role
router.put("/user/:id", verifyToken, allowRoles("admin"), updateUser);

// Delete user
router.delete("/user/:id", verifyToken, allowRoles("admin"), deleteUser);

export default router;
