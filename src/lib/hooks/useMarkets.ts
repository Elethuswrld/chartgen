import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useFirestore } from './useFirestore';

const useMarkets = () => {
  const { user } = useAuth();
  const { addToWatchlist, removeFromWatchlist } = useFirestore();
  const [assets, setAssets] = useState<{stocks: any[], crypto: any[], forex: any[], commodities: any[]}>({ stocks: [], crypto: [], forex: [], commodities: [] });
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        const stockRes = await fetch(`/api/marketdata?endpoint=/stock/symbol&exchange=US`);
        const stockData = await stockRes.json();

        const cryptoRes = await fetch('https://api.binance.com/api/v3/exchangeInfo');
        const cryptoData = await cryptoRes.json();

        const forexRes = await fetch(`/api/marketdata?endpoint=/forex/symbol&exchange=oanda`);
        const forexData = await forexRes.json();

        // To keep the UI from being cluttered, we'll only show a subset of the data
        setAssets({
          stocks: stockData.slice(0, 100),
          crypto: cryptoData.symbols.slice(0, 100),
          forex: forexData.slice(0, 100),
          commodities: [], // Placeholder for commodities data
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
