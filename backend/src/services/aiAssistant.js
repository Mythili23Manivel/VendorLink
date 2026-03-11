/**
 * AI Assistant - Rule-based intelligent logic
 * No external paid AI APIs. Analyzes vendor data and generates insights.
 */

import Vendor from '../models/Vendor.js';
import Payment from '../models/Payment.js';
import Invoice from '../models/Invoice.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import { generateGroqResponse } from './groqService.js';
import { generateGrokResponse, isGrokAvailable } from './grokService.js';

import { calculateRiskScore } from '../utils/riskScore.js';

const MISMATCH_THRESHOLD = 5;
const OVERDUE_DAYS = 7;
const HIGH_RISK_THRESHOLD = 50;

/**
 * Helper to fetch specific vendor context if mentioned in query
 */
const getVendorContext = async (query) => {
  try {
    const allVendors = await Vendor.find({}, 'name _id').lean();
    const matchedVendors = allVendors.filter(v => query.toLowerCase().includes(v.name.toLowerCase()));

    if (matchedVendors.length === 0) return null;

    const vendors = await Vendor.find({ _id: { $in: matchedVendors.map(v => v._id) } }).lean();

    // Enrich with recent payment/invoice data for better context
    const detailedVendors = await Promise.all(vendors.map(async (v) => {
      const risk = calculateRiskScore(v);

      const [recentPayments, recentInvoices] = await Promise.all([
        Payment.find({ vendorId: v._id }).sort({ dueDate: -1 }).limit(3).lean(),
        Invoice.find({ vendorId: v._id }).sort({ createdAt: -1 }).limit(3).lean()
      ]);

      return {
        name: v.name,
        email: v.email,
        rating: v.rating,
        delayRate: v.delayRate,
        mismatchRate: v.mismatchRate,
        riskScore: risk.score,
        riskLevel: risk.level,
        recentPayments: recentPayments.map(p => ({
          amount: p.amount,
          status: p.status,
          dueDate: p.dueDate ? p.dueDate.toISOString().split('T')[0] : 'N/A'
        })),
        recentInvoices: recentInvoices.map(i => ({
          amount: i.invoiceAmount,
          matched: i.matched,
          mismatchPercentage: i.mismatchPercentage
        }))
      };
    }));

    return detailedVendors;
  } catch (error) {
    console.error('Error fetching vendor context:', error);
    return null;
  }
};

/**
 * Parse user query and route to appropriate handler
 */
export const processQuery = async (query) => {
  const lowerQuery = query.toLowerCase().trim();

  if (lowerQuery.includes('why') && (lowerQuery.includes('delayed') || lowerQuery.includes('delay'))) {
    return await explainVendorDelay(query);
  }

  if (lowerQuery.includes('mismatch') && (lowerQuery.includes('above') || lowerQuery.includes('over') || lowerQuery.includes('%'))) {
    const match = query.match(/(\d+)\s*%/);
    const threshold = match ? parseInt(match[1]) : 10;
    return await getVendorsWithMismatchAbove(threshold);
  }

  if (lowerQuery.includes('high risk') || lowerQuery.includes('high-risk')) {
    return await getHighRiskVendors();
  }

  if (lowerQuery.includes('predict') && (lowerQuery.includes('payment') || lowerQuery.includes('risk'))) {
    return await predictPaymentRisk();
  }

  if (lowerQuery.includes('summary') || lowerQuery.includes('overview') || lowerQuery.includes('dashboard')) {
    return await getDashboardSummary();
  }

  if (lowerQuery.includes('top') && (lowerQuery.includes('vendor') || lowerQuery.includes('performing'))) {
    return await getTopPerformingVendors();
  }

  if (lowerQuery.includes('delayed') || lowerQuery.includes('overdue')) {
    return await getDelayedVendors();
  }

  return await getGeneralInsights(query);
};

/**
 * Explain why a specific vendor is delayed
 */
