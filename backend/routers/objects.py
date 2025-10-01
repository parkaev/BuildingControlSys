from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import models, schemas
from core.database import get_db
from core.utils import get_current_user

router = APIRouter(prefix="/objects", tags=["Objects"])

@router.post("/", response_model=schemas.ObjectRead)
async def create_object(obj: schemas.ObjectCreate, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    new_obj = models.Object(**obj.dict())
    db.add(new_obj)
    await db.commit()
    await db.refresh(new_obj)
    return new_obj

@router.get("/", response_model=List[schemas.ObjectRead])
async def get_objects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Object))
    return result.scalars().all()

@router.get("/{object_id}", response_model=schemas.ObjectRead)
async def get_object(object_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Object).where(models.Object.id == object_id))
    obj = result.scalars().first()
    if not obj:
        raise HTTPException(status_code=404, detail="Object not found")
    return obj
