
'use client';

import { useEffect, useRef } from 'react';
import { chartAdapter } from '@/components/Chart/chartAdapter';
import { useAiStore } from '@/stores/aiStore';
import { useUiStore } from '@/stores/uiStore';
import { useMarketStore } from '@/stores/marketStore';
import { OhlcData, Time } from 'lightweight-charts';

export default function ChartCanvas() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const setHoverContext = useAiStore(state => state.setHoverExplainPayload);
  const setSelectedCandle = useUiStore(state => state.setSelectedCandle);
  const ohlc = useMarketStore(state => state.ohlc);

  useEffect(() => {
    if (chartContainerRef.current) {
      chartAdapter.createChart(chartContainerRef.current);

      if (ohlc.length > 0) {
        chartAdapter.createCandleSeries(ohlc as OhlcData<Time>[]);
      }

      chartAdapter.subscribeCrosshairMove(param => {
        setHoverContext(param);
      });

      chartAdapter.subscribeClick(param => {
        setSelectedCandle(param);
      });
    }
  }, [ohlc, setHoverContext, setSelectedCandle]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
}
