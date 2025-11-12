'use client';

import { ChartBarIcon, CpuChipIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Mock user state and logout function
const user = null; // or { name: 'John Doe' }
const logout = () => {
  console.log('User logged out');
};

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface shadow-lg p-4 flex justify-between items-center"
    >
      <div className="flex items-center">
        <ChartBarIcon className="h-8 w-8 text-accent" />
        <h1 className="text-2xl font-bold ml-2 text-text">ChartGen</h1>
        <CpuChipIcon className="h-5 w-5 ml-2 text-accent" />
        <span className="text-xs text-accent ml-1">Powered by Gemini</span>
      </div>
      <nav className="flex items-center space-x-6">
        <Link href="/" className="text-gray-300 hover:text-accent transition-colors relative group">
          Dashboard
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </Link>
        <Link href="/charts" className="text-gray-300 hover:text-accent transition-colors relative group">
          Charts
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </Link>
        <Link href="/ai" className="text-gray-300 hover:text-accent transition-colors relative group">
          AI
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </Link>
        <Link href="/settings" className="text-gray-300 hover:text-accent transition-colors relative group">
          Settings
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </Link>
      </nav>
      <div className="flex items-center">
        {user ? (
          <button
            onClick={logout}
            className="bg-danger hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="bg-accent hover:bg-yellow-500 text-background font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </motion.header>
  );
}
