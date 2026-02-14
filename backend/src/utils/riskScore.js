/**
 * Risk Score Formula
 * 
 * Risk Score = (delayRate * 0.4) + (mismatchRate * 0.4) + ((5 - rating) * 20 * 0.2)
 * 
 * - delayRate: 0-100 (higher = worse)
 * - mismatchRate: 0-100 (higher = worse)  
 * - rating: 0-5 (higher = better, so we invert: (5-rating)*20 gives 0-100 scale)
 * 
 * Final score: 0-100 (higher = higher risk)
 */

export const calculateRiskScore = (vendor) => {
  const delayWeight = 0.4;
  const mismatchWeight = 0.4;
  const ratingWeight = 0.2;

  const delayComponent = (vendor.delayRate || 0) * delayWeight;
  const mismatchComponent = (vendor.mismatchRate || 0) * mismatchWeight;
  const ratingComponent = ((5 - (vendor.rating || 0)) * 20) * ratingWeight;

  const riskScore = Math.min(100, Math.round(delayComponent + mismatchComponent + ratingComponent));

  let riskLevel = 'Low';
  if (riskScore >= 70) riskLevel = 'Critical';
  else if (riskScore >= 50) riskLevel = 'High';
  else if (riskScore >= 30) riskLevel = 'Medium';

  return {
    score: riskScore,
    level: riskLevel,
    breakdown: {
      delay: Math.round(delayComponent),
      mismatch: Math.round(mismatchComponent),
      rating: Math.round(ratingComponent),
    },
  };
};
