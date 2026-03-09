import { useEffect, useRef } from "react";
import useMarketStore from "../../store/marketStore";
import { CandlestickData } from "../../components/Chart/chartTypes";
import * as patterns from "../../lib/analysis/patterns";

const patternDetectors = {
  Doji: patterns.findDoji,
  Engulfing: patterns.findEngulfing,
  Hammer: patterns.findHammer,
  ShootingStar: patterns.findShootingStar,
  MorningStar: patterns.findMorningStar,
  EveningStar: patterns.findEveningStar,
};

export function useLiveMarket(symbols: string[]) {
  const wsRef = useRef<WebSocket | null>(null);
  const { updateAsset, addPattern } = useMarketStore();

  useEffect(() => {
    if (!symbols.length) return;
    const ws = new WebSocket(`wss://ws.finnhub.io?token=${process.env.NEXT_PUBLIC_FINNHUB_KEY}`);
    wsRef.current = ws;

    ws.onopen = () => symbols.forEach(sym => ws.send(JSON.stringify({ type: "subscribe", symbol: sym })));

    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
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
        const recentCandles = [...assetCandles, candle].slice(-20); // check only last 20
        Object.entries(patternDetectors).forEach(([name, detector]) => {
          const found = detector(recentCandles);
          if (found.length && found[found.length - 1].time === candle.time) {
            addPattern(update.s, name);
          }
        });
      });
    };

    return () => {
      if (wsRef.current) {
        symbols.forEach(sym => {
             if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ type: "unsubscribe", symbol: sym }))
             }
        });
        wsRef.current.close();
      }
    };
  }, [symbols, updateAsset, addPattern]);
}
