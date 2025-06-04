import React from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from "../../layout/Navbar";
import Footer from "../../layout/Footer";

export function BookingPage() {
  const location = useLocation();
  const { tripId, tripName, price } = location.state || {};

  return (
    <div>
      <NavBar />
      <div className=" flex flex-col items-center justify-center min-h-screen p-6"  style={{ background: "linear-gradient(135deg, #115d5a, #E7C873)" }}>
        <h1 className="mt-20 text-4xl font-bold text-[#115d5a] mb-8">Booking Page</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-[#115d5a] mb-4">
            Booking Details
          </h2>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Trip:</span> {tripName}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Price:</span> ${price}
          </p>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#115d5a] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#115d5a] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Payment Information
              </label>
              <input
                type="text"
                placeholder="Enter payment details"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#115d5a] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#115d5a] to-[#E7C873] text-white px-6 py-3 rounded-lg hover:from-[#E7C873] hover:to-[#115d5a] transition duration-300"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BookingPage;