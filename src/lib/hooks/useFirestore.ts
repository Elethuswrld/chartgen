
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

interface Stock {
    name: string;
    price: number;
    movement: string;
    change: number
}

export const useFirestore = () => {
  const getUserData = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : null;
  };

  const setUserData = async (uid: string, data: Record<string, unknown>) => {
    await setDoc(doc(db, "users", uid), data, { merge: true });
  };

  const addToWatchlist = async (uid: string, stock: { name: string; price: number; movement: string; change: number }) => {
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
