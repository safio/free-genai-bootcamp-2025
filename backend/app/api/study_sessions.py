from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, text
from datetime import datetime, timedelta
from typing import List
from app.database.database import get_db
from app.models.models import StudySession, StudyActivity, WordReviewItem, Group, Word, words_groups
from app.schemas.schemas import (
    StudySessionCreate,
    StudySession as StudySessionSchema,
    WordReviewCreate,
    WordReview as WordReviewSchema,
    PaginatedResponse,
    PaginationParams,
    DashboardStats,
    Word as WordSchema
)
from sqlalchemy.orm import Session

router = APIRouter(prefix="/study-sessions")

@router.get("/", response_model=PaginatedResponse[StudySessionSchema])
def get_study_sessions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Get sessions with pagination
    sessions = db.query(StudySession).offset(skip).limit(limit).all()
    
    # Get total count
    total = db.query(StudySession).count()
    
    return PaginatedResponse(
        items=sessions,
        pagination=PaginationParams(
            current_page=skip // limit + 1,
            total_pages=(total + limit - 1) // limit,
            total_items=total,
            items_per_page=limit
        )
    )

@router.post("/", response_model=StudySessionSchema)
def create_study_session(activity_id: int, group_id: int, db: Session = Depends(get_db)):
    # Verify group exists
    group = db.query(Group).filter(Group.id == group_id).first()
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Verify activity exists
    activity = db.query(StudyActivity).filter(StudyActivity.id == activity_id).first()
    if activity is None:
        raise HTTPException(status_code=404, detail="Study activity not found")
    
    db_session = StudySession(
        activity_id=activity_id,
        group_id=group_id,
        start_time=datetime.utcnow()
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.post("/reviews", response_model=WordReviewSchema)
async def create_word_review(
    session_id: int,
    review: WordReviewCreate,
    word_id: int,
    db: AsyncSession = Depends(get_db)
):
    # Verify session exists
    session_query = select(StudySession).where(StudySession.id == session_id)
    session_result = await db.execute(session_query)
    session = session_result.scalar_one_or_none()
    
    if session is None:
        raise HTTPException(status_code=404, detail="Study session not found")
    
    db_review = WordReviewItem(
        word_id=word_id,
        study_session_id=session_id,
        correct=review.correct
    )
    db.add(db_review)
    await db.commit()
    await db.refresh(db_review)
    return db_review

@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    # Get success rate
    reviews_query = select(WordReviewItem)
    reviews_result = await db.execute(reviews_query)
    reviews = reviews_result.scalars().all()
    
    total_reviews = len(reviews)
    correct_reviews = len([r for r in reviews if r.correct])
    success_rate = (correct_reviews / total_reviews * 100) if total_reviews > 0 else 0
    
    # Get total study sessions
    sessions_query = select(func.count()).select_from(StudySession)
    sessions_result = await db.execute(sessions_query)
    total_sessions = sessions_result.scalar()
    
    # Get total active groups
    groups_query = select(func.count()).select_from(Group)
    groups_result = await db.execute(groups_query)
    total_groups = groups_result.scalar()
    
    # Calculate study streak
    today = datetime.now().date()
    streak = 0
    current_date = today
    
    while True:
        date_query = select(StudySession).where(
            func.date(StudySession.created_at) == current_date
        )
        date_result = await db.execute(date_query)
        sessions_on_date = date_result.scalars().all()
        
        if not sessions_on_date:
            break
            
        streak += 1
        current_date -= timedelta(days=1)
    
    return DashboardStats(
        success_rate=success_rate,
        total_study_sessions=total_sessions,
        total_active_groups=total_groups,
        study_streak_days=streak
    )

@router.get("/progress", response_model=dict)
async def get_session_progress(session_id: int, db: AsyncSession = Depends(get_db)):
    # Verify session exists
    session_query = select(StudySession).where(StudySession.id == session_id)
    session_result = await db.execute(session_query)
    session = session_result.scalar_one_or_none()
    
    if session is None:
        raise HTTPException(status_code=404, detail="Study session not found")
    
    # Get review statistics
    stats_query = text("""
    SELECT 
        COUNT(*) as total_reviews,
        SUM(CASE WHEN correct THEN 1 ELSE 0 END) as correct_reviews
    FROM word_review_items 
    WHERE study_session_id = :session_id
    """)
    
    result = await db.execute(stats_query, {"session_id": session_id})
    stats = result.first()
    
    total_reviews = stats[0] or 0
    correct_reviews = stats[1] or 0
    
    return {
        "session_id": session_id,
        "created_at": session.created_at,
        "total_reviews": total_reviews,
        "correct_reviews": correct_reviews,
        "success_rate": (correct_reviews / total_reviews * 100) if total_reviews > 0 else 0
    }

@router.get("/words", response_model=PaginatedResponse[WordSchema])
def get_session_words(
    session_id: int,
    reviewed_only: bool = False,
    correct_only: bool = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    # Verify session exists
    session = db.query(StudySession).filter(StudySession.id == session_id).first()
    if session is None:
        raise HTTPException(status_code=404, detail="Study session not found")
    
    # Build query based on filters
    if reviewed_only:
        query = db.query(Word).join(WordReviewItem)
        if correct_only is not None:
            query = query.filter(WordReviewItem.correct == correct_only)
        query = query.filter(WordReviewItem.session_id == session_id)
    else:
        # Get all words from the group
        query = db.query(Word).join(words_groups).filter(words_groups.c.group_id == session.group_id)
    
    # Apply pagination
    total = query.count()
    words = query.offset(skip).limit(limit).all()
    
    return PaginatedResponse(
        items=words,
        pagination=PaginationParams(
            current_page=skip // limit + 1,
            total_pages=(total + limit - 1) // limit,
            total_items=total,
            items_per_page=limit
        )
    )

@router.get("/recent", response_model=PaginatedResponse[StudySessionSchema])
async def get_recent_sessions(
    days: int = 7,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    cutoff_date = datetime.now() - timedelta(days=days)
    query = (
        select(StudySession)
        .where(StudySession.created_at >= cutoff_date)
        .order_by(desc(StudySession.created_at))
        .offset(skip)
        .limit(limit)
    )
    
    result = await db.execute(query)
    sessions = result.scalars().all()
    
    # Get total count
    total_query = select(func.count()).select_from(StudySession).where(
        StudySession.created_at >= cutoff_date
    )
    total_result = await db.execute(total_query)
    total = total_result.scalar()
    
    return PaginatedResponse(
        items=sessions,
        pagination=PaginationParams(
            current_page=skip // limit + 1,
            total_pages=(total + limit - 1) // limit,
            total_items=total,
            items_per_page=limit
        )
    )

@router.get("/study_sessions")
def get_study_sessions_sync(page: int = 1, per_page: int = 10, db: Session = Depends(get_db)):
    skip = (page - 1) * per_page
    total = db.query(StudySession).count()
    sessions = db.query(StudySession).offset(skip).limit(per_page).all()
    
    return {
        "items": sessions,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page
    }

@router.post("/study_sessions")
def create_study_session_sync(activity_id: int, group_id: int, db: Session = Depends(get_db)):
    session = StudySession(
        activity_id=activity_id,
        group_id=group_id,
        start_time=datetime.utcnow()
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.get("/{session_id}")
def get_study_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(StudySession).filter(StudySession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Study session not found")
    return session

@router.get("/{session_id}/review-items", response_model=PaginatedResponse[WordReviewSchema])
def get_session_review_items(session_id: int, page: int = 1, per_page: int = 10, db: Session = Depends(get_db)):
    # Check if session exists
    session = db.query(StudySession).filter(StudySession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Study session not found")
    
    skip = (page - 1) * per_page
    
    # Get review items with pagination
    items = (db.query(WordReviewItem)
            .filter(WordReviewItem.session_id == session_id)
            .offset(skip)
            .limit(per_page)
            .all())
    
    # Get total count
    total = db.query(WordReviewItem).filter(WordReviewItem.session_id == session_id).count()
    
    return PaginatedResponse(
        items=items,
        pagination=PaginationParams(
            current_page=page,
            total_pages=(total + per_page - 1) // per_page,
            total_items=total,
            items_per_page=per_page
        )
    )

@router.put("/end")
def end_study_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(StudySession).filter(StudySession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Study session not found")
    
    if session.end_time:
        raise HTTPException(status_code=400, detail="Study session already ended")
    
    session.end_time = datetime.utcnow()
    db.commit()
    db.refresh(session)
    return session

@router.post("/review-items")
def add_review_item(session_id: int, word_id: int, is_correct: bool, db: Session = Depends(get_db)):
    session = db.query(StudySession).filter(StudySession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Study session not found")
    
    if session.end_time:
        raise HTTPException(status_code=400, detail="Cannot add review items to ended session")
    
    review_item = WordReviewItem(
        session_id=session_id,
        word_id=word_id,
        is_correct=is_correct,
        timestamp=datetime.utcnow()
    )
    db.add(review_item)
    db.commit()
    db.refresh(review_item)
    return review_item 