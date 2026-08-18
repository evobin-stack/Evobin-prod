from fastapi import APIRouter, Query, HTTPException
from app.database import db
from typing import Optional

router = APIRouter()

@router.get("/nearby")
async def get_nearby_centers(
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    radius: Optional[float] = Query(10.0)
):
    cursor = db.centers.find()
    centers = await cursor.to_list(length=100)
    for c in centers:
        c["_id"] = str(c["_id"])
        if "id" not in c:
            c["id"] = c["_id"]
    return {"data": centers}

@router.get("/search")
async def search_centers(query: Optional[str] = ""):
    filter_query = {}
    if query:
        filter_query = {
            "$or": [
                {"name": {"$regex": query, "$options": "i"}},
                {"address": {"$regex": query, "$options": "i"}},
                {"acceptedTypes": {"$regex": query, "$options": "i"}}
            ]
        }
    cursor = db.centers.find(filter_query)
    centers = await cursor.to_list(length=100)
    for c in centers:
        c["_id"] = str(c["_id"])
        if "id" not in c:
            c["id"] = c["_id"]
    return {"data": centers}

@router.get("/{id}")
async def get_center_details(id: str):
    center = await db.centers.find_one({"$or": [{"id": id}, {"_id": id}]})
    if not center:
        raise HTTPException(status_code=404, detail="Collection center not found")
    center["_id"] = str(center["_id"])
    return {"data": center}

@router.post("/{id}/review")
async def submit_center_review(id: str, review: dict):
    await db.centers.update_one(
        {"$or": [{"id": id}, {"_id": id}]},
        {"$inc": {"reviewCount": 1}}
    )
    return {"message": "Review submitted successfully"}
