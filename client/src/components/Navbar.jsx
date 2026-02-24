import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import  Logo  from "../assets/logo.png";

export default function Navbar({ className = "" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Active link style
  const activeClass = (path) =>
    location.pathname === path
      ? "bg-gradient-to-r from-green-600 to-green-500 text-white px-3 py-1.5 rounded-full font-semibold shadow-md hover:text-white transition"
      : "text-gray-600 hover:bg-gradient-to-r from-green-700 to-green-600 px-3 py-1.5 rounded-full hover:text-white font-medium transition";

  return (
    <nav
      className={`bg-white sticky top-0 z-50 transition-shadow ${
        scrolled ? "shadow-md" : ""
      } ${className}`}
    >
      <div className=" max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="flex text-3xl font-bold text-gray-500 cursor-pointer"
        >
        <img src={Logo} alt="Logo" className="w-15.5 h-9.4" />
          Ski
          <span className="text-green-600">ll</span>
          Forge
        </h1>

        <div className="flex items-center mr-[20%] gap-8">
          <button
            onClick={() => navigate("/")}
            className={`${activeClass("/")} hover:text-green-600`}
          >
            Home
          </button>

          <button
            onClick={() => navigate("/student")}
            className={`${activeClass("/student")} hover:text-green-600`}
          >
            Courses
          </button>

          <button
            onClick={() => navigate("/about")}
            className={`${activeClass("/about")} hover:text-green-600`}
          >
            About
          </button>

          <button
            onClick={() => navigate("/contact")}
            className={`${activeClass("/contact")} hover:text-green-600`}
          >
            Contact
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className={`px-4 py-1 rounded-full font-medium transition text-lg ${
                  location.pathname === "/login"
                    ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md"
                    : " border-green-600 text-gray-600 hover:bg-gradient-to-r hover:from-green-600 hover:to-green-500 hover:text-white"
                }`}
              >
                Log In
              </button>

              <button
                onClick={() => navigate("/register")}
                className={`px-4 py-1 rounded-full font-medium transition text-lg ${
                  location.pathname === "/register"
                    ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md"
                    : " border-green-600 text-gray-600 hover:bg-gradient-to-r hover:from-green-600 hover:to-green-500 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Button */}
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <span className="text-gray-600 text-xl font-medium">{user.name}</span>
              </div>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => navigate("/settings")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Settings
                  </button>

                  <hr className="my-2" />

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 pb-4 space-y-3 shadow-md">
          <button
            onClick={() => navigate("/")}
            className="block w-full text-left text-gray-600"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/student")}
            className="block w-full text-left text-gray-600"
          >
            Courses
          </button>

          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="block w-full text-left text-gray-600"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="block w-full text-left text-gray-600"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <div className="text-gray-600">{user.name}</div>

              <button
                onClick={() => handleLogout()}
                className="block w-full text-left text-red-500"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
