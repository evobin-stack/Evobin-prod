from fastapi import APIRouter, HTTPException
from app.database import db
from typing import Optional

router = APIRouter()

@router.get("/content")
async def get_education_content(category: Optional[str] = None):
    query = {}
    if category and category != "All":
        query = {"category": category}

    cursor = db.education_content.find(query)
    items = await cursor.to_list(length=50)
    for item in items:
        item["_id"] = str(item["_id"])
        if "id" not in item:
            item["id"] = item["_id"]

    return {"data": items}

@router.get("/content/{id}")
async def get_content_by_id(id: str):
    item = await db.education_content.find_one({"$or": [{"id": id}, {"_id": id}]})
    if not item:
        raise HTTPException(status_code=404, detail="Educational content not found")
    item["_id"] = str(item["_id"])
    return {"data": item}

@router.get("/guides/{deviceType}")
async def get_disassembly_guide(deviceType: str):
    guide = await db.disassembly_guides.find_one({
        "deviceType": {"$regex": f"^{deviceType}", "$options": "i"}
    })
    if not guide:
        # Fallback general guide
        guide = {
            "id": f"guide-general",
            "deviceType": deviceType,
            "title": f"General Safety & Recycling Guide for {deviceType}",
            "difficulty": "Easy",
            "estimatedMinutes": 10,
            "hazards": ["Battery Short Circuit", "Sharp Plastic Components"],
            "steps": [
                f"Ensure {deviceType} is fully powered off and disconnected from mains.",
                "Remove detachable batteries or peripheral cords.",
                "Separate glass/display units carefully without puncturing internal cells.",
                "Deposit electronics in designated EvoBin collection points."
            ]
        }
    else:
        guide["_id"] = str(guide["_id"])

    return {"data": guide}

@router.post("/content/{id}/view")
async def track_content_view(id: str):
    await db.education_content.update_one(
        {"$or": [{"id": id}, {"_id": id}]},
        {"$inc": {"views": 1}}
    )
    return {"message": "View tracked"}
