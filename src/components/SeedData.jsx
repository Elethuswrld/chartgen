"use client";

import { useEffect } from 'react';
import { seedWatchlist } from '../lib/seed';

export function SeedData() {
  useEffect(() => {
    seedWatchlist();
  }, []);

  return null;
}
