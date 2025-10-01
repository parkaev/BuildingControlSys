from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import models, schemas
from core.database import get_db
from core.utils import get_current_user

router = APIRouter(prefix="/defects", tags=["Defects"])

@router.post("/", response_model=schemas.DefectRead)
async def create_defect(defect: schemas.DefectCreate, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    new_defect = models.Defect(**defect.dict())
    db.add(new_defect)
    await db.commit()
    await db.refresh(new_defect)
    return new_defect

@router.get("/", response_model=List[schemas.DefectRead])
async def get_defects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Defect))
    return result.scalars().all()

@router.get("/{defect_id}", response_model=schemas.DefectRead)
async def get_defect(defect_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Defect).where(models.Defect.id == defect_id))
    defect = result.scalars().first()
    if not defect:
        raise HTTPException(status_code=404, detail="Defect not found")
    return defect
