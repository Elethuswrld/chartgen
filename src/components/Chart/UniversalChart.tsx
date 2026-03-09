import { useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi, UTCTimestamp } from "lightweight-charts";
import useMarketStore from "../../store/marketStore";
import { CandlestickData } from "./chartTypes";

interface UniversalChartProps {
  symbol: string;
}

export default function UniversalChart({ symbol }: UniversalChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const asset = useMarketStore((state) => state.assets[symbol]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: "#0E1424" }, textColor: "white" },
      grid: { vertLines: { color: "rgba(255,255,255,0.05)" }, horzLines: { color: "rgba(255,255,255,0.05)" } },
    });
    chartRef.current = chart;
    seriesRef.current = chart.addCandlestickSeries();

    const resize = () => chart.resize(chartContainerRef.current!.clientWidth, chartContainerRef.current!.clientHeight);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !asset) return;
    seriesRef.current.setData(asset.candles.map((d) => ({ ...d, time: d.time as UTCTimestamp })));

    const markers = (asset.patterns || []).map(() => ({
      time: asset.candles[asset.candles.length - 1].time as UTCTimestamp,
      position: "aboveBar" as const,
      color: "#ffc107",
      shape: "arrowDown" as const,
      text: "Doji",
    }));
    seriesRef.current.setMarkers(markers);
  }, [asset]);
  
  return <div ref={chartContainerRef} style={{ height: "100%", width: "100%" }} />;
}
