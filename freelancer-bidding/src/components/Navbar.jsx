import React, { useState } from "react";
import { HiBars3BottomLeft } from "react-icons/hi2";
import { FiChevronDown } from "react-icons/fi";
import Logo from "./Logo";
import { findWorkItems } from "../services/navitems";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import NotificationsDropdown from "../components/NotificationDropdown";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const token = sessionStorage.getItem("token");

  const location = useLocation();
  const isWelcomePage = location.pathname === "/"; // 👈 Check if WelcomePage

  const userRole = user?.role;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout successful");
    navigate("/Login");
    setToggleMenu(false);
  };

  const getProfileImage = () => {
    if (user?.profileimg) {
      if (
        user.profileimg.startsWith("http") ||
        user.profileimg.startsWith("data:image")
      ) {
        return user.profileimg;
      } else {
        return `${
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
        }/${user.profileimg}`;
      }
    }
    return "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Left Section */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-gray-700"
            >
              <Logo />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-6">
              {userRole === "jobseeker" && (
                <div className="relative group">
                  <button className="text-gray-700 flex items-center gap-1">
                    Find Work <FiChevronDown />
                  </button>
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-md w-64 rounded-md opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    {findWorkItems.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4">
              {user && <NotificationsDropdown />}

              {!user ? (
                <>
                  {/* 👇 Admin Login Button (Desktop) */}
                  {isWelcomePage && (
                    <Link to="/login">
                      <button className="text-white bg-blue-500 hover:bg-red-700 px-4 py-2 rounded-full font-semibold">
                        Admin Login
                      </button>
                    </Link>
                  )}
                  <Link to="/register">
                    <button className="text-gray-700 font-medium  bg-pink-500 hover:bg-gray-200 py-2 px-5 rounded-full">
                      Sign up
                    </button>
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1 focus:outline-none"
                  >
                    <img
                      src={getProfileImage()}
                      alt="User Avatar"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <FiChevronDown
                      className={`mt-1 transition-transform ${
                        profileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                      <Link
                        to="/user/profile/view"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        View Profile
                      </Link>

                      <Link
                        to={
                          userRole === "jobseeker"
                            ? "/user/profile/edit"
                            : "/user/updateHiringprofile"
                        }
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Update Profile
                      </Link>

                      <Link
                        to="/user/update-password"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Update Password
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button onClick={() => setToggleMenu(!toggleMenu)}>
                <HiBars3BottomLeft className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-16 left-0 w-full bg-white px-8 pt-6 transition-all duration-700 ease-in-out lg:hidden ${
          toggleMenu
            ? "h-full opacity-100 scale-100"
            : "h-0 opacity-0 scale-95 overflow-hidden"
        }`}
      >
        <div className="flex flex-col gap-6 font-semibold">
          {user && token && (
            <>
              <NotificationsDropdown />
              <div className="flex flex-col gap-2 border-b pb-4 mb-4">
                <Link
                  to="/user/profile/view"
                  className="block px-4 py-2 text-blue-700 hover:bg-blue-50 rounded"
                  onClick={() => setToggleMenu(false)}
                >
                  View Profile
                </Link>
                <Link
                  to={
                    userRole === "jobseeker"
                      ? "/user/profile/edit"
                      : "/user/updateHiringprofile"
                  }
                  className="block px-4 py-2 text-blue-700 hover:bg-blue-50 rounded"
                  onClick={() => setToggleMenu(false)}
                >
                  Update Profile
                </Link>
                <Link
                  to="/user/update-password"
                  className="block px-4 py-2 text-blue-700 hover:bg-blue-50 rounded"
                  onClick={() => setToggleMenu(false)}
                >
                  Update Password
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  Logout
                </button>
              </div>
            </>
          )}

          {!user && (
            <div className="pt-4 flex flex-col gap-2">
              <Link to="/login">
                <button className="block w-full border-2 border-gray-300 py-2 px-4 rounded-full text-center hover:bg-gray-700 hover:text-white">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="block w-full border-2 bg-pink-500 border-gray-300 py-2 px-4 rounded-full text-center hover:bg-gray-700 hover:text-white">
                  Sign Up
                </button>
              </Link>
              {/* 👇 Admin Login Button (Mobile) */}
              {isWelcomePage && (
                <Link to="/login">
                  <button className="block w-full bg-blue-500 text-white py-2 px-4 rounded-full text-center hover:bg-red-700">
                    Admin Login
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </nav>
  );
};

export default Navbar;
