import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../api/stores/auth.store";
import { toast } from "react-toastify";
import NavBar from "../layout/Navbar";
import Footer from "../layout/Footer";

export const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await login(formData);
      console.log('✅ Logged in user:', user);
      if (!user) {
        return toast.error("Login failed: no user returned.");
      }

      toast.success("Login successful!");
      setTimeout(() => {
        navigate(user.role === "admin" ? "/admin/dashboard" : "/profile");
      }, 300);
    } catch (err) {
      console.error('🔴 Login error in component:', err);
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#115d5a] to-[#E7C873]">
      <NavBar />
      <div className="flex items-center justify-center h-full">
        <div className="flex bg-white shadow-lg overflow-hidden max-w-5xl rounded-r-3xl">
          <div className="w-2/5 p-8 bg-[#115d5a] flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold text-[#E7C873] mb-2">TIME</h1>
            <h2 className="text-2xl font-light text-white">to Travel</h2>
          </div>
          <div className="w-3/5 p-12 bg-white/80 relative -left-12 rounded-l-3xl">
            <h2 className="text-xl font-semibold text-[#115d5a] mb-6 text-center">Login</h2>
            {error && <p className="text-sm text-red-500 mb-4">{error.message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a]"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a]"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-full text-white transition ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#115d5a] hover:bg-[#0d4a47]"
                }`}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
