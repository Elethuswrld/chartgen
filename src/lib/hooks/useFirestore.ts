import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

interface Stock {
    name: string;
    addedAt: number;
}

export const useFirestore = () => {
  const getUserData = async (uid: string) => {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : null;
  };

  const setUserData = async (uid: string, data: any) => {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, data, { merge: true });
  };

  const addToWatchlist = async (uid: string, stock: { name: string; addedAt: number }) => {
    const watchlistRef = doc(db, "watchlists", uid);
    const watchlistDoc = await getDoc(watchlistRef);
    if (!watchlistDoc.exists()) {
        await setDoc(watchlistRef, { stocks: [] });
    }
    await updateDoc(watchlistRef, {
      stocks: arrayUnion(stock),
    });
  };

  const removeFromWatchlist = async (uid: string, stockName: string) => {
    const watchlistRef = doc(db, "watchlists", uid);
    const watchlistDoc = await getDoc(watchlistRef);
    if (watchlistDoc.exists()) {
      const watchlistData = watchlistDoc.data();
      const stockToRemove = watchlistData.stocks.find((stock: Stock) => stock.name === stockName);
      if (stockToRemove) {
        await updateDoc(watchlistRef, {
          stocks: arrayRemove(stockToRemove),
        });
      }
    }
  };

  return { getUserData, setUserData, addToWatchlist, removeFromWatchlist };
};