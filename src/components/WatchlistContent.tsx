'use client';

import { useRealtime } from '../lib/hooks/useRealtime';
import { WatchlistSkeleton } from './WatchlistSkeleton';

interface Stock {
  name: string;
  price: number;
  movement: 'up' | 'down';
  change: number;
}

interface WatchlistData {
  stocks: Stock[];
}

export function WatchlistContent({ userId }: { userId: string }) {
  const watchlistData = useRealtime<WatchlistData>(`watchlist/${userId}`);

  return (
    <>
      {watchlistData && watchlistData.stocks ? (
        <ul className="space-y-4">
          {watchlistData.stocks.map((stock) => (
            <li key={stock.name} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
              <span className="font-semibold">{stock.name}</span>
              <span className="font-mono">${stock.price.toFixed(2)}</span>
              <span className={`font-semibold ${stock.movement === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stock.change.toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <WatchlistSkeleton />
      )}
    </>
  );
}
