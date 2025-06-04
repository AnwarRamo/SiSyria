import React, { useState } from 'react';
import axios from 'axios';

const RegisterTripButton = ({ tripId, token }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await axios.post('http://localhost:5000/users/trips/register', { tripId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) return <button disabled className="btn-success">Registered</button>;

  return (
    <>
      <button onClick={handleRegister} disabled={loading} className="btn-primary">
        {loading ? 'Registering...' : 'Register'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
};

export default RegisterTripButton;
