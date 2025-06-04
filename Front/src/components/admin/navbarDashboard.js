// src/components/admin/NavbarDashboard.jsx
import React from "react";
import { FaSearch, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../api/stores/auth.store";

const NavbarDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const adminName = user?.displayName || user?.username || "Admin";
  const adminInitial = adminName?.charAt(0).toUpperCase() || 'A';

  return (
    <nav className="bg-white shadow-md fixed w-full z-40 h-16 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <Link to="/" className="flex items-center text-lg font-semibold text-gray-700 hover:text-purple-600 transition-colors">
            <FaHome className="mr-2 text-gray-500" aria-hidden="true" />
            Admin Panel
          </Link>
          <div className="flex-1 flex justify-center px-4 lg:px-0">
            <div className="relative w-full max-w-xs lg:max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm transition text-sm"
                aria-label="Search"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 font-medium text-sm hidden sm:block">
              Welcome, {adminName}
            </span>
            <div className="flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="Admin Avatar" className="w-10 h-10 rounded-full object-cover bg-gray-200 shadow-sm" />
              ) : (
                <div
                  className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-sm"
                  aria-label="Admin Avatar Fallback"
                >
                  {adminInitial}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarDashboard;