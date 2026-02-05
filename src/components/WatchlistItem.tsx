'use client';

interface Quote {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
  t: number;  // Timestamp
}

export function WatchlistItem({ symbol, quote }: { symbol: string, quote: Quote | null }) {
  if (!quote) {
    return (
        <li className="flex justify-between items-center p-3 bg-secondary rounded-lg animate-pulse">
            <span className="font-semibold">{symbol}</span>
            <div className="h-4 bg-gray-700 rounded w-16"></div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
        </li>
    );
  }

  const movementClass = quote.d < 0 ? 'text-red-500' : 'text-green-500';
  const sign = quote.d > 0 ? '+' : '';

  return (
    <li className="flex justify-between items-center p-3 bg-secondary rounded-lg">
      <span className="font-semibold">{symbol}</span>
      <span className="font-mono">${quote.c.toFixed(2)}</span>
      <span className={`font-semibold ${movementClass}`}>
        {sign}{quote.d.toFixed(2)} ({sign}{quote.dp.toFixed(2)}%)
      </span>
    </li>
  );
}
