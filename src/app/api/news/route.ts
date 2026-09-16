import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN", {
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) {
        throw new Error("Failed to fetch news");
    }

    const json = await res.json();
    const data = { results: json.Data.slice(0, 15) }; 
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("News API Error, falling back to mock data:", error);
    // Fallback mock data so the app never crashes during demo
    const mockData = {
      results: [
        {
          id: "1",
          title: "Creditcoin Unveils Universal Score Attestation Protocol",
          body: "Creditcoin announces their newest iteration allowing omnichain score verification through their Gluwa USC SDK, bridging the gap for undercollateralized lending.",
          source_info: { name: "Web3 Times" },
          url: "https://creditcoin.org",
          imageurl: "https://cryptocompare.com/media/37746238/btc.png"
        },
        {
          id: "2",
          title: "Groq LPU Accelerates On-Chain AI Analytics",
          body: "Groq's LPU architecture proves capable of analyzing vast amounts of blockchain data in milliseconds, enabling real-time risk assessment.",
          source_info: { name: "AI Insider" },
          url: "https://groq.com",
          imageurl: "https://cryptocompare.com/media/37746238/eth.png"
        },
        {
          id: "3",
          title: "The Rise of Zero-Knowledge Credit Scores",
          body: "As DeFi matures, protocols are rapidly adopting ZK-proofs to verify user reputation without exposing raw transactional history.",
          source_info: { name: "DeFi Weekly" },
          url: "https://defillama.com",
          imageurl: "https://cryptocompare.com/media/37746238/eth.png"
        },
        {
          id: "4",
          title: "DoraHacks 2026: Identity & Reputation Take Center Stage",
          body: "Hackathon judges note a massive spike in projects tackling on-chain identity, noting that undercollateralized lending remains the 'holy grail' of crypto.",
          source_info: { name: "Hackathon Hub" },
          url: "https://dorahacks.io",
          imageurl: "https://cryptocompare.com/media/37746238/btc.png"
        },
        {
          id: "5",
          title: "Aave V3 Introduces Dynamic Risk Parameters",
          body: "Major lending protocols are upgrading their risk engines to allow third-party AI agents to automatically defend against sudden liquidations.",
          source_info: { name: "Block Analytica" },
          url: "https://aave.com",
          imageurl: "https://cryptocompare.com/media/37746238/eth.png"
        },
        {
          id: "6",
          title: "Gluwa USC SDK Sees Record Integration Rates",
          body: "Developers are flocking to the Universal Score Credential SDK to mint soulbound tokens that prove financial reliability across fragmented L2s.",
          source_info: { name: "Crypto Tech" },
          url: "https://gluwa.com",
          imageurl: "https://cryptocompare.com/media/37746238/btc.png"
        },
        {
          id: "7",
          title: "Modular Blockchains Enable Cross-Chain Execution",
          body: "New architectures separate data availability and execution, allowing smart contracts on one chain to seamlessly execute functions on another.",
          source_info: { name: "Web3 Innovations" },
          url: "https://celestia.org",
          imageurl: "https://cryptocompare.com/media/37746238/eth.png"
        },
        {
          id: "8",
          title: "Account Abstraction Reaches Mass Adoption",
          body: "ERC-4337 is finally making seed phrases obsolete, paving the way for smooth, gasless onboarding for the next billion users.",
          source_info: { name: "Blockchain Daily" },
          url: "https://eips.ethereum.org/EIPS/eip-4337",
          imageurl: "https://cryptocompare.com/media/37746238/btc.png"
        },
        {
          id: "9",
          title: "Decentralized AI Networks Emerge",
          body: "Web3 networks are now crowdsourcing compute power to train decentralized LLMs, challenging centralized tech monopolies.",
          source_info: { name: "Future Tech Insight" },
          url: "https://bittensor.com",
          imageurl: "https://cryptocompare.com/media/37746238/eth.png"
        },
        {
          id: "10",
          title: "Zero-Knowledge Rollups Break Speed Records",
          body: "New prover algorithms have drastically reduced ZK-rollup finality times, enabling near-instant, trustless L2 to L1 withdrawals.",
          source_info: { name: "ZK Research" },
          url: "https://zksync.io",
          imageurl: "https://cryptocompare.com/media/37746238/btc.png"
        }
      ]
    };
    return NextResponse.json(mockData);
  }
}
