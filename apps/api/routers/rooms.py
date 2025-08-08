from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import RoomCreate, RoomOut
from models import Room
from db import get_session

router = APIRouter(prefix="/rooms", tags=["rooms"])

def get_db():
    with get_session() as s:
        yield s

@router.post("", response_model=RoomOut, status_code=201)
def create_room(payload: RoomCreate, db: Session = Depends(get_db)):
    exists = db.query(Room).filter(Room.name == payload.name).first()
    if exists:
        raise HTTPException(status_code=409, detail="Room name already exists")
    room = Room(name=payload.name, currency=payload.currency)
    db.add(room)
    db.commit()
    db.refresh(room)
    return room

@router.get("", response_model=list[RoomOut])
def list_rooms(db: Session = Depends(get_db)):
    return db.query(Room).order_by(Room.id.desc()).all()

@router.get("/{room_id}", response_model=RoomOut)
def get_room(room_id: int, db: Session = Depends(get_db)):
    room = db.get(Room, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Not found")
    return room
