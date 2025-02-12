from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import Setting
from app.schemas.schemas import SettingCreate, SettingUpdate, Setting as SettingSchema
from typing import List

router = APIRouter(prefix="/settings")

@router.get("/", response_model=List[SettingSchema])
def get_settings(db: Session = Depends(get_db)):
    """Get all settings"""
    return db.query(Setting).all()

@router.get("/{key}", response_model=SettingSchema)
def get_setting(key: str, db: Session = Depends(get_db)):
    """Get a setting by key"""
    setting = db.query(Setting).filter(Setting.key == key).first()
    if not setting:
        raise HTTPException(status_code=404, detail=f"Setting with key {key} not found")
    return setting

@router.post("/", response_model=SettingSchema)
def create_setting(setting: SettingCreate = Body(...), db: Session = Depends(get_db)):
    """Create a new setting"""
    # Check if setting already exists
    existing = db.query(Setting).filter(Setting.key == setting.key).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Setting with key {setting.key} already exists")
    
    db_setting = Setting(**setting.dict())
    db.add(db_setting)
    db.commit()
    db.refresh(db_setting)
    return db_setting

@router.put("/{key}", response_model=SettingSchema)
def update_setting(key: str, setting: SettingUpdate = Body(...), db: Session = Depends(get_db)):
    """Update a setting"""
    db_setting = db.query(Setting).filter(Setting.key == key).first()
    if not db_setting:
        raise HTTPException(status_code=404, detail=f"Setting with key {key} not found")
    
    update_data = setting.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_setting, field, value)
    
    db.commit()
    db.refresh(db_setting)
    return db_setting

@router.delete("/{key}")
def delete_setting(key: str, db: Session = Depends(get_db)):
    """Delete a setting"""
    setting = db.query(Setting).filter(Setting.key == key).first()
    if not setting:
        raise HTTPException(status_code=404, detail=f"Setting with key {key} not found")
    
    db.delete(setting)
    db.commit()
    return {"message": f"Setting {key} deleted"} 