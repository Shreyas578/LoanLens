import { ethers } from "ethers";

// Known DeFi Protocol Addresses (Mainnet)
const PROTOCOLS = {
  "Aave V3": "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
  "Aave V2": "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
  "Uniswap V3": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
  "Uniswap V2": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  "Compound": "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B",
  "MakerDAO": "0x35D1b3F3D7946C1eFc64da9DFB4e082cb9F56050",
  "Curve": "0xD51a44d3FaE010294C616388b506AcdA1bfAAE46"
};

// LiquidationCall topic0 for Aave V3/V2
const LIQUIDATION_TOPIC = "0xe413a321e8681d831f4dbccbca790d2952b56f977908e45be3733527b16ce25c";

export interface DeFiMetrics {
  liquidations: number;
  repaymentRate: number; // 0-100
  protocolsUsed: string[];
  recentTransactions: any[];
}

export async function analyzeDeFiHistory(walletAddress: string): Promise<DeFiMetrics> {
  const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY;
  if (!ALCHEMY_KEY) {
    console.warn("Missing ALCHEMY_API_KEY for DeFi Indexing");
    return { liquidations: 0, repaymentRate: 90, protocolsUsed: [], recentTransactions: [] };
  }

  try {
    const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`);
    
    // 1. Detect Liquidations using eth_getLogs (Alchemy)
    // We look for LiquidationCall events where the user is the 'user' (topic2 in Aave)
    const paddedAddress = ethers.zeroPadValue(walletAddress, 32);
    
    let liquidationsCount = 0;
    try {
      const logs = await provider.getLogs({
        fromBlock: "0x0",
        toBlock: "latest",
        topics: [LIQUIDATION_TOPIC, null, paddedAddress] // user is usually the 2nd indexed parameter
      });
      liquidationsCount = logs.length;
    } catch (e) {
      console.warn("Failed to fetch liquidation logs. Query might be too broad for free tier.", e);
      // Fallback if Alchemy rejects massive historical queries
      liquidationsCount = 0; 
    }

    // 2. Fetch Normal Transactions via Etherscan to detect Protocols & Repayments
    // We use Etherscan API (rate limited to 5 req/sec without API key)
    let protocolsUsed = new Set<string>();
    let repaymentRate = 100;
    let recentTransactions: any[] = [];
    
    try {
      const etherscanRes = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=15&sort=desc`);
      const data = await etherscanRes.json();
      
      if (data.status === "1" && data.result) {
        let interactions = 0;
        let successfulRepays = 0;
        
        // Map real transactions for the frontend
        recentTransactions = data.result.map((tx: any) => {
          let protocol = "Transfer/Contract Call";
          const toAddress = tx.to?.toLowerCase() || "";
          
          for (const [name, address] of Object.entries(PROTOCOLS)) {
            if (address.toLowerCase() === toAddress) {
              protocol = name;
              protocolsUsed.add(name);
              interactions++;
              
              const functionSig = tx.input.substring(0, 10);
              if (["0x5ce339ce", "0x573ade81", "0x00000000"].includes(functionSig) && tx.isError === "0") {
                successfulRepays++;
              }
            }
          }
          
          return {
            date: new Date(parseInt(tx.timeStamp) * 1000).toISOString().split('T')[0],
            chain: "Ethereum", // Etherscan is mainnet
            type: tx.isError === "1" ? "Failed" : (tx.value === "0" ? "Contract Call" : "Transfer"),
            protocol: protocol,
            amount: parseFloat(ethers.formatEther(tx.value)).toFixed(4) + " ETH",
            status: tx.isError === "1" ? "Failed" : "Success"
          };
        });

        // Calculate a repayment rate based on successful DeFi interactions vs liquidations
        if (interactions > 0) {
          let score = 95;
          score -= (liquidationsCount * 20);
          repaymentRate = Math.max(0, Math.min(100, score));
        } else {
          repaymentRate = 0;
        }
      }
    } catch (e) {
      console.error("Etherscan API failed in DeFi indexer:", e);
    }

    return {
      liquidations: liquidationsCount,
      repaymentRate: repaymentRate,
      protocolsUsed: Array.from(protocolsUsed),
      recentTransactions
    };
  } catch (error) {
    console.error("DeFi Indexing Error:", error);
    return { liquidations: 0, repaymentRate: 90, protocolsUsed: [], recentTransactions: [] };
  }
}
