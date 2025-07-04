import { useState, useEffect } from 'react';
import { BotnoiApiService, BotnoiApiResponse } from '../services/botnoiApi';
import { useAuth } from './useAuth';

export const useBotnoiApi = () => {
  const { user } = useAuth();
  const [apiData, setApiData] = useState<BotnoiApiResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApiKey = async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get the user's Firebase token
      const token = await user.getIdToken();
      const response = await BotnoiApiService.fetchApiKey(token);
      
      if (response.success && response.data) {
        setApiData(response.data);
        // Store in localStorage for persistence
        localStorage.setItem('botnoi_api_data', JSON.stringify(response.data));
      } else {
        setError(response.error || 'Failed to fetch API key');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('botnoi_api_data');
    if (stored) {
      try {
        setApiData(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored API data:', error);
        localStorage.removeItem('botnoi_api_data');
      }
    }
  }, []);

  const clearApiData = () => {
    setApiData(null);
    setError(null);
    localStorage.removeItem('botnoi_api_data');
  };

  return {
    apiData,
    loading,
    error,
    fetchApiKey,
    clearApiData,
    hasApiKey: !!apiData?.apiKey
  };
};