import { useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useAuthViewModel = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.register(formData);
      const { token, ...userData } = res.data.data;
      login(userData, token);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setError(msg);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.login(formData);
      const { token, ...userData } = res.data.data;
      login(userData, token);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      setError(msg);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { register, loginUser, loading, error, setError };
};