const explainVendorDelay = async (query) => {
  const vendorNameMatch = query.match(/vendor\s+(\w+)/i) || query.match(/(\w+)/i);
  const searchTerm = vendorNameMatch ? vendorNameMatch[1] : '';

  const vendors = await Vendor.find({
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { delayRate: { $gt: 0 } },
    ],
  })
    .sort({ delayRate: -1 })
    .limit(5)
    .lean();

  if (vendors.length === 0) {
    return {
      type: 'explanation',
      query,
      response: 'No vendors found matching your criteria. Try searching by vendor name.',
      data: [],
    };
  }

  const payments = await Payment.find({
    vendorId: { $in: vendors.map((v) => v._id) },
    status: { $in: ['Overdue', 'Pending'] },
  })
    .populate('vendorId', 'name delayRate')
    .lean();

  const explanations = vendors.map((vendor) => {
    const vendorPayments = payments.filter((p) => p.vendorId?._id?.toString() === vendor._id.toString());
    const overdueCount = vendorPayments.filter((p) => p.status === 'Overdue').length;
    const pendingCount = vendorPayments.filter((p) => p.status === 'Pending').length;

    let reason = '';
    if (vendor.delayRate > 30) {
      reason = `High delay rate (${vendor.delayRate}%) indicates frequent late payments. `;
    }
    if (overdueCount > 0) {
      reason += `${overdueCount} payment(s) are currently overdue. `;
    }
    if (pendingCount > 0) {
      reason += `${pendingCount} payment(s) are pending. `;
    }
    if (!reason) {
      reason = 'Historical data shows delayed delivery patterns.';
    }

    return {
      vendorName: vendor.name,
      delayRate: vendor.delayRate,
      reason: reason.trim(),
      overduePayments: overdueCount,
      pendingPayments: pendingCount,
    };
  });

  return {
    type: 'explanation',
    query,
    response: `Here's why these vendors have delays: ${explanations.map((e) => `${e.vendorName} (${e.delayRate}% delay rate): ${e.reason}`).join(' | ')}`,
    data: explanations,
  };
};

/**
 * Get vendors with mismatch rate above threshold
 */
const getVendorsWithMismatchAbove = async (threshold = 10) => {
  const vendors = await Vendor.find({ mismatchRate: { $gte: threshold } })
    .sort({ mismatchRate: -1 })
    .lean();

  const vendorList = vendors.map((v) => ({
    name: v.name,
    email: v.email,
    mismatchRate: v.mismatchRate,
    totalOrders: v.totalOrders,
    riskScore: calculateRiskScore(v).score,
  }));

  return {
    type: 'list',
    query: `Vendors with mismatch above ${threshold}%`,
    response: vendorList.length > 0
      ? `Found ${vendorList.length} vendor(s) with mismatch rate above ${threshold}%: ${vendorList.map((v) => `${v.name} (${v.mismatchRate}%)`).join(', ')}`
      : `No vendors found with mismatch rate above ${threshold}%.`,
    data: vendorList,
  };
};

/**
 * Get high risk vendors
 */
const getHighRiskVendors = async () => {
  const vendors = await Vendor.find().lean();
  const withRisk = vendors.map((v) => ({
    ...v,
    riskData: calculateRiskScore(v),
  }));

  const highRisk = withRisk.filter((v) => v.riskData.score >= HIGH_RISK_THRESHOLD).sort((a, b) => b.riskData.score - a.riskData.score);

  const result = highRisk.map((v) => ({
    name: v.name,
    email: v.email,
    riskScore: v.riskData.score,
    riskLevel: v.riskData.level,
    delayRate: v.delayRate,
    mismatchRate: v.mismatchRate,
    rating: v.rating,
  }));

  return {
    type: 'list',
    query: 'High risk vendors',
    response: result.length > 0
      ? `Identified ${result.length} high-risk vendor(s): ${result.map((v) => `${v.name} (Risk: ${v.riskScore} - ${v.riskLevel})`).join(', ')}`
      : 'No high-risk vendors identified at this time.',
    data: result,
  };
};

/**
 * Predict payment risk
 */
const predictPaymentRisk = async () => {
  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + OVERDUE_DAYS);

  const pendingPayments = await Payment.find({
    status: 'Pending',
    dueDate: { $lte: sevenDaysFromNow, $gte: today },
  })
    .populate('vendorId', 'name delayRate mismatchRate rating')
    .lean();

  const predictions = pendingPayments.map((p) => {
    const riskData = calculateRiskScore(p.vendorId);
    const daysUntilDue = Math.ceil((new Date(p.dueDate) - today) / (1000 * 60 * 60 * 24));

    return {
      vendorName: p.vendorId?.name,
      amount: p.amount,
      dueDate: p.dueDate,
      daysUntilDue,
      riskScore: riskData.score,
      riskLevel: riskData.level,
      prediction: riskData.score >= 50 ? 'High probability of delay' : riskData.score >= 30 ? 'Medium risk - monitor closely' : 'Low risk',
    };
  });

  const highRiskCount = predictions.filter((p) => p.riskScore >= 50).length;

  return {
    type: 'prediction',
    query: 'Predict payment risk',
    response: `Payment risk analysis: ${predictions.length} payment(s) due within 7 days. ${highRiskCount} have high risk of delay based on vendor history.`,
    data: predictions,
  };
};

