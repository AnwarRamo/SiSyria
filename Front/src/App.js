import React, { useEffect } from 'react';
import AppRoutes from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from './api/stores/auth.store';
import Mascot from './components/ui/Mascot';

const App = () => {
  const hydrate = useAuthStore(state => state.hydrate);
  const loading = useAuthStore(state => state.loading);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-[#115d5a]">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Mascot />
      <ToastContainer position="bottom-right" autoClose={3000} />
      <AppRoutes />
    </>
  );
};

export default App;