import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { signInWithGoogle, loading, error } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2d2e2e]">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-40 h-40 mb-6 overflow-hidden rounded-full">
              <img 
                src="/src/assets/botnoi.svg" 
                alt="Botnoi Logo" 
                className="w-30 h-30"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-200 mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-500">
              Sign in to access your n8n workspaces.
            </p>
          </div>
          {/* Error Message */}
          {error && (
            <div className="p-2 flex items-center justify-center mb-3">
              <span>
                {/* You can use an error icon from lucide-react or another icon library */}
                <svg className="w-7 h-7 inline text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                </svg>
              </span>
              <span className="text-red-600 text-md">Invalid Login.</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <div className='flex justify-center'>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading || isSigningIn}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSigningIn ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
              ) : (
                <>
                  {/* Google Icon SVG */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                  <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200 text-gray-500" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;