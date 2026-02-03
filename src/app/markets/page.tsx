"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import React from 'react';
import useMarkets from '../../lib/hooks/useMarkets';
import { useAuth } from "../../lib/hooks/useAuth";

// Star icon component
interface StarIconProps extends React.SVGProps<SVGSVGElement> {
  isFilled: boolean;
}

const StarIcon: React.FC<StarIconProps> = ({ isFilled, ...props }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={isFilled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`cursor-pointer ${isFilled ? "text-yellow-400" : "text-gray-500 hover:text-yellow-400"}`}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Dynamic sparkline component
interface SparklineProps {
  data: number[];
  positive: boolean;
}

const Sparkline: React.FC<SparklineProps> = ({ data, positive }) => {
  const path = data.map((y, i) => `${i * (100 / (data.length - 1))} ${40 - y}`).join(" L ");
  return (
    <svg width="100%" height="40" viewBox="0 0 100 40" className="mt-2">
      <path d={`M ${path}`} fill="none" stroke={positive ? "#22c55e" : "#ef4444"} strokeWidth="2" />
    </svg>
  );
};

function Markets() {
  const [activeTab, setActiveTab] = useState("stocks");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const { user } = useAuth();
  const { assets, watchlist, topMovers, isLoading, handleToggleWatchlist } = useMarkets();

  const allAssets = useMemo(() => Object.values(assets).flat(), [assets]);

  const filteredAssets = useMemo(() => {
    let currentAssets = activeTab === "watchlist" ? allAssets.filter((a) => watchlist.includes(a.symbol)) : assets[activeTab as keyof typeof assets] || [];
    if (searchTerm) {
      currentAssets = currentAssets.filter(
        (asset) =>
          asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (asset.description && asset.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sorting
    currentAssets.sort((a, b) => {
        if (sortBy === "name") return a.symbol.localeCompare(b.symbol);
        // Add sorting for price and change if available in the data
        return 0;
      });

    return currentAssets;
  }, [activeTab, searchTerm, watchlist, allAssets, sortBy, assets]);

  return (
    <div className="min-h-screen bg-[#020617] text-white px-4 sm:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Explore the Markets</h1>
          <p className="text-gray-400 mt-3 text-base sm:text-lg">
            Real-time insights across Global Indices, Forex, Crypto & Commodities.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex flex-wrap justify-center gap-2">
            {["watchlist", "stocks", "crypto", "forex", "commodities"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm sm:text-base rounded-lg font-semibold capitalize transition ${
                  activeTab === tab
                    ? "bg-blue-600 shadow-md shadow-blue-600/20"
                    : "bg-[#0B0F19] border border-white/10 text-gray-300 hover:bg-white/5"
                }`}
              >
                {tab === "stocks" ? "Indices" : tab}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap justify-center sm:justify-end">
            <input
              type="text"
              placeholder="Search asset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-[#0E1424] p-3 pl-10 rounded-lg border border-white/10 text-sm text-gray-300 outline-none focus:ring-2 focus:ring-blue-600"
            />
            <select
              className="bg-[#0E1424] p-2 rounded-lg text-gray-300"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="change">Sort by Change</option>
            </select>
          </div>
        </div>

        {/* MARKET GRID */}
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-gray-400">Loading market data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => {
              const sparkData = Array.from({ length: 10 }, () => Math.random() * 40);
              const isWatchlisted = watchlist.includes(asset.symbol);

              return (
                <motion.div
                  key={asset.symbol}
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#0B0F19] p-5 rounded-xl border border-white/10 hover:border-blue-600/40 transition shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-bold">{asset.symbol}</h2>
                        <p className="text-xs text-gray-400">{asset.description}</p>
                      </div>
                      <StarIcon isFilled={isWatchlisted} onClick={() => handleToggleWatchlist(asset.symbol, isWatchlisted)} />
                    </div>

                    {/* Price and change data will be added here when available */}
                    <Sparkline data={sparkData} positive={true} />
                  </div>

                  <Link
                    href="/trading-terminal"
                    className="mt-4 w-full block text-center py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                  >
                    View Chart
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {filteredAssets.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-gray-400">No assets found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Markets), { ssr: false });
