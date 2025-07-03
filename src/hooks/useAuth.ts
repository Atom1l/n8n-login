import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const SESSION_TIMEOUT = 10 * 1000; // 10 seconds in milliseconds

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout if user is logged in
      if (user) {
        console.log('User logged in, setting 10-second timeout...');
        timeoutId = setTimeout(() => {
          console.log('Session timeout reached, signing out...');
          signOut(auth).then(() => {
            console.log('User signed out due to timeout');
            setUser(null);
          }).catch((error) => {
            console.error('Error signing out:', error);
          });
        }, SESSION_TIMEOUT);
      }
    });

    // Cleanup function
    return () => {
      unsubscribe();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign in successful');
      return result.user;
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('Manual logout successful');
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error.message);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    logout
  };
};