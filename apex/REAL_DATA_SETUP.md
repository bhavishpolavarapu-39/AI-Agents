# APEX Real Market Data Integration Guide

This guide explains how to set up real market data integration for the APEX platform. By default, the app uses demo/mock data, but you can enable real-time data from financial APIs.

## 📊 Supported APIs

### 1. **Finnhub** (Recommended)
- **Purpose**: Real-time stock quotes, company profiles, financial statements, news
- **Cost**: Free tier available (60 API calls/minute)
- **Website**: https://www.finnhub.io/
- **Sign Up**: 
  1. Visit https://www.finnhub.io/
  2. Click "Sign Up" (Free plan available)
  3. Verify email
  4. Get your API key from dashboard

### 2. **Alpha Vantage**
- **Purpose**: Technical indicators, intraday/daily time series data
- **Cost**: Free tier available (5 API calls/minute)
- **Website**: https://www.alphavantage.co/
- **Sign Up**:
  1. Visit https://www.alphavantage.co/
  2. Click "Get Free API Key"
  3. Verify email
  4. Copy API key from response

### 3. **Anthropic Claude** (For AI Agents)
- **Purpose**: Multi-agent analysis, portfolio insights, predictions
- **Cost**: Pay-as-you-go (starting free credits)
- **Website**: https://www.anthropic.com/api
- **Sign Up**:
  1. Visit https://console.anthropic.com/
  2. Create account
  3. Add billing method
  4. Get API key

## 🚀 Setup Instructions

### Step 1: Get API Keys
1. Sign up for each service above
2. Copy your API keys
3. Keep them secure (never commit to git)

### Step 2: Create `.env` File

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Add your API keys:
```env
FINNHUB_API_KEY=your_finnhub_api_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Step 3: Start Backend (Development)

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will start on `http://localhost:8000`

### Step 4: Configure Frontend

Update frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 5: Restart Frontend

```bash
cd frontend
npm run dev
```

Frontend will connect to backend and fetch real market data.

## 🎯 API Endpoints Available

### Market Data Endpoints

```
GET /api/apex/market/quote/{symbol}
- Real-time stock quote
- Returns: price, change, volume

GET /api/apex/market/chart/{symbol}?timeframe=1d
- Historical price chart data
- Timeframes: 1d, 1w, 1m, 3m, 1y, all

GET /api/apex/market/search?query=apple
- Search stocks globally
- Returns: company names, symbols, descriptions

GET /api/apex/market/profile/{symbol}
- Company information
- Returns: name, industry, description, website

GET /api/apex/market/financials/{symbol}
- Financial statements and metrics
- Returns: revenue, earnings, margins, ratios

GET /api/apex/market/news?category=general&limit=20
- Financial news articles
- Categories: general, forex, crypto, merger

GET /api/apex/market/technical/{symbol}?indicator=rsi&period=14
- Technical indicator data
- Indicators: rsi, macd, sma, ema, bbands, atr, adx, stoch

GET /api/apex/market/indicators
- List of available indicators with descriptions
```

## 🎮 Using Technical Indicators (TradingView Style)

The StockPriceChart component now includes a professional indicator selector:

1. Click the **📊 Indicators** button on any chart
2. Select indicators by category:
   - **Trend**: SMA, EMA, ADX
   - **Momentum**: RSI, MACD, Stochastic
   - **Volatility**: Bollinger Bands, ATR
3. Choose periods for each indicator
4. Indicators display on the chart automatically

### Available Indicators

| Indicator | Category | Default Period | Use Case |
|-----------|----------|-----------------|----------|
| SMA | Trend | 20, 50, 200 | Long-term trend |
| EMA | Trend | 12, 26 | Recent price emphasis |
| RSI | Momentum | 14 | Overbought/oversold |
| MACD | Momentum | 12, 26, 9 | Momentum changes |
| Bollinger Bands | Volatility | 20 | Support/resistance |
| ATR | Volatility | 14 | Volatility measure |
| ADX | Trend | 14 | Trend strength |
| Stochastic | Momentum | 14 | Momentum oscillator |

## 📈 Data Status Indicators

The chart displays your data status:

- **🔴 Live** - Real market data from APIs (requires API keys)
- **📊 Demo** - Demo/mock data (default, no API keys needed)

## ⚠️ API Rate Limits

### Finnhub
- Free: 60 calls/minute
- Premium: Unlimited

### Alpha Vantage
- Free: 5 calls/minute, 500 calls/day
- Premium: 150 calls/minute

**Recommendations:**
- Cache responses locally (default: 5-30 minutes)
- Avoid refreshing charts too frequently
- Consider upgrading for production use

## 🔄 Fallback Behavior

If APIs are unavailable or reach rate limits:
1. App automatically falls back to demo/mock data
2. No errors shown to user
3. Demo data generated locally
4. Retries automatically when APIs recover

## 🛠️ Troubleshooting

### Issue: "API key not configured"
**Solution**: 
- Ensure `.env` file exists with correct keys
- Restart backend after adding keys
- Check API provider console for key validity

### Issue: Rate limit exceeded
**Solution**:
- Wait a minute before retrying
- Upgrade to paid API plan
- Reduce chart refresh frequency

### Issue: Slow data loading
**Solution**:
- Check internet connection
- Verify API provider status
- Redis cache may be warming up

### Issue: Demo data showing instead of real data
**Solution**:
- API keys not configured (see above)
- API provider down (check status page)
- Network connectivity issue

## 📚 API Documentation

- **Finnhub**: https://finnhub.io/docs/api
- **Alpha Vantage**: https://www.alphavantage.co/documentation/
- **Anthropic Claude**: https://docs.anthropic.com/

## 💰 Cost Estimation

| API | Free Tier | Monthly Cost |
|-----|-----------|--------------|
| Finnhub | 60 calls/min | $0 - $50+ |
| Alpha Vantage | 5 calls/min | $0 - $29 |
| Anthropic | $0.80/million tokens | Pay-as-you-go |

**Note**: Using free tiers is sufficient for personal use and development.

## 🔒 Security Best Practices

1. **Never commit `.env` file** to git
2. **Keep API keys private** - regenerate if compromised
3. **Use environment variables** for production
4. **Rotate keys regularly** (monthly recommended)
5. **Monitor usage** on each provider's dashboard

## 📱 Production Deployment

For Vercel/production deployment:

1. Go to project settings in your platform
2. Add environment variables:
   - `FINNHUB_API_KEY`
   - `ALPHA_VANTAGE_API_KEY`
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_API_URL=https://your-backend-url.com`

3. Deploy backend to production
4. Update frontend API URL
5. Test all endpoints

## ✨ Next Steps

1. ✅ Get API keys from providers
2. ✅ Create `.env` file with keys
3. ✅ Start backend server
4. ✅ Restart frontend
5. ✅ Check data status indicator (🔴 Live vs 📊 Demo)
6. ✅ Click 📊 Indicators to select technical indicators
7. ✅ Use the platform with real market data!

## 📞 Support

For issues:
1. Check this guide
2. Review API provider documentation
3. Check console for error messages
4. Verify API keys are correct
