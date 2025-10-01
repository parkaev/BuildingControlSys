from pydantic import BaseModel
from enum import Enum
from typing import Optional
from datetime import datetime

# ---------------- Users ----------------
class RoleEnum(str, Enum):
    admin = "admin"
    user = "user"
    manager = "manager"
    boss = "boss"

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


# ---------------- Projects ----------------
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectRead(BaseModel):
    id: int
    name: str
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


# ---------------- Objects ----------------
class ObjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    project_id: int

class ObjectRead(BaseModel):
    id: int
    name: str
    description: Optional[str]
    address: Optional[str]
    created_at: datetime
    project_id: int

    class Config:
        from_attributes = True

class ObjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    project_id: Optional[int] = None


# ---------------- Defects ----------------
class DefectStatusEnum(str, Enum):
    new = "New"
    in_progress = "InProgress"
    completed = "Completed"

class DefectPriorityEnum(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"

class DefectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    status: DefectStatusEnum = DefectStatusEnum.new
    priority: DefectPriorityEnum = DefectPriorityEnum.medium
    object_id: int

class DefectRead(BaseModel):
    id: int
    name: str
    description: Optional[str]
    status: DefectStatusEnum
    priority: DefectPriorityEnum
    created_at: datetime
    updated_at: datetime
    object_id: int

    class Config:
        from_attributes = True

class DefectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[DefectStatusEnum] = None
    priority: Optional[DefectPriorityEnum] = None
    object_id: Optional[int] = None


# ---------------- Comments ----------------
class CommentCreate(BaseModel):
    defect_id: int
    user_id: int
    content: str

class CommentRead(BaseModel):
    id: int
    defect_id: int
    user_id: int
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------- Attachments ----------------
class AttachmentCreate(BaseModel):
    defect_id: int
    file_path: str
    description: Optional[str] = None

class AttachmentRead(BaseModel):
    id: int
    defect_id: int
    file_path: str
    description: Optional[str]
    uploaded_at: datetime

    class Config:
        from_attributes = True
