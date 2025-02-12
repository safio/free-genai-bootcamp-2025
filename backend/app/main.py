from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.models.models import Base, Word, Group, StudySession, WordReviewItem, StudyActivity, Setting
from app.database.database import engine, get_db
from app.db.seed import seed_data
from app.api import words, groups, study_sessions, study_activities, settings
from app.api.words import router as words_router
from app.api.groups import router as groups_router
from app.api.study_sessions import router as study_sessions_router
from app.api.study_activities import router as study_activities_router
from app.api.settings import router as settings_router
from app.schemas.schemas import PaginatedResponse, PaginationParams
import logging
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Language Learning Portal")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Include routers
app.include_router(words.router, prefix="/api")
app.include_router(groups.router, prefix="/api")
app.include_router(study_sessions.router, prefix="/api")
app.include_router(study_activities.router, prefix="/api")
app.include_router(settings.router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    db = next(get_db())
    # Check if database is empty
    if not db.query(Word).first():
        seed_data(db)

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    logger.error(f"HTTP error occurred: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    logger.error(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unexpected error occurred: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )

@app.get("/api/words")
def get_words(page: int = 1, per_page: int = 10, db: Session = Depends(get_db)):
    skip = (page - 1) * per_page
    total = db.query(Word).count()
    words = db.query(Word).offset(skip).limit(per_page).all()
    
    return {
        "items": words,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page
    }

@app.get("/api/words/{word_id}")
def get_word(word_id: int, db: Session = Depends(get_db)):
    word = db.query(Word).filter(Word.id == word_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    return word

@app.get("/api/groups")
def get_groups(db: Session = Depends(get_db)):
    groups = db.query(Group).all()
    return groups

@app.get("/api/groups/{group_id}")
def get_group(group_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return group

@app.get("/api/groups/{group_id}/words")
def get_group_words(group_id: int, page: int = 1, per_page: int = 10, db: Session = Depends(get_db)):
    try:
        logger.info(f"Fetching words for group {group_id}, page {page}, per_page {per_page}")
        group = db.query(Group).filter(Group.id == group_id).first()
        
        if not group:
            logger.warning(f"Group {group_id} not found")
            raise HTTPException(status_code=404, detail="Group not found")
        
        skip = (page - 1) * per_page
        total = len(group.words)
        words = group.words[skip:skip + per_page]
        
        response = PaginatedResponse(
            items=words,
            pagination=PaginationParams(
                current_page=page,
                total_pages=(total + per_page - 1) // per_page,
                total_items=total,
                items_per_page=per_page
            )
        )
        logger.info(f"Successfully fetched {len(words)} words for group {group_id}")
        return response
    except Exception as e:
        logger.error(f"Error fetching words for group {group_id}: {str(e)}", exc_info=True)
        raise

@app.post("/api/reset_history")
def reset_history(db: Session = Depends(get_db)):
    # Delete all study sessions and word review items
    db.query(WordReviewItem).delete()
    db.query(StudySession).delete()
    db.commit()
    return {"message": "History reset successfully"}

@app.post("/api/full_reset")
def full_reset(db: Session = Depends(get_db)):
    # Delete all data
    db.query(WordReviewItem).delete()
    db.query(StudySession).delete()
    db.query(WordGroup).delete()
    db.query(Word).delete()
    db.query(Group).delete()
    db.query(StudyActivity).delete()
    db.commit()
    
    # Re-seed the database
    seed_data(db)
    return {"message": "Database reset and re-seeded successfully"}

@app.get("/")
async def root():
    return {"message": "Welcome to Language Learning Portal API"} 