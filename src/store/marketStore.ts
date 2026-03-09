import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CandlestickData } from "../components/Chart/chartTypes";

interface AssetState {
  candles: CandlestickData[];
  patterns: string[];
}

interface MarketStore {
  assets: Record<string, AssetState>;
  updateAsset: (symbol: string, candle: CandlestickData) => void;
  addPattern: (symbol: string, pattern: string) => void;
  watchlist: string[];
  toggleWatchlist: (symbol: string) => void;
}

const useMarketStore = create(
  persist<MarketStore>((set) => ({
    assets: {},
    watchlist: [],
    updateAsset: (symbol, candle) =>
      set((state) => {
        const prev = state.assets[symbol]?.candles || [];
        const updated = [...prev, candle].slice(-1000);
        return {
          assets: {
            ...state.assets,
            [symbol]: { candles: updated, patterns: state.assets[symbol]?.patterns || [] },
          },
        };
      }),
    addPattern: (symbol, pattern) =>
      set((state) => ({
        assets: {
          ...state.assets,
          [symbol]: {
            ...(state.assets[symbol] || { candles: [], patterns: [] }),
            patterns: [...(state.assets[symbol]?.patterns || []), pattern],
          },
        },
      })),
    toggleWatchlist: (symbol) =>
      set((state) => ({
        watchlist: state.watchlist.includes(symbol)
          ? state.watchlist.filter((s) => s !== symbol)
          : [...state.watchlist, symbol],
      })),
  }), { name: "market-storage" })
);

export default useMarketStore;
