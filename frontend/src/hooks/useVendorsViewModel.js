import { useState, useEffect, useCallback } from 'react';
import { vendorsAPI } from '../services/api';

export const useVendorsViewModel = () => {
  const [vendors, setVendors] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await vendorsAPI.getAll({ page, limit: 10, search, sort });
      setVendors(res.data.data.vendors);
      setTotal(res.data.data.total);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  }, [page, search, sort]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const createVendor = async (formData) => {
    try {
      await vendorsAPI.create(formData);
      await fetchVendors();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to create vendor' };
    }
  };

  const updateVendor = async (id, formData) => {
    try {
      await vendorsAPI.update(id, formData);
      await fetchVendors();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to update vendor' };
    }
  };

  const deleteVendor = async (id) => {
    try {
      await vendorsAPI.delete(id);
      await fetchVendors();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to delete vendor' };
    }
  };

  return {
    vendors,
    total,
    page,
    setPage,
    totalPages,
    loading,
    error,
    search,
    setSearch,
    sort,
    setSort,
    fetchVendors,
    createVendor,
    updateVendor,
    deleteVendor,
  };
};
