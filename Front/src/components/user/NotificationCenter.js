// ✅ Your NotificationCenter component is already very well structured!
// Below is a slightly cleaned-up and ready-to-use version without major structural changes.
// I added a few best-practice touches for maintainability and performance.
// Assuming everything works on backend (API calls) – no fixes were necessary.
// You can copy-paste this as-is in your NotificationCenter.js file.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle, FaTimes, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { TripService } from '../../api/services/trip.service';

const NotificationItem = ({ notification, onMarkAsRead, onViewTrip }) => {
  const [isMarking, setIsMarking] = useState(false);

  // Add null check for notification
  if (!notification) {
    return null;
  }

  const iconMap = {
    trip_approved: <FaCheckCircle className="w-5 h-5 text-green-500" />,
    trip_rejected: <FaTimesCircle className="w-5 h-5 text-red-500" />,
    trip_reminder: <FaClock className="w-5 h-5 text-blue-500" />,
    trip_cancelled: <FaExclamationTriangle className="w-5 h-5 text-orange-500" />,
    event_approved: <FaCheckCircle className="w-5 h-5 text-green-500" />,
    event_rejected: <FaTimesCircle className="w-5 h-5 text-red-500" />,
    default: <FaBell className="w-5 h-5 text-gray-500" />,
  };

  const colorMap = {
    trip_approved: 'border-green-200 bg-green-50',
    trip_rejected: 'border-red-200 bg-red-50',
    trip_reminder: 'border-blue-200 bg-blue-50',
    trip_cancelled: 'border-orange-200 bg-orange-50',
    event_approved: 'border-green-200 bg-green-50',
    event_rejected: 'border-red-200 bg-red-50',
    default: 'border-gray-200 bg-gray-50',
  };

  const getIcon = () => iconMap[notification.type] || iconMap.default;
  const getColor = () => colorMap[notification.type] || colorMap.default;

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown time';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const handleMarkAsRead = async () => {
    if (notification.isRead) return;
    setIsMarking(true);
    try {
      await onMarkAsRead(notification._id);
    } catch (error) {
      toast.error('Failed to mark notification as read');
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`border rounded-lg p-3 ${getColor()} ${!notification.isRead ? 'ring-2 ring-blue-200 shadow-lg' : 'shadow-sm'} hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
            {getIcon()}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                {notification.title || 'Notification'}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
                {notification.message || 'No message available'}
              </p>
              {notification.tripId && (
                <button
                  onClick={() => onViewTrip(notification.tripId._id || notification.tripId)}
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  <span>View Trip</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 ml-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {formatDate(notification.createdAt)}
              </span>
              {!notification.isRead && (
                <button
                  onClick={handleMarkAsRead}
                  disabled={isMarking}
                  className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors disabled:opacity-50 p-1 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20"
                  title="Mark as read"
                >
                  {isMarking ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400" />
                  ) : (
                    <FaCheck size={14} />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const NotificationCenter = ({ isOpen, onClose, onViewTrip, onNotificationUpdate }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Auto-refresh notifications every 30 seconds when open
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await TripService.getUserNotifications(50, 0);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    if (!notificationId || typeof notificationId !== 'string' || notificationId.length !== 24 || !/^[a-fA-F0-9]{24}$/.test(notificationId)) return;
    try {
      await TripService.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      // Update parent component's notification count
      if (onNotificationUpdate) {
        onNotificationUpdate();
      }
    } catch (error) {
      throw error;
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead && n._id && typeof n._id === 'string' && n._id.length === 24 && /^[a-fA-F0-9]{24}$/.test(n._id));
      await Promise.all(
        unreadNotifications.map(notif => 
          TripService.markNotificationAsRead(notif._id)
        )
      );
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
      // Update parent component's notification count
      if (onNotificationUpdate) {
        onNotificationUpdate();
      }
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (!notification) return false;
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const getFilterCount = (filterType) => {
    if (filterType === 'all') return notifications.length;
    if (filterType === 'unread') return unreadCount;
    return notifications.filter(n => n && n.type === filterType).length;
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      className="absolute top-full right-0 mt-2 z-50"
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Dropdown Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-96 max-h-96 overflow-hidden">
        {/* Arrow pointing up */}
        <div className="absolute -top-2 right-6 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 transform rotate-45"></div>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <FaBell className="w-6 h-6 text-white mr-3" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white">
                Notifications
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchNotifications}
                disabled={loading}
                className="text-sm text-white hover:text-blue-200 font-medium disabled:opacity-50 transition-colors"
                title="Refresh notifications"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-white hover:text-blue-200 font-medium transition-colors"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'All', activeClass: 'bg-blue-500 text-white shadow-lg' },
              { key: 'unread', label: 'Unread', activeClass: 'bg-red-500 text-white shadow-lg' },
              { key: 'trip_approved', label: 'Approved', activeClass: 'bg-green-500 text-white shadow-lg' },
              { key: 'trip_rejected', label: 'Rejected', activeClass: 'bg-orange-500 text-white shadow-lg' },
              { key: 'trip_reminder', label: 'Reminders', activeClass: 'bg-purple-500 text-white shadow-lg' },
              { key: 'event_approved', label: 'Event Approved', activeClass: 'bg-green-500 text-white shadow-lg' },
              { key: 'event_rejected', label: 'Event Rejected', activeClass: 'bg-orange-500 text-white shadow-lg' }
            ].map(({ key, label, activeClass }) => {
              const isActive = filter === key;
              const buttonClass = isActive 
                ? `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeClass}`
                : 'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500 border border-gray-200 dark:border-gray-600';
              
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={buttonClass}
                >
                  {label} ({getFilterCount(key)})
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-64 overflow-y-auto bg-white dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-24">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaBell className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {filter === 'all' 
                  ? "You'll see notifications about your trip registrations here."
                  : "Check back later for new notifications."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredNotifications.map(notification => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onViewTrip={onViewTrip}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
          
          {/* View All Button */}
          {!loading && filteredNotifications.length > 0 && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  onClose();
                  // You can navigate to a full notifications page here
                  window.open('/notifications', '_blank');
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationCenter;