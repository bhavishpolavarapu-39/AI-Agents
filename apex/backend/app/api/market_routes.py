from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from app.services.stock_service import stock_service

router = APIRouter(prefix="/market", tags=["market"])

@router.get("/quote/{symbol}")
async def get_stock_quote(symbol: str):
    """Get real-time stock quote"""
    try:
        data = await stock_service.get_stock_quote(symbol)
        return {
            "success": True,
            "symbol": symbol,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/chart/{symbol}")
async def get_stock_chart(
    symbol: str,
    timeframe: str = Query("1d", regex="^(1d|1w|1m|3m|1y|all)$")
):
    """Get historical stock chart data"""
    try:
        data = await stock_service.get_stock_chart(symbol, timeframe)
        return {
            "success": True,
            "symbol": symbol,
            "timeframe": timeframe,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/search")
async def search_stocks(query: str = Query(..., min_length=1)):
    """Search for stocks globally"""
    try:
        results = await stock_service.search_stocks(query)
        return {
            "success": True,
            "query": query,
            "results": results,
            "count": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/profile/{symbol}")
async def get_company_profile(symbol: str):
    """Get company profile and information"""
    try:
        data = await stock_service.get_company_profile(symbol)
        return {
            "success": True,
            "symbol": symbol,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/financials/{symbol}")
async def get_financial_statements(symbol: str):
    """Get financial statements and metrics"""
    try:
        data = await stock_service.get_financial_statements(symbol)
        return {
            "success": True,
            "symbol": symbol,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/news")
async def get_financial_news(
    category: str = Query("general", regex="^(general|forex|crypto|merger)$"),
    limit: int = Query(20, ge=1, le=100)
):
    """Get latest financial news"""
    try:
        articles = await stock_service.get_news(category=category)
        return {
            "success": True,
            "category": category,
            "articles": articles[:limit],
            "count": len(articles[:limit])
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/technical/{symbol}")
async def get_technical_indicator(
    symbol: str,
    indicator: str = Query(..., regex="^(rsi|macd|sma|ema|bbands|atr|adx|stoch)$"),
    period: int = Query(14, ge=2, le=200)
):
    """Get technical indicator data"""
    try:
        data = await stock_service.get_technical_indicators(symbol, indicator, period)
        return {
            "success": True,
            "symbol": symbol,
            "indicator": indicator,
            "period": period,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/indicators")
async def get_available_indicators():
    """Get list of available technical indicators"""
    indicators = {
        "sma": {
            "name": "Simple Moving Average",
            "description": "Average price over N periods",
            "periods": [5, 10, 20, 50, 100, 200],
            "category": "trend"
        },
        "ema": {
            "name": "Exponential Moving Average",
            "description": "Weighted moving average with more weight to recent prices",
            "periods": [5, 10, 12, 26, 50, 200],
            "category": "trend"
        },
        "rsi": {
            "name": "Relative Strength Index",
            "description": "Momentum oscillator measuring speed and magnitude of price changes",
            "periods": [14, 21],
            "category": "momentum",
            "overbought": 70,
            "oversold": 30
        },
        "macd": {
            "name": "MACD (Moving Average Convergence Divergence)",
            "description": "Trend-following momentum indicator",
            "periods": [12, 26, 9],
            "category": "momentum"
        },
        "bbands": {
            "name": "Bollinger Bands",
            "description": "Volatility bands placed above and below moving average",
            "periods": [20],
            "category": "volatility"
        },
        "atr": {
            "name": "Average True Range",
            "description": "Volatility indicator measuring price movement magnitude",
            "periods": [14],
            "category": "volatility"
        },
        "adx": {
            "name": "Average Directional Index",
            "description": "Measures trend strength",
            "periods": [14],
            "category": "trend"
        },
        "stoch": {
            "name": "Stochastic Oscillator",
            "description": "Momentum indicator comparing closing price to price range",
            "periods": [14, 3, 3],
            "category": "momentum",
            "overbought": 80,
            "oversold": 20
        }
    }
    return {
        "success": True,
        "indicators": indicators,
        "total": len(indicators)
    }
