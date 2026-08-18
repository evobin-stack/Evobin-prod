from fastapi import APIRouter, HTTPException, Depends
from app.database import db
from app.auth_utils import require_current_user
from datetime import datetime
import uuid

router = APIRouter()

@router.get("")
@router.get("/")
async def get_rewards():
    cursor = db.rewards.find()
    rewards = await cursor.to_list(length=100)
    for r in rewards:
        r["_id"] = str(r["_id"])
        if "id" not in r:
            r["id"] = r["_id"]
    return {"data": rewards}

@router.get("/points")
async def get_user_points(user = Depends(require_current_user)):
    return {
        "data": {
            "points": user.get("points", 0),
            "pending": 50
        }
    }

@router.post("/{id}/redeem")
async def redeem_reward(id: str, user = Depends(require_current_user)):
    reward = await db.rewards.find_one({"$or": [{"id": id}, {"_id": id}]})
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")

    points_required = reward.get("pointsRequired", 500)
    user_points = user.get("points", 0)

    if user_points < points_required:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient points balance ({user_points}/{points_required})"
        )

    # Deduct user points
    user_id = str(user.get("_id", user.get("id")))
    from bson import ObjectId
    await db.users.update_one(
        {"_id": ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id},
        {"$inc": {"points": -points_required}}
    )

    redemption_record = {
        "id": f"red-{uuid.uuid4().hex[:8]}",
        "userId": user_id,
        "rewardId": reward["id"],
        "rewardTitle": reward["title"],
        "pointsSpent": points_required,
        "code": reward.get("code", "EVOBIN-VOUCHER-2026"),
        "redeemedAt": datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
        "status": "Active"
    }

    await db.redemptions.insert_one(redemption_record)

    # Insert notification
    await db.notifications.insert_one({
        "id": f"notif-{uuid.uuid4().hex[:6]}",
        "userId": user_id,
        "title": "Reward Redeemed!",
        "message": f"You redeemed {reward['title']} for {points_required} points. Code: {redemption_record['code']}",
        "read": False,
        "createdAt": "Just now",
        "type": "reward"
    })

    return {
        "success": True,
        "data": redemption_record,
        "message": f"Successfully redeemed {reward['title']}!"
    }

@router.get("/redemptions")
async def get_user_redemptions(user = Depends(require_current_user)):
    user_id = str(user.get("_id", user.get("id")))
    cursor = db.redemptions.find({"userId": user_id}).sort("_id", -1)
    redemptions = await cursor.to_list(length=100)
    for r in redemptions:
        r["_id"] = str(r["_id"])
    return {"data": redemptions}
