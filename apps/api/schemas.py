from pydantic import BaseModel, Field

class RoomBase(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    currency: str = Field(default="EUR", min_length=3, max_length=8)

class RoomCreate(RoomBase):
    pass

class RoomOut(RoomBase):
    id: int

    class Config:
        from_attributes = True
