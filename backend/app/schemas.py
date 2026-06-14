from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserInfo(UserBase):
    id: int
    profile_image: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Item Schemas
class ItemBase(BaseModel):
    name: str
    category: str
    color: str
    image_url: str
    tags: List[str]
    brand: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class ItemInfo(ItemBase):
    id: int
    last_used: Optional[datetime]
    usage_count: int
    owner_id: int

    class Config:
        from_attributes = True

# Outfit Schemas
class OutfitBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    occasion: str
    is_favorite: Optional[bool] = False

class OutfitCreate(OutfitBase):
    item_ids: List[int]

class OutfitInfo(OutfitBase):
    id: int
    rating: float
    created_at: datetime
    items: List[ItemInfo]

    class Config:
        from_attributes = True

# Recommendation Schemas
class RecommendationRequest(BaseModel):
    occasion: Optional[str] = None
    weather_condition: Optional[str] = None
    temperature: Optional[float] = None
