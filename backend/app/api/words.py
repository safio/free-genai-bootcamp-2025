from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from typing import List
from app.database.database import get_db
from app.models.models import Word
from app.schemas.schemas import WordCreate, Word as WordSchema, PaginatedResponse, PaginationParams
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/words", response_model=WordSchema)
def create_word(word: WordCreate, db: Session = Depends(get_db)):
    db_word = Word(french=word.french, english=word.english)
    db.add(db_word)
    db.commit()
    db.refresh(db_word)
    return db_word

@router.get("/words", response_model=PaginatedResponse[WordSchema])
def get_words(page: int = 1, per_page: int = 10, db: Session = Depends(get_db)):
    skip = (page - 1) * per_page
    total = db.query(Word).count()
    words = db.query(Word).offset(skip).limit(per_page).all()
    
    return PaginatedResponse(
        items=words,
        pagination=PaginationParams(
            current_page=page,
            total_pages=(total + per_page - 1) // per_page,
            total_items=total,
            items_per_page=per_page
        )
    )

@router.get("/words/{word_id}", response_model=WordSchema)
def get_word(word_id: int, db: Session = Depends(get_db)):
    word = db.query(Word).filter(Word.id == word_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    return word

@router.put("/words/{word_id}", response_model=WordSchema)
def update_word(word_id: int, word: WordCreate, db: Session = Depends(get_db)):
    db_word = db.query(Word).filter(Word.id == word_id).first()
    if not db_word:
        raise HTTPException(status_code=404, detail="Word not found")
    
    db_word.french = word.french
    db_word.english = word.english
    db.commit()
    db.refresh(db_word)
    return db_word

@router.delete("/words/{word_id}")
def delete_word(word_id: int, db: Session = Depends(get_db)):
    word = db.query(Word).filter(Word.id == word_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    
    db.delete(word)
    db.commit()
    return {"message": "Word deleted successfully"}

@router.get("/words/search/", response_model=PaginatedResponse[WordSchema])
async def search_words(
    query: str,
    language: str = "french",  # or "english"
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    if language not in ["french", "english"]:
        raise HTTPException(status_code=400, detail="Language must be either 'french' or 'english'")
    
    if language == "french":
        search_query = select(Word).where(Word.french.ilike(f"%{query}%"))
    else:
        search_query = select(Word).where(Word.english.ilike(f"%{query}%"))
    
    search_query = search_query.offset(skip).limit(limit)
    result = await db.execute(search_query)
    words = result.scalars().all()
    
    # Get total count
    total_query = select(func.count()).select_from(Word)
    if language == "french":
        total_query = total_query.where(Word.french.ilike(f"%{query}%"))
    else:
        total_query = total_query.where(Word.english.ilike(f"%{query}%"))
    
    total_result = await db.execute(total_query)
    total = total_result.scalar()
    
    return PaginatedResponse(
        items=words,
        pagination=PaginationParams(
            current_page=skip // limit + 1,
            total_pages=(total + limit - 1) // limit,
            total_items=total,
            items_per_page=limit
        )
    )

# Add word progress tracking
@router.get("/words/{word_id}/progress", response_model=dict)
async def get_word_progress(word_id: int, db: AsyncSession = Depends(get_db)):
    # Check if word exists
    word_query = select(Word).where(Word.id == word_id)
    word_result = await db.execute(word_query)
    word = word_result.scalar_one_or_none()
    
    if word is None:
        raise HTTPException(status_code=404, detail="Word not found")
    
    # Get review statistics
    stats_query = text("""
    SELECT 
        COUNT(*) as total_reviews,
        SUM(CASE WHEN correct THEN 1 ELSE 0 END) as correct_reviews,
        MAX(created_at) as last_reviewed
    FROM word_review_items 
    WHERE word_id = :word_id
    """)
    
    result = await db.execute(stats_query, {"word_id": word_id})
    stats = result.first()
    
    total_reviews = stats[0] or 0
    correct_reviews = stats[1] or 0
    last_reviewed = stats[2]
    
    return {
        "word": {"french": word.french, "english": word.english},
        "total_reviews": total_reviews,
        "correct_reviews": correct_reviews,
        "success_rate": (correct_reviews / total_reviews * 100) if total_reviews > 0 else 0,
        "last_reviewed": last_reviewed
    } 