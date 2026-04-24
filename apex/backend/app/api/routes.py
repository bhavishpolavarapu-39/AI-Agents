from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import json
import asyncio

router = APIRouter(prefix="/api", tags=["apex"])

# In-memory storage
portfolios = {
    "default": {
        "id": "default",
        "name": "Main Portfolio",
        "holdings": [
            {"id": "1", "symbol": "AAPL", "name": "Apple Inc", "shares": 100, "current_price": 185.50, "total_value": 18550, "gain_loss": 3000, "gain_loss_percent": 19.3, "allocation_percent": 35.2},
            {"id": "2", "symbol": "MSFT", "name": "Microsoft Corp", "shares": 50, "current_price": 380.75, "total_value": 19037.50, "gain_loss": 4500, "gain_loss_percent": 23.1, "allocation_percent": 36.2},
            {"id": "3", "symbol": "GOOGL", "name": "Alphabet Inc", "shares": 30, "current_price": 140.20, "total_value": 4206, "gain_loss": 800, "gain_loss_percent": 19.0, "allocation_percent": 8.0},
            {"id": "4", "symbol": "TSLA", "name": "Tesla Inc", "shares": 25, "current_price": 245.30, "total_value": 6132.50, "gain_loss": 1200, "gain_loss_percent": 24.2, "allocation_percent": 11.6},
        ],
        "total_value": 47926,
        "total_gain_loss": 9500,
        "yoy_return": 8.3,
        "sharpe_ratio": 0.95,
        "max_drawdown": -8.2,
    }
}

conversation_history = []
_client = None

def get_client():
    """Lazy-load the Anthropic client"""
    global _client
    if _client is None:
        from anthropic import Anthropic
        _client = Anthropic()
    return _client

# ============ Portfolio Endpoints ============

@router.get("/apex/holdings")
async def get_holdings():
    """Get all portfolio holdings"""
    return portfolios["default"]["holdings"]

@router.get("/apex/portfolio")
async def get_portfolio():
    """Get portfolio summary"""
    portfolio = portfolios["default"]
    return {
        "id": portfolio["id"],
        "name": portfolio["name"],
        "total_value": portfolio["total_value"],
        "total_gain_loss": portfolio["total_gain_loss"],
        "yoy_return": portfolio["yoy_return"],
        "sharpe_ratio": portfolio["sharpe_ratio"],
        "max_drawdown": portfolio["max_drawdown"],
        "holdings_count": len(portfolio["holdings"]),
    }

@router.post("/apex/holdings/add")
async def add_holding(symbol: str, shares: int, purchase_price: float):
    """Add a new holding to portfolio"""
    holdings = portfolios["default"]["holdings"]
    new_id = str(len(holdings) + 1)

    current_price = purchase_price * 1.15
    total_value = shares * current_price
    gain_loss = shares * (current_price - purchase_price)

    new_holding = {
        "id": new_id,
        "symbol": symbol,
        "name": f"{symbol} Inc",
        "shares": shares,
        "current_price": current_price,
        "total_value": total_value,
        "gain_loss": gain_loss,
        "gain_loss_percent": (gain_loss / (shares * purchase_price)) * 100 if purchase_price > 0 else 0,
        "allocation_percent": 0.0,
    }

    holdings.append(new_holding)
    return new_holding

@router.delete("/apex/holdings/{holding_id}")
async def delete_holding(holding_id: str):
    """Remove a holding from portfolio"""
    holdings = portfolios["default"]["holdings"]
    portfolios["default"]["holdings"] = [h for h in holdings if h["id"] != holding_id]
    return {"status": "deleted"}

# ============ AI Agent Endpoints ============

