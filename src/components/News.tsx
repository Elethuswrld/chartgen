'use client';

import { motion } from 'framer-motion';

const news = [
  { headline: "Stock Market Hits All-Time High", source: "Reuters" },
  { headline: "Tech Stocks Lead the Way", source: "Bloomberg" },
  { headline: "Fed to Announce Interest Rate Decision", source: "Associated Press" },
];

export default function News() {
  return (
    <div className="bg-surface rounded-2xl p-4 mt-4 shadow-glow">
      <h3 className="text-xl font-bold mb-4 text-text">News</h3>
      <ul>
        {news.map((item, index) => (
          <motion.li
            key={index}
            whileHover={{ scale: 1.02 }}
            className="mb-4 p-2 rounded-lg hover:bg-background"
          >
            <p className="font-bold mb-1 text-text">{item.headline}</p>
            <p className="text-sm text-gray-400">{item.source}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
