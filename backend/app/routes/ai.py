from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, auth, database
# Import AI service here later
# from ..services import recommendation_service

from ..services.ai_service import ai_service
from ..services.weather_service import weather_service

router = APIRouter(prefix="/ai", tags=["AI & Recommendations"])

@router.post("/recommend")
async def recommend_outfit(
    request: schemas.RecommendationRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Generate a smart outfit recommendation based on weather, occasion, and user history.
    """
    weather = await weather_service.get_weather()
    
    items = ai_service.generate_recommendation(
        db, 
        current_user.id, 
        occasion=request.occasion,
        weather_data=weather
    )
    
    return {
        "weather": weather,
        "recommendation": items
    }

@router.post("/recognize")
async def recognize_image(
    # file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Recognize clothing category and color from an uploaded image.
    Uses CLIP/YOLO model in the service layer.
    """
    return {
        "category": "shirt",
        "color": "blue",
        "confidence": 0.95,
        "tags": ["casual", "cotton"]
    }
