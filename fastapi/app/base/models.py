import json
from datetime import datetime

from bson import ObjectId
from pydantic import BaseModel


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class AppBaseModel(BaseModel):
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }

    def json(self):
        return json.loads(json.dumps(self.dict(), default=str))
