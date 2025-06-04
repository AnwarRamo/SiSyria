import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import logo from "../assets/images/logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#115d5a] to-[#0d4a47] text-white py-12 z-10">
      <div className="max-w-screen-lg mx-auto px-6">
        {/* Top Section: Logo, Links, and Social Media */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          {/* Logo and Copyright */}
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <a href="/" aria-label="Homepage">
              <img
                src={logo}
                alt="SiSyria Logo"
                className="h-16 w-16 rounded-full hover:opacity-80 transition-opacity duration-300 transform hover:scale-105"
              />
            </a>
            <p className="text-sm text-gray-300">
              © 2023{" "}
              <span className="text-[#E7C873] font-semibold">SiSyria</span>. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center space-x-6 text-sm mb-6 md:mb-0">
            <a
              href="/privacy-policy"
              className="text-gray-300 hover:text-[#E7C873] hover:underline transition duration-300 transform hover:scale-105"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-gray-300 hover:text-[#E7C873] hover:underline transition duration-300 transform hover:scale-105"
            >
              Terms of Service
            </a>
            <a
              href="/contactUs"
              className="text-gray-300 hover:text-[#E7C873] hover:underline transition duration-300 transform hover:scale-105"
            >
              Contact Us
            </a>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-6">
            <a
              href="#"
              className="relative group text-gray-300 hover:text-[#E7C873] transition duration-300 transform hover:scale-110"
              aria-label="Visit our Facebook page"
            >
              <FaFacebook size={28} />
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-[#115d5a] rounded opacity-0 group-hover:opacity-100 transition duration-300">
                Facebook
              </span>
            </a>
            <a
              href="#"
              className="relative group text-gray-300 hover:text-[#E7C873] transition duration-300 transform hover:scale-110"
              aria-label="Visit our Twitter page"
            >
              <FaTwitter size={28} />
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-[#115d5a] rounded opacity-0 group-hover:opacity-100 transition duration-300">
                Twitter
              </span>
            </a>
            <a
              href="#"
              className="relative group text-gray-300 hover:text-[#E7C873] transition duration-300 transform hover:scale-110"
              aria-label="Visit our Instagram page"
            >
              <FaInstagram size={28} />
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-[#115d5a] rounded opacity-0 group-hover:opacity-100 transition duration-300">
                Instagram
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;