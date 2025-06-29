import React, { useEffect } from 'react';
import AppRoutes from './routes';
import { useAuthStore } from './api/stores/auth.store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  const loading = useAuthStore(state => state.loading);

  useEffect(() => {
    console.log("App.js: Hydrating auth store...");
    // ✅ استخدم getState().hydrate() بدلًا من تمرير hydrate كمرجع في useEffect
    useAuthStore.getState().hydrate();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-[#115d5a]">
        Loading...
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </>
  );
};

export default App;
 
