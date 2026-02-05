'use client';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/client';

interface Stock {
  name: string;
  addedAt: number;
}

export const useFirestore = () => {
  const addToWatchlist = async (userId: string, stock: Stock) => {
    await setDoc(doc(db, 'watchlists', userId, 'stocks', stock.name), stock, { merge: true });
  };

  return { addToWatchlist };
};
