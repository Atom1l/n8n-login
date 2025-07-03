import React, { useState } from 'react';
import { Mail, Shield, ArrowRight, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to access your n8n workspace
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading || isSigningIn}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSigningIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 rounded-sm flex items-center justify-center">
                    <Mail className="w-3 h-3 text-white" />
                  </div>
                  <span>Continue with Google</span>
                  <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                What you'll get:
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Secure Gmail authentication</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Direct access to n8n workflows</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Seamless workspace integration</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>
              Secured by Firebase • Protected by Google OAuth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;