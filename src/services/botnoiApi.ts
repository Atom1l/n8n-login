export interface BotnoiApiResponse {
  success: boolean;
  data?: {
    apiKey: string;
    quota: number;
    usage: number;
  };
  error?: string;
}

export class BotnoiApiService {
  private static readonly BASE_URL = 'https://voice.botnoi.ai/tts/api-developer-v2';

  static async fetchApiKey(userToken: string): Promise<BotnoiApiResponse> {
    try {
      const response = await fetch(this.BASE_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: {
          apiKey: data.apiKey || data.api_key,
          quota: data.quota || 0,
          usage: data.usage || 0,
        }
      };
    } catch (error) {
      console.error('Failed to fetch Botnoi API key:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      // This would be the validation endpoint if available
      const response = await fetch(`${this.BASE_URL}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      return response.ok;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }
}