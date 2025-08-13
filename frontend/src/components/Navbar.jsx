import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdDarkMode } from "react-icons/md";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  return (
    <div className="bg-white">
      <nav className="flex items-center justify-between px-6 py-4 shadow-sm">
        <div className="flex items-center gap-10">
          <h1 className="text-2xl font-bold">AlgoLog</h1>
          <Link to="/" className="text-lg hover:text-blue-600">
            Home
          </Link>
          <Link to="/dashboard" className="text-lg hover:text-blue-600">
            Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-4 relative">
          <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center cursor-pointer hover:bg-gray-200">
            <span>
              <MdDarkMode />
            </span>
          </div>
          <Link
            to="/login"
            className="px-4 py-1 border rounded hover:bg-gray-100"
          >
            Login
          </Link>
          <div className="relative">
            <div
              onClick={toggleDropdown}
              className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center cursor-pointer hover:bg-gray-200"
            >
              <span>👤</span>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-md z-10">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Settings
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
