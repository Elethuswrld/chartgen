import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CrosshairMode,
  ColorType,
  IChartApi,
  ISeriesApi,
  CandlestickData,
} from "lightweight-charts/standalone";
import { useAuth } from '../../lib/hooks/useAuth';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { AIPanel } from "../AIPanel";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../lib/firebase";

type SymbolOption = { symbol: string; type: "crypto" | "stock" | "forex" };

export default function UniversalChart({ finnhubApiKey }: { finnhubApiKey: string }) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [symbols, setSymbols] = useState<SymbolOption[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolOption | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const candleDataRef = useRef<CandlestickData[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  const { addToWatchlist } = useFirestore();
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredSymbols = symbols.filter((s) =>
    s.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToWatchlist = () => {
    if (user && selectedSymbol && candleDataRef.current.length > 0) {
      const lastCandle = candleDataRef.current[candleDataRef.current.length - 1];
      const previousCandle = candleDataRef.current[candleDataRef.current.length - 2];
      const price = lastCandle.close;
      let change = 0;
      let movement = 'up';

      if(previousCandle) {
          change = ((price - previousCandle.close) / previousCandle.close) * 100;
          if (change < 0) {
              movement = 'down';
          }
      }

      const stock = {
        name: selectedSymbol.symbol,
        price: price,
        movement: movement,
        change: change,
      };
      addToWatchlist(user.uid, stock);
    }
  };

  const getAIResponse = async (request: "explain_move" | "trade_plan" | "trend") => {
    if (!selectedSymbol) {
      setAiResponse("Please select a symbol first.");
      return;
    }

    setIsLoading(true);
    setAiResponse('');

    const geminiProxy = httpsCallable(functions, 'geminiProxy');
    const ohlc = candleDataRef.current.slice(-20);

    const promptPayload = {
      symbol: selectedSymbol.symbol,
      timeframe: '1h',
      ohlc: ohlc,
      request: request,
    };

    try {
      const result = await geminiProxy({ prompt: JSON.stringify(promptPayload) });
      const rawResponse = (result.data as { response: string }).response;
      const cleanedJsonString = rawResponse.replace(/```json\n?|\n?```/g, '');
      const parsedResponse = JSON.parse(cleanedJsonString);
      setAiResponse(JSON.stringify(parsedResponse, null, 2));
    } catch (error) {
      console.error("Error calling geminiProxy function:", error);
      setAiResponse("Error getting response from AI.");
    } finally {
        setIsLoading(false);
    }
  };

  // Fetch symbols (stocks + crypto)
  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const stockRes = await fetch(
          `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${finnhubApiKey}`
        );
        const stockData = await stockRes.json();
        const stockSymbols: SymbolOption[] = stockData.map((s: any) => ({
          symbol: s.symbol,
          type: "stock",
        }));

        const binanceRes = await fetch("https://api.binance.com/api/v3/exchangeInfo");
        const binanceData = await binanceRes.json();
        const cryptoSymbols: SymbolOption[] = binanceData.symbols
          .filter((s: any) => s.status === "TRADING")
          .map((s: any) => ({ symbol: s.symbol, type: "crypto" }));

        const allSymbols = [...stockSymbols, ...cryptoSymbols];
        setSymbols(allSymbols);
        setSelectedSymbol(allSymbols[0]);
      } catch (err) {
        console.error("Error fetching symbols:", err);
      }
    };
    fetchSymbols();
  }, [finnhubApiKey]);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
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

    candleSeriesRef.current = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current!.clientWidth,
        height: chartContainerRef.current!.clientHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // Fetch candles + live updates
  useEffect(() => {
    if (!selectedSymbol || !candleSeriesRef.current) return;

    wsRef.current?.close();
    if (intervalRef.current) clearInterval(intervalRef.current);

    const fetchCandles = async () => {
      candleDataRef.current = [];
      try {
        let data: CandlestickData[] = [];

        if (selectedSymbol.type === "crypto") {
          const res = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${selectedSymbol.symbol}&interval=1h&limit=100`
          );
          const klines = await res.json();
          data = klines.map((k: any) => ({
            time: k[0] / 1000,
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
              time: k.t / 1000,
              open: parseFloat(k.o),
              high: parseFloat(k.h),
              low: parseFloat(k.l),
              close: parseFloat(k.c),
            });
          };
        } else {
          const now = Math.floor(Date.now() / 1000);
          const oneMonthAgo = now - 30 * 24 * 3600;
          const res = await fetch(
            `https://finnhub.io/api/v1/stock/candle?symbol=${selectedSymbol.symbol}&resolution=60&from=${oneMonthAgo}&to=${now}&token=${finnhubApiKey}`
          );
          const candles = await res.json();
          if (candles.t) {
            data = candles.t.map((t: number, i: number) => ({
              time: t,
              open: candles.o[i],
              high: candles.h[i],
              low: candles.l[i],
              close: candles.c[i],
            }));
          }

          intervalRef.current = setInterval(async () => {
            try {
              const latestRes = await fetch(
                `https://finnhub.io/api/v1/stock/candle?symbol=${selectedSymbol.symbol}&resolution=60&from=${Math.floor(
                  Date.now() / 1000 - 3600
                )}&to=${Math.floor(Date.now() / 1000)}&token=${finnhubApiKey}`
              );
              const latest = await latestRes.json();
              if (latest.t?.length) {
                candleSeriesRef.current?.update({
                  time: latest.t[latest.t.length - 1],
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
        candleSeriesRef.current.setData(data);
      } catch (err) {
        console.error("Error fetching candles:", err);
      }
    };

    fetchCandles();

    return () => {
      wsRef.current?.close();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedSymbol, finnhubApiKey]);

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
                isLoading={isLoading}
                onExplain={() => getAIResponse("explain_move")}
                onGeneratePlan={() => getAIResponse("trade_plan")}
                onGetTrend={() => getAIResponse("trend")}
            />
        </div>
    </div>
  );
}
