"use client";

import React from "react";

export default function TradingTerminal() {
  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
        <h1 className="text-4xl font-bold mb-4">Trading Terminal</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#0B0F19] rounded-2xl p-6 shadow-lg border border-white/5 h-[600px] flex items-center justify-center text-gray-500">
                Chart and Trading Tools Will Be Here
            </div>
            <div className="bg-[#0B0F19] rounded-2xl p-6 shadow-lg border border-white/5">
                <h2 className="text-2xl font-bold mb-4">Order Panel</h2>
                {/* Order panel content here */}
            </div>
        </div>
    </div>
  );
}