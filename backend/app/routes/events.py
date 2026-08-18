from fastapi import APIRouter, HTTPException, Depends
from app.database import db
from app.auth_utils import get_current_user, require_current_user

router = APIRouter()

@router.get("")
@router.get("/")
async def get_events():
    cursor = db.events.find()
    events = await cursor.to_list(length=50)
    for e in events:
        e["_id"] = str(e["_id"])
        if "id" not in e:
            e["id"] = e["_id"]
    return {"data": events}

@router.get("/{id}")
async def get_event_details(id: str):
    event = await db.events.find_one({"$or": [{"id": id}, {"_id": id}]})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event["_id"] = str(event["_id"])
    return {"data": event}

@router.post("/{id}/register")
async def register_for_event(id: str, user = Depends(require_current_user)):
    user_id = str(user.get("_id", user.get("id")))

    await db.events.update_one(
        {"$or": [{"id": id}, {"_id": id}]},
        {"$inc": {"registeredCount": 1}}
    )

    reg = {
        "eventId": id,
        "userId": user_id,
        "status": "Registered"
    }

    await db.event_registrations.insert_one(reg)

    return {"data": reg, "message": "Registered for event successfully"}

@router.delete("/{id}/register")
async def cancel_event_registration(id: str, user = Depends(require_current_user)):
    user_id = str(user.get("_id", user.get("id")))

    await db.events.update_one(
        {"$or": [{"id": id}, {"_id": id}]},
        {"$inc": {"registeredCount": -1}}
    )

    await db.event_registrations.delete_many({"eventId": id, "userId": user_id})

    return {"message": "Registration cancelled"}
