from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, insert
from typing import List
from app.database.database import get_db
from app.models.models import Group, Word, words_groups
from app.schemas.schemas import GroupCreate, Group as GroupSchema, PaginatedResponse, PaginationParams, Word as WordSchema
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/groups/", response_model=GroupSchema)
async def create_group(group: GroupCreate, db: AsyncSession = Depends(get_db)):
    db_group = Group(name=group.name)
    db.add(db_group)
    await db.commit()
    await db.refresh(db_group)
    return db_group

@router.get("/groups/", response_model=PaginatedResponse[GroupSchema])
async def get_groups(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    query = select(Group).offset(skip).limit(limit)
    result = await db.execute(query)
    groups = result.scalars().all()
    
    # Get total count
    total_query = select(Group)
    total_result = await db.execute(total_query)
    total = len(total_result.scalars().all())
    
    return PaginatedResponse(
        items=groups,
        pagination=PaginationParams(
            current_page=skip // limit + 1,
            total_pages=(total + limit - 1) // limit,
            total_items=total,
            items_per_page=limit
        )
    )

@router.get("/groups/{group_id}", response_model=GroupSchema)
def get_group(group_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    return group

@router.put("/groups/{group_id}", response_model=GroupSchema)
async def update_group(group_id: int, group: GroupCreate, db: AsyncSession = Depends(get_db)):
    query = select(Group).where(Group.id == group_id)
    result = await db.execute(query)
    db_group = result.scalar_one_or_none()
    
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
        
    db_group.name = group.name
    await db.commit()
    await db.refresh(db_group)
    return db_group

@router.delete("/groups/{group_id}")
async def delete_group(group_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Group).where(Group.id == group_id)
    result = await db.execute(query)
    group = result.scalar_one_or_none()
    
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
        
    await db.delete(group)
    await db.commit()
    return {"message": "Group deleted successfully"}

@router.post("/groups/{group_id}/words/{word_id}")
async def add_word_to_group(group_id: int, word_id: int, db: AsyncSession = Depends(get_db)):
    # Check if group exists
    group_query = select(Group).where(Group.id == group_id)
    group_result = await db.execute(group_query)
    group = group_result.scalar_one_or_none()
    
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Check if word exists
    word_query = select(Word).where(Word.id == word_id)
    word_result = await db.execute(word_query)
    word = word_result.scalar_one_or_none()
    
    if word is None:
        raise HTTPException(status_code=404, detail="Word not found")
    
    # Check if word is already in group
    exists_query = select(words_groups).where(
        (words_groups.c.group_id == group_id) & 
        (words_groups.c.word_id == word_id)
    )
    exists_result = await db.execute(exists_query)
    if exists_result.first() is not None:
        return {"message": "Word already in group"}
    
    # Add word to group using direct insert
    stmt = insert(words_groups).values(
        group_id=group_id,
        word_id=word_id
    )
    await db.execute(stmt)
    await db.commit()
    return {"message": "Word added to group successfully"}

@router.delete("/groups/{group_id}/words/{word_id}")
async def remove_word_from_group(group_id: int, word_id: int, db: AsyncSession = Depends(get_db)):
    # Check if group exists
    group_query = select(Group).where(Group.id == group_id)
    group_result = await db.execute(group_query)
    group = group_result.scalar_one_or_none()
    
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Check if word exists
    word_query = select(Word).where(Word.id == word_id)
    word_result = await db.execute(word_query)
    word = word_result.scalar_one_or_none()
    
    if word is None:
        raise HTTPException(status_code=404, detail="Word not found")
    
    # Delete the association
    delete_stmt = words_groups.delete().where(
        (words_groups.c.group_id == group_id) & 
        (words_groups.c.word_id == word_id)
    )
    result = await db.execute(delete_stmt)
    await db.commit()
    
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Word not in group")
        
    return {"message": "Word removed from group successfully"}

@router.get("/groups/{group_id}/words", response_model=PaginatedResponse[WordSchema])
def get_group_words(group_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Check if group exists
    group = db.query(Group).filter(Group.id == group_id).first()
    
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Get words in group with pagination
    words = db.query(Word).join(words_groups).filter(words_groups.c.group_id == group_id).offset(skip).limit(limit).all()
    
    # Get total count
    total = db.query(func.count()).select_from(words_groups).filter(words_groups.c.group_id == group_id).scalar()
    
    return PaginatedResponse(
        items=words,
        pagination=PaginationParams(
            current_page=skip // limit + 1,
            total_pages=(total + limit - 1) // limit,
            total_items=total,
            items_per_page=limit
        )
    )

@router.get("/groups/{group_id}/words")
def get_group_words_orm(group_id: int, page: int = 1, per_page: int = 10, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    skip = (page - 1) * per_page
    total = len(group.words)
    words = group.words[skip:skip + per_page]
    
    return {
        "items": words,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page
    }

@router.post("/groups")
def create_group_orm(name: str, db: Session = Depends(get_db)):
    group = Group(name=name)
    db.add(group)
    db.commit()
    db.refresh(group)
    return group

@router.put("/groups/{group_id}")
def update_group_orm(group_id: int, name: str, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    group.name = name
    db.commit()
    db.refresh(group)
    return group

@router.delete("/groups/{group_id}")
def delete_group_orm(group_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    db.delete(group)
    db.commit()
    return {"message": "Group deleted successfully"}

@router.post("/groups/{group_id}/words/{word_id}")
def add_word_to_group_orm(group_id: int, word_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    word = db.query(Word).filter(Word.id == word_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    
    # Create association between word and group using the association table
    stmt = words_groups.insert().values(word_id=word_id, group_id=group_id)
    db.execute(stmt)
    db.commit()
    return {"message": "Word added to group successfully"}

@router.delete("/groups/{group_id}/words/{word_id}")
def remove_word_from_group_orm(group_id: int, word_id: int, db: Session = Depends(get_db)):
    # Delete from the association table
    result = db.execute(
        words_groups.delete().where(
            (words_groups.c.group_id == group_id) & 
            (words_groups.c.word_id == word_id)
        )
    )
    
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Word not found in group")
    
    db.commit()
    return {"message": "Word removed from group successfully"} 