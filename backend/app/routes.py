from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app.models.models import User, Slot, Booking
from app.schemas import UserCreate, UserResponse, Token, UserLogin, SlotCreate, SlotResponse, BookingCreate, BookingResponse
from app.auth import get_password_hash, verify_password, create_access_token, get_current_user, get_current_admin
from datetime import timedelta
from app.core.config import settings

router = APIRouter()

# --- Auth Routes ---
@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.username == user.username))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    # First user is admin for simplicity in this portfolio demo
    result_all = await db.execute(select(User))
    is_admin = len(result_all.scalars().all()) == 0
    
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password, is_admin=is_admin)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.username == form_data.username))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# --- Slot Routes ---
@router.post("/slots/", response_model=SlotResponse)
async def create_slot(slot: SlotCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_admin)):
    new_slot = Slot(**slot.dict())
    db.add(new_slot)
    await db.commit()
    await db.refresh(new_slot)
    return new_slot

@router.get("/slots/", response_model=List[SlotResponse])
async def read_slots(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Slot).filter(Slot.is_booked == False))
    return result.scalars().all()

# --- Booking Routes ---
@router.post("/bookings/", response_model=BookingResponse)
async def create_booking(booking: BookingCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if slot exists and is available using 'with for_update' to lock the row
    # Note: asyncpg/SQLAlchemy async locking syntax:
    result = await db.execute(select(Slot).filter(Slot.id == booking.slot_id).with_for_update())
    slot = result.scalars().first()
    
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    if slot.is_booked:
        raise HTTPException(status_code=400, detail="Slot already booked")
    
    slot.is_booked = True
    new_booking = Booking(user_id=current_user.id, slot_id=slot.id)
    db.add(new_booking)
    
    await db.commit()
    await db.refresh(new_booking)
    
    # Eager load relationships for response
    # Re-fetch with relationships
    # Ideally should use select(Booking).options(joinedload(Booking.user), joinedload(Booking.slot))...
    # For now, let's just return basic info or handle lazy load carefully.
    # Actually, SQLAlchemy Async doesn't support lazy loading. We need to eager load.
    
    # Let's simple re-query with eager load
    from sqlalchemy.orm import selectinload
    stmt = select(Booking).filter(Booking.id == new_booking.id).options(selectinload(Booking.user), selectinload(Booking.slot))
    result = await db.execute(stmt)
    return result.scalars().first()

@router.get("/bookings/my", response_model=List[BookingResponse])
async def read_my_bookings(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    from sqlalchemy.orm import selectinload
    stmt = select(Booking).filter(Booking.user_id == current_user.id).options(selectinload(Booking.user), selectinload(Booking.slot))
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/bookings/all", response_model=List[BookingResponse])
async def read_all_bookings(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_admin)):
    from sqlalchemy.orm import selectinload
    stmt = select(Booking).options(selectinload(Booking.user), selectinload(Booking.slot))
    result = await db.execute(stmt)
    return result.scalars().all()
