import { useState, useEffect, useCallback } from 'react';
import { purchaseOrdersAPI } from '../services/api';
import { vendorsAPI } from '../services/api';

export const usePurchaseOrdersViewModel = () => {
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (vendorFilter) params.vendorId = vendorFilter;
      const res = await purchaseOrdersAPI.getAll(params);
      setOrders(res.data.data.orders);
      setTotal(res.data.data.total);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load purchase orders');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, vendorFilter]);

  const fetchVendors = async () => {
    try {
      const res = await vendorsAPI.getAll({ limit: 100 });
      setVendors(res.data.data.vendors || []);
    } catch (e) {
      setVendors([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const createOrder = async (formData) => {
    try {
      await purchaseOrdersAPI.create(formData);
      await fetchOrders();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to create order' };
    }
  };

  const approveOrder = async (id) => {
    try {
      await purchaseOrdersAPI.approve(id);
      await fetchOrders();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to approve order' };
    }
  };

  return {
    orders,
    vendors,
    total,
    page,
    setPage,
    totalPages,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    vendorFilter,
    setVendorFilter,
    fetchOrders,
    createOrder,
    approveOrder,
  };
};
