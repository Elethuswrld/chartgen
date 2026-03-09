import { useEffect, useRef } from "react";
import useMarketStore from "../../store/marketStore";
import { CandlestickData } from "../../components/Chart/chartTypes";
import { findDoji } from "../../lib/analysis/patterns";

export function useLiveMarket(symbols: string[]) {
  const wsRef = useRef<WebSocket | null>(null);
  const updateAsset = useMarketStore((state) => state.updateAsset);
  const addPattern = useMarketStore((state) => state.addPattern);

  useEffect(() => {
    if (!symbols.length) return;

    const ws = new WebSocket(`wss://ws.finnhub.io?token=${process.env.NEXT_PUBLIC_FINNHUB_KEY}`);
    wsRef.current = ws;

    ws.onopen = () => {
      symbols.forEach((sym) => ws.send(JSON.stringify({ type: "subscribe", symbol: sym })));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (!data?.data) return;

      data.data.forEach((update: any) => {
        const candle: CandlestickData = {
          time: Math.floor(update.t / 1000).toString(),
          open: update.o,
          high: update.h,
          low: update.l,
          close: update.c,
        };
        updateAsset(update.s, candle);

        // Check for Doji
        const assetCandles = [...(useMarketStore.getState().assets[update.s]?.candles || []), candle];
        const dojiCandles = findDoji(assetCandles);
        if (dojiCandles.length) addPattern(update.s, "Doji");
      });
    };

    return () => {
        if (wsRef.current) {
            symbols.forEach((sym) => {
                if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({ type: "unsubscribe", symbol: sym }));
                }
            });
            wsRef.current.close();
        }
    };
  }, [symbols, updateAsset, addPattern]);
}
