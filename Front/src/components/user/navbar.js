import React, { useState } from 'react';
import logo from '../../assets/images/logo.jpg';
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignIn = () => {
    navigate('/signIn');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <nav className="backdrop-blur-md fixed w-full z-20 top-0 left-0 bg-white/80 shadow-sm">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between p-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <img
            src={logo}
            className="h-16 transition-transform duration-300 transform hover:scale-105"
            alt="Application Logo"
          />
        </div>

        {/* Mobile Hamburger/Close Icon */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-[#002147]"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center justify-center gap-6">
          <li>
            <Link
              to="/"
              className="pt-1.5 font-dm text-sm font-medium text-black hover:text-[#115d5a] transition duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/trip"
              className="pt-1.5 font-dm text-sm font-medium text-black hover:text-[#115d5a] transition duration-300"
            >
              Our Trips
            </Link>
          </li>
          <li>
            <Link
              to="/aboutus"
              className="pt-1.5 font-dm text-sm font-medium text-black hover:text-[#115d5a] transition duration-300"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/contactus"
              className="pt-1.5 font-dm text-sm font-medium text-black hover:text-[#115d5a] transition duration-300"
            >
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={handleSignIn}
            type="button"
            className="text-white bg-[#115d5a] hover:bg-[#0d4a47] font-medium rounded-lg text-sm px-5 py-2 transition-all duration-300"
            aria-label="Sign In"
          >
            Sign In
          </button>
          <button
            onClick={handleLogin}
            type="button"
            className="text-white bg-[#E7C873] hover:bg-[#d4b15d] font-medium rounded-lg text-sm px-5 py-2 transition-all duration-300"
            aria-label="Login"
          >
            Login
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-white/95 backdrop-blur-sm shadow-lg transition-all duration-300 transform ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <ul className="space-y-4 p-4">
          <li>
            <Link
              to="/"
              className="block px-4 py-2 text-black hover:text-[#115d5a] transition duration-300"
              aria-label="Go to Home"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/trip"
              className="block px-4 py-2 text-black hover:text-[#115d5a] transition duration-300"
              aria-label="Go to Our Trips"
            >
              Our Trips
            </Link>
          </li>
          <li>
            <Link
              to="/aboutus"
              className="block px-4 py-2 text-black hover:text-[#115d5a] transition duration-300"
              aria-label="Go to About Us"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/contactus"
              className="block px-4 py-2 text-black hover:text-[#115d5a] transition duration-300"
              aria-label="Go to Contact Us"
            >
              Contact Us
            </Link>
          </li>
          <li>
            <button
              onClick={handleSignIn}
              className="w-full text-left px-4 py-2 text-white bg-[#115d5a] hover:bg-[#0d4a47] rounded-lg transition-all duration-300"
              aria-label="Sign In"
            >
              Sign In
            </button>
          </li>
          <li>
            <button
              onClick={handleLogin}
              className="w-full text-left px-4 py-2 text-white bg-[#E7C873] hover:bg-[#d4b15d] rounded-lg transition-all duration-300"
              aria-label="Login"
            >
              Login
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;