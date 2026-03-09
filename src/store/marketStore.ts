import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OhlcData, Time } from 'lightweight-charts';

interface AssetState {
  candles: OhlcData<Time>[];
  patterns: { name: string, time: number }[];
}

export interface Alert {
  symbol: string;
  pattern: string;
  time: number;
}

interface MarketState {
  assets: Record<string, AssetState>;
  symbol: string;
  ohlc: OhlcData<Time>[];
  setSymbol: (symbol: string) => void;
  fetchOhlc: (symbol: string, interval: string, since?: number) => Promise<void>;
  updateAsset: (symbol: string, candle: OhlcData<Time>) => void;
  addPattern: (symbol: string, name: string, time: number) => void;
  watchlist: string[];
  toggleWatchlist: (symbol: string) => void;
  alerts: Alert[];
}

const useMarketStore = create(
  persist<MarketState>(
    (set) => ({
      assets: {},
      symbol: 'BTCUSDT',
      ohlc: [],
      watchlist: [],
      alerts: [],
      setSymbol: (symbol: string) => set({ symbol }),
      fetchOhlc: async (symbol, interval, since) => {
        // This is a placeholder, the actual implementation is in marketStore.ts
      },
      updateAsset: (symbol, candle) =>
        set((state) => {
          const asset = state.assets[symbol] || { candles: [], patterns: [] };
          const updatedCandles = [...asset.candles, candle].slice(-1000);
          return {
            assets: {
              ...state.assets,
              [symbol]: { ...asset, candles: updatedCandles },
            },
          };
        }),
      addPattern: (symbol, name, time) =>
        set((state) => {
          const asset = state.assets[symbol] || { candles: [], patterns: [] };
          return {
            assets: {
              ...state.assets,
              [symbol]: {
                ...asset,
                patterns: [...asset.patterns, { name, time }],
              },
            },
            alerts: [{ symbol, pattern: name, time }, ...state.alerts].slice(0, 50),
          };
        }),
      toggleWatchlist: (symbol) =>
        set((state) => ({
          watchlist: state.watchlist.includes(symbol)
            ? state.watchlist.filter((s) => s !== symbol)
            : [...state.watchlist, symbol],
        })),
    }),
    {
      name: "market-storage",
      partialize: (state) => ({ watchlist: state.watchlist, alerts: state.alerts } as any),
    }
  )
);

export default useMarketStore;