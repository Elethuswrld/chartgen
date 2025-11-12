"use client";

import Link from 'next/link';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">ChartGen</Link>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-primary-foreground">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center">
        <Link href="/charts" className="p-2 hover:scale-105 transition-transform duration-200">Charts</Link>
        <Link href="/ai" className="p-2 hover:scale-105 transition-transform duration-200">AI</Link>
        <Link href="/settings" className="p-2 hover:scale-105 transition-transform duration-200">Settings</Link>
        <ThemeSwitcher />
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="absolute top-16 left-0 w-full bg-primary flex flex-col items-center md:hidden">
          <Link href="/charts" className="p-4 hover:scale-105 transition-transform duration-200" onClick={() => setIsOpen(false)}>Charts</Link>
          <Link href="/ai" className="p-4 hover:scale-105 transition-transform duration-200" onClick={() => setIsOpen(false)}>AI</Link>
          <Link href="/settings" className="p-4 hover:scale-105 transition-transform duration-200" onClick={() => setIsOpen(false)}>Settings</Link>
          <div className="p-4">
            <ThemeSwitcher />
          </div>
        </nav>
      )}
    </header>
  );
}
