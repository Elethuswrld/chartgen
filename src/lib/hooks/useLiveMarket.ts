import { useEffect, useRef } from "react";
import useMarketStore from "../../store/marketStore";
import { CandlestickData } from "../../components/Chart/chartTypes";
import * as patternMatchers from "../../lib/analysis/patterns";

const patternDetectors = {
  Doji: patternMatchers.findDoji,
  Engulfing: patternMatchers.findEngulfing,
  Hammer: patternMatchers.findHammer,
  ShootingStar: patternMatchers.findShootingStar,
  MorningStar: patternMatchers.findMorningStar,
  EveningStar: patternMatchers.findEveningStar,
};

export function useLiveMarket(symbols: string[]) {
  const wsRef = useRef<WebSocket | null>(null);
  const { updateAsset, addPattern } = useMarketStore();

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

        const assetCandles = useMarketStore.getState().assets[update.s]?.candles || [];
        const extendedCandles = [...assetCandles, candle];

        Object.entries(patternDetectors).forEach(([name, detector]) => {
          const found = detector(extendedCandles);
          if (found.length) {
            // Check if the last candle is a pattern
            const lastCandleTime = extendedCandles[extendedCandles.length -1].time
            if (found[found.length -1].time === lastCandleTime) {
                 addPattern(update.s, name);
            }
          }
        });
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
