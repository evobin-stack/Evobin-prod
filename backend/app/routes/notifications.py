from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from typing import List
from app.database import db
from app.auth_utils import require_current_user

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

ws_manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_notifications(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({"type": "ack", "message": "Notification socket active", "payload": data})
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

@router.get("")
@router.get("/")
async def get_notifications(user = Depends(require_current_user)):
    user_id = str(user.get("_id", user.get("id")))
    cursor = db.notifications.find({"$or": [{"userId": user_id}, {"userId": "all"}]}).sort("_id", -1)
    notifs = await cursor.to_list(length=50)

    for n in notifs:
        n["_id"] = str(n["_id"])
        if "id" not in n:
            n["id"] = n["_id"]

    return {"data": notifs}

@router.put("/{id}/read")
async def mark_as_read(id: str, user = Depends(require_current_user)):
    await db.notifications.update_one(
        {"$or": [{"id": id}, {"_id": id}]},
        {"$set": {"read": True}}
    )
    return {"message": "Notification marked as read"}

@router.put("/read-all")
async def mark_all_as_read(user = Depends(require_current_user)):
    user_id = str(user.get("_id", user.get("id")))
    await db.notifications.update_many(
        {"$or": [{"userId": user_id}, {"userId": "all"}]},
        {"$set": {"read": True}}
    )
    return {"message": "All notifications marked as read"}

@router.delete("/{id}")
async def delete_notification(id: str, user = Depends(require_current_user)):
    await db.notifications.delete_one({"$or": [{"id": id}, {"_id": id}]})
    return {"message": "Notification deleted"}

