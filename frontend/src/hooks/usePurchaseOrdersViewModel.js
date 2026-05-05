import { useState, useEffect, useCallback, useRef } from 'react';
import { purchaseOrdersAPI, vendorsAPI } from '../services/api';

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

  // prevent state updates after unmount
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getErrorMessage = useCallback(
    (err, fallback) => err?.response?.data?.message || err?.message || fallback,
    []
  );

  // UX: when filters change, jump back to page 1
  useEffect(() => {
    setPage(1);
  }, [statusFilter, vendorFilter]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (vendorFilter) params.vendorId = vendorFilter;

      const res = await purchaseOrdersAPI.getAll(params);
      const data = res?.data?.data || {};

      if (!isMounted.current) return;

      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      if (!isMounted.current) return;
      setError(getErrorMessage(err, 'Failed to load purchase orders'));
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [page, statusFilter, vendorFilter, getErrorMessage]);

  const fetchVendors = useCallback(async () => {
    try {
      const res = await vendorsAPI.getAll({ limit: 100 });
      const data = res?.data?.data || {};

      if (!isMounted.current) return;

      setVendors(data.vendors || []);
    } catch (err) {
      if (!isMounted.current) return;
      setVendors([]);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const createOrder = useCallback(
    async (formData) => {
      try {
        await purchaseOrdersAPI.create(formData);
        await fetchOrders();
        return { success: true };
      } catch (err) {
        return { success: false, error: getErrorMessage(err, 'Failed to create order') };
      }
    },
    [fetchOrders, getErrorMessage]
  );

  const approveOrder = useCallback(
    async (id) => {
      try {
        await purchaseOrdersAPI.approve(id);
        await fetchOrders();
        return { success: true };
      } catch (err) {
        return { success: false, error: getErrorMessage(err, 'Failed to approve order') };
      }
    },
    [fetchOrders, getErrorMessage]
  );

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
    fetchVendors,
    createOrder,
    approveOrder,
  };
};
