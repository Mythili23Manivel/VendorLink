import { useState, useCallback } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useAuthViewModel = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const getErrorMessage = (err, fallback) =>
    err?.response?.data?.message || err?.message || fallback;

  const normalizeAuthPayload = (formData) => ({
    ...formData,
    email: formData?.email?.trim?.() || formData?.email,
  });

  const register = async (formData) => {
    if (loading) return { success: false, error: 'Please wait...' };

    setLoading(true);
    setError(null);

    try {
      const res = await authAPI.register(normalizeAuthPayload(formData));
      const data = res?.data?.data || {};
      const { token, ...userData } = data;

      if (!token) throw new Error('Token missing in response');

      login(userData, token);
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, 'Registration failed');
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (formData) => {
    if (loading) return { success: false, error: 'Please wait...' };

    setLoading(true);
    setError(null);

    try {
      const res = await authAPI.login(normalizeAuthPayload(formData));
      const data = res?.data?.data || {};
      const { token, ...userData } = data;

      if (!token) throw new Error('Token missing in response');

      login(userData, token);
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, 'Login failed');
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { register, loginUser, loading, error, clearError, setError };
};
