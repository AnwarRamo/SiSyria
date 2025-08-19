import React, { useEffect, useState } from 'react';
import AppRoutes from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from './api/stores/auth.store';
// Mascot removed per requirements

const App = () => {
  const hydrate = useAuthStore(state => state.hydrate);
  const loading = useAuthStore(state => state.loading);
  const [bypassAuth, setBypassAuth] = useState(false);

  useEffect(() => {
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('⏰ Loading timeout reached, forcing app to load');
      // Force loading to false if it takes too long
      useAuthStore.setState({ loading: false });
      setBypassAuth(true);
    }, 5000); // 5 second timeout

    hydrate().finally(() => {
      clearTimeout(timeoutId);
    });

    return () => clearTimeout(timeoutId);
  }, [hydrate]);

  // Bypass auth loading for testing
  if (bypassAuth) {
    console.log('🚀 Bypassing auth loading for testing');
    return (
      <>
        <ToastContainer position="bottom-right" autoClose={3000} />
        <AppRoutes />
      </>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-[#115d5a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115d5a] mx-auto mb-4"></div>
          <div>Loading...</div>
          <button 
            onClick={() => {
              console.log('🚀 Manual bypass clicked');
              useAuthStore.setState({ loading: false });
              setBypassAuth(true);
            }}
            className="mt-4 px-4 py-2 bg-[#115d5a] text-white rounded hover:bg-[#0f4f4c]"
          >
            Skip Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <AppRoutes />
    </>
  );
};

export default App;