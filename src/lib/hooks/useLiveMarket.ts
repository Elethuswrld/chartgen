
import { useEffect, useRef } from "react";
import { useMarketStore } from "@/store/marketStore";
import { CandlestickData } from "@/components/Chart/chartTypes";
import * as patterns from "@/lib/analysis/patterns";
import { sendPatternAlert, requestNotificationPermission } from "@/lib/alerts/alertManager";

const patternDetectors = {
  Doji: patterns.findDoji,
  Engulfing: patterns.findEngulfing,
  Hammer: patterns.findHammer,
  ShootingStar: patterns.findShootingStar,
  MorningStar: patterns.findMorningStar,
  EveningStar: patterns.findEveningStar,
};

const lastAlerted: Record<string, string> = {}; // key: `${symbol}-${pattern}`

export function useLiveMarket(symbols: string[]) {
  const wsRef = useRef<WebSocket | null>(null);
  const { updateAsset, addPattern } = useMarketStore();

  useEffect(() => {
    requestNotificationPermission();
  }, []);

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
        const extendedCandles = [...assetCandles]; // No need to add the candle again, updateAsset does it

        Object.entries(patternDetectors).forEach(([name, detector]) => {
          const found = detector(extendedCandles);
          if (found.length) {
            const lastCandleInHistory = extendedCandles[extendedCandles.length - 1];
            if (lastCandleInHistory && found[found.length - 1].time === lastCandleInHistory.time) {
              const lastCandleTime = parseInt(String(lastCandleInHistory.time), 10);

              addPattern(update.s, name, lastCandleTime);
              
              const alertKey = `${update.s}-${name}`;
              if (lastAlerted[alertKey] !== String(lastCandleInHistory.time)) {
                sendPatternAlert(update.s, name);
                lastAlerted[alertKey] = String(lastCandleInHistory.time);
              }
            }
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
