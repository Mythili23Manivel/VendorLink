import { useState, useCallback, useRef, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useAuthViewModel = () => {
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* Track component mount state */
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  /* Helpers */

  const clearError = useCallback(() => {
    if (isMounted.current) setError(null);
  }, []);

  const getErrorMessage = useCallback((err, fallback) => {
    return (
      err?.response?.data?.message ||
      err?.message ||
      fallback
    );
  }, []);

  const normalizeAuthPayload = useCallback((formData = {}) => {
    return {
      ...formData,
      email: formData?.email?.trim?.() || formData?.email,
    };
  }, []);

  /* Unified Auth Handler */

  const handleAuth = useCallback(
    async (apiCall, formData, fallbackMsg) => {
      if (loading) {
        return { success: false, error: 'Please wait...' };
      }

      setLoading(true);
      setError(null);

      try {
        const res = await apiCall(normalizeAuthPayload(formData));

        const data = res?.data?.data || {};
        const { token, ...userData } = data;

        if (!token) {
          throw new Error('Token missing in response');
        }

        login(userData, token);

        return { success: true };
      } catch (err) {
        const msg = getErrorMessage(err, fallbackMsg);

        if (isMounted.current) {
          setError(msg);
        }

        return { success: false, error: msg };
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [loading, login, normalizeAuthPayload, getErrorMessage]
  );

  /* Public APIs */

  const register = useCallback(
    (formData) =>
      handleAuth(authAPI.register, formData, 'Registration failed'),
    [handleAuth]
  );

  const loginUser = useCallback(
    (formData) =>
      handleAuth(authAPI.login, formData, 'Login failed'),
    [handleAuth]
  );

  return {
    register,
    loginUser,
    loading,
    error,
    clearError,
    setError,
  };
};
