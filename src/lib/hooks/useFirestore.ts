
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const useFirestore = () => {
  const getUserData = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : null;
  };

  const setUserData = async (uid: string, data: Record<string, unknown>) => {
    await setDoc(doc(db, "users", uid), data, { merge: true });
  };

  return { getUserData, setUserData };
};
