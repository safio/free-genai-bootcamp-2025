from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import StudyActivity

router = APIRouter()

@router.get("/study-activities")
def get_study_activities(db: Session = Depends(get_db)):
    activities = db.query(StudyActivity).all()
    return activities

@router.get("/study-activities/{activity_id}")
def get_study_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(StudyActivity).filter(StudyActivity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Study activity not found")
    return activity

@router.post("/study-activities")
def create_study_activity(name: str, description: str, thumbnail_url: str, db: Session = Depends(get_db)):
    activity = StudyActivity(
        name=name,
        description=description,
        thumbnail_url=thumbnail_url
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

@router.put("/study-activities/{activity_id}")
def update_study_activity(
    activity_id: int,
    name: str,
    description: str,
    thumbnail_url: str,
    db: Session = Depends(get_db)
):
    activity = db.query(StudyActivity).filter(StudyActivity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Study activity not found")
    
    activity.name = name
    activity.description = description
    activity.thumbnail_url = thumbnail_url
    db.commit()
    db.refresh(activity)
    return activity

@router.delete("/study-activities/{activity_id}")
def delete_study_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(StudyActivity).filter(StudyActivity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Study activity not found")
    
    db.delete(activity)
    db.commit()
    return {"message": "Study activity deleted successfully"} 