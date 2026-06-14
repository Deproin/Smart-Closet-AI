import random
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from .. import models

class AIService:
    @staticmethod
    def get_color_harmony(color: str) -> List[str]:
        """
        Rule-based styling system for color harmony.
        In a real app, this would use a more complex color wheel logic.
        """
        harmonies = {
            "white": ["black", "blue", "red", "green", "pink"],
            "black": ["white", "gold", "silver", "red", "blue"],
            "blue": ["white", "beige", "gold", "grey"],
            "red": ["black", "white", "grey", "navy"],
            "beige": ["navy", "brown", "white", "black"],
        }
        return harmonies.get(color.lower(), ["white", "black", "grey"])

    @staticmethod
    def generate_recommendation(
        db: Session, 
        user_id: int, 
        occasion: str = None, 
        weather_data: Dict[str, Any] = None
    ) -> List[models.Item]:
        """
        Hybrid Recommendation Engine (Weather-Aware).
        """
        items = db.query(models.Item).filter(models.Item.owner_id == user_id).all()
        if not items:
            return []

        temp = weather_data.get("temp", 20) if weather_data else 20
        
        # Weather Filtering Logic
        is_cold = temp < 18
        is_hot = temp > 28

        active_items = items
        if is_cold:
            # Prioritize long sleeves, jackets, pants
            active_items = [i for i in items if any(tag in (i.tags or []) for tag in ['winter', 'warm', 'long-sleeve', 'heavy'])]
            if not active_items: active_items = items
        elif is_hot:
            # Prioritize shorts, t-shirts, light fabrics
            active_items = [i for i in items if any(tag in (i.tags or []) for tag in ['summer', 'light', 'short-sleeve'])]
            if not active_items: active_items = items

        # Split items by category
        tops = [i for i in active_items if i.category.lower() in ['shirt', 't-shirt', 'blouse', 'hoodie']]
        bottoms = [i for i in active_items if i.category.lower() in ['pants', 'jeans', 'skirt', 'shorts']]
        shoes = [i for i in active_items if i.category.lower() in ['shoes', 'sneakers', 'boots']]

        if not tops or not bottoms:
            return random.sample(items, min(len(items), 3))

        # Pick harmonious set
        selected_top = random.choice(tops)
        harmony_colors = AIService.get_color_harmony(selected_top.color)
        matching_bottoms = [b for b in bottoms if b.color.lower() in harmony_colors]
        
        selected_bottom = random.choice(matching_bottoms) if matching_bottoms else random.choice(bottoms)
        selected_shoes = random.choice(shoes) if shoes else None
        
        outfit = [selected_top, selected_bottom]
        if selected_shoes:
            outfit.append(selected_shoes)
            
        return outfit

    @staticmethod
    async def analyze_image(image_bytes: bytes) -> Dict[str, Any]:
        """
        Stub for YOLO/CLIP Vision Model integration.
        In production, this would call a pre-trained model runner.
        """
        # Simulated delay and logic
        return {
            "category": "shirt",
            "color": "blue",
            "confidence": 0.89,
            "detected_tags": ["formal", "cotton", "long-sleeve"]
        }

ai_service = AIService()
