import React, { useEffect } from 'react';
import AppRoutes from './routes';
import { useAuthStore } from './api/stores/auth.store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  const hydrate = useAuthStore(state => state.hydrate);

  useEffect(() => {
    console.log("App.js: Hydrating auth store...");
    hydrate();
  }, [hydrate]);

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