from app.database.database import engine, Base
from app.models.models import Word, Group, StudyActivity, StudySession, WordReviewItem
from app.db.seed import seed_data
from sqlalchemy.orm import Session

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create a session
    session = Session(engine)
    
    try:
        # Check if database is empty
        if not session.query(Word).first():
            # Seed initial data
            seed_data(session)
            print("Database initialized and seeded successfully!")
        else:
            print("Database already contains data, skipping initialization.")
    finally:
        session.close()

if __name__ == "__main__":
    init_db() 