import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../api/stores/auth.store";
import NavBar from "../../layout/Navbar";
import Footer from "../../layout/Footer";

 export const Register = () => {
  const navigate = useNavigate();

  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    displayName: "",
    phone: "",
    nationalId: "",
  });



  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic frontend validation
    if (!formData.username || !formData.email || !formData.password || !formData.phone || !formData.nationalId) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    if (!/\d/.test(formData.password)) {
      toast.error("Password must contain at least one number");
      return;
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      toast.error("Password must contain at least one special character");
      return;
    }
    

    
    try {
      const user = await register(formData);
      if (!user) {
        toast.error("Registration successful but user data is missing");
        navigate("/login");
        return;
      }
      
      toast.success("Registration successful!");
      
      // Default to profile if role is not available
      const redirectPath = (user && user.role === "admin") ? "/admin/dashboard" : "/profile";

      navigate(redirectPath);
    } catch (err) {

      
      let errorMessage = "Registration failed";
      
      if (err.response?.status === 409) {
        errorMessage = err.response?.data?.message || "Username or email already exists";
      } else if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        errorMessage = err.response.data.errors[0].msg;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-black dark:bg-[#0a192f] dark:text-white">
      <NavBar />
      <div className="flex flex-1 items-center justify-center py-8">
        <div className="flex flex-col md:flex-row bg-white shadow-lg overflow-hidden max-w-3xl w-full rounded-2xl">
          {/* Left Section (hidden on mobile) */}
          <div className="hidden md:flex md:w-2/5 p-8 bg-[#115d5a] items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#E7C873] mb-4">TIME</h1>
              <h2 className="text-2xl font-light text-white">to Travel</h2>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-3/5 p-6 md:p-12 bg-white/80 relative rounded-2xl md:rounded-l-none flex items-center justify-center">
            <div className="w-full max-w-md mx-auto text-center">
              <h2 className="text-xl font-semibold text-[#115d5a] mb-6">Register</h2>
              {error && (
                <p className="text-sm text-red-500 mb-4">{error.message}</p>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username *"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a]"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">3-31 characters</p>
                </div>
                
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a]"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="text"
                    name="displayName"
                    placeholder="Display Name (Optional)"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a]"
                  />
                </div>
                
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a]"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Up to 20 characters</p>
                </div>
                
                <div>
                  <input
                    type="text"
                    name="nationalId"
                    placeholder="National ID Number *"
                    value={formData.nationalId}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a]"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Up to 20 characters</p>
                </div>
                
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password *"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a]"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Min 8 characters, include number & special character</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 rounded-[20px] text-white transition-all ${
                    loading ? "bg-gray-400" : "bg-[#115d5a] hover:bg-[#0d4a47]"
                  }`}
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
