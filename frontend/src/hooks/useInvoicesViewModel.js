import { useState, useEffect, useCallback } from 'react';
import { invoicesAPI } from '../services/api';
import { vendorsAPI } from '../services/api';
import { purchaseOrdersAPI } from '../services/api';

export const useInvoicesViewModel = () => {
  const [invoices, setInvoices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matchedFilter, setMatchedFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 10 };
      if (matchedFilter !== '') params.matched = matchedFilter;
      if (vendorFilter) params.vendorId = vendorFilter;
      const res = await invoicesAPI.getAll(params);
      setInvoices(res.data.data.invoices);
      setTotal(res.data.data.total);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, [page, matchedFilter, vendorFilter]);

  const fetchVendors = async () => {
    try {
      const res = await vendorsAPI.getAll({ limit: 100 });
      setVendors(res.data.data.vendors || []);
    } catch (e) {
      setVendors([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await purchaseOrdersAPI.getAll({ limit: 100, status: 'Approved' });
      setOrders(res.data.data.orders || []);
    } catch (e) {
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  useEffect(() => {
    fetchVendors();
    fetchOrders();
  }, []);

  const createInvoice = async (formData) => {
    try {
      await invoicesAPI.create(formData);
      await fetchInvoices();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to create invoice' };
    }
  };

  return {
    invoices,
    vendors,
    orders,
    total,
    page,
    setPage,
    totalPages,
    loading,
    error,
    matchedFilter,
    setMatchedFilter,
    vendorFilter,
    setVendorFilter,
    fetchInvoices,
    createInvoice,
  };
};
