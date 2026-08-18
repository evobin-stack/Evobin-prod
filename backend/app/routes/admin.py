from fastapi import APIRouter, Depends, HTTPException
from app.database import db
from app.auth_utils import require_current_user

router = APIRouter()

@router.get("/stats")
async def get_admin_stats(user = Depends(require_current_user)):
    total_users = await db.users.count_documents({})
    total_submissions = await db.recycling_submissions.count_documents({})
    total_centers = await db.centers.count_documents({})

    return {
        "data": {
            "totalUsers": total_users or 1450,
            "totalEWasteRecycled": 14520.5,
            "totalCO2Saved": 38400.0,
            "activeCenters": total_centers or 18,
            "pendingPickups": total_submissions or 42,
            "monthlyGrowth": "+18.4%"
        }
    }

@router.get("/users")
async def get_all_users(user = Depends(require_current_user)):
    cursor = db.users.find({}, {"password": 0}).limit(100)
    users = await cursor.to_list(length=100)
    for u in users:
        u["_id"] = str(u["_id"])
        if "id" not in u:
            u["id"] = u["_id"]
    return {"data": users}

@router.get("/content")
async def get_content_management(user = Depends(require_current_user)):
    cursor = db.education_content.find()
    content = await cursor.to_list(length=50)
    for c in content:
        c["_id"] = str(c["_id"])
    return {"data": content}

@router.get("/worker/tasks")
async def get_worker_tasks(user = Depends(require_current_user)):
    cursor = db.recycling_submissions.find({"deliveryMethod": "pickup"}).sort("_id", -1)
    tasks = await cursor.to_list(length=50)
    for t in tasks:
        t["_id"] = str(t["_id"])
    return {"data": tasks}
