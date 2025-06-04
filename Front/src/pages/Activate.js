/*
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyAccount } from '../services/UserServices';
import { toast } from 'react-toastify';

export const Activate = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const handleActivation = async (e) => {
    e.preventDefault();
    try {
      await verifyAccount({ token });
      toast.success('Account activated successfully!');
      navigate('/login');
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error?.message || 'Activation failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <button onClick={handleActivation}>Activate Your Account</button>
    </div>
  );
};
*/