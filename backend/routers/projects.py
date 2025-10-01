from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import models, schemas
from core.database import get_db
from core.utils import get_current_user

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/", response_model=schemas.ProjectRead)
async def create_project(project: schemas.ProjectCreate, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    new_project = models.Project(**project.dict())
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    return new_project

@router.get("/", response_model=List[schemas.ProjectRead])
async def get_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Project))
    return result.scalars().all()

@router.get("/{project_id}", response_model=schemas.ProjectRead)
async def get_project(project_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Project).where(models.Project.id == project_id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
