import { JsonRpcProvider } from "ethers";
import { calculateDeterministicScore, RawWalletData } from "./scoring-engine";

const SOURCE_CHAIN_RPC_URL = process.env.SOURCE_CHAIN_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";

export async function fetchWalletData(walletAddress: string) {
  try {
    const provider = new JsonRpcProvider(SOURCE_CHAIN_RPC_URL);
    
    // Fetch real on-chain transaction count
    const txCount = await provider.getTransactionCount(walletAddress);
    
    // Fetch real on-chain balance
    const balanceWei = await provider.getBalance(walletAddress);
    const balanceEth = Number(balanceWei) / 1e18;

    const rawData: RawWalletData = {
      walletAddress,
      txCount,
      balanceEth,
      repaymentRate: 100, // Default assumption without DeFi indexing
      liquidations: 0,
      collateralRatio: 150,
      chains: 1,
      nftValue: 0,
      maxBorrow: 0,
      consistency: Math.min(100, txCount * 2),
      protocols: txCount > 10 ? ["Unknown Smart Contracts"] : [],
    };

    // Use deterministic scoring engine
    const scoreResult = calculateDeterministicScore(rawData);

    return {
      ...rawData,
      chains: ["Ethereum Sepolia"], // Override for UI display
      score: scoreResult.score,
      grade: scoreResult.grade,
      scoreFactors: scoreResult.factors
    };
  } catch (error) {
    console.error("Error fetching real wallet data:", error);
    throw new Error("Failed to fetch on-chain data via RPC.");
  }
}
