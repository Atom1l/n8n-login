import React, { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';

function App() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      // Redirect to n8n workflow immediately after successful login
      window.location.href = 'http://localhost:5678/workflow/3itcopY4xzxL7s0z';
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#3c3c45] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show a brief redirect message
  if (user) {
    return (
      <div className="min-h-screen bg-[#3c3c45] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-white">Redirecting to n8n workflow...</p>
        </div>
      </div>
    );
  }

  return <LoginPage />;
}

export default App;