import React, { useState } from 'react';
import { Key, RefreshCw, Copy, Check, AlertCircle, Database } from 'lucide-react';
import { useBotnoiApi } from '../hooks/useBotnoiApi';

const ApiKeySection = () => {
  const { apiData, loading, error, fetchApiKey, hasApiKey } = useBotnoiApi();
  const [copied, setCopied] = useState(false);

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
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Key className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Botnoi API Access</h3>
          <p className="text-sm text-gray-600">Manage your TTS API credentials</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {!hasApiKey ? (
        <div className="text-center py-6">
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No API key found. Fetch your credentials from Botnoi.</p>
          <button
            onClick={fetchApiKey}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Key className="w-4 h-4" />
            )}
            {loading ? 'Fetching...' : 'Fetch API Key'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
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
            <div className="font-mono text-sm bg-white p-2 rounded border">
              {formatApiKey(apiData.apiKey)}
            </div>
          </div>

          {/* Usage Stats */}
          {(apiData.quota > 0 || apiData.usage > 0) && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-blue-600 font-medium">Usage</div>
                <div className="text-lg font-bold text-blue-900">{apiData.usage.toLocaleString()}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm text-green-600 font-medium">Quota</div>
                <div className="text-lg font-bold text-green-900">{apiData.quota.toLocaleString()}</div>
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={fetchApiKey}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh API Key
          </button>
        </div>
      )}
    </div>
  );
};

export default ApiKeySection;