import { useState, useEffect, useCallback } from 'react';
import { paymentsAPI } from '../services/api';
import { vendorsAPI } from '../services/api';
import { invoicesAPI } from '../services/api';

export const usePaymentsViewModel = () => {
  const [payments, setPayments] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (vendorFilter) params.vendorId = vendorFilter;
      const res = await paymentsAPI.getAll(params);
      setPayments(res.data.data.payments);
      setTotal(res.data.data.total);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load payments');
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

  const fetchInvoices = async () => {
    try {
      const res = await invoicesAPI.getAll({ limit: 100 });
      setInvoices(res.data.data.invoices || []);
    } catch (e) {
      setInvoices([]);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    fetchVendors();
    fetchInvoices();
  }, []);

  const createPayment = async (formData) => {
    try {
      await paymentsAPI.create(formData);
      await fetchPayments();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to create payment' };
    }
  };

  const markPaid = async (id) => {
    try {
      await paymentsAPI.markPaid(id);
      await fetchPayments();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to mark payment' };
    }
  };

  return {
    payments,
    vendors,
    invoices,
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
    fetchPayments,
    createPayment,
    markPaid,
  };
};
