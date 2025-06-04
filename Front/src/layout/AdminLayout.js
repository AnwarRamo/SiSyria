// src/layout/AdminLayout.jsx (Create this file)
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import NavbarDashboard from '../components/admin/navbarDashboard'; // Correct path
import Sidebar from '../components/admin/Sidebar'; // Correct path
import { useAuthStore } from '../api/stores/auth.store';
import LoadingSpinner from '../components/LodingSpinner'; // Correct path

const AdminLayout = () => {
  const user = useAuthStore(state => state.user);
  const loading = useAuthStore(state => state.loading);

  // This component is already rendered *inside* a ProtectedRoute (adminOnly),
  // so user should exist and be an admin. But we can check loading state.
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Extra safety check, though ProtectedRoute should handle this
  if (!user) {
     console.log("AdminLayout: No user found despite ProtectedRoute, redirecting.");
     return <Navigate to="/login" replace />;
  }


  return (
<div className="flex h-screen bg-gray-100">
<Sidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
         {/* Navbar */}
        <NavbarDashboard />

        {/* Page Contenta (Outlet renders the specific admin page) */}
        {/* Added pt-16 for fixed navbar height, overflow-y-auto for scrolling */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-16">
           <div className="container mx-auto px-6 py-8"> {/* Add padding around content */}
             <Outlet /> {/* Child route component renders here */}
           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;