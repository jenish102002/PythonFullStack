from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_admin: bool

    class Config:
        from_attributes = True

# Slot Schemas
class SlotBase(BaseModel):
    start_time: datetime
    end_time: datetime
    price: float

class SlotCreate(SlotBase):
    pass

class SlotResponse(SlotBase):
    id: int
    is_booked: bool

    class Config:
        from_attributes = True

# Booking Schemas
class BookingCreate(BaseModel):
    slot_id: int

class BookingResponse(BaseModel):
    id: int
    booking_date: datetime
    slot: SlotResponse
    user: UserResponse

    class Config:
        from_attributes = True

# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
