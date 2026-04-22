# NEXUS - Supply Chain Operating System

**Demand forecasting, inventory optimization, and supply chain risk mitigation.**

## Quick Start

```bash
cd backend && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Features

- **Demand Forecasting** - ML-powered demand prediction with confidence intervals
- **Inventory Optimization** - Dynamic reorder point calculation
- **Supplier Risk** - Reliability scoring and diversification strategy
- **Cost Reduction** - Carrying cost vs stockout analysis
- **Supply Alerts** - Real-time shortage warnings

## Tech Stack

FastAPI + LangGraph + Claude + PostgreSQL + Redis + Next.js 14
