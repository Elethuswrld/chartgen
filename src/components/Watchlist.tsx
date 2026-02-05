'use client';

import { useAuth } from '../lib/hooks/useAuth';
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

export function Watchlist() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="bg-card text-card-foreground p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Watchlist</h2>
        <p className="text-sm opacity-80">Log in to view your watchlist.</p>
      </div>
    );
  }

  const watchlistData = useRealtime<WatchlistData>(`watchlist/${user.uid}`);

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Watchlist</h2>
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
    </div>
  );
}
