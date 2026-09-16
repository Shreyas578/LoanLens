import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateCreditScoreNarrative(walletData: any) {
  const SCORING_PROMPT = `
You are an AI credit analyst for LoanLens, a decentralized cross-chain credit platform.
You have received ATTESTED on-chain data for wallet ${walletData.walletAddress} via the Attestcoin Protocol.

ATTESTED WALLET DATA:
- Wallet age: ${walletData.walletAge} days
- Total transactions: ${walletData.txCount}
- DeFi protocols used: ${walletData.protocols?.join(', ') || 'None'}
- Loan repayment rate: ${walletData.repaymentRate}%
- Liquidation events: ${walletData.liquidations}
- Current collateral ratio: ${walletData.collateralRatio}%
- Cross-chain activity: ${walletData.chains?.join(', ') || 'Ethereum'}
- NFT holdings value: $${walletData.nftValue}
- Largest single borrow: $${walletData.maxBorrow}
- 90-day transaction consistency: ${walletData.consistency}%

Calculated credit score: ${walletData.score}/850 (${walletData.grade})

Generate a credit analysis with the following JSON structure ONLY, no other text:
{
  "headline": "One sentence summary of this borrower's credit profile",
  "narrative": "3-4 sentence plain English explanation of why this score was given. Reference specific data points. Do NOT use jargon.",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "lender_summary": "One sentence a lender would read to decide whether to lend. Be direct."
}
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an AI that outputs purely valid JSON.",
        },
        {
          role: "user",
          content: SCORING_PROMPT,
        },
      ],
      model: "groq/compound",
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (error) {
    console.warn("Groq API failed, falling back to OpenRouter:", error);
    
    // OpenRouter Fallback
    const fallbackResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nex-agi/nex-n2.5-pro:free",
        messages: [
          {
            role: "system",
            content: "You are an AI that outputs purely valid JSON.",
          },
          {
            role: "user",
            content: SCORING_PROMPT,
          },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    try {
      if (!fallbackResponse.ok) {
        throw new Error(`OpenRouter Fallback Error: ${fallbackResponse.statusText}`);
      }
      const data = await fallbackResponse.json();
      const fallbackContent = data.choices[0]?.message?.content || "{}";
      return JSON.parse(fallbackContent);
    } catch (openRouterError) {
      console.warn("OpenRouter also failed, falling back to NVIDIA NIM:", openRouterError);
      
      // Secondary Fallback: NVIDIA NIM
      const nvidiaResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NVIDIA_NIM_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-70b-instruct",
          messages: [
            {
              role: "system",
              content: "You are an AI that outputs purely valid JSON.",
            },
            {
              role: "user",
              content: SCORING_PROMPT,
            },
          ],
          temperature: 0.2,
          max_tokens: 1024,
        })
      });

      if (!nvidiaResponse.ok) {
        throw new Error(`Nvidia NIM Error: ${nvidiaResponse.statusText}`);
      }

      const nvidiaData = await nvidiaResponse.json();
      const nvidiaContent = nvidiaData.choices[0]?.message?.content || "{}";
      
      // Nvidia sometimes wraps json in ```json ... ```, so clean it
      const cleanContent = nvidiaContent.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleanContent);
    }
  }
}
