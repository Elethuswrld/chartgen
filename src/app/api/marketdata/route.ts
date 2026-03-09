import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";

const finnhubStockSymbolSchema = z.array(
  z.object({
    currency: z.string(),
    description: z.string(),
    displaySymbol: z.string(),
    figi: z.string(),
    isin: z.string().nullable(),
    mic: z.string(),
    shareClassFIGI: z.string(),
    symbol: z.string(),
    symbol2: z.string(),
    type: z.string(),
  })
);

export async function GET() {
  return NextResponse.json(
    { error: "Use POST /api/marketdata with { provider, action, params }" },
    { status: 405 }
  );
}

export async function POST(req: Request) {
  try {
    const { provider, action, params } = (await req.json()) as {
      provider?: "finnhub" | "binance";
      action?: string;
      params?: Record<string, any>;
    };

    if (!provider || !action) {
      return NextResponse.json({ error: "provider and action are required" }, { status: 400 });
    }

    console.log("[marketdata]", provider, action);

    // Finnhub
    if (provider === "finnhub") {
      const key = process.env.FINNHUB_API_KEY;
      if (!key) {
        return NextResponse.json({ error: "Missing FINNHUB_API_KEY" }, { status: 500 });
      }

      if (action === "stock_symbols") {
        const { exchange = "US", search = "" } = params ?? {};
        const url = new URL("https://finnhub.io/api/v1/stock/symbol");
        url.searchParams.set("exchange", exchange);
        url.searchParams.set("token", key);
        const r = await fetch(url);
        const data = await r.json();
        
        const validation = finnhubStockSymbolSchema.safeParse(data);
        if (!validation.success) {
          return NextResponse.json({ error: "Invalid data from provider", details: validation.error }, { status: 500 });
        }

        const filteredData = search
          ? validation.data.filter(s => s.symbol.toLowerCase().includes(search.toLowerCase()))
          : validation.data;

        return NextResponse.json(filteredData, { status: r.status });
      }
      
      if (action === "forex_symbols") {
        const exchange = params?.exchange ?? "oanda";
        const url = new URL("https://finnhub.io/api/v1/forex/symbol");
        url.searchParams.set("exchange", exchange);
        url.searchParams.set("token", key);
        const r = await fetch(url);
        const data = await r.json();
        return NextResponse.json(data, { status: r.status });
      }


      if (action === "stock_candles") {
        const { symbol, resolution, from, to } = params ?? {};
        if (!symbol || !resolution || !from || !to) {
          return NextResponse.json({ error: "symbol,resolution,from,to required" }, { status: 400 });
        }
        const url = new URL("https://finnhub.io/api/v1/stock/candle");
        url.searchParams.set("symbol", symbol);
        url.searchParams.set("resolution", String(resolution));
        url.searchParams.set("from", String(from));
        url.searchParams.set("to", String(to));
        url.searchParams.set("token", key);
        const r = await fetch(url);
        const data = await r.json();
        return NextResponse.json(data, { status: r.status });
      }

      if (action === "quote_batch") {
        const symbols: string[] = params?.symbols;
        if (!Array.isArray(symbols) || symbols.length === 0) {
          return NextResponse.json({ error: "symbols[] required" }, { status: 400 });
        }
        const capped = symbols.slice(0, 30);
        const results = await Promise.all(
          capped.map(async (symbol) => {
            const url = new URL("https://finnhub.io/api/v1/quote");
            url.searchParams.set("symbol", symbol);
            url.searchParams.set("token", key);
            const r = await fetch(url);
            const data = await r.json();
            return [symbol, data] as const;
          })
        );
        return NextResponse.json(Object.fromEntries(results));
      }

      return NextResponse.json({ error: "Unsupported finnhub action" }, { status: 400 });
    }

    // Binance
    if (provider === "binance") {
      if (action === "exchange_info") {
        const r = await fetch("https://api.binance.com/api/v3/exchangeInfo");
        const data = await r.json();
        return NextResponse.json(data, { status: r.status });
      }

      if (action === "klines") {
        const { symbol, interval, limit = 100 } = params ?? {};
        if (!symbol || !interval) {
          return NextResponse.json({ error: "symbol and interval required" }, { status: 400 });
        }
        const url = new URL("https://api.binance.com/api/v3/klines");
        url.searchParams.set("symbol", symbol);
        url.searchParams.set("interval", interval);
        url.searchParams.set("limit", String(limit));
        const r = await fetch(url);
        const data = await r.json();
        return NextResponse.json(data, { status: r.status });
      }

      return NextResponse.json({ error: "Unsupported binance action" }, { status: 400 });
    }

    return NextResponse.json({ error: "Unsupported provider" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
