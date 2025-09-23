from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import schemas, models, utils, database
from auth import get_current_user
from sqlalchemy import select

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/create_user", response_model=schemas.UserRead)
async def create_user(
        user_in: schemas.UserCreate,
        db: AsyncSession = Depends(database.get_db),
        current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    result = await db.execute(select(models.User).where(models.User.username == user_in.username))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = models.User(
        username=user_in.username,
        hashed_password=utils.get_password_hash(user_in.password),
        role=user_in.role
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user