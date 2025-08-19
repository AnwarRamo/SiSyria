import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSettings, FiLogOut, FiGrid, FiHeart, FiClock, FiUser, FiPhone, 
  FiGlobe, FiCreditCard, FiMail, FiMapPin, FiCalendar, FiUsers,
  FiEdit3, FiSave, FiX, FiCheck, FiAlertCircle, FiStar, FiBell
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../api/stores/auth.store';
import { UserService } from '../../api/services/user.service';
import { TripService } from '../../api/services/trip.service';
import Avatar from '../../components/ui/Avatar';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import LodingSpinner from '../../components/LodingSpinner';
import TicketManagement from '../../components/user/TicketManagement';
import NotificationCenter from '../../components/user/NotificationCenter';

const ProfileHeader = ({ user, onLogout }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <Avatar
            src={user?.avatar}
            name={user?.displayName || user?.username || 'User'}
            size="xl"
            className="ring-4 ring-white/30 shadow-xl"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              {user?.displayName || user?.username || 'User Profile'}
            </h1>
            <p className="text-lg opacity-90 mb-4">@{user?.username}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <FiMail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-2">
                  <FiPhone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ProfileStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FiHeart className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalTrips || 0}</p>
            <p className="text-sm text-gray-600">Total Trips</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <FiCheck className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.approvedTrips || 0}</p>
            <p className="text-sm text-gray-600">Approved</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-100 rounded-lg">
            <FiClock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingTrips || 0}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <FiStar className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.favoriteTrips || 0}</p>
            <p className="text-sm text-gray-600">Favorites</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PersonalInfoSection = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    phone: user?.phone || '',
    nationalId: user?.nationalId || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await UserService.updatePersonalInfo(formData);
      onUpdate(formData);
      setIsEditing(false);
      toast.success('Personal information updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update personal information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || '',
      phone: user?.phone || '',
      nationalId: user?.nationalId || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiEdit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiX className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-900">{user?.displayName || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <p className="text-gray-900">{user?.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          {isEditing ? (
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-900">{user?.phone || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">National ID</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.nationalId}
              onChange={(e) => setFormData(prev => ({ ...prev, nationalId: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-900">{user?.nationalId || 'Not set'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const RecentTripsSection = ({ trips }) => {
  const navigate = useNavigate();

  if (!trips || trips.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center">
        <FiMapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Trips Yet</h3>
        <p className="text-gray-600 mb-4">You haven't registered for any trips yet.</p>
        <button
          onClick={() => navigate('/travel')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Trips
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent Trip Registrations</h2>
        <button
          onClick={() => navigate('/my-registrations')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {trips.slice(0, 3).map((trip) => (
          <div
            key={trip._id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/trips/${trip.tripId?._id || trip._id}`)}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <FiMapPin className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {trip.tripId?.title || 'Trip Title Not Available'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {trip.tripId?.destination || 'Destination not available'}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trip.status === 'approved' ? 'bg-green-100 text-green-800' :
                    trip.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {trip.status}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {trip.registeredAt ? new Date(trip.registeredAt).toLocaleDateString() : 'Date not available'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AccountSettingsSection = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    promotions: true
  });

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleNotificationChange('email')}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700">Email notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={() => handleNotificationChange('sms')}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700">SMS notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.promotions}
                onChange={() => handleNotificationChange('promotions')}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700">Promotional offers</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700">Show profile to other users</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700">Allow trip recommendations</span>
            </label>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
};

 export const Profile = () => {
  const { user, logout, loading } = useAuthStore();
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          setIsLoadingTrips(true);
          const userTrips = await TripService.getUserBookings();
          setTrips(userTrips || []);
          
          // Calculate stats
          const tripStats = {
            totalTrips: userTrips?.length || 0,
            approvedTrips: userTrips?.filter(t => t.status === 'approved').length || 0,
            pendingTrips: userTrips?.filter(t => t.status === 'pending').length || 0,
            favoriteTrips: 0 // This would come from a favorites API
          };
          setStats(tripStats);
        } catch (error) {
          console.error('Error fetching user trips:', error);
          // Don't show error toast for network issues, just log them
          if (error.code !== 'ERR_NETWORK' && error.response?.status !== 429) {
            toast.error('Failed to load trip data');
          }
        } finally {
          setIsLoadingTrips(false);
        }
      }
    };

    fetchUserData();
  }, [user?.id]);

  const handleUserUpdate = (updatedData) => {
    // Update the user in the store
    // This would typically be handled by the auth store
  };

  if (loading) {
    return <LodingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <ProfileHeader user={user} onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: FiGrid },
            { id: 'personal', label: 'Personal Info', icon: FiUser },
            { id: 'trips', label: 'My Trips', icon: FiMapPin },
            { id: 'tickets', label: 'My Tickets', icon: FiCreditCard },
            { id: 'settings', label: 'Settings', icon: FiSettings },
            { id: 'notifications', label: 'Notifications', icon: FiBell }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <ProfileStats stats={stats} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <PersonalInfoSection user={user} onUpdate={handleUserUpdate} />
                  <RecentTripsSection trips={trips} />
                </div>
              </div>
            )}

            {activeTab === 'personal' && (
              <PersonalInfoSection user={user} onUpdate={handleUserUpdate} />
            )}

            {activeTab === 'trips' && (
              <RecentTripsSection trips={trips} />
            )}

            {activeTab === 'tickets' && (
              <TicketManagement />
            )}

            {activeTab === 'settings' && (
              <AccountSettingsSection />
            )}

            {activeTab === 'notifications' && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(true)}
                  className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Open Notifications
                </button>
                {showNotifications && (
                  <NotificationCenter
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                    onViewTrip={(tripId) => window.open(`/trips/${tripId}`, '_blank')}
                  />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;