import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useFirestore } from './useFirestore';

const useMarkets = () => {
  const { user } = useAuth();
  const { addToWatchlist, removeFromWatchlist } = useFirestore();
  const [assets, setAssets] = useState({ stocks: [], crypto: [], forex: [], commodities: [] });
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        const stockRes = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`);
        const stockData = await stockRes.json();

        const cryptoRes = await fetch('https://api.binance.com/api/v3/exchangeInfo');
        const cryptoData = await cryptoRes.json();

        const forexRes = await fetch(`https://finnhub.io/api/v1/forex/symbol?exchange=oanda&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`);
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

  useEffect(() => {
    if (user) {
      const fetchWatchlist = async () => {
        // Fetch watchlist from Firestore and update the state
      };
      fetchWatchlist();
    }
  }, [user]);

  const topMovers = useMemo(() => {
    // Calculate top movers from the assets
    return [];
  }, [assets]);

  const handleToggleWatchlist = (pair: string, isWatchlisted: boolean) => {
    if (!user) return;
    if (isWatchlisted) {
      removeFromWatchlist(user.uid, pair);
      setWatchlist(watchlist.filter((item) => item !== pair));
    } else {
        // Note: The addToWatchlist function expects a stock object with more details.
        // You would need to fetch the current price and other details for the selected pair
        // before adding it to the watchlist. For this example, we'll just add the pair name.
      addToWatchlist(user.uid, { name: pair, price: 0, movement: 'up', change: 0 });
      setWatchlist([...watchlist, pair]);
    }
  };

  return { assets, watchlist, topMovers, isLoading, handleToggleWatchlist };
};

export default useMarkets;