@router.post("/apex/chat")
async def chat(message: str):
    """Chat with APEX AI Agent"""
    conversation_history.append({
        "role": "user",
        "content": message
    })

    portfolio = portfolios["default"]
    holdings_summary = "\n".join([
        f"- {h['symbol']}: {h['shares']} shares @ ${h['current_price']:.2f} = ${h['total_value']:.2f} ({h['gain_loss_percent']:+.1f}%)"
        for h in portfolio["holdings"]
    ])

    system_prompt = f"""You are APEX, an advanced Portfolio Intelligence Operating System. Provide expert investment analysis.

Current Portfolio:
- Total Value: ${portfolio['total_value']:.0f}
- YoY Return: {portfolio['yoy_return']}%
- Sharpe Ratio: {portfolio['sharpe_ratio']}

Holdings:
{holdings_summary}

You can analyze allocation, provide recommendations, discuss market trends, and optimize strategy."""

    try:
        client = get_client()
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            system=system_prompt,
            messages=conversation_history,
        )

        assistant_message = response.content[0].text
        conversation_history.append({
            "role": "assistant",
            "content": assistant_message
        })

        return {"response": assistant_message}
    except Exception as e:
        error_msg = f"AI Agent error: {str(e)}"
        conversation_history.append({
            "role": "assistant",
            "content": error_msg
        })
        return {"response": error_msg}

@router.get("/apex/chat/history")
async def get_chat_history():
    """Get conversation history"""
    return conversation_history

@router.post("/apex/chat/clear")
async def clear_chat():
    """Clear conversation history"""
    global conversation_history
    conversation_history = []
    return {"status": "cleared"}

# ============ Plugin Endpoints ============

@router.get("/apex/plugins")
async def get_plugins():
    """Get available plugins"""
    return [
        {"id": "rebalancer", "name": "Portfolio Rebalancer", "description": "Optimize portfolio allocation", "active": True},
        {"id": "risk_analyzer", "name": "Risk Analyzer", "description": "Analyze portfolio risk metrics", "active": True},
        {"id": "tax_optimizer", "name": "Tax Optimizer", "description": "Tax loss harvesting suggestions", "active": True},
        {"id": "market_watcher", "name": "Market Watcher", "description": "Real-time market alerts", "active": True},
        {"id": "dividend_tracker", "name": "Dividend Tracker", "description": "Track dividend income", "active": False},
    ]

@router.post("/apex/plugins/{plugin_id}/run")
async def run_plugin(plugin_id: str):
    """Run a specific plugin"""
    portfolio = portfolios["default"]

    if plugin_id == "rebalancer":
        return {
            "plugin": plugin_id,
            "result": "Portfolio is well-balanced",
            "recommendations": [
                "Increase MSFT position by 2%",
                "Reduce TSLA position by 1.5%",
            ]
        }
    elif plugin_id == "risk_analyzer":
        return {
            "plugin": plugin_id,
            "volatility": "Medium (18.5%)",
            "beta": 1.12,
            "var_95": -4.2,
        }
    elif plugin_id == "tax_optimizer":
        return {
            "plugin": plugin_id,
            "potential_savings": 1250,
            "suggestions": [
                "Harvest losses in underperforming positions",
                "Defer gains to next tax year where possible",
            ]
        }

    return {"error": "Plugin not found"}

# ============ Analysis Endpoints ============

@router.get("/apex/analysis/allocation")
async def get_allocation_analysis():
    """Get portfolio allocation analysis"""
    holdings = portfolios["default"]["holdings"]
    return {
        "by_sector": {
            "Technology": 71.4,
            "Consumer": 28.6,
        },
        "holdings": [
            {"symbol": h["symbol"], "allocation": h["allocation_percent"]}
            for h in holdings
        ]
    }

@router.get("/apex/analysis/performance")
async def get_performance_analysis():
    """Get performance metrics"""
    return {
        "mtd_return": 2.3,
        "qtd_return": 5.1,
        "ytd_return": 8.3,
        "one_year_return": 18.5,
    }

# ============ Health Check ============

@router.get("/health")
async def health():
    return {"status": "healthy", "service": "APEX Portfolio Intelligence OS"}

