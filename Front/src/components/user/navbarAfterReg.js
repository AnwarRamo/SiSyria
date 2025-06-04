import React, { useState } from "react";
import { FaBars, FaTimes, FaUser, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom"; // تأكد من تثبيت react-router-dom إذا كنت تستخدمه

const NavBarAfterRegister = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-[#115d5a] to-[#1a7c78] shadow-lg fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-[#E7C873]">
            TravelWorld
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-[#E7C873] transition-all duration-300">
              Home
            </Link>
            <Link to="/about" className="text-white hover:text-[#E7C873] transition-all duration-300">
              About
            </Link>
            <Link to="/trip" className="text-white hover:text-[#E7C873] transition-all duration-300">
              Destinations
            </Link>
            <Link to="/contact" className="text-white hover:text-[#E7C873] transition-all duration-300">
              Contact
            </Link>
          </div>

          {/* Search and User Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <FaSearch className="text-white hover:text-[#E7C873] cursor-pointer transition-all duration-300" />
            <FaUser className="text-white hover:text-[#E7C873] cursor-pointer transition-all duration-300" />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gradient-to-r from-[#115d5a] to-[#1a7c78] shadow-lg">
            <div className="flex flex-col space-y-4 p-4">
              <Link to="/" className="text-white hover:text-[#E7C873] transition-all duration-300">
                Home
              </Link>
              <Link to="/about" className="text-white hover:text-[#E7C873] transition-all duration-300">
                About
              </Link>
              <Link to="/destinations" className="text-white hover:text-[#E7C873] transition-all duration-300">
                Destinations
              </Link>
              <Link to="/contact" className="text-white hover:text-[#E7C873] transition-all duration-300">
                Contact
              </Link>
              <div className="flex items-center space-x-4">
                <FaSearch className="text-white hover:text-[#E7C873] cursor-pointer transition-all duration-300" />
                <FaUser className="text-white hover:text-[#E7C873] cursor-pointer transition-all duration-300" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBarAfterRegister;