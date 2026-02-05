'use client';

import { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import { useRealtime } from '../lib/hooks/useRealtime';
import { WatchlistSkeleton } from './WatchlistSkeleton';
import { WatchlistItem } from './WatchlistItem';

interface WatchlistStock {
  name: string;
  addedAt: number;
}

interface WatchlistData {
  stocks: WatchlistStock[];
}

interface Quote {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

export function WatchlistContent({ userId }: { userId: string }) {
  const watchlistData = useRealtime<WatchlistData>(`watchlists/${userId}`);
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});

  useEffect(() => {
    const fetchQuotes = async () => {
      if (watchlistData && watchlistData.stocks && watchlistData.stocks.length > 0) {
        const symbols = watchlistData.stocks.map(stock => stock.name);
        if (!functions) {
          console.error("Firebase is not configured. Check env vars.");
          return;
        }
        try {
          const marketDataProxy = httpsCallable(functions, 'marketDataProxy');
          const response = await marketDataProxy({
            source: 'finnhub',
            endpoint: 'quote',
            params: { symbols },
          });
          setQuotes(response.data as Record<string, Quote>);
        } catch (error) {
          console.error('Error fetching quotes:', error);
        }
      }
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 15000); // Fetch quotes every 15 seconds

    return () => clearInterval(interval);
  }, [watchlistData]);

  return (
    <>
      {watchlistData ? (
        watchlistData.stocks && watchlistData.stocks.length > 0 ? (
          <ul className="space-y-4">
            {watchlistData.stocks.map((stock) => (
              <WatchlistItem key={stock.name} symbol={stock.name} quote={quotes[stock.name]} />
            ))}
          </ul>
        ) : (
          <p className="text-sm opacity-80">Your watchlist is empty. Add symbols to get started.</p>
        )
      ) : (
        <WatchlistSkeleton />
      )}
    </>
  );
}
