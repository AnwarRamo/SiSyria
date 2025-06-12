// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../api/stores/auth.store";
import { toast } from "react-toastify";
import NavBar from "../layout/Navbar";
import Footer from "../layout/Footer";

export const Register = () => {
  const navigate = useNavigate();

  // ✅ Use selectors to properly access Zustand store functions and state
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    displayName: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(formData);
      toast.success("Registration successful!");
      navigate(user.role === "admin" ? "/admin/dashboard" : "/profile");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#115d5a] to-[#E7C873]">
      <NavBar />
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-row bg-white shadow-lg overflow-hidden max-w-5xl rounded-r-[50px]">
          {/* Left Section */}
          <div className="w-3/5 p-8 bg-[#115d5a] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#E7C873] mb-4">TIME</h1>
              <h2 className="text-2xl font-light text-white">to Travel</h2>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-3/4 p-12 bg-white/80 relative -left-12 rounded-l-[50px]">
            <div className="max-w-md mx-auto text-center">
              <h2 className="text-xl font-semibold text-[#115d5a] mb-6">Register</h2>
              {error && (
                <p className="text-sm text-red-500 mb-4">{error.message}</p>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a]"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a]"
                  required
                />
                <input
                  type="text"
                  placeholder="Display Name"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a]"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a]"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 rounded-[20px] ${
                    loading ? "bg-gray-400" : "bg-[#115d5a] hover:bg-[#0d4a47]"
                  } text-white transition-all`}
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
