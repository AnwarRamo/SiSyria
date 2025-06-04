import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSettings, FiLogOut, FiGlobe, FiEdit, FiGrid, FiHeart,
  FiActivity, FiShield
} from "react-icons/fi";
import Avatar from '../components/ui/Avatar';
import StatsRadarChart from '../components/ui/StatsRadarChart;';
import { AuthService } from '../api/services/auth.service';
import { TripService } from '../api/services/trip.service';
import Navbar from "../layout/Navbar";

const PROFILE_BG_IMAGE_URL = "/images/profile-cover.jpg";

export const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAllTrips, setShowAllTrips] = useState(false);
  const [user, setUser] = useState(null);
  const [savedTrips, setSavedTrips] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await AuthService.getCurrentUser();
        console.log("Current user data:", response);

        if (!response || !response.user) throw new Error("User not authenticated");

        setUser(response.user);

        // Fetch only trips user registered for:
        const trips = await TripService.getRegisteredTrips();
        setSavedTrips(trips);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load profile data. Please try again later.");
      }
    }
    fetchData();
  }, []);

  const tripsToDisplay = useMemo(() => (
    showAllTrips ? savedTrips : savedTrips.slice(0, 2)
  ), [showAllTrips, savedTrips]);

  const headerStyle = useMemo(() => ({
    backgroundImage: `linear-gradient(to bottom, rgba(17, 93, 90, 0.75), rgba(17, 93, 90, 0.4)), url(${PROFILE_BG_IMAGE_URL})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }), []);

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 text-center py-20 text-red-500 dark:text-red-400 text-lg">
      {error}
    </div>
  );
  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 text-center py-20 text-slate-600 dark:text-slate-300 text-lg">
      Loading profile...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Navbar />
      {/* Profile Header */}
      <motion.div className="relative pt-28 pb-16 md:pt-32 md:pb-20" style={headerStyle}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-slate-900 via-transparent to-transparent opacity-60"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
            <Avatar
              src={user.image}
              name={user.displayName || user.username}
              size="xl"
              className="ring-4 ring-white/60 dark:ring-slate-800/60 shadow-xl"
            />
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-sm">{user.displayName || user.username}</h1>
                <button className="p-2 hover:bg-white/25 rounded-full transition-colors duration-150">
                  <FiEdit className="text-white/90 w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-white/80 mb-1">@{user.username}</p>
              <div className="text-white/75 text-xs mb-3 flex flex-wrap gap-x-4 gap-y-1 justify-center md:justify-start">
                {user.location && (
                  <span className="flex items-center gap-1.5"><FiGlobe className="w-3.5 h-3.5" />{user.location}</span>
                )}
                <span>Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
              {user.bio && <p className="text-sm text-white/95 max-w-xl leading-relaxed hidden md:block">{user.bio}</p>}
            </div>
            <div>
              <button
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-150"
                onClick={async () => {
                  try {
                    await AuthService.logout();
                    window.location.reload();
                  } catch (e) {
                    alert("Logout failed.");
                  }
                }}>
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
          {user.bio && <p className="text-sm text-white/95 max-w-xl mx-auto leading-relaxed md:hidden text-center mt-6">{user.bio}</p>}
        </div>
      </motion.div>

      {/* Main Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="lg:flex lg:gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 lg:flex-shrink-0 lg:sticky lg:top-28 self-start bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-900/50 lg:max-h-[calc(100vh-8rem)] overflow-y-auto mb-8 lg:mb-0 transition-all duration-300">
            <nav>
              {[
                { id: 'overview', label: 'Overview', icon: FiGrid },
                { id: 'savedTrips', label: 'Saved Trips', icon: FiHeart },
                { id: 'activity', label: 'My Activity', icon: FiActivity },
                { id: 'settings', label: 'Settings', icon: FiSettings },
                { id: 'security', label: 'Security', icon: FiShield },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-lg mb-2 text-left transition-all duration-150 ease-in-out group ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#115d5a] to-[#187a74] text-white shadow-md scale-[1.01]'
                      : 'hover:bg-slate-200/70 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-300 hover:scale-[1.02] transform'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 transition-transform duration-150 ${activeTab === tab.id ? '' : 'group-hover:scale-110'}`} />
                  <span className="font-medium text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-xl dark:shadow-slate-900/50 min-h-[400px]"
              >
                {activeTab === "overview" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h2 className="text-2xl font-semibold mb-6 text-slate-700 dark:text-slate-200">Account Details</h2>
                      <div className="space-y-3">
                        <p><strong className="font-medium text-slate-600 dark:text-slate-300">Display Name:</strong> {user.displayName || 'Not set'}</p>
                        <p><strong className="font-medium text-slate-600 dark:text-slate-300">Username:</strong> @{user.username}</p>
                        <p><strong className="font-medium text-slate-600 dark:text-slate-300">Email:</strong> {user.email}</p>
                        <p><strong className="font-medium text-slate-600 dark:text-slate-300">Joined:</strong> {new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        {user.location && <p><strong className="font-medium text-slate-600 dark:text-slate-300">Location:</strong> {user.location}</p>}
                      </div>
                    </div>
                    <div className="min-h-[250px] flex items-center justify-center">
                      <StatsRadarChart />
                    </div>
                  </div>
                )}

                {activeTab === "savedTrips" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-8 text-slate-700 dark:text-slate-200">Registered Trips</h2>
                    {savedTrips.length === 0 ? (
                      <p className="text-slate-500 dark:text-slate-400 text-center py-10">You haven't registered for any trips yet.</p>
                    ) : (
                      <>
                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-8">
                          {tripsToDisplay.map(trip => (
                            <div key={trip._id || trip.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl dark:hover:shadow-slate-700/80 border border-slate-200 dark:border-slate-700/50 transition-all duration-300 transform hover:-translate-y-1">
                              <img src={trip.images && trip.images.length > 0 ? trip.images[0] : '/images/placeholder-trip.jpg'} alt={trip.title} className="w-full h-52 object-cover" />
                              <div className="p-5">
                                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-1">{trip.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                                  <FiGlobe className="w-3.5 h-3.5 flex-shrink-0" /> {trip.destination}
                                </p>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200 dark:border-slate-600/50">
                                  <p className="text-sm font-medium text-[#115d5a] dark:text-teal-400">💰 ${trip.price}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    ⏱ {trip.duration || calculateDuration(trip.startDate, trip.endDate)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {savedTrips.length > 2 && (
                          <div className="mt-8 text-center">
                            <button onClick={() => setShowAllTrips(!showAllTrips)} className="px-6 py-2 bg-gradient-to-r from-[#115d5a] to-[#187a74] text-white rounded-md hover:opacity-90 transition-opacity text-sm font-medium">
                              {showAllTrips ? 'Show Less Trips' : 'Show More Trips'}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {["activity", "settings", "security"].includes(activeTab) && (
                  <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                    <FiSettings className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-xl font-semibold mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
                    <p>This section is currently under development.</p>
                    <p>Please check back later for updates!</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

// Optional helper for duration display
function calculateDuration(startDate, endDate) {
  if (!startDate || !endDate) return '';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
}

export default Profile;
