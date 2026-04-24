from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes

app = FastAPI(
    title="APEX Operating System",
    version="1.0.0",
    description="Production-grade apex AI operating system"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8000",
        "https://ai-agents-kvjx.vercel.app",
        "https://*.vercel.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)

@app.get("/health")
async def health():
    return {"status": "operational", "service": "APEX"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
