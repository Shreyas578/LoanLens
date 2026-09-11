import { NextResponse } from "next/server";
import { attestTransaction } from "@/lib/attestcoin";

export async function POST(req: Request) {
  try {
    const { txHash } = await req.json();

    if (!txHash) {
      return NextResponse.json({ error: "Transaction hash is required" }, { status: 400 });
    }

    console.log("Starting attestation process for:", txHash);
    const verified = await attestTransaction(txHash);

    if (verified) {
      return NextResponse.json({ success: true, message: "Transaction attested and verified on Creditcoin Testnet." });
    } else {
      return NextResponse.json({ success: false, message: "Verification failed." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process attestation" }, { status: 500 });
  }
}
