// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../api/stores/auth.store';
import { AdminService } from '../../api/services/admin.service';
import LoadingSpinner from '../../components/LodingSpinner';
import ErrorDisplay from '../../components/ErrorBoundary';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { getDisplayErrorMessage } from '../../components/ui/errorUtils'; // Ensure path is correct

const initialDashboardState = {
  travelData: [],
  tripData: {},     // For TripOverview, TopDestinations
  revenueData: [],  // For RevenueOverview (original intent)
  userData: [],     // For user stats/list if needed
  kpiData: {},      // For DashboardKPIs
  orderTrendData: { labels: [], orderCounts: [] }, // For OrdersTrendChart
  orderProductData: [], // For OrderProductOverview
  loading: true,
  error: null,
};

export function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const storeLoading = useAuthStore((state) => state.loading);

  const [dashboardData, setDashboardData] = useState(initialDashboardState);

  const abortControllerRef = useRef(null);
  const activityTimeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const updateActivity = useCallback(() => { lastActivityRef.current = Date.now(); }, []);

  const checkInactivity = useCallback(() => {
    const timeSinceLastActivity = Date.now() - lastActivityRef.current;
    const INACTIVITY_LIMIT = 15 * 60 * 1000;
    if (timeSinceLastActivity > INACTIVITY_LIMIT) {
      console.log('[Dashboard] User inactive, logging out...');
      logout();
    }
  }, [logout]);

  useEffect(() => {
    console.log('[Dashboard Effect Activity] Setting up activity listeners.');
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, updateActivity, { passive: true }));
    updateActivity();
    activityTimeoutRef.current = setInterval(checkInactivity, 30 * 1000);
    return () => {
      console.log('[Dashboard Effect Activity] Cleaning up activity listeners and aborting fetch.');
      events.forEach((event) => window.removeEventListener(event, updateActivity));
      if (activityTimeoutRef.current) clearInterval(activityTimeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [updateActivity, checkInactivity]);

  const loadData = useCallback(async (signal) => {
    console.log('[loadData] Called.');
    if (signal.aborted) {
      console.log('[loadData] Fetch aborted before starting.');
      return;
    }
    setDashboardData(prev => ({ ...initialDashboardState, loading: true, error: null })); // Reset to initial for loading
    console.log('[loadData] Set loading to true. Initializing data fetch...');

    try {
      const processFetch = async (promiseFnToExecute, defaultValue, sourceName) => {
        console.log(`[loadData processFetch] Fetching ${sourceName}...`);
        try {
          const result = await promiseFnToExecute();
          console.log(`[loadData processFetch] Successfully fetched ${sourceName}. Result:`, result);
          return { data: result, error: null, source: sourceName };
        } catch (err) {
          if (err.name === 'AbortError' || (signal && signal.aborted)) {
            console.log(`[loadData processFetch] Fetch aborted for ${sourceName}.`);
            throw err;
          }
          console.error(`[loadData processFetch] Error fetching ${sourceName}:`, err);
          return { data: defaultValue, error: err, source: sourceName };
        }
      };

      console.log('[loadData] Awaiting Promise.all...');
      const results = await Promise.all([
        processFetch(() => AdminService.fetchTravelPackages(signal), initialDashboardState.travelData, 'Travel Packages'),
        processFetch(() => AdminService.getTripOverview(signal), initialDashboardState.tripData, 'Trip Overview'),
        processFetch(() => AdminService.fetchRevenueData(signal), initialDashboardState.revenueData, 'Revenue Data'), // This could be for RevenueOverview chart
        processFetch(() => AdminService.fetchAllUsers(signal), initialDashboardState.userData, 'User Data'),
        processFetch(() => AdminService.fetchDashboardKPIs(signal), initialDashboardState.kpiData, 'Dashboard KPIs'),
        processFetch(() => AdminService.fetchOrderTrends(signal), initialDashboardState.orderTrendData, 'Order Trends'),
        processFetch(() => AdminService.fetchOrderProductData(signal), initialDashboardState.orderProductData, 'Order/Product Data'),
      ]);
      console.log('[loadData] Promise.all resolved. Results:', results);

      if (signal.aborted) {
        console.log('[loadData] Data fetch aborted after Promise.all resolved.');
        setDashboardData(prev => ({ ...prev, loading: false }));
        return;
      }

      const errors = results.filter(r => r.error !== null);
      let overallError = null;

      if (errors.length > 0) {
        const firstErrorDetails = errors[0];
        const firstErrorMessage = getDisplayErrorMessage(firstErrorDetails.error, `Failed to load ${firstErrorDetails.source}.`);
        overallError = `Some dashboard data could not be loaded. First error from ${firstErrorDetails.source}: ${firstErrorMessage}`;
        console.warn('[loadData] Errors found after processing fetches:', errors);
      }

      console.log('[loadData] Setting final dashboard state. Overall error:', overallError);
      setDashboardData({
        travelData: results[0].data,
        tripData: results[1].data,
        revenueData: results[2].data, // Pass this to RevenueOverview
        userData: results[3].data,   // Pass this to relevant component if needed (e.g. User list)
        kpiData: results[4].data,
        orderTrendData: results[5].data,
        orderProductData: results[6].data,
        loading: false,
        error: overallError,
      });
      console.log('[loadData] Successfully set final dashboard state.');

    } catch (error) {
      console.error('[loadData] Main try-catch block caught an error:', error);
      if (error.name === 'AbortError' || (signal && signal.aborted)) {
        console.log('[loadData] Data fetch aborted (caught in main catch).');
        setDashboardData(prev => ({ ...prev, loading: false, error: prev.error || null }));
        return;
      }
      if (!signal || !signal.aborted) {
        const displayError = getDisplayErrorMessage(error, 'A critical error occurred while loading dashboard data.');
        setDashboardData({ ...initialDashboardState, loading: false, error: displayError });
        console.log('[loadData] Set critical error state.');
      } else {
         setDashboardData(prev => ({...prev, loading: false}));
      }
    }
  }, [getDisplayErrorMessage]); // Added getDisplayErrorMessage as it's used in catch

  useEffect(() => {
    console.log('[Dashboard Effect Auth] Checking auth state. StoreLoading:', storeLoading, 'User:', !!user);
    if (!storeLoading && user) {
      console.log('[Dashboard Effect Auth] User authenticated. Initializing data load.');
      const currentAbortController = new AbortController();
      abortControllerRef.current = currentAbortController;
      loadData(currentAbortController.signal);
    } else if (!storeLoading && !user) {
      console.log('[Dashboard Effect Auth] User not authenticated. Redirecting to login.');
      navigate('/login', { replace: true });
    }
     return () => { // Cleanup for this effect specifically if user/storeLoading changes rapidly
        if (abortControllerRef.current) {
            console.log('[Dashboard Effect Auth] Cleaning up auth effect, aborting if a fetch was in progress from this specific effect instance.');
            abortControllerRef.current.abort();
        }
    };
  }, [storeLoading, user, loadData, navigate]);

  console.log('[Dashboard Render] Current state:', { dashboardLoading: dashboardData.loading, storeLoading, error: dashboardData.error });

  if (dashboardData.loading || storeLoading) {
    console.log('[Dashboard Render] Showing LoadingSpinner.');
    return <LoadingSpinner fullScreen message="Loading Dashboard..." />;
  }

  if (dashboardData.error) {
    console.log('[Dashboard Render] Showing ErrorDisplay for error:', dashboardData.error);
    return (
      <div className="p-4">
        <ErrorDisplay
          message={dashboardData.error}
          onRetry={() => {
            console.log('[Dashboard ErrorDisplay] Retrying data load.');
            if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
                abortControllerRef.current.abort(); 
            }
            const newAbortController = new AbortController();
            abortControllerRef.current = newAbortController;
            loadData(newAbortController.signal);
          }}
        />
         {/* You might still want to show the layout with any data that did load */}
         <DashboardLayout data={dashboardData} />
      </div>
    );
  }

  console.log('[Dashboard Render] Showing DashboardLayout with data:', dashboardData);
  return <DashboardLayout data={dashboardData} />;
}

export default Dashboard;