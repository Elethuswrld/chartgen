'use client';

import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/client";

type Stock = { name: string; addedAt: number };

export function useFirestore() {
  const addToWatchlist = async (uid: string, stock: Stock) => {
    await setDoc(doc(db, "watchlists", uid, "stocks", stock.name), stock, { merge: true });
  };

  const removeFromWatchlist = async (uid: string, stockName: string) => {
    await deleteDoc(doc(db, "watchlists", uid, "stocks", stockName));
  };

  const getUserData = async (uid: string) => {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  };

  return { addToWatchlist, removeFromWatchlist, getUserData };
}
