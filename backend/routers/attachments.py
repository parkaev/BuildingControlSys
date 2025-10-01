from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import models, schemas
from core.database import get_db
from core.utils import get_current_user
import shutil
from pathlib import Path

router = APIRouter(prefix="/attachments", tags=["Attachments"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/", response_model=schemas.AttachmentRead)
async def upload_attachment(file: UploadFile = File(...), defect_id: int = 0, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    file_path = UPLOAD_DIR / file.filename
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    attachment = models.Attachment(file_path=str(file_path), defect_id=defect_id, uploaded_by_id=user.id)
    db.add(attachment)
    await db.commit()
    await db.refresh(attachment)
    return attachment

@router.get("/defect/{defect_id}", response_model=List[schemas.AttachmentRead])
async def get_attachments(defect_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Attachment).where(models.Attachment.defect_id == defect_id))
    return result.scalars().all()
