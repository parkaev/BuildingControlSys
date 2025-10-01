from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import models, schemas
from core.database import get_db
from core.utils import get_current_user

router = APIRouter(prefix="/comments", tags=["Comments"])

@router.post("/", response_model=schemas.CommentRead)
async def create_comment(comment: schemas.CommentCreate, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    new_comment = models.Comment(**comment.dict(), author_id=user.id)
    db.add(new_comment)
    await db.commit()
    await db.refresh(new_comment)
    return new_comment

@router.get("/defect/{defect_id}", response_model=List[schemas.CommentRead])
async def get_comments(defect_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Comment).where(models.Comment.defect_id == defect_id))
    return result.scalars().all()
