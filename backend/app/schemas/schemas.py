from pydantic import BaseModel
from typing import List, Optional, Dict, TypeVar, Generic
from datetime import datetime

T = TypeVar('T')

class WordBase(BaseModel):
    french: str
    english: str
    parts: Optional[Dict] = None

class WordCreate(WordBase):
    pass

class Word(WordBase):
    id: int
    correct_count: int = 0
    wrong_count: int = 0
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class GroupBase(BaseModel):
    name: str

class GroupCreate(GroupBase):
    pass

class Group(GroupBase):
    id: int
    created_at: datetime
    updated_at: datetime
    words: List[Word] = []
    class Config:
        from_attributes = True

class StudyActivityBase(BaseModel):
    name: str
    description: str
    thumbnail_url: str

class StudyActivityCreate(StudyActivityBase):
    pass

class StudyActivity(StudyActivityBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class WordReviewItemBase(BaseModel):
    word_id: int
    session_id: int
    is_correct: bool

class WordReviewCreate(WordReviewItemBase):
    pass

class WordReview(WordReviewItemBase):
    id: int
    timestamp: datetime
    created_at: datetime
    word: Word
    class Config:
        from_attributes = True

class StudySessionBase(BaseModel):
    activity_id: int
    group_id: int
    start_time: datetime
    end_time: Optional[datetime] = None

class StudySessionCreate(StudySessionBase):
    pass

class StudySession(StudySessionBase):
    id: int
    created_at: datetime
    activity: StudyActivity
    group: Group
    review_items: List[WordReview] = []
    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    success_rate: float
    total_study_sessions: int
    total_active_groups: int
    study_streak_days: int

class PaginationParams(BaseModel):
    current_page: int
    total_pages: int
    total_items: int
    items_per_page: int

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    pagination: PaginationParams

class SettingBase(BaseModel):
    key: str
    value: str
    description: str | None = None

class SettingCreate(SettingBase):
    pass

class SettingUpdate(BaseModel):
    value: str
    description: str | None = None

class Setting(SettingBase):
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 