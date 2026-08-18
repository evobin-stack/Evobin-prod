from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from typing import Optional, List
from app.database import db
from app.auth_utils import get_current_user, require_current_user
from datetime import datetime
import uuid

router = APIRouter()

@router.get("/posts")
async def get_community_posts():
    cursor = db.community_posts.find().sort("_id", -1)
    posts = await cursor.to_list(length=100)
    for p in posts:
        p["_id"] = str(p["_id"])
        if "id" not in p:
            p["id"] = p["_id"]
    return {"data": posts}

@router.post("/posts")
async def create_community_post(
    content: str = Form(...),
    user = Depends(require_current_user)
):
    user_id = str(user.get("_id", user.get("id")))
    new_post = {
        "id": f"post-{uuid.uuid4().hex[:8]}",
        "authorId": user_id,
        "authorName": user.get("name", "Eco User"),
        "authorAvatar": user.get("avatar", f"https://api.dicebear.com/7.x/avataaars/svg?seed={user.get('name')}"),
        "content": content,
        "likes": 0,
        "commentsCount": 0,
        "createdAt": "Just now",
        "timestamp": datetime.utcnow()
    }
    inserted = await db.community_posts.insert_one(new_post)
    new_post["_id"] = str(inserted.inserted_id)

    return {"data": new_post}

@router.post("/posts/{id}/like")
async def like_community_post(id: str):
    await db.community_posts.update_one(
        {"$or": [{"id": id}, {"_id": id}]},
        {"$inc": {"likes": 1}}
    )
    return {"message": "Liked post"}

@router.get("/posts/{id}/comments")
async def get_comments(id: str):
    cursor = db.comments.find({"postId": id}).sort("_id", 1)
    comments = await cursor.to_list(length=100)
    for c in comments:
        c["_id"] = str(c["_id"])
    return {"data": comments}

@router.post("/posts/{id}/comments")
async def add_comment(id: str, body: dict, user = Depends(get_current_user)):
    content = body.get("content", "")
    author_name = user.get("name") if user else "Anonymous Recycler"
    comment = {
        "id": f"comm-{uuid.uuid4().hex[:6]}",
        "postId": id,
        "authorName": author_name,
        "content": content,
        "createdAt": "Just now"
    }
    await db.comments.insert_one(comment)
    await db.community_posts.update_one(
        {"$or": [{"id": id}, {"_id": id}]},
        {"$inc": {"commentsCount": 1}}
    )
    return {"data": comment}

@router.get("/challenges")
async def get_challenges():
    cursor = db.challenges.find({"active": True})
    challenges = await cursor.to_list(length=50)
    for c in challenges:
        c["_id"] = str(c["_id"])
        if "id" not in c:
            c["id"] = c["_id"]
    return {"data": challenges}

@router.post("/challenges/{id}/join")
async def join_challenge(id: str, user = Depends(require_current_user)):
    await db.challenges.update_one(
        {"$or": [{"id": id}, {"_id": id}]},
        {"$inc": {"participantsCount": 1}}
    )
    return {"message": "Joined challenge successfully"}
