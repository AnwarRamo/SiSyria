import { useState } from 'react';

export const useApiCall = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = async (apiCall, payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = payload ? await apiCall(payload) : await apiCall();
      setData(result.data);
      return result;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'API request failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, execute };
};
