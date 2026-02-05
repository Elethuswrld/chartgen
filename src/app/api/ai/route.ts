// src/app/api/ai/route.ts
import "server-only";
import { NextResponse } from "next/server";

type Model = "gpt" | "deepseek";

export async function POST(req: Request) {
  try {
    const { prompt, model } = (await req.json()) as { prompt?: string; model?: Model };

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (model !== "gpt" && model !== "deepseek") {
      return NextResponse.json({ error: "Invalid model" }, { status: 400 });
    }

    if (model === "gpt") {
      const key = process.env.OPENAI_API_KEY;
      if (!key) return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });

      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      });

      const data = await r.json();
      if (!r.ok) return NextResponse.json({ error: data?.error ?? data }, { status: r.status });

      return NextResponse.json({
        text: data?.choices?.[0]?.message?.content ?? "",
        raw: data,
      });
    }

    // deepseek
    const key = process.env.DEEPSEEK_API_KEY;
    if (!key) return NextResponse.json({ error: "Missing DEEPSEEK_API_KEY" }, { status: 500 });

    const r = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    const data = await r.json();
    if (!r.ok) return NextResponse.json({ error: data?.error ?? data }, { status: r.status });

    return NextResponse.json({
      text: data?.choices?.[0]?.message?.content ?? "",
      raw: data,
    });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}