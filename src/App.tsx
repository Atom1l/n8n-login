import React, { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';

function App() {
  const { user, loading, shouldRememberUser } = useAuth();

  useEffect(() => {
    if (user && !loading && shouldRememberUser) {
      // Only redirect automatically if user chose to be remembered
      window.location.href = 'http://localhost:5678/workflow/3itcopY4xzxL7s0z';
    }
  }, [user, loading, shouldRememberUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and should be remembered, show redirect message
  if (user && shouldRememberUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Redirecting to n8n workflow...</p>
        </div>
      </div>
    );
  }

  return <LoginPage />;
}