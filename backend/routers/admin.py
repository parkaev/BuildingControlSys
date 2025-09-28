from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import schemas, models
from core import database, utils
from .auth import get_current_user

router = APIRouter(prefix="/admin", tags=["Administration"])

def check_admin_permissions(current_user: models.User):
    if current_user.role != schemas.RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")

@router.get("/users", response_model=List[schemas.UserRead])
async def get_all_users(
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    check_admin_permissions(current_user)
    result = await db.execute(select(models.User))
    users = result.scalars().all()
    return users

@router.post("/users", response_model=schemas.UserRead)
async def create_user(
    user_in: schemas.UserCreate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    check_admin_permissions(current_user)
    
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

@router.put("/users/{user_id}", response_model=schemas.UserRead)
async def update_user(
    user_id: int,
    user_update: schemas.UserUpdate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    check_admin_permissions(current_user)
    
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.username and user_update.username != user.username:
        existing = await db.execute(select(models.User).where(models.User.username == user_update.username))
        if existing.scalars().first():
            raise HTTPException(status_code=400, detail="Username already exists")
        user.username = user_update.username
    
    if user_update.password:
        user.hashed_password = utils.get_password_hash(user_update.password)
    
    if user_update.role is not None:
        user.role = user_update.role
    
    if user_update.is_active is not None:
        user.is_active = user_update.is_active
    
    await db.commit()
    await db.refresh(user)
    return user

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    check_admin_permissions(current_user)
    
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    await db.delete(user)
    await db.commit()
    return {"message": "User deleted successfully"}
