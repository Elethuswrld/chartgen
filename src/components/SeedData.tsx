'use client';

import React, { useEffect } from 'react';
import { seedWatchlist } from '../lib/seed';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const SeedData: React.FC = () => {
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await seedWatchlist(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  return null;
};
