import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    const systemPrompt = `
    You are LoanLens AI, a friendly and knowledgeable DeFi credit advisor.
    You have FULL ACCESS to the user's attested wallet data and credit analysis:
    ${JSON.stringify(context)}

    PERSONALITY: You are direct, honest, and encouraging. You never sugarcoat bad scores 
    but always provide actionable paths forward. You speak in plain English, never jargon.
    You reference their specific on-chain data when answering questions.
    You know about all major DeFi lending protocols and their requirements.

    Keep responses concise — 2-4 sentences unless a detailed explanation is requested.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "I didn't quite get that.";
    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("Chat API error:", error);
    // Simple fallback logic could go here similar to groq.ts
    return NextResponse.json({ reply: "My connection to the AI cluster was interrupted. Please try again." });
  }
}
