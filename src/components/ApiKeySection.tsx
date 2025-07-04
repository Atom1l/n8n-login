import React, { useState } from 'react';
import { Key, RefreshCw, Copy, Check, AlertCircle, Database, Trash2 } from 'lucide-react';
import { useBotnoiApi } from '../hooks/useBotnoiApi';
import BotnoiLoginForm from './BotnoiLoginForm';

const ApiKeySection = () => {
  const { 
    apiData, 
    loading, 
    error, 
    fetchApiKeyWithLogin, 
    refreshApiKey, 
    clearApiData, 
    hasApiKey,
    hasStoredCredentials 
  } = useBotnoiApi();
  const [copied, setCopied] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleCopyApiKey = async () => {
    if (apiData?.apiKey) {
      try {
        await navigator.clipboard.writeText(apiData.apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy API key:', error);
      }
    }
  };

  const formatApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.substring(0, 8)}...${key.substring(key.length - 8)}`;
  };

  const handleClearData = () => {
    clearApiData();
    setShowLoginForm(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Botnoi API Access</h3>
            <p className="text-sm text-gray-600">Manage your TTS API credentials</p>
          </div>
        </div>
        
        {(hasApiKey || hasStoredCredentials) && (
          <button
            onClick={handleClearData}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {!hasApiKey && !showLoginForm ? (
        <div className="text-center py-6">
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">
            Connect to your Botnoi Voice account to fetch your API key
          </p>
          <button
            onClick={() => setShowLoginForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
          >
            <Key className="w-4 h-4" />
            Connect Botnoi Account
          </button>
        </div>
      ) : !hasApiKey && showLoginForm ? (
        <BotnoiLoginForm
          onLogin={fetchApiKeyWithLogin}
          loading={loading}
          error={error}
        />
      ) : (
        <div className="space-y-4">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-sm font-medium">API key successfully retrieved!</span>
          </div>

          {/* API Key Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">API Key</label>
              <button
                onClick={handleCopyApiKey}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-sm bg-white p-3 rounded border break-all">
              {formatApiKey(apiData.apiKey)}
            </div>
          </div>

          {/* Usage Stats */}
          {(apiData.quota && apiData.quota > 0) || (apiData.usage && apiData.usage > 0) ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-blue-600 font-medium">Usage</div>
                <div className="text-lg font-bold text-blue-900">
                  {apiData.usage?.toLocaleString() || '0'}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm text-green-600 font-medium">Quota</div>
                <div className="text-lg font-bold text-green-900">
                  {apiData.quota?.toLocaleString() || 'Unlimited'}
                </div>
              </div>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={refreshApiKey}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={() => setShowLoginForm(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              <Key className="w-4 h-4" />
              Re-login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeySection;