// src/routes/AppRoutes.jsx

import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../layout/AdminLayout";
import ErrorBoundary from "../components/ErrorBoundary";
import LoadingSpinner from "../components/LodingSpinner";

import { useAuthStore } from "../api/stores/auth.store";

// Lazy Imports - Public
const Home = lazy(() => import("../pages/public/Home").then(module => ({ default: module.Home })));
const Login = lazy(() => import("../pages/public/Login").then(module => ({ default: module.Login })));
const Register = lazy(() => import("../pages/public/Register").then(module => ({ default: module.Register })));
const ContactUs = lazy(() => import("../pages/public/ContactUs"));
const AboutUs = lazy(() => import("../pages/public/AboutUs"));
const Travel = lazy(() => import("../pages/public/Travel"));
const Souvenirs = lazy(() => import("../pages/public/Souvenirs"));
const TripeDeatiles = lazy(() => import("../pages/public/TripeDeatiles"));
const Events = lazy(() => import("../pages/public/Events"));

// Lazy Imports - User
const TripRequestForm = lazy(() => import("../pages/user/TripRequestForm"));
const Profile = lazy(() => import("../pages/user/Profile"));
const TicketBookingPage = lazy(() => import("../pages/user/TicketBookingPage"));
const SelectTripToBook = lazy(() => import("../pages/user/SelectTripToBook"));
const CartPage = lazy(() => import("../pages/user/CartPage"));
const MyRegistrations = lazy(() => import("../pages/user/MyRegistrations"));

// Lazy Imports - Admin
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const ManageTrips = lazy(() => import("../pages/admin/ManageTrips"));
const UserManagement = lazy(() => import("../pages/admin/UserManagement"));
const AddTrip = lazy(() => import("../pages/admin/AddTrip"));
const TicketsReview = lazy(() => import("../pages/admin/TicketsReview"));
const EventRequests = lazy(() => import("../pages/admin/EventRequests"));
const OrganizedEvents = lazy(() => import("../pages/admin/OrganizedEvents"));
const RegistrationDashboard = lazy(() => import("../pages/admin/RegistrationDashboard"));
const TripDaysDetails = lazy(() => import("../pages/admin/TripDaysDetails"));


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
  { path: "/events", element: <Events /> },
    { path: "/trips/:tripId", element: <TripeDeatiles /> }, 
];

// Authenticated User Routes
const protectedRoutes = [
  { path: "/profile", element: <Profile /> },
  { path: "/TripRequestForm", element: <TripRequestForm /> },
  { path: "/my-registrations", element: <MyRegistrations /> },
  { path: "/book-ticket/:tripId", element: <TicketBookingPage /> },
  { path: "/book-ticket", element: <SelectTripToBook /> },
];

const AppRoutes = () => {
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
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
            <Route path="tickets" element={<TicketsReview />} />
            <Route path="event-requests" element={<EventRequests />} />
            <Route path="organized-events" element={<OrganizedEvents />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;