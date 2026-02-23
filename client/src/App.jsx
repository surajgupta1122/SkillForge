import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Courses from "./pages/admin/Courses";

import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import ViewCourses from "./pages/instructor/InstructorMyCourses";
import CourseStudents from "./pages/instructor/CourseStudents";

import StudentDashboard from "./pages/student/StudentDashboard";
import MyCourses from "./pages/student/StudentMyCourses";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute roles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/my-courses"
          element={
            <ProtectedRoute roles={["student"]}>
              <MyCourses />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Courses />
            </ProtectedRoute>
          }
        />

        {/* Instructor Courses */}
        <Route
          path="/instructor"
          element={
            <ProtectedRoute roles={["instructor"]}>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/courses"
          element={
            <ProtectedRoute roles={["instructor"]}>
              <ViewCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/course/:id/students"
          element={
            <ProtectedRoute roles={["instructor"]}>
              <CourseStudents />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
