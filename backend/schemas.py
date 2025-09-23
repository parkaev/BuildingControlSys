from pydantic import BaseModel
from enum import Enum

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

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
