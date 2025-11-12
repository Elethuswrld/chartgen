'use client';

import { motion } from 'framer-motion';

const watchlist = [
  { symbol: "GOOGL", price: "$2800.00", change: "-0.5%" },
  { symbol: "TSLA", price: "$700.00", change: "+2.1%" },
  { symbol: "AMZN", price: "$3400.00", change: "+0.8%" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Watchlist() {
  return (
    <div className="bg-surface rounded-2xl p-4 mt-4 shadow-glow">
      <h3 className="text-xl font-bold mb-4 text-text">Watchlist</h3>
      <motion.ul variants={container} initial="hidden" animate="show">
        {watchlist.map((stock) => (
          <motion.li
            key={stock.symbol}
            variants={item}
            className="flex justify-between mb-2 p-2 rounded-lg hover:bg-background"
          >
            <span className="font-bold text-text">{stock.symbol}</span>
            <span className="text-text">{stock.price}</span>
            <span
              className={stock.change.startsWith('+') ? 'text-success' : 'text-danger'}
            >
              {stock.change}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
