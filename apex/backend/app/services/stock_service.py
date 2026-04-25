import httpx
import asyncio
from typing import Optional, Dict, List, Any
from datetime import datetime, timedelta
from functools import lru_cache
from app.config import Settings

settings = Settings()

class StockDataCache:
    """Simple in-memory cache for stock data"""
    def __init__(self):
        self.cache: Dict[str, tuple] = {}

    def get(self, key: str) -> Optional[Any]:
        if key in self.cache:
            data, timestamp = self.cache[key]
            if datetime.now() - timestamp < timedelta(seconds=300):
                return data
            del self.cache[key]
        return None

    def set(self, key: str, value: Any) -> None:
        self.cache[key] = (value, datetime.now())

cache = StockDataCache()

class StockService:
    """Service for fetching real market data from financial APIs"""

    @staticmethod
    async def get_stock_quote(symbol: str) -> Dict[str, Any]:
        """Get real-time stock quote from Finnhub"""
        cache_key = f"quote:{symbol}"

        # Check cache first
        cached = cache.get(cache_key)
        if cached:
            return cached

        if not settings.FINNHUB_API_KEY:
            return {
                "error": "FINNHUB_API_KEY not configured",
                "symbol": symbol,
                "demo_mode": True
            }

        try:
            async with httpx.AsyncClient() as client:
                url = f"{settings.FINNHUB_BASE_URL}/quote"
                params = {
                    "symbol": symbol,
                    "token": settings.FINNHUB_API_KEY
                }
                response = await client.get(url, params=params, timeout=10.0)
                response.raise_for_status()
                data = response.json()

                # Cache the result
                cache.set(cache_key, data)
                return data
        except Exception as e:
            return {"error": str(e), "symbol": symbol}

    @staticmethod
    async def get_stock_chart(symbol: str, timeframe: str = "1d") -> Dict[str, Any]:
        """Get historical stock data from Alpha Vantage"""
        cache_key = f"chart:{symbol}:{timeframe}"

        # Check cache first
        cached = cache.get(cache_key)
        if cached:
            return cached

        if not settings.ALPHA_VANTAGE_API_KEY:
            return {
                "error": "ALPHA_VANTAGE_API_KEY not configured",
                "symbol": symbol,
                "demo_mode": True
            }

        # Map timeframe to Alpha Vantage function
        function_map = {
            "1d": "TIME_SERIES_INTRADAY",
            "1w": "TIME_SERIES_DAILY",
            "1m": "TIME_SERIES_DAILY",
            "3m": "TIME_SERIES_DAILY",
            "1y": "TIME_SERIES_DAILY",
            "all": "TIME_SERIES_DAILY"
        }

        function = function_map.get(timeframe, "TIME_SERIES_DAILY")

        try:
            async with httpx.AsyncClient() as client:
                params = {
                    "function": function,
                    "symbol": symbol,
                    "apikey": settings.ALPHA_VANTAGE_API_KEY,
                    "outputsize": "full"
                }
                if timeframe == "1d":
                    params["interval"] = "5min"

                response = await client.get(settings.ALPHA_VANTAGE_BASE_URL, params=params, timeout=10.0)
                response.raise_for_status()
                data = response.json()

                # Cache the result
                cache.set(cache_key, data)
                return data
        except Exception as e:
            return {"error": str(e), "symbol": symbol}

    @staticmethod
    async def search_stocks(query: str) -> List[Dict[str, Any]]:
        """Search for stocks globally"""
        if not settings.FINNHUB_API_KEY:
            return []

        try:
            async with httpx.AsyncClient() as client:
                url = f"{settings.FINNHUB_BASE_URL}/search"
                params = {
                    "q": query,
                    "token": settings.FINNHUB_API_KEY
                }
                response = await client.get(url, params=params, timeout=10.0)
                response.raise_for_status()
                data = response.json()
                return data.get("result", [])
        except Exception as e:
            print(f"Error searching stocks: {e}")
            return []

    @staticmethod
    async def get_company_profile(symbol: str) -> Dict[str, Any]:
        """Get company information"""
        if not settings.FINNHUB_API_KEY:
            return {"error": "API key not configured"}

        try:
            async with httpx.AsyncClient() as client:
                url = f"{settings.FINNHUB_BASE_URL}/stock/profile2"
                params = {
                    "symbol": symbol,
                    "token": settings.FINNHUB_API_KEY
                }
                response = await client.get(url, params=params, timeout=10.0)
                response.raise_for_status()
                return response.json()
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    async def get_financial_statements(symbol: str) -> Dict[str, Any]:
        """Get financial statements"""
        if not settings.FINNHUB_API_KEY:
            return {"error": "API key not configured"}

        try:
            async with httpx.AsyncClient() as client:
                url = f"{settings.FINNHUB_BASE_URL}/stock/financials-reported"
                params = {
                    "symbol": symbol,
                    "token": settings.FINNHUB_API_KEY
                }
                response = await client.get(url, params=params, timeout=10.0)
                response.raise_for_status()
                return response.json()
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    async def get_news(query: str = "", category: str = "general") -> List[Dict[str, Any]]:
        """Get financial news"""
        if not settings.FINNHUB_API_KEY:
            return []

        try:
            async with httpx.AsyncClient() as client:
                url = f"{settings.FINNHUB_BASE_URL}/news"
                params = {
                    "category": category,
                    "token": settings.FINNHUB_API_KEY
                }
                response = await client.get(url, params=params, timeout=10.0)
                response.raise_for_status()
                data = response.json()
                return data[:20]  # Return top 20 articles
        except Exception as e:
            print(f"Error fetching news: {e}")
            return []

    @staticmethod
    async def get_technical_indicators(symbol: str, indicator: str, period: int = 14) -> Dict[str, Any]:
        """Get technical indicator data from Alpha Vantage"""
        if not settings.ALPHA_VANTAGE_API_KEY:
            return {"error": "API key not configured"}

        indicator_map = {
            "rsi": "RSI",
            "macd": "MACD",
            "sma": "SMA",
            "ema": "EMA",
            "bbands": "BBANDS",
            "atr": "ATR",
            "adx": "ADX",
            "stoch": "STOCH"
        }

        function = indicator_map.get(indicator, indicator.upper())

        try:
            async with httpx.AsyncClient() as client:
                params = {
                    "function": function,
                    "symbol": symbol,
                    "interval": "daily",
                    "time_period": period,
                    "apikey": settings.ALPHA_VANTAGE_API_KEY
                }
                response = await client.get(settings.ALPHA_VANTAGE_BASE_URL, params=params, timeout=10.0)
                response.raise_for_status()
                return response.json()
        except Exception as e:
            return {"error": str(e)}

# Create singleton instance
stock_service = StockService()
