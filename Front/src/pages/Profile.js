import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSettings, FiLogOut, FiGrid, FiHeart } from 'react-icons/fi';
// BUG FIX: Import the 'shallow' equality checker from Zustand
import { shallow } from 'zustand/shallow';
import { useAuthStore } from '../api/stores/auth.store';

import Avatar from '../components/ui/Avatar';
import StatsRadarChart from '../components/ui/StatsRadarChart;';
import Navbar from '../layout/Navbar';
import FullPageSpinner from '../components/LodingSpinner';

const PROFILE_BG_IMAGE_URL = '/images/profile-cover.jpg';

// --- Sub-Components for Readability (No changes needed here) ---

const ProfileHeader = ({ user, onLogout }) => {
  const headerStyle = useMemo(() => ({
    backgroundImage: `linear-gradient(to bottom, rgba(17, 93, 90, 0.75), rgba(17, 93, 90, 0.4)), url(${PROFILE_BG_IMAGE_URL})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }), []);

  return (
    <motion.header
      style={headerStyle}
      className="relative pt-28 pb-16 md:pt-32 md:pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
          <Avatar
            src={user.avatar}
            name={user.displayName || user.username}
            size="xl"
            className="ring-4 ring-white/60 shadow-xl"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-sm">{user.displayName || user.username}</h1>
            <p className="text-sm text-white/80 mt-1">@{user.username}</p>
          </div>
          <div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium shadow-md transition-all"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
    const tabs = useMemo(() => [
        { id: 'overview', label: 'Overview', icon: FiGrid },
        { id: 'savedTrips', label: 'Saved Trips', icon: FiHeart },
        { id: 'settings', label: 'Settings', icon: FiSettings },
    ], []);

    return (
        <aside className="w-full lg:w-72 lg:flex-shrink-0 lg:sticky lg:top-24 self-start mb-8 lg:mb-0">
            <nav className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-left transition-all group ${
                            activeTab === tab.id
                            ? 'bg-gradient-to-r from-[#115d5a] to-[#187a74] text-white shadow-md'
                            : 'hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                    >
                        <tab.icon className="w-5 h-5" />
                        <span className="font-medium text-sm">{tab.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

const ProfileContent = ({ activeTab, user, savedTrips }) => {
    return (
        <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-xl min-h-[400px]"
                >
                    {activeTab === 'overview' && <div><h2 className="text-2xl font-semibold">Welcome, {user.displayName}!</h2> <p>This is your account overview.</p> <StatsRadarChart /> </div>}
                    {activeTab === 'savedTrips' && <div><h2 className="text-2xl font-semibold">Your Saved Trips</h2>{/* Map over savedTrips here */}</div>}
                    {activeTab === 'settings' && <div><h2 className="text-2xl font-semibold">Settings</h2><p>This section is under development.</p></div>}
                </motion.div>
            </AnimatePresence>
        </main>
    );
};


// --- Main Profile Component ---

export const Profile = () => {
  // BUG FIX: Apply the 'shallow' equality checker to the store hook.
  // This prevents the component from re-rendering unnecessarily.
  const { user, loading, logout, fetchRegisteredTrips, savedTrips } = useAuthStore(
    state => ({
      user: state.user,
      loading: state.loading,
      logout: state.logout,
      fetchRegisteredTrips: state.fetchRegisteredTrips,
      savedTrips: state.savedTrips,
    }),
    shallow
  );

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // This effect is now safe because 'fetchRegisteredTrips' is a stable reference
    // thanks to the shallow comparison, and we've specified user.id
    // as the dependency, which is more stable than the entire user object.
    if (user?.id) {
      fetchRegisteredTrips();
    }
  }, [user?.id, fetchRegisteredTrips]); // Use a primitive value like user.id for dependency

  if (loading && !user) {
    return <FullPageSpinner />;
  }

  if (!user) {
    return (
        <div className="flex items-center justify-center h-screen text-center">
            <div>
                <h2 className="text-2xl font-semibold">Authentication Error</h2>
                <p className="text-slate-600 mt-2">Please log in to view your profile.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Navbar />
      <ProfileHeader user={user} onLogout={logout} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="lg:flex lg:gap-8">
            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <ProfileContent activeTab={activeTab} user={user} savedTrips={savedTrips} />
        </div>
      </div>
    </div>
  );
};

export default Profile;