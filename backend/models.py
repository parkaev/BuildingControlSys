from sqlalchemy import Column, Integer, String, Boolean, Enum as SQLEnum, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from core.database import Base
from schemas import RoleEnum
import enum

# ------------------- Users -------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(SQLEnum(RoleEnum, name="role_enum", native_enum=False), default=RoleEnum.user, nullable=False)

    projects = relationship("ProjectUser", back_populates="user")
    defects = relationship("DefectUser", back_populates="user")
    comments = relationship("Comment", back_populates="author")
    attachments = relationship("Attachment", back_populates="uploaded_by")

# ------------------- Projects -------------------
class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    objects = relationship("Object", back_populates="project")
    users = relationship("ProjectUser", back_populates="project")

# ------------------- Objects -------------------
class Object(Base):
    __tablename__ = "objects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    address = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    project_id = Column(Integer, ForeignKey("projects.id"))

    project = relationship("Project", back_populates="objects")
    defects = relationship("Defect", back_populates="object")

# ------------------- Defects -------------------
class DefectStatusEnum(str, enum.Enum):
    New = "New"
    InProgress = "InProgress"
    OnReview = "OnReview"
    Closed = "Closed"
    Cancelled = "Cancelled"

class DefectPriorityEnum(str, enum.Enum):
    Low = "Low"
    Medium = "Medium"
    High = "High"
    Critical = "Critical"

class Defect(Base):
    __tablename__ = "defects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum(DefectStatusEnum, name="defect_status_enum", native_enum=False), default=DefectStatusEnum.New, nullable=False)
    priority = Column(SQLEnum(DefectPriorityEnum, name="defect_priority_enum", native_enum=False), default=DefectPriorityEnum.Medium, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    object_id = Column(Integer, ForeignKey("objects.id"))

    object = relationship("Object", back_populates="defects")
    users = relationship("DefectUser", back_populates="defect")
    comments = relationship("Comment", back_populates="defect")
    attachments = relationship("Attachment", back_populates="defect")

# ------------------- Project Users -------------------
class ProjectUser(Base):
    __tablename__ = "project_users"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    project = relationship("Project", back_populates="users")
    user = relationship("User", back_populates="projects")

# ------------------- Defect Users -------------------
class DefectUser(Base):
    __tablename__ = "defect_users"

    id = Column(Integer, primary_key=True, index=True)
    defect_id = Column(Integer, ForeignKey("defects.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    assigned_at = Column(DateTime, default=datetime.utcnow)

    defect = relationship("Defect", back_populates="users")
    user = relationship("User", back_populates="defects")

# ------------------- Comments -------------------
class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    defect_id = Column(Integer, ForeignKey("defects.id"))
    author_id = Column(Integer, ForeignKey("users.id"))

    defect = relationship("Defect", back_populates="comments")
    author = relationship("User", back_populates="comments")

# ------------------- Attachments -------------------
class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String(255), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    defect_id = Column(Integer, ForeignKey("defects.id"))
    uploaded_by_id = Column(Integer, ForeignKey("users.id"))

    defect = relationship("Defect", back_populates="attachments")
    uploaded_by = relationship("User", back_populates="attachments")
