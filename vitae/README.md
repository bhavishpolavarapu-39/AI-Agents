# VITAE - Personal Health Operating System

**Continuous health monitoring, anomaly detection, and personalized wellness recommendations.**

## Quick Start

```bash
cd backend && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Features

- **Vital Monitoring** - Real-time heart rate, BP, O2 saturation tracking
- **Anomaly Detection** - Pattern recognition across vital signs
- **Clinical Decision Support** - Evidence-based recommendations
- **Health Timeline** - 24-hour activity and event visualization
- **Provider Integration** - Shareable clinical summaries

## Tech Stack

FastAPI + LangGraph + Claude + PostgreSQL (time-series) + Next.js 14
