from pydantic import BaseModel
from enum import Enum
from typing import Optional

class RoleEnum(str, Enum):
    user = "user"
    admin = "admin"

class UserCreate(BaseModel):
    username: str
    password: str
    role: RoleEnum = RoleEnum.user

class UserRead(BaseModel):
    id: int
    username: str
    role: RoleEnum
    is_active: bool

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[RoleEnum] = None
    is_active: Optional[bool] = None

class UserProfile(BaseModel):
    id: int
    username: str
    role: RoleEnum
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
