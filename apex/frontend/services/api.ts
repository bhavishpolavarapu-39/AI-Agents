const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/apex';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${API_PREFIX}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Fetch error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Stock Data Endpoints
  async getStockQuote(symbol: string) {
    return this.fetch(`/market/quote/${symbol}`);
  }

  async getStockChart(symbol: string, timeframe: string = '1d') {
    return this.fetch(`/market/chart/${symbol}?timeframe=${timeframe}`);
  }

  async searchStocks(query: string) {
    return this.fetch(`/market/search?query=${encodeURIComponent(query)}`);
  }

  async getCompanyProfile(symbol: string) {
    return this.fetch(`/market/profile/${symbol}`);
  }

  async getFinancialStatements(symbol: string) {
    return this.fetch(`/market/financials/${symbol}`);
  }

  async getNews(category: string = 'general', limit: number = 20) {
    return this.fetch(`/market/news?category=${category}&limit=${limit}`);
  }

  async getTechnicalIndicator(symbol: string, indicator: string, period: number = 14) {
    return this.fetch(`/market/technical/${symbol}?indicator=${indicator}&period=${period}`);
  }

  async getAvailableIndicators() {
    return this.fetch(`/market/indicators`);
  }

  // Fallback mock data when API is not available
  getMockStockQuote(symbol: string) {
    return {
      success: true,
      symbol,
      data: {
        c: 195.42,
        h: 196.8,
        l: 190.5,
        o: 193.5,
        pc: 191.16,
        t: Math.floor(Date.now() / 1000),
      },
    };
  }

  getMockStockChart(symbol: string, timeframe: string) {
    const data = [];
    let price = 150;
    const days = timeframe === '1d' ? 100 : timeframe === '1w' ? 52 : 252;

    for (let i = 0; i < days; i++) {
      price += (Math.random() - 0.48) * 3;
      data.push({
        t: Math.floor(Date.now() / 1000) - (days - i) * 86400,
        o: price - Math.random() * 2,
        h: price + Math.random() * 2,
        l: price - Math.random() * 1,
        c: price,
        v: Math.floor(Math.random() * 5000000) + 1000000,
      });
    }

    return {
      success: true,
      symbol,
      timeframe,
      data: { t: data.map((d) => d.t), o: data.map((d) => d.o), h: data.map((d) => d.h), l: data.map((d) => d.l), c: data.map((d) => d.c), v: data.map((d) => d.v) },
    };
  }
}

export const apiClient = new ApiClient(API_BASE);
