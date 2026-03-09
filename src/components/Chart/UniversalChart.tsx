
import { useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi, UTCTimestamp } from "lightweight-charts";
import { CandlestickData } from "./chartTypes";
import { findDoji } from "../../lib/analysis/patterns";

interface UniversalChartProps {
  initialData: CandlestickData[];
}

export default function UniversalChart({ initialData }: UniversalChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#0E1424" },
        textColor: "white",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.05)" },
        horzLines: { color: "rgba(255,255,255,0.05)" },
      },
    });
    chartRef.current = chart;

    const candlestickSeries = chart.addCandlestickSeries();
    candlestickSeriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.resize(chartContainerRef.current.clientWidth, chartContainerRef.current.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (candlestickSeriesRef.current) {
      candlestickSeriesRef.current.setData(initialData.map(d => ({ ...d, time: d.time as UTCTimestamp })));

      const dojiPatterns = findDoji(initialData);
      const markers = dojiPatterns.map(pattern => ({
        time: pattern.time as UTCTimestamp,
        position: 'aboveBar' as const,
        color: '#ffc107',
        shape: 'arrowDown' as const,
        text: 'Doji',
      }));

      candlestickSeriesRef.current.setMarkers(markers);
    }
  }, [initialData]);

  return <div ref={chartContainerRef} style={{ height: "100%", width: "100%" }} />;
}
