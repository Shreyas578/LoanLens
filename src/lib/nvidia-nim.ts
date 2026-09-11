export async function generateRiskAnalysis(walletData: any) {
  const RISK_PROMPT = `
You are a DeFi risk analyst AI. Analyze the following ATTESTED on-chain data and identify risks.

DATA:
${JSON.stringify(walletData, null, 2)}

Return ONLY valid JSON with the following structure:
{
  "overall_risk": "Critical|High|Medium|Low|Minimal",
  "risk_score": 0-100,
  "flags": [
    {
      "severity": "Critical|High|Medium|Low",
      "category": "Liquidation|Counterparty|Concentration|Behavioral|Exposure",
      "title": "Short flag title",
      "description": "What this risk means in plain English",
      "mitigation": "Specific action the borrower can take to reduce this risk"
    }
  ],
  "automated_actions": [
    "Action the smart contract should auto-trigger if risk reaches Critical"
  ]
}
`;

  try {
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NVIDIA_NIM_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-70b-instruct", // Using available llama 3.1 instruct model on NVIDIA NIM
        messages: [
          {
            role: "system",
            content: "You are a DeFi risk analyst AI that outputs purely valid JSON.",
          },
          {
            role: "user",
            content: RISK_PROMPT,
          },
        ],
        temperature: 0.2,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
        throw new Error(`NVIDIA NIM API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "{}";
    
    // Attempt to extract JSON if the model added markdown blocks
    const jsonMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/) || content.match(/(\{[\s\S]*?\})/);
    if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("NVIDIA NIM API error:", error);
    throw new Error("Failed to generate risk analysis.");
  }
}
