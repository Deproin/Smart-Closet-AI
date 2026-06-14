from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
from .. import models, schemas, auth, database

router = APIRouter(prefix="/items", tags=["Closet Items"])

# Ensure uploads directory exists
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/", response_model=schemas.ItemInfo)
async def create_item(
    name: str = Form(...),
    category: str = Form(...),
    color: str = Form(...),
    tags: str = Form("[]"),  # JSON string
    brand: Optional[str] = Form(None),
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    # Save file
    file_extension = file.filename.split(".")[-1]
    file_name = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    import json
    parsed_tags = json.loads(tags)

    new_item = models.Item(
        name=name,
        category=category,
        color=color,
        image_url=file_path,
        tags=parsed_tags,
        brand=brand,
        owner_id=current_user.id
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.get("/", response_model=List[schemas.ItemInfo])
def get_items(
    category: Optional[str] = None,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    query = db.query(models.Item).filter(models.Item.owner_id == current_user.id)
    if category:
        query = query.filter(models.Item.category == category)
    return query.all()

@router.get("/{item_id}", response_model=schemas.ItemInfo)
def get_item(item_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id, models.Item.owner_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.delete("/{item_id}")
def delete_item(item_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id, models.Item.owner_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Optionally delete file from storage
    if os.path.exists(item.image_url):
        os.remove(item.image_url)
        
    db.delete(item)
    db.commit()
    return {"detail": "Item deleted"}
