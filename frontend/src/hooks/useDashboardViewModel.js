import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

export const useDashboardViewModel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardAPI.getAnalytics();
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { data, loading, error, refresh: fetchAnalytics };
};
