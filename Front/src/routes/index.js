// src/routes/AppRoutes.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../layout/AdminLayout";
import ErrorBoundary from "../components/ErrorBoundary";
import LoadingSpinner from "../components/LodingSpinner";

import { useAuthStore } from "../api/stores/auth.store";

// Public/User Pages
import { Home, Login, Register,ContactUs, AboutUs, Travel, Souvenirs,TripeDeatiles } from "../pages/public";
import { TripRequestForm,Profile } from "../pages/user";
import CartPage from "../pages/user/CartPage";
import MyRegistrations from "../pages/user/MyRegistrations";

// Admin Pages
import { Dashboard, ManageTrips, UserManagement, AddTrip } from "../pages/admin";
import TripDaysDetails from "../pages/admin/TripDaysDetails";
import RegistrationDashboard from "../pages/admin/RegistrationDashboard";


// Public Routes
const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/about-us", element: <AboutUs /> },
  { path: "/contact-us", element: <ContactUs /> },
  { path: "/cart", element: <CartPage /> },
    { path: "/travel", element: <Travel /> },
  { path: "/souvenirs", element: <Souvenirs /> },
    { path: "/trips/:tripId", element: <TripeDeatiles /> }, 
];

// Authenticated User Routes
const protectedRoutes = [
  { path: "/profile", element: <Profile /> },
  { path: "/TripRequestForm", element: <TripRequestForm /> },
  { path: "/my-registrations", element: <MyRegistrations /> },
];

const AppRoutes = () => {
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<ErrorBoundary>{route.element}</ErrorBoundary>}
        />
      ))}

      <Route element={<ProtectedRoute />}>
        {protectedRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<ErrorBoundary>{route.element}</ErrorBoundary>}
          />
        ))}
      </Route>

      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="trips" element={<ManageTrips />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="add-trip" element={<AddTrip />} />
          <Route path="registrations" element={<RegistrationDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;