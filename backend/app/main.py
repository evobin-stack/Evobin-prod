import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.routes import (
    auth,
    users,
    devices,
    centers,
    leaderboard,
    rewards,
    analytics,
    community,
    education,
    events,
    notifications,
    admin
)

app = FastAPI(title="EvoBin (EcoWaste AI) Backend API", version="1.0.0")

# Configure CORS origins from settings
allowed_origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]
if not allowed_origins or "*" in allowed_origins:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists and mount static files
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(devices.router, prefix="/devices", tags=["Devices"])
app.include_router(centers.router, prefix="/centers", tags=["Collection Centers"])
app.include_router(leaderboard.router, prefix="/leaderboard", tags=["Leaderboard"])
app.include_router(rewards.router, prefix="/rewards", tags=["Rewards"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
app.include_router(community.router, prefix="/community", tags=["Community"])
app.include_router(education.router, prefix="/education", tags=["Education"])
app.include_router(events.router, prefix="/events", tags=["Events"])
app.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])

@app.get("/")
def root():
    return {
        "status": "EvoBin Production API running",
        "version": "1.0.0",
        "documentation": "/docs"
    }

