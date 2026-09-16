import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { calculateDeterministicScore } from "../../../lib/scoring-engine";
import { analyzeDeFiHistory } from "../../../lib/defi-indexer";

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: "Missing wallet address" }, { status: 400 });
    }

    const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY;
    if (!ALCHEMY_KEY) {
      console.warn("WARNING: ALCHEMY_API_KEY is missing from .env");
    }

    // Connect to multiple major MAINNETs using the reliable Alchemy API
    const networks = [
      { name: "Ethereum", rpc: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` },
      { name: "Polygon", rpc: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` },
      { name: "Arbitrum", rpc: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` },
      { name: "Optimism", rpc: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` },
      { name: "Base", rpc: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` }
    ];

    let totalTxCount = 0;
    let totalBalanceEth = 0;
    let isContract = false;
    const activeChainsList: string[] = [];

    // Fetch from all mainnets in parallel for a massive performance boost
    await Promise.all(
      networks.map(async (net) => {
        try {
          const provider = new ethers.JsonRpcProvider(net.rpc);
          const [txCount, balanceWei, code] = await Promise.all([
            provider.getTransactionCount(walletAddress),
            provider.getBalance(walletAddress),
            provider.getCode(walletAddress)
          ]);
          
          if (txCount > 0 || balanceWei > BigInt(0)) {
            activeChainsList.push(net.name);
          }

          totalTxCount += txCount;
          totalBalanceEth += parseFloat(ethers.formatEther(balanceWei));
          
          if (code !== "0x") isContract = true;
        } catch (e) {
          console.error(`Failed to fetch from ${net.name} via Alchemy:`, e);
        }
      })
    );

    // Deterministic simulation for deep DeFi history (Aave, etc) since we don't have a paid indexer
    const seedStr = walletAddress.toLowerCase();
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
      seed = (seed << 5) - seed + seedStr.charCodeAt(i);
      seed = seed & seed; 
    }
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    let walletAgeDays = 0; // Real value fetched from Etherscan, defaults to 0

    try {
      // Etherscan API: Get the first transaction to calculate real wallet age
      const etherscanUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc`;
      const etherscanRes = await fetch(etherscanUrl);
      const etherscanData = await etherscanRes.json();
      
      if (etherscanData.status === "1" && etherscanData.result.length > 0) {
        const firstTxTimestamp = parseInt(etherscanData.result[0].timeStamp) * 1000;
        const now = Date.now();
        walletAgeDays = Math.floor((now - firstTxTimestamp) / (1000 * 60 * 60 * 24));
      }
    } catch (e) {
      console.error("Failed to fetch real wallet age from Etherscan:", e);
    }

    const txCount = totalTxCount;
    const balanceEth = totalBalanceEth;

    // --- COMPLEX DEFI INDEXING ---
    const defiData = await analyzeDeFiHistory(walletAddress);

    // Build raw data object for the scoring engine
    const rawData = {
      walletAddress,
      txCount,
      balanceEth,
      walletAgeDays,
      repaymentRate: txCount > 0 ? defiData.repaymentRate : 0, 
      liquidations: defiData.liquidations, 
      collateralRatio: Math.floor(random() * 50) + 120, // Still randomly estimated as true collateral tracking requires real-time debt checking
      chains: activeChainsList.length,
      nftValue: Math.floor(random() * 2000), // Could be pulled via Alchemy NFT API in the future
      consistency: Math.floor(random() * 40) + 60,
      protocols: defiData.protocolsUsed.length > 0 ? defiData.protocolsUsed : (isContract ? ["Unknown Contract"] : ["No known DeFi usage"])
    };

    const scoreResult = calculateDeterministicScore(rawData);

    const walletData = {
      ...rawData,
      isContract,
      chains: activeChainsList.length > 0 ? activeChainsList : ["Ethereum"],
      score: scoreResult.score,
      grade: scoreResult.grade,
      scoreFactors: scoreResult.factors,
      maxBorrow: scoreResult.score > 700 ? Math.floor(balanceEth * 1000) + 5000 : 500,
      recentTransactions: defiData.recentTransactions // Pass real transactions to UI
    };

    return NextResponse.json(walletData);
  } catch (error) {
    console.error("Wallet Data API Error:", error);
    return NextResponse.json({ error: "Failed to fetch real wallet data" }, { status: 500 });
  }
}
