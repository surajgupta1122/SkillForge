import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";

import Home from "./pages/guest/Home";
import GuestCourses from "./pages/guest/Courses"; // Renamed to GuestCourses
import About from "./pages/guest/About";
import Contact from "./pages/guest/Contact";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import AdminCourses from "./pages/admin/Courses"; // Renamed to AdminCourses
import AdminSettings from "./pages/admin/AdminSettings"; // New Admin Settings page

import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import ViewCourses from "./pages/instructor/InstructorMyCourses";
import Students from "./pages/instructor/Students";
import Analytics from "./pages/instructor/Analytics";
import Settings from "./pages/instructor/Settings";
import CourseStudents from "./pages/instructor/CourseStudents";

import StudentDashboard from "./pages/student/StudentDashboard";
import MyCourses from "./pages/student/StudentMyCourses";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<GuestCourses />} /> {/* Updated */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

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
              <AdminCourses /> {/* Updated */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminSettings /> {/* New Admin Settings route */}
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
          path="/instructor/students"
          element={
            <ProtectedRoute roles={["instructor"]}>
              <Students />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/analytics"
          element={
            <ProtectedRoute roles={["instructor"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/settings"
          element={
            <ProtectedRoute roles={["instructor"]}>
              <Settings />
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
