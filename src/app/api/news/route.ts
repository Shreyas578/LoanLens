import { NextResponse } from "next/server";

export async function GET() {
  try {
    // We fetch from CryptoPanic's free public feed
    const res = await fetch("https://cryptopanic.com/api/v1/posts/?public=true&filter=hot&currencies=ETH,CTC", {
      next: { revalidate: 3600 } // Cache for an hour
    });
    
    if (!res.ok) {
        throw new Error("Failed to fetch news");
    }

    const data = await res.json();
    
    // In a real production scenario, we would map over these and pass them to Groq 
    // to generate a 1-sentence summary for each. For the sake of speed in the hackathon,
    // we'll return the raw data and let the frontend display the titles.
    return NextResponse.json(data);
  } catch (error) {
    console.error("News API Error:", error);
    return NextResponse.json({ error: "Failed to fetch news feed" }, { status: 500 });
  }
}
