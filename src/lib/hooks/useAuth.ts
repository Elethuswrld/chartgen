'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createUserProfile = async (user: User) => {
    if (!db) return;
    const userRef = doc(db, `users/${user.uid}`);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      const { email, displayName } = user;
      await setDoc(userRef, {
        email,
        name: displayName,
        createdAt: new Date(),
      });
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user);
    } catch (error) {
      console.error("Error logging in with Google: ", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(result.user);
      await createUserProfile(result.user);
    } catch (error) {
      console.error("Error signing up with email: ", error);
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createUserProfile(result.user);
      return result;
    } catch (error) {
      console.error("Error signing in with email: ", error);
      throw error;
    }
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const logout = () => signOut(auth);

  const updateUserProfile = async ({ name }: { name: string }) => {
    if (!auth.currentUser) throw new Error("No user authenticated.");

    // Update Firebase Auth Profile
    await updateProfile(auth.currentUser, { displayName: name });

    // Update Firestore Document
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userRef, { name }, { merge: true });

    // Manually trigger a state update to reflect the change immediately
    setUser({ ...auth.currentUser });
  };

  return { user, loading, loginWithGoogle, signUpWithEmail, signInWithEmail, resetPassword, logout, updateUserProfile };
};
