"use client";

import React from "react";

export default function Markets() {
  const markets = [
    { name: "Bitcoin", price: "$65,000", change: "+2.5%" },
    { name: "Ethereum", price: "$3,500", change: "+1.8%" },
    { name: "Apple", price: "$150", change: "-0.5%" },
    { name: "Tesla", price: "$180", change: "+1.2%" },
    { name: "Gold", price: "$2,300", change: "+0.2%" },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Markets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {markets.map((market, index) => (
          <div key={index} className="bg-[#0B0F19] p-6 rounded-2xl shadow-lg border border-white/5">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{market.name}</h2>
              <p className="text-xl font-semibold">{market.price}</p>
            </div>
            <p className={`text-lg ${market.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
              {market.change}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}