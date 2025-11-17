"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      
      {/* NAVBAR */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-white/10">
        <h1 className="text-3xl font-bold tracking-wide">ChartGen</h1>

        <nav className="flex items-center gap-6 text-gray-300">
          <Link href="/markets" className="hover:text-white">Markets</Link>
          <Link href="/trading-terminal" className="hover:text-white">Trade</Link>
          <Link href="/login" className="hover:text-white">Login</Link>
          <Link 
            href="/register"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="text-center px-8 py-24 max-w-4xl mx-auto">
        <h2 className="text-6xl font-extrabold leading-tight">
          The Future of Trading is <span className="text-blue-500">Smarter, Not Harder</span>
        </h2>

        <p className="mt-6 text-gray-400 text-xl">
          ChartGen is a multi-asset trading platform for Stocks, Forex, Crypto & Commodities,  
          supercharged with next-gen analytics and real-time AI insights.
        </p>

        <div className="mt-10 flex justify-center">
          <Link 
            href="/register"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-semibold shadow-lg shadow-blue-600/20"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <h3 className="text-4xl font-bold text-center mb-14">
          Everything You Need to Outperform
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-[#0B0F19] p-8 rounded-2xl border border-white/10 hover:border-blue-600/40 transition">
            <h4 className="text-2xl font-bold mb-3">Institutional-Grade Charting</h4>
            <p className="text-gray-400">
              Experience lightning-fast analytics, 100+ indicators, and advanced drawing tools with our TradingView-level UI.
            </p>
          </div>

          <div className="bg-[#0B0F19] p-8 rounded-2xl border border-white/10 hover:border-blue-600/40 transition">
            <h4 className="text-2xl font-bold mb-3">Your AI Trading Co-Pilot</h4>
            <p className="text-gray-400">
              Get real-time market insights, AI-driven signal detection, risk scoring, and automated trade journaling.
            </p>
          </div>

          <div className="bg-[#0B0F19] p-8 rounded-2xl border border-white/10 hover:border-blue-600/40 transition">
            <h4 className="text-2xl font-bold mb-3">One Platform, All Assets</h4>
            <p className="text-gray-400">
              Seamlessly trade Forex, Crypto, Stocks, Metals, Indices & Commodities from a single, unified interface.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 text-gray-500 border-t border-white/10">
        <p>© {new Date().getFullYear()} ChartGen. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
