import Vendor from '../models/Vendor.js';
import Payment from '../models/Payment.js';
import Invoice from '../models/Invoice.js';
import { calculateRiskScore } from '../utils/riskScore.js';

export const getDashboardAnalyticsUseCase = async () => {
  const [
    totalVendors,
    pendingPayments,
    invoiceMismatches,
    vendors,
  ] = await Promise.all([
    Vendor.countDocuments(),
    Payment.countDocuments({ status: 'Pending' }),
    Invoice.countDocuments({ matched: false }),
    Vendor.find().lean(),
  ]);

  const withRisk = vendors.map((v) => ({
    ...v,
    riskScore: calculateRiskScore(v),
  }));

  const topPerforming = [...withRisk]
    .sort((a, b) => b.rating - a.rating || a.mismatchRate - b.mismatchRate)
    .slice(0, 5);

  const delayedVendors = [...withRisk]
    .filter((v) => v.delayRate > 0)
    .sort((a, b) => b.delayRate - a.delayRate)
    .slice(0, 5);

  const riskVendors = [...withRisk]
    .filter((v) => v.riskScore.score >= 50)
    .sort((a, b) => b.riskScore.score - a.riskScore.score);

  return {
    totalVendors,
    totalPendingPayments: pendingPayments,
    totalInvoiceMismatches: invoiceMismatches,
    topPerformingVendors: topPerforming.map((v) => ({
      id: v._id,
      name: v.name,
      rating: v.rating,
      mismatchRate: v.mismatchRate,
      delayRate: v.delayRate,
    })),
    delayedVendors: delayedVendors.map((v) => ({
      id: v._id,
      name: v.name,
      delayRate: v.delayRate,
    })),
    riskVendors: riskVendors.map((v) => ({
      id: v._id,
      name: v.name,
      riskScore: v.riskScore.score,
      riskLevel: v.riskScore.level,
    })),
  };
};
