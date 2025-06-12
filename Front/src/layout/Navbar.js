import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../api/stores/auth.store";
import { useCartStore } from "../api/stores/cart.store";
import { FaUserCircle, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import logo from "../assets/images/logo.jpg";
import CartModal from "../pages/user/CartPage"; // Adjust path if necessary

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // Manage cart modal open state

  const { user, logout } = useAuthStore();
  const { items, totalQuantity } = useCartStore();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const handleLogout = async () => {
    try {
      await logout?.();
      toast.success("Logout successful!");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/travel", label: "Travel" },
    { path: "/souvenirs", label: "Souvenirs" },
    { path: "/about-us", label: "About Us" },
    { path: "/contact-us", label: "Contact" },
  ];

  const cartCount = totalQuantity?.() || 0;
  const hasCartItems = (items?.length || 0) > 0;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img src={logo} alt="Logo" className="h-10" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 hover:text-[#115d5a] text-sm font-semibold"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(true)} // Open cart modal on click
                className="relative text-gray-700 hover:text-[#115d5a]"
                aria-label="Open cart"
              >
                <FaShoppingCart className="h-6 w-6" />
                {hasCartItems && (
                  <span className="absolute -top-1 -right-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Desktop */}
            <div className="hidden md:block">
              {user ? (
                <div className="relative">
                  <button onClick={toggleUserDropdown} className="flex items-center space-x-2">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full border border-[#115d5a] object-cover"
                      />
                    ) : (
                      <FaUserCircle className="w-8 h-8 text-[#115d5a]" />
                    )}
                    <FaCaretDown className="text-gray-600" />
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                        Profile
                      </Link>
                      {user.role === "admin" && (
                        <Link to="/admin/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100">
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Link to="/login" className="text-[#115d5a] hover:underline text-sm">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-[#115d5a] text-white px-3 py-1 rounded-md text-sm hover:bg-[#0d4a47]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                aria-label="Toggle menu"
                className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#115d5a]"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 bg-white shadow border-t border-gray-200 z-40">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block py-2 text-sm text-gray-700 hover:text-[#115d5a]"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Show Login/Register if no user */}
          {!user ? (
            <div className="flex flex-col space-y-2 mt-2">
              <Link
                to="/login"
                className="text-[#115d5a] hover:underline text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#115d5a] text-white px-3 py-1 rounded-md text-sm hover:bg-[#0d4a47] text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <>
              <Link
                to="/profile"
                className="block py-2 text-sm text-gray-700 hover:text-[#115d5a]"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="block py-2 text-sm text-gray-700 hover:text-[#115d5a]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
    </nav>
  );
};

export default Navbar;
