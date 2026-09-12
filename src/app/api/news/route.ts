import { NextResponse } from "next/server";

export async function GET() {
  try {
    // CryptoCompare News API doesn't require an auth token for low-volume hackathon use
    const res = await fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN", {
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) {
        throw new Error("Failed to fetch news");
    }

    const json = await res.json();
    const data = { results: json.Data.slice(0, 15) }; // Map to match previous structure
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("News API Error:", error);
    return NextResponse.json({ error: "Failed to fetch news feed" }, { status: 500 });
  }
}
