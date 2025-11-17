'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const UniversalChart = dynamic(() => import('@/components/Chart/UniversalChart'), {
  ssr: false,
});

export default function TradingTerminal() {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const finnhubApiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

  if (!finnhubApiKey) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <p>Finnhub API key is not configured. Please set the NEXT_PUBLIC_FINNHUB_API_KEY environment variable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white px-4 sm:px-6 lg:px-10 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT SIDEBAR — WATCHLIST */}
        <div className="hidden lg:block bg-[#0B0F19] border border-white/10 rounded-xl p-5 h-[85vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Watchlist</h2>

          {[
            { pair: 'EUR/USD', price: '1.0843', change: '+0.42%' },
            { pair: 'BTC/USD', price: '$67,420', change: '+3.8%' },
            { pair: 'AAPL', price: '$171.39', change: '+0.84%' },
            { pair: 'Gold', price: '$2,354.10', change: '+0.33%' },
          ].map((item) => (
            <div
              key={item.pair}
              className="bg-[#0E1424] p-4 rounded-lg mb-3 border border-white/5 hover:border-blue-600/40 transition"
            >
              <div className="flex justify-between">
                <p className="font-semibold">{item.pair}</p>
                <p
                  className={`font-bold ${
                    item.change.startsWith('-')
                      ? 'text-red-400'
                      : 'text-green-400'
                  }`}
                >
                  {item.change}
                </p>
              </div>
              <p className="text-gray-300 text-sm">{item.price}</p>
            </div>
          ))}
        </div>

        {/* MAIN CHART AREA */}
        <div className="lg:col-span-2 bg-[#0B0F19] border border-white/10 rounded-xl p-5 h-[85vh]">
          <UniversalChart finnhubApiKey={finnhubApiKey} />
        </div>

        {/* ORDER PANEL */}
        <div className="bg-[#0B0F19] border border-white/10 rounded-xl p-5 h-[85vh] flex flex-col">
          <h2 className="text-xl font-bold mb-4">Order Panel</h2>

          {/* BUY/SELL TOGGLE */}
          <div className="flex mb-6" suppressHydrationWarning>
            <button
              className={`flex-1 py-2 font-semibold rounded-l-xl transition ${
                side === 'buy' ? 'bg-green-600' : 'bg-[#0E1424] text-gray-300'
              }`}
              onClick={() => setSide('buy')}
              suppressHydrationWarning
            >
              Buy
            </button>
            <button
              className={`flex-1 py-2 font-semibold rounded-r-xl transition ${
                side === 'sell' ? 'bg-red-600' : 'bg-[#0E1424] text-gray-300'
              }`}
              onClick={() => setSide('sell')}
              suppressHydrationWarning
            >
              Sell
            </button>
          </div>

          {/* ORDER FIELDS */}
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-sm text-gray-400">Order Type</label>
              <select 
                className="w-full mt-1 p-3 bg-[#0E1424] rounded-lg border border-white/10"
                suppressHydrationWarning
              >
                <option>Market</option>
                <option>Limit</option>
                <option>Stop</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400">Amount</label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full mt-1 p-3 bg-[#0E1424] rounded-lg border border-white/10"
                suppressHydrationWarning
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Take Profit (TP)</label>
              <input
                type="number"
                className="w-full mt-1 p-3 bg-[#0E1424] rounded-lg border border-white/10"
                suppressHydrationWarning
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Stop Loss (SL)</label>
              <input
                type="number"
                className="w-full mt-1 p-3 bg-[#0E1424] rounded-lg border border-white/10"
                suppressHydrationWarning
              />
            </div>

            {/* EXECUTE ORDER BUTTON */}
            <button
              className={`w-full mt-4 py-3 rounded-xl font-semibold transition ${
                side === 'buy'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              suppressHydrationWarning
            >
              {side === 'buy' ? 'Execute Buy' : 'Execute Sell'}
            </button>
          </div>

          {/* POSITION SUMMARY */}
          <div className="mt-10 bg-[#0E1424] border border-white/10 rounded-lg p-4">
            <h3 className="font-bold mb-2">Position Summary</h3>
            <p className="text-gray-400 text-sm">No open positions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}