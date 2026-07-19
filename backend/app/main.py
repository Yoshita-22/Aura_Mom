from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import profile, meditation
from app.routers.diet_plan import router as diet_plan_router

app = FastAPI(
    title="AuraMom API",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(diet_plan_router)
app.include_router(profile.router)
app.include_router(meditation.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to AuraMom API"
    }