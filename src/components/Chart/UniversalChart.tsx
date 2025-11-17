"use client";

import { useEffect, useRef, useState } from "react";
import Select, { SingleValue } from "react-select";

type SymbolOption = {
  symbol: string;
  label: string;
  value: string;
  type: "crypto" | "stock";
};

export default function UniversalChart({
  finnhubApiKey,
}: {
  finnhubApiKey: string;
}) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);
  const initializedRef = useRef(false);

  const [symbols, setSymbols] = useState<SymbolOption[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolOption | null>(
    null
  );

  // ----------------------------------
  // 1) Fetch Symbols (Dynamic Dropdown)
  // ----------------------------------
  useEffect(() => {
    async function loadSymbols() {
      try {
        // STOCKS (Finnhub)
        const stockRes = await fetch(
          `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${finnhubApiKey}`
        );
        const stockData = await stockRes.json();

        const stockList: SymbolOption[] = stockData.slice(0, 40).map((s: any) => ({
          symbol: s.symbol,
          label: s.symbol,
          value: s.symbol,
          type: "stock",
        }));

        // CRYPTO (Binance)
        const cryptoRes = await fetch(
          "https://api.binance.com/api/v3/exchangeInfo"
        );
        const cryptoData = await cryptoRes.json();

        const cryptoList: SymbolOption[] = cryptoData.symbols
          .filter((s: any) => s.status === "TRADING")
          .slice(0, 40)
          .map((s: any) => ({
            symbol: s.symbol,
            label: s.symbol,
            value: s.symbol,
            type: "crypto",
          }));

        const fullList = [...stockList, ...cryptoList];

        setSymbols(fullList);
        setSelectedSymbol(fullList[0]);
      } catch (err) {
        console.error("Symbol loading error:", err);
      }
    }

    loadSymbols();
  }, [finnhubApiKey]);

  // ----------------------------------
  // 2) Initialize the Chart (Client Only)
  // ----------------------------------
  useEffect(() => {
    if (!chartContainerRef.current) return;
    if (initializedRef.current) return; // Prevent double init

    initializedRef.current = true;

    async function initChart() {
      try {
        const {
          createChart,
          CrosshairMode,
          ColorType,
        } = await import("lightweight-charts");

        const chart = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
          layout: {
            background: { type: ColorType.Solid, color: "#0E1424" },
            textColor: "#FFFFFF",
          },
          grid: {
            vertLines: { color: "rgba(255,255,255,0.05)" },
            horzLines: { color: "rgba(255,255,255,0.05)" },
          },
          crosshair: { mode: CrosshairMode.Normal },
          timeScale: { borderColor: "rgba(255,255,255,0.1)" },
          rightPriceScale: { borderColor: "rgba(255,255,255,0.1)" },
        });

        const candleSeries = chart.addCandlestickSeries({
          upColor: "#22c55e",
          downColor: "#ef4444",
          borderUpColor: "#22c55e",
          borderDownColor: "#ef4444",
          wickUpColor: "#22c55e",
          wickDownColor: "#ef4444",
        });

        chartRef.current = chart;
        candleSeriesRef.current = candleSeries;

        // Auto resize
        const resize = () => {
          chart.applyOptions({
            width: chartContainerRef.current!.clientWidth,
            height: chartContainerRef.current!.clientHeight,
          });
        };

        window.addEventListener("resize", resize);

        return () => {
          window.removeEventListener("resize", resize);
          chart.remove();
        };
      } catch (err) {
        console.error("Chart initialization error:", err);
      }
    }

    initChart();
  }, []);

  // ----------------------------------
  // 3) Load Candlestick Data (Dynamic)
  // ----------------------------------
  useEffect(() => {
    if (!selectedSymbol || !candleSeriesRef.current) return;

    async function loadData() {
      try {
        let data: any;

        if (selectedSymbol.type === "stock") {
          const url = `https://finnhub.io/api/v1/stock/candle?symbol=${selectedSymbol.symbol}&resolution=D&count=100&token=${finnhubApiKey}`;
          const res = await fetch(url);
          const json = await res.json();

          data = json.t.map((_: any, i: number) => ({
            time: json.t[i],
            open: json.o[i],
            high: json.h[i],
            low: json.l[i],
            close: json.c[i],
          }));
        } else {
          const url = `https://api.binance.com/api/v3/klines?symbol=${selectedSymbol.symbol}&interval=1d&limit=100`;
          const res = await fetch(url);
          const json = await res.json();

          data = json.map((k: any) => ({
            time: Math.floor(k[0] / 1000),
            open: parseFloat(k[1]),
            high: parseFloat(k[2]),
            low: parseFloat(k[3]),
            close: parseFloat(k[4]),
          }));
        }

        candleSeriesRef.current.setData(data);
      } catch (err) {
        console.error("Candle data loading error:", err);
      }
    }

    loadData();
  }, [selectedSymbol, finnhubApiKey]);

  return (
    <div className="w-full h-full flex flex-col gap-4 bg-[#0E1424] p-4">
      <Select
        options={symbols}
        value={selectedSymbol}
        onChange={(o: SingleValue<SymbolOption>) => setSelectedSymbol(o)}
        placeholder="Search symbols..."
        className="text-black"
      />

      <div ref={chartContainerRef} className="flex-1 w-full rounded-md" />
    </div>
  );
}