# ============ Stock Search Endpoints ============

@router.get("/apex/search/stocks")
async def search_stocks(query: str, market_code: str = None, limit: int = 10):
    """Search for stocks globally"""
    from app.services.stock_service import stock_service
    results = await stock_service.search_stocks(query, market_code, limit)
    return {"results": results, "count": len(results)}

@router.get("/apex/market-filters")
async def get_market_filters():
    """Get available market filters"""
    from app.services.stock_service import stock_service
    return {
        "markets": stock_service.market_codes,
        "total_markets": len(stock_service.market_codes)
    }

@router.get("/apex/stock/quote")
async def get_stock_quote(symbol: str):
    """Get detailed stock quote"""
    from app.services.stock_service import stock_service
    quote = await stock_service.get_stock_quote(symbol)
    return quote

@router.get("/apex/stock/technicals")
async def get_stock_technicals(symbol: str):
    """Get technical indicators"""
    from app.services.stock_service import stock_service
    technicals = await stock_service.get_technicals(symbol)
    return technicals

@router.get("/apex/market-status")
async def get_market_status():
    """Get global market status"""
    from app.services.stock_service import stock_service
    status = await stock_service.get_market_status()
    return {"market_status": status}

# ============ News Endpoints ============

@router.get("/apex/news")
async def get_financial_news(symbols: str = None, days_back: int = 7, sentiment_filter: str = None, limit: int = 50):
    """Get financial news with sentiment analysis"""
    from app.services.news_service import news_service
    symbol_list = symbols.split(",") if symbols else None
    news = await news_service.get_news(symbol_list, days_back, sentiment_filter, limit)
    return {"news": news, "count": len(news)}

@router.get("/apex/news/sentiment")
async def get_sentiment(symbols: str):
    """Get sentiment analysis for symbols"""
    from app.services.news_service import news_service
    symbol_list = symbols.split(",") if symbols else []
    sentiment = await news_service.get_sentiment_analysis(symbol_list)
    return {"sentiment_scores": sentiment}

# ============ Market Correlation Endpoints ============

@router.get("/apex/market-correlation/matrix")
async def get_correlation_matrix(markets: str = None):
    """Get correlation matrix between markets"""
    from app.services.market_correlation_service import market_correlation_service
    market_list = markets.split(",") if markets else None
    matrix = await market_correlation_service.get_correlation_matrix(market_list)
    return {"correlation_matrix": matrix}

@router.get("/apex/market-correlation/impact")
async def get_market_impact(primary_market: str, price_change: float = 2.0):
    """Get impact analysis of market movement on other markets"""
    from app.services.market_correlation_service import market_correlation_service
    impact = await market_correlation_service.get_market_impact_analysis(primary_market, price_change)
    return impact

@router.get("/apex/market-dashboard")
async def get_global_market_dashboard():
    """Get global market overview"""
    from app.services.market_correlation_service import market_correlation_service
    dashboard = await market_correlation_service.get_global_market_dashboard()
    return dashboard

@router.get("/apex/market-regime")
async def detect_market_regime(markets: str = None):
    """Detect current market regime (Bull, Bear, Chop)"""
    from app.services.market_correlation_service import market_correlation_service
    market_list = markets.split(",") if markets else None
    regime = await market_correlation_service.detect_market_regime(market_list)
    return regime

@router.get("/apex/geographic-analysis")
async def get_geographic_diversification(holdings: str = None):
    """Analyze geographic diversification of portfolio"""
    from app.services.market_correlation_service import market_correlation_service
    holdings_list = []
    if holdings:
        import json
        try:
            holdings_list = json.loads(holdings)
        except:
            holdings_list = portfolios["default"]["holdings"]
    else:
        holdings_list = portfolios["default"]["holdings"]
    
    analysis = await market_correlation_service.get_geographic_diversification_analysis(holdings_list)
    return analysis
