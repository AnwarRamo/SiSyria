import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../api/stores/auth.store";
import { useCartStore } from "../api/stores/cart.store";
import { FaUserCircle, FaCaretDown, FaShoppingCart, FaSun, FaMoon, FaBell } from "react-icons/fa";
import logo from "../assets/images/logo.jpg";
import CartModal from "../pages/user/CartPage";
import NotificationCenter from "../components/user/NotificationCenter";
import { TripService } from "../api/services/trip.service";
import { toast } from "react-toastify";

const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/travel", label: "Travel" },
  { path: "/souvenirs", label: "Souvenirs" },
  { path: "/about-us", label: "About Us" },
  { path: "/contact-us", label: "Contact" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const navRef = useRef(null);
  const location = useLocation();

  const { user, logout } = useAuthStore();
  const { items, totalQuantity } = useCartStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
    setIsCartOpen(false);
    setIsNotificationOpen(false);
  }, [location]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNotificationOpen && !event.target.closest('.notification-container')) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  // Fetch notification count when user is logged in
  useEffect(() => {
    if (user) {
      fetchNotificationCount();
      // Set up interval to fetch notifications every 2 minutes (reduced frequency)
      const interval = setInterval(fetchNotificationCount, 120000);
      return () => clearInterval(interval);
    } else {
      setNotificationCount(0);
    }
  }, [user]);

  const fetchNotificationCount = async () => {
    try {
      const data = await TripService.getUserNotifications(1, 0);
      const newCount = data.unreadCount || 0;
      
      // Show toast if there are new notifications
      if (newCount > notificationCount && notificationCount > 0) {
        toast.info(`You have ${newCount - notificationCount} new notification${newCount - notificationCount > 1 ? 's' : ''}!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      
      setNotificationCount(newCount);
    } catch (error) {
      // Don't log errors for notification fetching to reduce console noise
      // Only set count to 0 if it's a network error, not rate limiting
      if (error.code === 'ERR_NETWORK' || error.response?.status === 429) {
        // Keep the previous count if it's a temporary error
        return;
      }
      setNotificationCount(0);
    }
  };

  // Load dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem('sisyria-theme');
    if (saved === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('sisyria-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('sisyria-theme', 'light');
      }
      return next;
    });
  };

  const handleLogout = async () => {
    try {
      await logout?.();
    } catch {}
  };

  const cartCount = totalQuantity?.() || 0;
  const hasCartItems = (items?.length || 0) > 0;

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-lg bg-white/80 dark:bg-[#0a192f]/90 shadow-2xl" : "bg-white/60 dark:bg-[#0a192f]/80"
      } border-b border-white/30`}
      style={{
        boxShadow: isScrolled ? "0 8px 32px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
        backdropFilter: "blur(12px)",
      }}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-12 w-12 rounded-full shadow-md" />
          <span className="text-2xl font-extrabold tracking-tight text-black dark:text-white hidden sm:block" style={{ letterSpacing: '-1px' }}>SiSyria</span>
        </NavLink>

        {/* Center Nav Links */}
        <div className="hidden lg:flex gap-2 relative">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative px-4 py-2 text-lg font-semibold transition-colors duration-200 rounded-full group ` +
                (isActive
                  ? "bg-white text-black border-2 border-[#FF4500] shadow-md dark:bg-[#0a192f] dark:text-white"
                  : "bg-white text-black border-2 border-transparent hover:border-[#FF4500] hover:text-[#FF4500] dark:bg-[#0a192f] dark:text-white dark:hover:text-[#FF4500]")
              }
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {link.label}
              {/* Animated underline */}
              <span
                className={`absolute left-4 right-4 -bottom-1 h-0.5 rounded bg-[#FF4500] transition-all duration-300 ${
                  location.pathname === link.path ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </NavLink>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center p-2 rounded-full bg-white/70 dark:bg-[#0a192f]/80 hover:bg-[#FF4500]/10 dark:hover:bg-[#FF4500]/20 transition shadow"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <FaSun className="text-yellow-400 text-xl" /> : <FaMoon className="text-black text-xl dark:text-white" />}
          </button>

          {/* Cart */}
          <div className="relative">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-black dark:text-white hover:text-[#FF4500]"
              aria-label="Open cart"
            >
              <FaShoppingCart className="h-7 w-7" />
              {hasCartItems && (
                <span className="absolute -top-2 -right-2 text-xs bg-[#FF4500] text-white px-2 py-0.5 rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Notifications */}
          {user && (
            <div className="relative notification-container">
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  if (!isNotificationOpen) {
                    // Refresh notifications when opened
                    fetchNotificationCount();
                  }
                }}
                className={`relative text-black dark:text-white hover:text-[#FF4500] transition-all duration-200 ${
                  notificationCount > 0 ? 'animate-bounce' : ''
                }`}
                aria-label="Open notifications"
              >
                <div className="relative">
                  <FaBell className={`h-7 w-7 ${notificationCount > 0 ? 'text-[#FF4500] drop-shadow-lg' : ''}`} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse shadow-lg font-semibold">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </div>
              </button>
              
              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <NotificationCenter 
                  isOpen={isNotificationOpen} 
                  onClose={() => setIsNotificationOpen(false)}
                  onViewTrip={(tripId) => {
                    setIsNotificationOpen(false);
                    window.open(`/trips/${tripId}`, '_blank');
                  }}
                  onNotificationUpdate={fetchNotificationCount}
                />
              )}
            </div>
          )}

          {/* User Profile */}
          <div className="relative">
            {user ? (
              <>
                <button
                  onClick={() => setIsUserDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={isUserDropdownOpen}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-9 h-9 rounded-full border-2 border-[#FF4500] object-cover shadow"
                    />
                  ) : (
                    <FaUserCircle className="w-9 h-9 text-black dark:text-white" />
                  )}
                  <FaCaretDown className="text-black dark:text-white" />
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/95 dark:bg-[#0a192f]/95 backdrop-blur-lg rounded-xl shadow-2xl py-2 z-50 border border-white/40 animate-fade-in-down">
                    <NavLink to="/profile" className="block px-4 py-2 text-base hover:bg-[#FF4500]/10 dark:hover:bg-[#FF4500]/20 rounded-lg transition">Profile</NavLink>
                    <NavLink to="/my-registrations" className="block px-4 py-2 text-base hover:bg-[#FF4500]/10 dark:hover:bg-[#FF4500]/20 rounded-lg transition">My Registrations</NavLink>
                    {user.role === "admin" && (
                      <NavLink to="/admin/dashboard" className="block px-4 py-2 text-base hover:bg-[#FF4500]/10 dark:hover:bg-[#FF4500]/20 rounded-lg transition">Dashboard</NavLink>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-base text-red-600 hover:bg-[#FF4500]/10 dark:hover:bg-[#FF4500]/20 rounded-lg transition"
                    >Logout</button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex gap-2">
                <NavLink to="/login" className="bg-white text-black border-2 border-[#FF4500] font-semibold px-4 py-2 rounded-full shadow hover:bg-[#FF4500] hover:text-white transition dark:bg-[#0a192f] dark:text-white dark:hover:bg-[#FF4500]" >Login</NavLink>
                <NavLink to="/register" className="bg-[#FF4500] text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-[#d63a00] transition">Sign Up</NavLink>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF4500]"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden px-4 pb-4 pt-2 bg-white/95 dark:bg-[#0a192f]/95 backdrop-blur-lg shadow-2xl border-t border-white/30 z-40 animate-fade-in-down">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `block py-3 text-lg rounded-full transition font-semibold px-4 " "` +
                (isActive
                  ? "bg-white text-black border-2 border-[#FF4500] shadow-md dark:bg-[#0a192f] dark:text-white"
                  : "bg-white text-black border-2 border-transparent hover:border-[#FF4500] hover:text-[#FF4500] dark:bg-[#0a192f] dark:text-white dark:hover:text-[#FF4500]")
              }
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {!user ? (
            <div className="flex flex-col gap-2 mt-2">
              <NavLink to="/login" className="bg-white text-black border-2 border-[#FF4500] font-semibold px-4 py-2 rounded-full shadow hover:bg-[#FF4500] hover:text-white transition dark:bg-[#0a192f] dark:text-white dark:hover:bg-[#FF4500]" onClick={() => setIsMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" className="bg-[#FF4500] text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-[#d63a00] transition" onClick={() => setIsMenuOpen(false)}>Sign Up</NavLink>
            </div>
          ) : (
            <>
              <NavLink to="/profile" className="block py-3 text-lg rounded-full transition font-semibold px-4 bg-white text-black border-2 border-[#FF4500] shadow-md dark:bg-[#0a192f] dark:text-white" onClick={() => setIsMenuOpen(false)}>Profile</NavLink>
              <NavLink to="/my-registrations" className="block py-3 text-lg rounded-full transition font-semibold px-4 bg-white text-black border-2 border-[#FF4500] shadow-md dark:bg-[#0a192f] dark:text-white" onClick={() => setIsMenuOpen(false)}>My Registrations</NavLink>
              <button 
                onClick={() => { setIsNotificationOpen(true); setIsMenuOpen(false); }}
                className="block w-full text-left py-3 text-lg rounded-full transition font-semibold px-4 bg-white text-black border-2 border-[#FF4500] shadow-md dark:bg-[#0a192f] dark:text-white"
              >
                Notifications
                {notificationCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
              {user.role === "admin" && (
                <NavLink to="/admin/dashboard" className="block py-3 text-lg rounded-full transition font-semibold px-4 bg-white text-black border-2 border-[#FF4500] shadow-md dark:bg-[#0a192f] dark:text-white" onClick={() => setIsMenuOpen(false)}>Dashboard</NavLink>
              )}
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left py-3 text-lg text-red-600 hover:bg-[#FF4500]/10 dark:hover:bg-[#FF4500]/20 rounded-lg transition">Logout</button>
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
