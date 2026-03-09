
'use client';

import { useEffect, useRef } from 'react';
import { chartAdapter } from '@/components/Chart/chartAdapter';
import { useAiStore } from '@/stores/aiStore';
import { useUiStore } from '@/stores/uiStore';
import useMarketStore from '@/store/marketStore';
import { OhlcData, Time, UTCTimestamp } from 'lightweight-charts';

export default function ChartCanvas() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const setHoverContext = useAiStore(state => state.setHoverExplainPayload);
  const setSelectedCandle = useUiStore(state => state.setSelectedCandle);
  const ohlc = useMarketStore(state => state.ohlc);

  useEffect(() => {
    if (chartContainerRef.current) {
      chartAdapter.init(chartContainerRef.current);

      if (ohlc.length > 0) {
        const candlestickData = ohlc.map(d => ({ ...d, time: d.time as UTCTimestamp }));
        chartAdapter.setData(candlestickData);
      }

    }
  }, [ohlc, setHoverContext, setSelectedCandle]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
}
