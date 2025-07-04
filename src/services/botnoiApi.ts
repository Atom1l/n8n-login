export interface BotnoiApiResponse {
  success: boolean;
  data?: {
    apiKey: string;
    quota?: number;
    usage?: number;
  };
  error?: string;
}

export interface BotnoiLoginCredentials {
  email: string;
  password: string;
}

export class BotnoiApiService {
  private static readonly BASE_URL = 'https://voice.botnoi.ai';
  private static readonly LOGIN_URL = `${this.BASE_URL}/api/auth/login`;
  private static readonly API_KEY_URL = `${this.BASE_URL}/tts/api-developer-v2`;

  static async loginToBotnoi(credentials: BotnoiLoginCredentials): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const response = await fetch(this.LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        token: data.token || data.access_token
      };
    } catch (error) {
      console.error('Botnoi login failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  static async fetchApiKeyWithSession(sessionToken: string): Promise<BotnoiApiResponse> {
    try {
      const response = await fetch(this.API_KEY_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: {
          apiKey: data.apiKey || data.api_key || data.key,
          quota: data.quota || 0,
          usage: data.usage || 0,
        }
      };
    } catch (error) {
      console.error('Failed to fetch Botnoi API key:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch API key'
      };
    }
  }

  static async scrapeApiKeyFromPage(sessionToken: string): Promise<BotnoiApiResponse> {
    try {
      // Alternative approach: fetch the HTML page and extract API key
      const response = await fetch(this.API_KEY_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Cookie': `session_token=${sessionToken}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      
      // Extract API key from HTML (this would need to be adjusted based on actual HTML structure)
      const apiKeyMatch = html.match(/api[_-]?key["\s]*[:=]["\s]*([a-zA-Z0-9-_]+)/i);
      const quotaMatch = html.match(/quota["\s]*[:=]["\s]*(\d+)/i);
      const usageMatch = html.match(/usage["\s]*[:=]["\s]*(\d+)/i);

      if (apiKeyMatch) {
        return {
          success: true,
          data: {
            apiKey: apiKeyMatch[1],
            quota: quotaMatch ? parseInt(quotaMatch[1]) : 0,
            usage: usageMatch ? parseInt(usageMatch[1]) : 0,
          }
        };
      }

      throw new Error('API key not found in response');
    } catch (error) {
      console.error('Failed to scrape API key:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to extract API key'
      };
    }
  }

  static async getApiKeyComplete(credentials: BotnoiLoginCredentials): Promise<BotnoiApiResponse> {
    try {
      // Step 1: Login to Botnoi
      const loginResult = await this.loginToBotnoi(credentials);
      
      if (!loginResult.success || !loginResult.token) {
        return {
          success: false,
          error: loginResult.error || 'Login failed'
        };
      }

      // Step 2: Fetch API key using session
      let apiResult = await this.fetchApiKeyWithSession(loginResult.token);
      
      // Step 3: If direct API call fails, try scraping
      if (!apiResult.success) {
        apiResult = await this.scrapeApiKeyFromPage(loginResult.token);
      }

      return apiResult;
    } catch (error) {
      console.error('Complete API key fetch failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Process failed'
      };
    }
  }
}