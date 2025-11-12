"use client";

import { useRealtime } from '../lib/hooks/useRealtime';

export function Watchlist() {
  const watchlistData = useRealtime('watchlist/user-default');

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Watchlist</h2>
      {watchlistData ? (
        <ul>
          {watchlistData.stocks.map((stock) => (
            <li key={stock.name} className="flex justify-between items-center p-2 border-b">
              <span>{stock.name}</span>
              <span>${stock.price.toFixed(2)}</span>
              <span className={stock.movement === 'up' ? 'text-green-500' : 'text-red-500'}>
                {stock.change.toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading watchlist...</p>
      )}
    </div>
  );
}
