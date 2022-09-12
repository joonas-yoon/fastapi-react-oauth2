from datetime import datetime
from enum import Enum
from typing import List, Optional

from beanie import PydanticObjectId
from pydantic import Field, EmailStr
from app.base.models import AppBaseModel
from fastapi_users import schemas
from fastapi_users.db import BeanieBaseUser, BaseOAuthAccount


class SocialScope(str, Enum):
    email: str = "email"
    google: str = "google"


class UserRead(schemas.BaseUser[PydanticObjectId]):
    pass


class UserCreate(schemas.BaseUserCreate):
    pass


class UserUpdate(schemas.BaseUserUpdate):
    pass


class User(BeanieBaseUser[PydanticObjectId], AppBaseModel):
    email: EmailStr
    username: Optional[str] = Field(None, description='Username')
    first_name: Optional[str] = Field(None)
    last_name: Optional[str] = Field(None)
    picture: Optional[str] = Field(None)

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    last_login_at: datetime = Field(default_factory=datetime.now)
