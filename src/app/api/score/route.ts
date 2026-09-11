import { NextResponse } from "next/server";
import { generateCreditScoreNarrative } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { walletData } = body;

    if (!walletData || !walletData.walletAddress) {
      return NextResponse.json({ error: "Missing wallet data" }, { status: 400 });
    }

    const narrative = await generateCreditScoreNarrative(walletData);

    return NextResponse.json(narrative);
  } catch (error) {
    console.error("Score API Error:", error);
    return NextResponse.json({ error: "Failed to generate score narrative" }, { status: 500 });
  }
}
