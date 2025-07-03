import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const REMEMBER_ME_KEY = 'rememberMe';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldRememberUser, setShouldRememberUser] = useState(false);

  useEffect(() => {
    // Check if user chose to be remembered
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    setShouldRememberUser(rememberMe);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !rememberMe) {
        // If user is logged in but didn't choose to be remembered, sign them out
        signOut(auth);
        setUser(null);
      } else {
        setUser(user);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async (rememberMe: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Store remember me preference
      localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());
      setShouldRememberUser(rememberMe);
      
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear remember me preference on logout
      localStorage.removeItem(REMEMBER_ME_KEY);
      setShouldRememberUser(false);
      await signOut(auth);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const redirectToN8n = () => {
    window.location.href = 'http://localhost:5678/workflow/3itcopY4xzxL7s0z';
  };

  return {
    user,
    loading,
    error,
    shouldRememberUser,
    signInWithGoogle,
    logout,
    redirectToN8n
  };
};