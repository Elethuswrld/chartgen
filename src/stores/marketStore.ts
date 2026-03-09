
import { create } from 'zustand';
import { OhlcData, Time } from 'lightweight-charts';
import { binance } from 'crypto-ohlc';

interface MarketState {
  symbol: string;
  ohlc: OhlcData<Time>[];
  setSymbol: (symbol: string) => void;
  fetchOhlc: (symbol: string, interval: string, since?: number) => Promise<void>;
}

export const useMarketStore = create<MarketState>()((set) => ({
  symbol: 'BTCUSDT',
  ohlc: [],
  setSymbol: (symbol: string) => set({ symbol }),
  fetchOhlc: async (symbol, interval, since) => {
    try {
      const rawOhlc = await binance.fetchOhlc(symbol, interval, since);
      const ohlcData: OhlcData<Time>[] = rawOhlc.map((d: any) => ({
        time: (d[0] / 1000) as Time,
        open: d[1],
        high: d[2],
        low: d[3],
        close: d[4],
      }));
      set({ ohlc: ohlcData });
    } catch (error) {
      console.error('Failed to fetch OHLC data:', error);
      set({ ohlc: [] });
    }
  },
}));
