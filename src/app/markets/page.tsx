"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';

// A simple star icon component
const StarIcon = ({ isFilled, ...props }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={isFilled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`cursor-pointer ${
      isFilled ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'
    }`}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// A simple sparkline chart component
const Sparkline = ({ data, positive }) => (
  <svg width="100%" height="40" viewBox="0 0 100 40" className="mt-4">
    <path
      d="M 0 20 L 10 25 L 20 15 L 30 20 L 40 10 L 50 18 L 60 22 L 70 12 L 80 18 L 90 25 L 100 20"
      fill="none"
      stroke={positive ? '#22c55e' : '#ef4444'}
      strokeWidth="2"
    />
  </svg>
);

const assets = {
  forex: [
    { pair: 'EUR/USD', price: '1.0843', change: '+0.42%' },
    { pair: 'GBP/USD', price: '1.2731', change: '-0.15%' },
    { pair: 'USD/JPY', price: '148.23', change: '+0.67%' },
    { pair: 'AUD/USD', price: '0.6580', change: '+0.21%' },
    { pair: 'USD/CAD', price: '1.3510', change: '-0.30%' },
  ],
  crypto: [
    { pair: 'BTC/USD', price: '$67,420', change: '+3.8%' },
    { pair: 'ETH/USD', price: '$3,450', change: '-1.2%' },
    { pair: 'SOL/USD', price: '$148.55', change: '+5.1%' },
    { pair: 'XRP/USD', price: '$0.52', change: '+2.3%' },
    { pair: 'DOGE/USD', price: '$0.15', change: '-0.5%' },
  ],
  stocks: [
    { pair: 'AAPL', price: '$171.39', change: '+0.84%' },
    { pair: 'TSLA', price: '$173.52', change: '-2.03%' },
    { pair: 'AMZN', price: '$184.88', change: '+1.02%' },
    { pair: 'GOOGL', price: '$170.11', change: '+1.50%' },
    { pair: 'MSFT', price: '$420.72', change: '+0.95%' },
  ],
  commodities: [
    { pair: 'Gold', price: '$2,354.10', change: '+0.33%' },
    { pair: 'Oil', price: '$78.44', change: '-0.82%' },
    { pair: 'Silver', price: '$28.17', change: '+1.22%' },
    { pair: 'Copper', price: '$4.50', change: '+0.78%' },
    { pair: 'Nat Gas', price: '$2.85', change: '-1.50%' },
  ],
};

export default function Markets() {
  const [activeTab, setActiveTab] = useState('forex');
  const [searchTerm, setSearchTerm] = useState('');
  const [watchlist, setWatchlist] = useState(['BTC/USD', 'AAPL']);

  const allAssets = useMemo(() => Object.values(assets).flat(), []);

  const toggleWatchlist = (pair) => {
    setWatchlist((prev) =>
      prev.includes(pair) ? prev.filter((p) => p !== pair) : [...prev, pair]
    );
  };

  const filteredAssets = useMemo(() => {
    let currentAssets = [];
    if (activeTab === 'watchlist') {
      currentAssets = allAssets.filter((asset) => watchlist.includes(asset.pair));
    } else {
      currentAssets = assets[activeTab] || [];
    }

    if (searchTerm) {
      return currentAssets.filter((asset) =>
        asset.pair.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return currentAssets;
  }, [activeTab, searchTerm, watchlist, allAssets]);

  return (
    <div className="min-h-screen bg-[#020617] text-white px-4 sm:px-8 py-12">
      <div className="max-w-7xl mx-auto">

        {/* PAGE HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Explore the Markets
          </h1>
          <p className="text-gray-400 mt-3 text-base sm:text-lg">
            Real-time insights across Forex, Crypto, Stocks & Commodities.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex flex-wrap justify-center gap-2">
            {['watchlist', 'forex', 'crypto', 'stocks', 'commodities'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm sm:text-base rounded-lg font-semibold capitalize transition ${
                  activeTab === tab
                    ? 'bg-blue-600 shadow-md shadow-blue-600/20'
                    : 'bg-[#0B0F19] border border-white/10 text-gray-300 hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search asset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0E1424] p-3 pl-10 rounded-lg border border-white/10 text-sm text-gray-300 outline-none focus:ring-2 focus:ring-blue-600"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* MARKET GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <div
              key={asset.pair}
              className="bg-[#0B0F19] p-5 rounded-xl border border-white/10 hover:border-blue-600/40 transition shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-bold">{asset.pair}</h2>
                  <StarIcon
                    isFilled={watchlist.includes(asset.pair)}
                    onClick={() => toggleWatchlist(asset.pair)}
                  />
                </div>

                <p className="text-gray-300 mt-1 text-2xl font-semibold">
                  {asset.price}
                </p>

                <p
                  className={`font-bold ${
                    asset.change.startsWith('-') ? 'text-red-400' : 'text-green-400'
                  }`}
                >
                  {asset.change}
                </p>

                <Sparkline
                  data={[1, 5, 2, 6, 3, 5, 2]}
                  positive={!asset.change.startsWith('-')}
                />
              </div>

              <Link
                href="/trading-terminal"
                className="mt-4 w-full block text-center py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
              >
                View Chart
              </Link>
            </div>
          ))}
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400">No assets found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
'''