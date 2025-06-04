import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaSuitcase,
  FaUsers,
  FaArrowAltCircleRight,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuthStore } from "../../api/stores/auth.store";

function Sidebar({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1000);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const navItems = [
    { to: "/admin/dashboard", icon: <FaTachometerAlt />, label: "Dashboard", adminOnly: true },
    { to: "/admin/trips", icon: <FaSuitcase />, label: "Manage Trips", adminOnly: true },
    { to: "/admin/users", icon: <FaUsers />, label: "User Management", adminOnly: true },
    { to: "/admin/add-trip", icon: <FaArrowAltCircleRight />, label: "Create Trip", adminOnly: true },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      const shouldCollapse = window.innerWidth < 1000;
      setIsCollapsed(shouldCollapse);
      if (!shouldCollapse) setIsOpen(false);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-blue-600 p-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-blue-900 to-blue-700 shadow-2xl p-4 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-50 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="h-full flex flex-col">
          {!isCollapsed && (
            <div className="text-white text-3xl font-extrabold tracking-wide mb-10 px-3">
              Travel Admin
            </div>
          )}

          <nav className="flex-1">
            <ul className="space-y-3">
              {navItems
                .filter(item => user?.role === 'admin' || !item.adminOnly)
                .map(({ to, icon, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? 'bg-white/20 text-white font-semibold shadow-md' 
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        } ${isCollapsed ? 'justify-center' : 'pl-4'}`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-2xl">{icon}</span>
                      {!isCollapsed && (
                        <span className="text-base">{label}</span>
                      )}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </nav>

          <div className="mt-auto border-t border-white/20 pt-6">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 ${
                isCollapsed ? 'justify-center' : 'pl-4 pr-3'
              } py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors duration-200`}
              aria-label="Logout"
            >
              <FaSignOutAlt className="text-2xl" />
              {!isCollapsed && (
                <span className="text-base">Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Spacer div to push content */}
      <div 
        className={`hidden md:block ${
          isCollapsed ? "ml-20" : "ml-64"
        } transition-margin duration-300 ease-in-out`}
      />
    </>
  );
}

export default Sidebar;