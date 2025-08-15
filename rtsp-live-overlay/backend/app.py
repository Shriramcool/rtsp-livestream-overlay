from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import os

def to_json(doc):
    if doc is None:
        return None
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "rtsp_overlay")
PORT = int(os.getenv("PORT", "5001"))

app = Flask(__name__)
CORS(app)

client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB]
overlays = db["overlays"]
settings = db["settings"]

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "time": datetime.utcnow().isoformat()})

# -------- Overlay CRUD --------

@app.route("/api/overlays", methods=["POST"])
def create_overlay():
    data = request.get_json(force=True)
    now = datetime.utcnow()
    doc = {
        "name": data.get("name", "overlay"),
        "type": data.get("type", "text"),  # "text" | "image"
        "content": data.get("content", ""),
        "x": float(data.get("x", 50)),
        "y": float(data.get("y", 50)),
        "width": float(data.get("width", 200)),
        "height": float(data.get("height", 80)),
        "style": data.get("style", { "color": "#ffffff", "background": "transparent", "opacity": 1.0, "fontSize": 18 }),
        "createdAt": now,
        "updatedAt": now
    }
    res = overlays.insert_one(doc)
    created = overlays.find_one({"_id": res.inserted_id})
    return jsonify(to_json(created)), 201

@app.route("/api/overlays", methods=["GET"])
def list_overlays():
    items = [to_json(doc) for doc in overlays.find({}).sort("createdAt", -1)]
    return jsonify(items), 200

@app.route("/api/overlays/<oid>", methods=["GET"])
def get_overlay(oid):
    try:
        doc = overlays.find_one({"_id": ObjectId(oid)})
        if not doc:
            return jsonify({"error": "Not found"}), 404
        return jsonify(to_json(doc)), 200
    except Exception:
        return jsonify({"error": "Invalid id"}), 400

@app.route("/api/overlays/<oid>", methods=["PUT", "PATCH"])
def update_overlay(oid):
    data = request.get_json(force=True)
    try:
        upd = {k: v for k, v in data.items() if k in ["name","type","content","x","y","width","height","style"]}
        upd["updatedAt"] = datetime.utcnow()
        res = overlays.update_one({"_id": ObjectId(oid)}, {"$set": upd})
        if res.matched_count == 0:
            return jsonify({"error": "Not found"}), 404
        doc = overlays.find_one({"_id": ObjectId(oid)})
        return jsonify(to_json(doc)), 200
    except Exception:
        return jsonify({"error": "Invalid id"}), 400

@app.route("/api/overlays/<oid>", methods=["DELETE"])
def delete_overlay(oid):
    try:
        res = overlays.delete_one({"_id": ObjectId(oid)})
        if res.deleted_count == 0:
            return jsonify({"error": "Not found"}), 404
        return jsonify({"ok": True}), 200
    except Exception:
        return jsonify({"error": "Invalid id"}), 400

# -------- Player settings (e.g., default volume, HLS URL) --------

@app.route("/api/settings", methods=["GET"])
def get_settings():
    doc = settings.find_one({"_id": "player"})
    if not doc:
        doc = {"_id": "player", "volume": 0.7, "hlsUrl": ""}
        settings.insert_one(doc)
    return jsonify(to_json(doc)), 200

@app.route("/api/settings", methods=["PUT", "PATCH"])
def update_settings():
    data = request.get_json(force=True)
    doc = settings.find_one({"_id": "player"}) or {"_id": "player"}
    if "volume" in data:
        doc["volume"] = max(0.0, min(1.0, float(data["volume"])))
    if "hlsUrl" in data:
        doc["hlsUrl"] = str(data["hlsUrl"])
    settings.replace_one({"_id": "player"}, doc, upsert=True)
    return jsonify(to_json(doc)), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)
