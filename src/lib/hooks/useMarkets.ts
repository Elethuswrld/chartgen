import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useFirestore } from './useFirestore';

const useMarkets = () => {
  const { user } = useAuth();
  const { addToWatchlist, removeFromWatchlist } = useFirestore();
  const [assets, setAssets] = useState<{stocks: any[], crypto: any[], forex: any[], commodities: any[]}>({ stocks: [], crypto: [], forex: [], commodities: [] });
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const postMarket = async (provider: "finnhub" | "binance", action: string, params?: Record<string, any>) => {
    const res = await fetch("/api/marketdata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, action, params }),
    });
  
    const text = await res.text();
    let data: any = null;
  
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      throw new Error(`Invalid JSON from /api/marketdata (status ${res.status})`);
    }
  
    if (!res.ok) {
      throw new Error(data?.error ?? `marketdata ${res.status}`);
    }
  
    return data;
  };

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        const stockData = await postMarket("finnhub", "stock_symbols", { exchange: "US" });
        const forexData = await postMarket("finnhub", "forex_symbols", { exchange: "oanda" });
        const binanceData = await postMarket("binance", "exchange_info");

        setAssets({
          stocks: Array.isArray(stockData) ? stockData.slice(0, 100) : [],
          forex: Array.isArray(forexData) ? forexData.slice(0, 100) : [],
          crypto: Array.isArray(binanceData?.symbols) ? binanceData.symbols.slice(0, 100) : [],
          commodities: [],
        });
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const topMovers = useMemo(() => {
    // Calculate top movers from the assets
    return [];
  }, []);

  const handleToggleWatchlist = (pair: string, isWatchlisted: boolean) => {
    if (!user) return;
    if (isWatchlisted) {
      removeFromWatchlist(user.uid, pair);
      setWatchlist(watchlist.filter((item) => item !== pair));
    } else {
      addToWatchlist(user.uid, { name: pair, addedAt: Date.now() });
      setWatchlist([...watchlist, pair]);
    }
  };

  return { assets, watchlist, topMovers, isLoading, handleToggleWatchlist };
};

export default useMarkets;
