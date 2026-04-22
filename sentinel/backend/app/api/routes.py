from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import json, asyncio

router = APIRouter(prefix="/api/project", tags=["project"])

@router.get("/health")
async def health():
    return {"status": "operational"}

@router.get("/data")
async def get_data():
    return {"data": []}
