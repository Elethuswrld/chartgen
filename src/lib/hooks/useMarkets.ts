import { useState, useEffect, useMemo, useCallback } from 'react';
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

  const fetchAssets = useCallback(async (assetType: string, search: string = "") => {
    setIsLoading(true);
    try {
      let data;
      if (assetType === 'stocks') {
        data = await postMarket("finnhub", "stock_symbols", { exchange: "US", search });
      } else if (assetType === 'forex') {
        // Server-side search not yet implemented for forex, filtering is done client-side for now
        const forexData = await postMarket("finnhub", "forex_symbols", { exchange: "oanda" });
        data = search ? forexData.filter((s: any) => s.symbol.toLowerCase().includes(search.toLowerCase())) : forexData;
      } else if (assetType === 'crypto') {
        // Server-side search not yet implemented for crypto, filtering is done client-side for now
        const binanceData = await postMarket("binance", "exchange_info");
        const cryptoAssets = Array.isArray(binanceData?.symbols) ? binanceData.symbols : [];
        data = search ? cryptoAssets.filter((s: any) => s.symbol.toLowerCase().includes(search.toLowerCase())) : cryptoAssets;
      }
      
      if (data) {
        setAssets(prevAssets => ({
            ...prevAssets,
            [assetType]: Array.isArray(data) ? data.slice(0, 100) : []
        }));
      }

    } catch (error) {
      console.error(`Error fetching ${assetType}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchInitialAssets = async () => {
        setIsLoading(true);
        await Promise.all([
            fetchAssets('stocks'),
            fetchAssets('crypto'),
            fetchAssets('forex'),
        ]);
        setIsLoading(false);
    };
    fetchInitialAssets();
  }, [fetchAssets]);

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

  return { assets, watchlist, topMovers, isLoading, handleToggleWatchlist, fetchAssets };
};

export default useMarkets;
