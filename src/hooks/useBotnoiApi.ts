import { useState, useEffect } from 'react';
import { BotnoiApiService, BotnoiApiResponse, BotnoiLoginCredentials } from '../services/botnoiApi';

export const useBotnoiApi = () => {
  const [apiData, setApiData] = useState<BotnoiApiResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [botnoiCredentials, setBotnoiCredentials] = useState<BotnoiLoginCredentials | null>(null);

  const fetchApiKeyWithLogin = async (credentials: BotnoiLoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await BotnoiApiService.getApiKeyComplete(credentials);
      
      if (response.success && response.data) {
        setApiData(response.data);
        setBotnoiCredentials(credentials);
        // Store in localStorage for persistence
        localStorage.setItem('botnoi_api_data', JSON.stringify(response.data));
        localStorage.setItem('botnoi_credentials', JSON.stringify(credentials));
      } else {
        setError(response.error || 'Failed to fetch API key');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refreshApiKey = async () => {
    if (!botnoiCredentials) {
      setError('No stored credentials found');
      return;
    }

    await fetchApiKeyWithLogin(botnoiCredentials);
  };

  // Load from localStorage on mount
  useEffect(() => {
    const storedApiData = localStorage.getItem('botnoi_api_data');
    const storedCredentials = localStorage.getItem('botnoi_credentials');
    
    if (storedApiData) {
      try {
        setApiData(JSON.parse(storedApiData));
      } catch (error) {
        console.error('Failed to parse stored API data:', error);
        localStorage.removeItem('botnoi_api_data');
      }
    }

    if (storedCredentials) {
      try {
        setBotnoiCredentials(JSON.parse(storedCredentials));
      } catch (error) {
        console.error('Failed to parse stored credentials:', error);
        localStorage.removeItem('botnoi_credentials');
      }
    }
  }, []);

  const clearApiData = () => {
    setApiData(null);
    setError(null);
    setBotnoiCredentials(null);
    localStorage.removeItem('botnoi_api_data');
    localStorage.removeItem('botnoi_credentials');
  };

  return {
    apiData,
    loading,
    error,
    fetchApiKeyWithLogin,
    refreshApiKey,
    clearApiData,
    hasApiKey: !!apiData?.apiKey,
    hasStoredCredentials: !!botnoiCredentials
  };
};