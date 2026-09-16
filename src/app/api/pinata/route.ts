import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image, walletAddress } = await req.json();
    
    // Remove base64 header
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Pinata API requires form-data for files
    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'image/png' });
    formData.append('file', blob, `${walletAddress}-passport.png`);
    
    const pinataMetadata = JSON.stringify({
      name: `LoanLens Passport - ${walletAddress}`,
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', pinataOptions);

    const pinataRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_SECRET_KEY}`,
      },
      body: formData,
    });

    if (!pinataRes.ok) {
        const errText = await pinataRes.text();
        console.error("Pinata rejection:", errText);
        throw new Error("Failed to pin to IPFS");
    }

    const pinataData = await pinataRes.json();
    
    return NextResponse.json({ success: true, ipfsHash: pinataData.IpfsHash });

  } catch (error: any) {
    console.error("Pinata API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
