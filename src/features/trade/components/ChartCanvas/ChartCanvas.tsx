
'use client';

import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { useMarketStore } from '@/stores/marketStore';

export default function ChartCanvas() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const ohlc = useMarketStore((state) => state.ohlc);

  useEffect(() => {
    if (!chartContainerRef.current || ohlc.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: '#1f2937' },
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      wickUpColor: '#22c55e',
    });

    candlestickSeries.setData(ohlc);

    return () => {
      chart.remove();
    };
  }, [ohlc]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
}
