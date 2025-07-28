import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../api/stores/auth.store";
import NavBar from "../../layout/Navbar";
import Footer from "../../layout/Footer";

export const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(formData);
      toast.success("Login successful!");

      setTimeout(() => {
        navigate(user?.role === "admin" ? "/admin/dashboard" : "/profile");
      }, 500);
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-black dark:bg-[#0a192f] dark:text-white">
      <NavBar />
      <div className="flex flex-1 items-center justify-center py-8">
        <div className="flex flex-col md:flex-row bg-white shadow-lg overflow-hidden max-w-3xl w-full rounded-2xl">
          
          {/* Left Section */}
          <div className="w-3/5 p-8 bg-[#115d5a] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#E7C873] mb-4">TIME</h1>
              <h2 className="text-2xl font-light text-white">to Travel</h2>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-3/4 p-12 bg-white/80 relative rounded-l-[50px]">
            <div className="max-w-md mx-auto text-center">
              <h2 className="text-xl font-semibold text-[#115d5a] mb-6">Login</h2>
              {error && (
                <p className="text-sm text-red-500 mb-4">{error.message}</p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a]"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 rounded-[20px] text-white transition-all ${
                    loading ? "bg-gray-400" : "bg-[#115d5a] hover:bg-[#0d4a47]"
                  }`}
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
