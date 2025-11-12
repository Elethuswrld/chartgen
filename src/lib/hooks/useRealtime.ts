import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export function useRealtime<T>(path: string) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!path) return;

    const docRef = doc(db, path);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setData(doc.data() as T);
      } else {
        setData(null);
      }
    });

    return () => unsubscribe();
  }, [path]);

  return data;
}
