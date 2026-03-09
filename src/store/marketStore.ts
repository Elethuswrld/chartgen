import { create } from "zustand";
import { CandlestickData } from "../components/Chart/chartTypes";

interface AssetState {
  [symbol: string]: {
    candles: CandlestickData[];
    patterns: string[]; // e.g., ["Doji"]
  };
}

interface MarketStore {
  assets: AssetState;
  updateAsset: (symbol: string, candle: CandlestickData) => void;
  addPattern: (symbol: string, pattern: string) => void;
}

const useMarketStore = create<MarketStore>((set) => ({
  assets: {},
  updateAsset: (symbol, candle) =>
    set((state) => {
      const prev = state.assets[symbol]?.candles || [];
      const updated = [...prev, candle].slice(-1000); // keep last 1000 candles
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
          ...state.assets[symbol],
          patterns: [...(state.assets[symbol]?.patterns || []), pattern],
        },
      },
    })),
}));

export default useMarketStore;
