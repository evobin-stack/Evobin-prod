from fastapi import APIRouter
from app.database import db
from bson import ObjectId

router = APIRouter()

@router.get("")
@router.get("/")
async def get_leaderboard():
    cursor = db.users.find({}, {"password": 0}).sort("points", -1).limit(50)
    users = await cursor.to_list(length=50)

    leaderboard = []
    for rank, u in enumerate(users, start=1):
        leaderboard.append({
            "rank": rank,
            "id": str(u.get("_id", u.get("id"))),
            "userId": str(u.get("_id", u.get("id"))),
            "name": u.get("name", "Eco Warrior"),
            "avatar": u.get("avatar", "https://api.dicebear.com/7.x/avataaars/svg?seed=User"),
            "points": u.get("points", 0),
            "recycledItems": int(u.get("totalRecycled", 0)),
            "co2Saved": u.get("co2Saved", 0.0),
            "badge": u.get("badges", ["Recycler"])[0] if u.get("badges") else "Eco Member"
        })

    return {"data": leaderboard}

@router.get("/user/{userId}")
async def get_user_rank(userId: str):
    query_id = ObjectId(userId) if ObjectId.is_valid(userId) else userId
    user = await db.users.find_one({"$or": [{"id": userId}, {"_id": query_id}]})

    if not user:
        return {"data": {"rank": 42, "points": 0, "name": "Guest"}}

    count = await db.users.count_documents({"points": {"$gt": user.get("points", 0)}})
    user_rank = count + 1

    return {
        "data": {
            "rank": user_rank,
            "id": str(user.get("_id", user.get("id"))),
            "name": user.get("name"),
            "points": user.get("points", 0),
            "recycledItems": int(user.get("totalRecycled", 0)),
            "co2Saved": user.get("co2Saved", 0.0)
        }
    }
