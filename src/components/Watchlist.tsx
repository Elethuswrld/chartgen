'use client';

import { useAuth } from '../lib/hooks/useAuth';
import { WatchlistContent } from './WatchlistContent';

export function Watchlist() {
  const { user } = useAuth();

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Watchlist</h2>
      {user ? (
        <WatchlistContent userId={user.uid} />
      ) : (
        <p className="text-sm opacity-80">Log in to view your watchlist.</p>
      )}
    </div>
  );
}