/**
 * Dashboard summary
 */
const getDashboardSummary = async () => {
  const [totalVendors, pendingPayments, mismatchInvoices, topVendors, delayedVendors] = await Promise.all([
    Vendor.countDocuments(),
    Payment.countDocuments({ status: 'Pending' }),
    Invoice.countDocuments({ matched: false }),
    Vendor.find().sort({ rating: -1, mismatchRate: 1 }).limit(5).lean(),
    Vendor.find({ delayRate: { $gt: 0 } }).sort({ delayRate: -1 }).limit(5).lean(),
  ]);

  const riskVendors = (await Vendor.find().lean())
    .map((v) => ({ ...v, riskScore: calculateRiskScore(v).score }))
    .filter((v) => v.riskScore >= 50);

  return {
    type: 'summary',
    query: 'Dashboard overview',
    response: `Summary: ${totalVendors} vendors, ${pendingPayments} pending payments, ${mismatchInvoices} invoice mismatches. ${riskVendors.length} vendors at high risk.`,
    data: {
      totalVendors,
      pendingPayments,
      invoiceMismatches: mismatchInvoices,
      topVendors: topVendors.map((v) => ({ name: v.name, rating: v.rating })),
      delayedVendors: delayedVendors.map((v) => ({ name: v.name, delayRate: v.delayRate })),
      riskVendors: riskVendors.map((v) => ({ name: v.name, riskScore: v.riskScore })),
    },
  };
};

/**
 * Top performing vendors
 */
const getTopPerformingVendors = async () => {
  const vendors = await Vendor.find({ totalOrders: { $gt: 0 } })
    .sort({ rating: -1, mismatchRate: 1, delayRate: 1 })
    .limit(10)
    .lean();

  const result = vendors.map((v) => ({
    name: v.name,
    rating: v.rating,
    onTimeDeliveries: v.onTimeDeliveries,
    totalOrders: v.totalOrders,
    onTimePercentage: v.totalOrders > 0 ? ((v.onTimeDeliveries / v.totalOrders) * 100).toFixed(1) : 0,
    mismatchRate: v.mismatchRate,
    delayRate: v.delayRate,
  }));

  return {
    type: 'list',
    query: 'Top performing vendors',
    response: `Top ${result.length} performing vendors based on rating and delivery performance.`,
    data: result,
  };
};

/**
 * Delayed vendors
 */
const getDelayedVendors = async () => {
  const vendors = await Vendor.find({ delayRate: { $gt: 0 } }).sort({ delayRate: -1 }).lean();

  const result = vendors.map((v) => ({
    name: v.name,
    delayRate: v.delayRate,
    totalOrders: v.totalOrders,
    onTimeDeliveries: v.onTimeDeliveries,
  }));

  return {
    type: 'list',
    query: 'Delayed vendors',
    response: `Found ${result.length} vendor(s) with delivery delays.`,
    data: result,
  };
};

/**
 * General insights for unmatched queries - uses Grok (xAI) when GROK_API_KEY is set, else Groq
 */
const getGeneralInsights = async (query) => {
  const summary = await getDashboardSummary();
  const vendorContext = await getVendorContext(query);

  const context = {
    dashboardSummary: summary.data,
    specificVendorContext: vendorContext ? vendorContext : 'No specific vendor mentioned in query.'
  };

  try {
    const aiResponse = isGrokAvailable()
      ? await generateGrokResponse(query, context)
      : await generateGroqResponse(query, context);

    return {
      type: 'general',
      query,
      response: aiResponse,
      data: context,
    };
  } catch (error) {
    console.error('AI integration error:', error);
    return {
      type: 'general',
      query,
      response: `I can help you with: vendor delays, mismatch analysis, high-risk vendors, payment risk prediction, and dashboard summaries. Try asking: "Why is Vendor X delayed?" or "Show vendors with mismatch above 10%" or "Which vendor is high risk?" For now, here's a quick overview: ${summary.response}`,
      data: summary.data,
    };
  }
};
