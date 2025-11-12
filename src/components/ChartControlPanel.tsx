'use client';

import { motion } from 'framer-motion';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface ChartControlPanelProps {
  symbol: string;
  setSymbol: (symbol: string) => void;
  interval: string;
  setInterval: (interval: string) => void;
  onRefresh: () => void;
}

const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"];
const intervals = ["1m", "5m", "15m", "1h", "4h", "1d"];

export default function ChartControlPanel({
  symbol,
  setSymbol,
  interval,
  setInterval,
  onRefresh,
}: ChartControlPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-surface rounded-2xl p-4 mb-4 flex items-center justify-between shadow-glow"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-background rounded-lg p-1">
          {symbols.map((s) => (
            <button
              key={s}
              onClick={() => setSymbol(s)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                symbol === s
                  ? 'bg-accent text-background'
                  : 'text-text hover:bg-gray-700'
              }`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-background rounded-lg p-1">
          {intervals.map((i) => (
            <button
              key={i}
              onClick={() => setInterval(i)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                interval === i
                  ? 'bg-accent text-background'
                  : 'text-text hover:bg-gray-700'
              }`}>
              {i}
            </button>
          ))}
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRefresh}
        className="bg-accent hover:bg-yellow-500 text-background font-bold p-2 rounded-full transition-colors shadow-glow"
      >
        <ArrowPathIcon className="h-5 w-5" />
      </motion.button>
    </motion.div>
  );
}
