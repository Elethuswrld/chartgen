'use client';

import { motion } from 'framer-motion';

export default function SummaryCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-surface rounded-2xl p-4 shadow-glow"
    >
      <h3 className="text-lg font-bold text-text mb-2">BTC/USDT Summary</h3>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold text-success">$68,420.50</p>
          <p className="text-sm text-gray-400">Last Price</p>
        </div>
        <div>
          <p className="text-danger">-2.15%</p>
          <p className="text-sm text-gray-400">24h Change</p>
        </div>
      </div>
    </motion.div>
  );
}
