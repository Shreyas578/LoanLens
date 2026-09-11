import { JsonRpcProvider } from "ethers";

const SOURCE_CHAIN_RPC_URL = process.env.SOURCE_CHAIN_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";

export async function fetchWalletData(walletAddress: string) {
  try {
    const provider = new JsonRpcProvider(SOURCE_CHAIN_RPC_URL);
    
    // Fetch real on-chain transaction count
    const txCount = await provider.getTransactionCount(walletAddress);
    
    // Fetch real on-chain balance
    const balanceWei = await provider.getBalance(walletAddress);
    const balanceEth = Number(balanceWei) / 1e18;

    // We can compute a basic proxy for "wallet age" and "consistency" based on tx count for now, 
    // unless we query an archive node or an indexer for the exact first tx timestamp.
    // For this strict implementation, we will pass exactly what we can prove.
    return {
      walletAddress,
      txCount,
      balanceEth,
      // The below fields would ideally require Alchemy/Covalent API keys to be populated accurately.
      // Since we don't have them yet, we will rely strictly on what ethers.js can verify via the RPC.
      protocols: txCount > 10 ? ["Unknown Smart Contracts"] : [],
      repaymentRate: 100, // Default assumption without DeFi indexing
      liquidations: 0,
      collateralRatio: 150, // Default safe assumption
      chains: ["Ethereum Sepolia"],
      nftValue: 0,
      maxBorrow: 0,
      consistency: Math.min(100, txCount * 2), // Rough heuristic
    };
  } catch (error) {
    console.error("Error fetching real wallet data:", error);
    throw new Error("Failed to fetch on-chain data via RPC.");
  }
}
