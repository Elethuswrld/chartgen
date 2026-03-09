import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("X-Finnhub-Secret");
  if (secret !== process.env.FINNHUB_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Immediately acknowledge to avoid webhook timeout
  const response = NextResponse.json({ status: "ok" }, { status: 200 });

  // Process event in the background
  setTimeout(() => {
    console.log("Received Finnhub event:", body);
    // Example: push update to zustand store or notify user
  }, 0);

  return response;
}
