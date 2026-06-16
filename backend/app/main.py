from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
import os
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

from .database import engine, Base, SessionLocal
from .routes import auth as auth_router, items, ai
from . import models, auth as auth_service

# Lifespan manager for startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Create a default user for testing if not exists
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.username == "hisham").first()
        if not user:
            logger.info("Creating default admin user: hisham")
            test_user = models.User(
                username="hisham",
                email="hisham@test.com",
                hashed_password=auth_service.get_password_hash("123456")
            )
            db.add(test_user)
            db.commit()
    except Exception as e:
        logger.error(f"Error during startup: {e}")
    finally:
        db.close()
    
    yield
    # Cleanup on shutdown (if needed)
    logger.info("Shutting down...")

app = FastAPI(
    title="Smart Closet AI API",
    description="Backend API for Smart Closet AI - Intelligent Wardrobe Management",
    version="1.0.0",
    lifespan=lifespan
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global Exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
    )

# CORS configuration - Allow all for now, but in production this should be restricted
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(auth_router.router, prefix="/api/auth", tags=["auth"]) # Added prefix for better structure
app.include_router(items.router, prefix="/api/items", tags=["items"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Smart Closet AI API",
        "docs": "/docs",
        "health": "healthy"
    }

if __name__ == "__main__":
    # For local development or quick runs
    # Render will typically use the 'Start Command' in their UI
    port = int(os.environ.get("PORT", 10000))
    host = "0.0.0.0"
    logger.info(f"Starting server on {host}:{port}")
    uvicorn.run("app.main:app", host=host, port=port, reload=True if os.getenv("DEBUG") else False)

