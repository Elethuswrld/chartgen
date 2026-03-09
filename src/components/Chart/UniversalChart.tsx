import { useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi, UTCTimestamp, MouseEventParams } from "lightweight-charts";
import useMarketStore from "../../store/marketStore";
import { CandlestickData } from "./chartTypes";

// Pattern styles
const patternStyles: Record<string, { color: string; shape: 'arrowUp' | 'arrowDown' | 'circle' }> = {
  Doji: { color: "#ffc107", shape: "circle" },
  Hammer: { color: "#00ff00", shape: "arrowUp" },
  ShootingStar: { color: "#ff0000", shape: "arrowDown" },
  Engulfing: { color: "#00ffff", shape: "circle" },
  MorningStar: { color: "#ff7f50", shape: "arrowUp" },
  EveningStar: { color: "#ff1493", shape: "arrowDown" },
};

interface PatternEntry {
  name: string;
  time: number;
}

interface UniversalChartProps {
  symbol: string;
}

export default function UniversalChart({ symbol }: UniversalChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const asset = useMarketStore((state) => state.assets[symbol]);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: "#0E1424" }, textColor: "#fff" },
      grid: { vertLines: { color: "rgba(255,255,255,0.05)" }, horzLines: { color: "rgba(255,255,255,0.05)" } },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.2)" },
      timeScale: { borderColor: "rgba(255,255,255,0.2)" },
      crosshair: { mode: 1 },
    });

    chartRef.current = chart;
    seriesRef.current = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderDownColor: '#ef5350',
      borderUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      wickUpColor: '#26a69a',
    });

    // Resize handler
    const resize = () => chart.resize(chartContainerRef.current!.clientWidth, chartContainerRef.current!.clientHeight);
    window.addEventListener("resize", resize);

    // Tooltip element
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.display = 'none';
    tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '8px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.zIndex = '1000';
    chartContainerRef.current.appendChild(tooltip);
    tooltipRef.current = tooltip;

    return () => {
      window.removeEventListener("resize", resize);
      chart.remove();
      tooltip.remove();
    };
  }, []);

  // Update chart data and markers
  useEffect(() => {
    if (!seriesRef.current || !asset?.candles?.length) return;

    // Candlestick data
    const chartData = asset.candles.map(d => ({ ...d, time: d.time as UTCTimestamp }));
    seriesRef.current.setData(chartData);

    // Auto visible range
    if(chartData.length > 0) {
        const lastTime = chartData[chartData.length - 1].time;
        chartRef.current?.timeScale().setVisibleRange({
          from: (lastTime - 86400 * 2),
          to: lastTime,
        });
    }


    // Map candle times to detected patterns
    const candlePatternMap = new Map<UTCTimestamp, PatternEntry[]>();
    if (asset.patterns?.length) {
      // This logic assumes patterns are added chronologically and match the latest candles
      const patternStartIdx = Math.max(0, asset.candles.length - asset.patterns.length);
      const relevantCandles = asset.candles.slice(patternStartIdx);

      asset.patterns.forEach((patternName, idx) => {
        // The pattern belongs to the candle at the same relative index
        const candle = relevantCandles[idx];
        if (!candle) return;
        const time = candle.time as UTCTimestamp;
        if (!candlePatternMap.has(time)) {
          candlePatternMap.set(time, []);
        }
        candlePatternMap.get(time)!.push({ name: patternName, time: candle.time as number });
      });
    }

    // Convert to markers
    const markers = Array.from(candlePatternMap.entries()).flatMap(([time, patterns]) => {
      // Use the last pattern for the main marker to avoid clutter
      const mainPattern = patterns[patterns.length -1];
      const style = patternStyles[mainPattern.name] || { color: "#fff", shape: "circle" };
      return [{
          time,
          position: style.shape === "arrowUp" ? "belowBar" : "aboveBar",
          color: style.color,
          shape: style.shape,
          text: patterns.map(p => p.name).join(', '), // Tooltip will show all
      }];
    });

    seriesRef.current.setMarkers(markers);

    // Tooltip logic
    const chart = chartRef.current!;
    const handleCrosshair = (param: MouseEventParams) => {
      const tooltip = tooltipRef.current;
      if (!param.point || !param.time || !seriesRef.current || !tooltip) {
        if(tooltip) tooltip.style.display = 'none';
        return;
      }
      const data = param.seriesData.get(seriesRef.current) as CandlestickData;
      if (!data) {
        if(tooltip) tooltip.style.display = 'none';
        return;
      }
      const patternsHere = candlePatternMap.get(data.time as UTCTimestamp) || [];
      if (!patternsHere.length) {
        if(tooltip) tooltip.style.display = 'none';
        return;
      }

      // Price coordinate
      const y = chart.priceScale('right').priceToCoordinate(data.close);

      tooltip.style.display = 'block';
      tooltip.style.left = `${param.point.x + 15}px`;
      tooltip.style.top = `${y}px`;
      tooltip.innerHTML = `
        <div><strong>${symbol}</strong></div>
        <div>Patterns: ${patternsHere.map(p => p.name).join(', ')}</div>
        <div>O: ${data.open.toFixed(2)} H: ${data.high.toFixed(2)} L: ${data.low.toFixed(2)} C: ${data.close.toFixed(2)}</div>
        <div>Time: ${new Date((data.time as number) * 1000).toLocaleString()}</div>
      `;
    };

    chart.subscribeCrosshairMove(handleCrosshair);
    return () => chart.unsubscribeCrosshairMove(handleCrosshair);

  }, [asset, symbol]);

  return <div ref={chartContainerRef} style={{ height: "100%", width: "100%", position: 'relative' }} />;
}
