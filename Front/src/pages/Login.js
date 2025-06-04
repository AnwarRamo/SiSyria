import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../api/stores/auth.store";
import { toast } from "react-toastify";
import NavBar from "../layout/Navbar";
import Footer from "../layout/Footer";

export const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "" 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Try logging in the user with the form data
      const user = await login(formData);

      // Log the successful login
      console.log('Login successful, user:', user);

      // Set navigation delay to avoid UI glitches
      setTimeout(() => {
        // Navigate to either admin dashboard or user profile based on the role
        navigate(user?.role === "admin" ? "/admin/dashboard" : "/profile");
      }, 500);

      // Show success message after successful login
      toast.success("Login successful!");
    } catch (error) {
      // Log any errors encountered during login
      console.error('Login error:', error);

      // Show error message if login fails
      toast.error(error.message || "Login failed");
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
              <h2 className="text-xl font-semibold text-[#115d5a] mb-6">Login</h2>
              {error && (
                <p className="text-sm text-red-500 mb-4">{error.message}</p>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a]"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 rounded-[20px] ${
                    loading ? "bg-gray-400" : "bg-[#115d5a] hover:bg-[#0d4a47]"
                  } text-white transition-all`}
                >
                  {loading ? "Signing In..." : "Sign In"}
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

export default Login;
