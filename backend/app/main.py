from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import uvicorn
import os
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from .database import engine, Base
from .routes import auth as auth_router, items, ai

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Closet AI API",
    description="Backend API for Smart Closet AI - Intelligent Wardrobe Management",
    version="1.0.0"
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global Exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
    )

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

from . import models, auth as auth_service
from .database import SessionLocal

@app.on_event("startup")
def create_test_user():
    db = SessionLocal()
    try:
        # Create a default user for testing if not exists
        user = db.query(models.User).filter(models.User.username == "hisham").first()
        if not user:
            logger.info("Creating test user: hisham")
            test_user = models.User(
                username="hisham",
                email="hisham@test.com",
                hashed_password=auth_service.get_password_hash("123456")
            )
            db.add(test_user)
            db.commit()
    finally:
        db.close()

# Include routers
app.include_router(auth_router.router)
app.include_router(items.router)
app.include_router(ai.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Smart Closet AI API",
        "docs": "/docs",
        "status": "online"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
