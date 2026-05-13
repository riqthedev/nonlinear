import { NextResponse } from "next/server";
import { getFeedLinesForRecap } from "@/lib/demo/queries";

export async function GET() {
  const key = process.env.OPENAI_API_KEY;
  const lines = getFeedLinesForRecap().join("\n");

  if (!key) {
    return NextResponse.json({
      recap: [
        "- Cohort feed shows weekly pulses and demo submissions clustering around Shipline and Demo Radar.",
        "- Nexus is still exploring positioning while the first two projects push toward Friday.",
        "- Demo week 1 has two submissions with decks and a clip link — momentum is visible without heavy PM tooling.",
        "- (Set OPENAI_API_KEY for an LLM-generated recap from the same feed text.)",
      ].join("\n"),
    });
  }

  const prompt = `You are narrating a hackathon cohort feed. Summarize momentum in 5 bullets max, optimistic tone, no insults. Reference themes, not individuals unless clearly positive.\n\nFeed:\n${lines}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return plain text bullets with leading dashes." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 400,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "OpenAI request failed", detail: text },
      { status: 502 },
    );
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = json.choices?.[0]?.message?.content?.trim() ?? "";

  return NextResponse.json({ recap: content });
}
