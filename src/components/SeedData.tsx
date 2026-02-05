'use client';

import React, { useEffect } from 'react';
import { seedWatchlist } from '../lib/seed';

export const SeedData: React.FC = () => {
  useEffect(() => {
    seedWatchlist();
  }, []);

  return null;
};
