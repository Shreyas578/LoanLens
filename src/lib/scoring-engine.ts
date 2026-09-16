export interface RawWalletData {
  walletAddress: string;
  txCount: number;
  balanceEth: number;
  walletAgeDays?: number;
  repaymentRate?: number; // 0-100
  liquidations?: number;
  collateralRatio?: number;
  chains?: number;
  nftValue?: number;
  maxBorrow?: number;
  consistency?: number; // 0-100
  protocols?: string[];
}

export interface CreditScoreResult {
  score: number;       // 300 - 850
  grade: string;       // AAA, AA, A, B, C, D, F
  factors: {
    repaymentScore: number;
    collateralScore: number;
    activityScore: number;
    assetScore: number;
  };
}

/**
 * Calculates a deterministic on-chain credit score (FICO style: 300 - 850).
 * Weights:
 * - Repayment History (35%)
 * - Collateral Health (30%)
 * - Wallet Age & Consistency (20%)
 * - Assets & Liquidity (15%)
 */
export function calculateDeterministicScore(data: RawWalletData): CreditScoreResult {
  const MIN_SCORE = 300;
  const MAX_SCORE = 850;
  const RANGE = MAX_SCORE - MIN_SCORE;

  // 1. Repayment History (35% weight)
  // Assumes a base rate if no loans taken, but heavily penalizes missed payments if known.
  const repaymentRate = data.repaymentRate ?? 90; // default assumption
  const repaymentScore = (repaymentRate / 100) * 0.35 * RANGE;

  // 2. Collateral Health (30% weight)
  // Penalizes for liquidations.
  const liquidations = data.liquidations ?? 0;
  let collateralMultiplier = 1.0;
  if (liquidations === 1) collateralMultiplier = 0.5;
  if (liquidations > 1) collateralMultiplier = 0.1;
  const collateralScore = collateralMultiplier * 0.30 * RANGE;

  // 3. Wallet Age & Activity (20% weight)
  // Uses txCount and consistency as proxies for wallet age and activity.
  const txCount = data.txCount || 0;
  const consistency = data.consistency ?? 50;
  
  // Max out activity points at ~500 txs
  const txScoreFactor = Math.min(txCount / 500, 1.0);
  const consistencyFactor = consistency / 100;
  const activityScore = ((txScoreFactor * 0.6) + (consistencyFactor * 0.4)) * 0.20 * RANGE;

  // 4. Assets & Liquidity (15% weight)
  // Based on ETH balance and NFT value.
  const balanceEth = data.balanceEth || 0;
  const nftValue = data.nftValue || 0;
  // Max out asset points at ~10 ETH / $30k equivalent
  const assetValueFactor = Math.min((balanceEth + (nftValue / 3000)) / 10, 1.0);
  const assetScore = assetValueFactor * 0.15 * RANGE;

  // Total Score Calculation
  let totalScore = Math.floor(MIN_SCORE + repaymentScore + collateralScore + activityScore + assetScore);
  
  // Ensure bounds
  totalScore = Math.max(MIN_SCORE, Math.min(MAX_SCORE, totalScore));

  // Determine Grade
  let grade = "F";
  if (totalScore >= 800) grade = "AAA";
  else if (totalScore >= 750) grade = "AA";
  else if (totalScore >= 700) grade = "A";
  else if (totalScore >= 600) grade = "B";
  else if (totalScore >= 500) grade = "C";
  else if (totalScore >= 400) grade = "D";

  return {
    score: totalScore,
    grade,
    factors: {
      repaymentScore: Math.floor(repaymentScore),
      collateralScore: Math.floor(collateralScore),
      activityScore: Math.floor(activityScore),
      assetScore: Math.floor(assetScore),
    }
  };
}
