"use client";

import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ------------------------- */}
        {/* 📈 CHART (LEFT SECTION)   */}
        {/* ------------------------- */}
        <div className="lg:col-span-2">
          <div className="bg-[#0B0F19] rounded-2xl p-6 shadow-lg border border-white/5 h-[360px] flex items-center justify-center text-gray-500">
            Chart will be displayed here
          </div>

          {/* Spacing for alignment below */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Portfolio Value Card */}
            <div className="p-6 bg-[#0B0F19] rounded-2xl shadow-lg border border-white/5">
              <h2 className="text-sm text-gray-400">Portfolio Value</h2>
              <p className="text-3xl font-bold text-white">$12,345.67</p>
              <p className="text-green-400 text-sm font-medium mt-1">+2.3%</p>
            </div>

            {/* Best Performer Card */}
            <div className="p-6 bg-[#0B0F19] rounded-2xl shadow-lg border border-white/5">
              <h2 className="text-sm text-gray-400">Best Performer</h2>
              <p className="text-xl font-semibold mt-2">AAPL</p>
              <p className="text-green-400 text-sm font-medium">+4.1%</p>
            </div>

            {/* Worst Performer Card */}
            <div className="p-6 bg-[#0B0F19] rounded-2xl shadow-lg border border-white/5">
              <h2 className="text-sm text-gray-400">Worst Performer</h2>
              <p className="text-xl font-semibold mt-2">TSLA</p>
              <p className="text-red-400 text-sm font-medium">-1.9%</p>
            </div>
          </div>
        </div>

        {/* ------------------------- */}
        {/* 📊 RIGHT SIDEBAR SECTION  */}
        {/* ------------------------- */}
        <div className="space-y-8">

          {/* ------------------------- */}
          {/* WATCHLIST */}
          {/* ------------------------- */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Watchlist</h2>
            <div className="space-y-3">
              {[
                { symbol: "AAPL", price: "$150.00", change: "+1.25%" },
                { symbol: "GOOGL", price: "$2800.00", change: "-0.75%" },
                { symbol: "TSLA", price: "$700.00", change: "+2.50%" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-[#0E1424] p-4 rounded-xl border border-white/5 shadow-md"
                >
                  <span className="text-gray-200 font-medium">{item.symbol}</span>
                  <span className="text-gray-400">{item.price}</span>
                  <span
                    className={
                      item.change.startsWith("-")
                        ? "text-red-400 font-semibold"
                        : "text-green-400 font-semibold"
                    }
                  >
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ------------------------- */}
          {/* NEWS FEED */}
          {/* ------------------------- */}
          <div>
            <h2 className="text-lg font-semibold">News</h2>
            <div className="space-y-4 mt-4">
              <div className="border-b border-white/10 pb-2">
                <p className="text-gray-200">Market Hits All-Time High</p>
                <p className="text-gray-500 text-xs">2 hours ago</p>
              </div>

              <div className="border-b border-white/10 pb-2">
                <p className="text-gray-200">New Tech Disrupting Finance</p>
                <p className="text-gray-500 text-xs">1 day ago</p>
              </div>

              <div className="border-b border-white/10 pb-2">
                <p className="text-gray-200">Federal Reserve Updates Policy Outlook</p>
                <p className="text-gray-500 text-xs">3 days ago</p>
              </div>
            </div>
          </div>

          {/* ------------------------- */}
          {/* AI ASSISTANT */}
          {/* ------------------------- */}
          <div className="bg-[#0B0F19] p-4 rounded-xl shadow-lg border border-white/5">
            <h2 className="text-lg font-semibold mb-3">AI Assistant</h2>

            <div className="bg-[#111827] p-3 rounded-lg text-gray-400 mb-3">
              Welcome! How can I help you today?
            </div>

            <input
              type="text"
              placeholder="Ask ChartGen anything..."
              className="w-full bg-[#0E1424] p-3 rounded-lg border border-white/10 text-sm text-gray-300 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}