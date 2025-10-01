from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import models, schemas
from core import database, utils

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(database.get_db)):
    username = utils.decode_access_token(token)
    if username is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    result = await db.execute(select(models.User).where(models.User.username == username))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=401, detail="User is inactive")
    return user

@router.post("/login", response_model=schemas.Token, operation_id="login_auth")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.User).where(models.User.username == form_data.username))
    user = result.scalars().first()
    if not user or not utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    if not user.is_active:
        raise HTTPException(status_code=401, detail="User is inactive")

    token = utils.create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserProfile, operation_id="get_current_user_profile")
async def get_current_user_profile(current_user: models.User = Depends(get_current_user)):
    return current_user
