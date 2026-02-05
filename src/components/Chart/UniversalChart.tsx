
import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CrosshairMode,
  ColorType,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  UTCTimestamp,
} from "lightweight-charts";
import { useAuth } from '../../lib/hooks/useAuth';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { useAI } from '../../lib/hooks/useAI';
import { AIPanel } from "../AIPanel";

type SymbolOption = { symbol: string; type: "crypto" | "stock" | "forex" };

interface FinnhubStock {
  symbol: string;
  description: string;
}

interface BinanceSymbol {
  symbol: string;
  status: string;
}

interface BinanceExchangeInfo {
  symbols: BinanceSymbol[];
}

type BinanceKline = [
    number, // Kline open time
    string, // Open price
    string, // High price
    string, // Low price
    string, // Close price
    string, // Volume
    number, // Kline close time
    string, // Quote asset volume
    number, // Number of trades
    string, // Taker buy base asset volume
    string, // Taker buy quote asset volume
    string  // Unused
];

const toUTCTimestamp = (ms: number) => Math.floor(ms / 1000) as UTCTimestamp;

export default function UniversalChart() {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [symbols, setSymbols] = useState<SymbolOption[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolOption | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const candleDataRef = useRef<CandlestickData<UTCTimestamp>[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  const { addToWatchlist } = useFirestore();
  const [aiResponse, setAiResponse] = useState('');
  const { queryAI, loading: isAILoading, model, setModel } = useAI();

  const filteredSymbols = symbols.filter((s) =>
    s.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToWatchlist = () => {
    if (user && selectedSymbol) {
      const stock = {
        name: selectedSymbol.symbol,
        addedAt: Date.now(),
      };
      addToWatchlist(user.uid, stock);
    }
  };

  const getAIResponse = async (request: "explain_move" | "trade_plan" | "trend") => {
    if (!selectedSymbol) {
      setAiResponse("Please select a symbol first.");
      return;
    }

    setAiResponse('');
    const ohlc = candleDataRef.current.slice(-20);
    const promptPayload = {
      symbol: selectedSymbol.symbol,
      timeframe: '1h',
      ohlc: ohlc,
      request: request,
    };

    const response = await queryAI(JSON.stringify(promptPayload));
    setAiResponse(response);
  };

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const stockRes = await fetch("/api/marketdata", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                provider: "finnhub",
                action: "stock_symbols",
                params: { exchange: "US" },
            }),
        });
        const stockData: FinnhubStock[] = await stockRes.json();
        const stockSymbols: SymbolOption[] = stockData.map((s: FinnhubStock) => ({
          symbol: s.symbol,
          type: "stock",
        }));

        const binanceRes = await fetch("/api/marketdata", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                provider: "binance",
                action: "exchange_info",
            }),
        });
        const binanceData: BinanceExchangeInfo = await binanceRes.json();
        const cryptoSymbols: SymbolOption[] = binanceData.symbols
          .filter((s: BinanceSymbol) => s.status === "TRADING")
          .map((s: BinanceSymbol) => ({ symbol: s.symbol, type: "crypto" }));

        const allSymbols = [...stockSymbols, ...cryptoSymbols];
        setSymbols(allSymbols);
        if(allSymbols.length > 0) {
            setSelectedSymbol(allSymbols[0]);
        }
      } catch (err) {
        console.error("Error fetching symbols:", err);
      }
    };
    fetchSymbols();
  }, []);

  useEffect(() => {
    if (!selectedSymbol) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }
    wsRef.current?.close();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const chart = createChart(chartContainerRef.current!, {
        width: chartContainerRef.current!.clientWidth,
        height: chartContainerRef.current!.clientHeight,
        layout: {
            background: { type: ColorType.Solid, color: "#0E1424" },
            textColor: "white",
        },
        crosshair: { mode: CrosshairMode.Normal },
        grid: {
            vertLines: { color: "rgba(255,255,255,0.05)" },
            horzLines: { color: "rgba(255,255,255,0.05)" },
        },
        rightPriceScale: { visible: true },
        timeScale: { rightOffset: 10, barSpacing: 10, fixRightEdge: true },
    });
    chartRef.current = chart;

    const candleSeries = chart.addCandlestickSeries({
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderUpColor: "#22c55e",
        borderDownColor: "#ef4444",
        wickUpColor: "#22c55e",
        wickDownColor: "#ef4444",
    });
    candleSeriesRef.current = candleSeries;

    const fetchCandles = async () => {
      candleDataRef.current = [];
      try {
        let data: CandlestickData<UTCTimestamp>[] = [];
        if (selectedSymbol.type === "crypto") {
          const res = await fetch("/api/marketdata", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                provider: "binance",
                action: "klines",
                params: { symbol: selectedSymbol.symbol, interval: "1h", limit: 100 },
            }),
          });
          const klines: BinanceKline[] = await res.json();
          data = klines.map((k: BinanceKline) => ({
            time: toUTCTimestamp(k[0]),
            open: parseFloat(k[1]),
            high: parseFloat(k[2]),
            low: parseFloat(k[3]),
            close: parseFloat(k[4]),
          }));

          wsRef.current = new WebSocket(
            `wss://stream.binance.com:9443/ws/${selectedSymbol.symbol.toLowerCase()}@kline_1h`
          );
          wsRef.current.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            const k = msg.k;
            candleSeriesRef.current?.update({
              time: toUTCTimestamp(k.t),
              open: parseFloat(k.o),
              high: parseFloat(k.h),
              low: parseFloat(k.l),
              close: parseFloat(k.c),
            });
          };
        } else {
          const now = Math.floor(Date.now() / 1000);
          const oneMonthAgo = now - 30 * 24 * 3600;
          const res = await fetch("/api/marketdata", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                provider: "finnhub",
                action: "stock_candles",
                params: { symbol: selectedSymbol.symbol, resolution: "60", from: oneMonthAgo, to: now },
            }),
          });
          const candles = await res.json();
          if (candles.t) {
            data = candles.t.map((t: number, i: number) => ({
              time: t as UTCTimestamp,
              open: candles.o[i],
              high: candles.h[i],
              low: candles.l[i],
              close: candles.c[i],
            }));
          }

          intervalRef.current = setInterval(async () => {
            try {
                const latestRes = await fetch("/api/marketdata", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        provider: "finnhub",
                        action: "stock_candles",
                        params: { symbol: selectedSymbol.symbol, resolution: "60", from: Math.floor(Date.now() / 1000) - 7200, to: Math.floor(Date.now() / 1000) },
                    }),
                });
                const latest = await latestRes.json();
              if (latest.t?.length) {
                candleSeriesRef.current?.update({
                  time: latest.t[latest.t.length - 1] as UTCTimestamp,
                  open: latest.o[latest.o.length - 1],
                  high: latest.h[latest.h.length - 1],
                  low: latest.l[latest.l.length - 1],
                  close: latest.c[latest.c.length - 1],
                });
              }
            } catch (err) {
              console.error("Error fetching live Finnhub candle:", err);
            }
          }, 60 * 1000);
        }

        candleDataRef.current = data;
        candleSeries.setData(data);
        chart.timeScale().fitContent();
      } catch (err) {
        console.error("Error fetching candles:", err);
      }
    };

    fetchCandles();

    const handleResize = () => {
        if (chartRef.current) {
            chartRef.current.applyOptions({
                width: chartContainerRef.current!.clientWidth,
                height: chartContainerRef.current!.clientHeight,
            });
        }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
          chartRef.current.remove();
      }
      wsRef.current?.close();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [selectedSymbol]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search symbols"
                className="w-full bg-[#0E1424] p-3 rounded-lg border border-white/10 mb-4"
            />
            <select
                value={selectedSymbol?.symbol || ""}
                onChange={(e) =>
                setSelectedSymbol(symbols.find((s) => s.symbol === e.target.value) || null)
                }
                className="w-full bg-[#0E1424] p-3 rounded-lg border border-white/10 mb-4"
            >
                {filteredSymbols.map((s) => (
                <option key={s.symbol} value={s.symbol}>
                    {s.symbol} ({s.type})
                </option>
                ))}
            </select>
            <button onClick={handleAddToWatchlist} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">⭐ Add to Watchlist</button>
            <div ref={chartContainerRef} style={{ height: "500px" }} />
        </div>
        <div>
            <AIPanel
                aiResponse={aiResponse}
                isLoading={isAILoading}
                onExplain={() => getAIResponse("explain_move")}
                onGeneratePlan={() => getAIResponse("trade_plan")}
                onGetTrend={() => getAIResponse("trend")}
                model={model}
                onModelChange={setModel}
            />
        </div>
    </div>
  );
}
