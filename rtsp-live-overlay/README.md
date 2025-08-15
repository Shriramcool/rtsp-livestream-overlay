# RTSP Livestream Overlay App

A full-stack application that allows users to view a livestream from an RTSP URL, add custom overlays (logos or text), and manage them via a CRUD API.

---

## 📦 Project Overview
This app provides:
- A landing page to watch a livestream from an RTSP URL.
- Basic video controls (play, pause, volume).
- Ability to add custom overlays (text, logo) over the livestream.
- Backend CRUD API to store, retrieve, update, and delete overlay settings in MongoDB.

**Tech Stack:**
- **Backend:** Python (Flask), Flask-CORS, PyMongo
- **Frontend:** React
- **Database:** MongoDB
- **Streaming:** RTSP (via HTML5 video with RTSP proxy/stream service)

---

## 🏗 Project Structure

```
rtsp-livestream-overlay/
│
├── backend/
│   ├── app.py                 # Flask API server
│   ├── requirements.txt       # Backend dependencies
│   ├── .env.example           # Example env variables
│
├── frontend/
│   ├── src/                   # React app source
│   ├── package.json           # Frontend dependencies
│
├── .gitignore                 # Ignore unnecessary files
├── README.md                  # Project documentation
```

---

## ⚙️ Installation & Setup

### 1️⃣ Backend Setup (Flask API)

```bash
# Clone the repo
git clone https://github.com/your-username/rtsp-livestream-overlay.git
cd rtsp-livestream-overlay/backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate    # Mac/Linux
# OR
.venv\Scripts\activate       # Windows

# Install dependencies
pip install -r requirements.txt

# Set environment variables
# Create a .env file and add:
# MONGODB_URI=mongodb://localhost:27017
# FLASK_PORT=5001

# Run the backend
python app.py
```

The backend will start at **http://127.0.0.1:5001**

---

### 2️⃣ Frontend Setup (React App)

```bash
cd ../frontend

# Install dependencies
npm install

# Start the frontend
npm start
```

The frontend will start at **http://localhost:3000**

---

## 🔌 How to Run
1. Start the **backend** Flask API first.
2. Start the **frontend** React app.
3. Open `http://localhost:3000` in your browser.
4. Enter your RTSP stream URL and click play.

---

## 🌐 API Documentation

### **Base URL**
```
http://localhost:5001/api
```

---

### **1. Create Overlay**
**POST** `/overlays`
```json
{
  "type": "text",
  "content": "Live Stream",
  "position": { "x": 100, "y": 50 },
  "size": { "width": 200, "height": 50 }
}
```
**Response:**
```json
{
  "message": "Overlay created successfully",
  "id": "64c1d3..."
}
```

---

### **2. Get All Overlays**
**GET** `/overlays`
**Response:**
```json
[
  {
    "_id": "64c1d3...",
    "type": "text",
    "content": "Live Stream",
    "position": { "x": 100, "y": 50 },
    "size": { "width": 200, "height": 50 }
  }
]
```

---

### **3. Update Overlay**
**PUT** `/overlays/<overlay_id>`
```json
{
  "content": "Breaking News",
  "position": { "x": 120, "y": 60 }
}
```
**Response:**
```json
{
  "message": "Overlay updated successfully"
}
```

---

### **4. Delete Overlay**
**DELETE** `/overlays/<overlay_id>`
**Response:**
```json
{
  "message": "Overlay deleted successfully"
}
```

---

## 📽 Streaming Notes
RTSP is not natively supported by browsers.  
For development:
- Use a service like [rtsp.me](https://rtsp.me/) or [rtsp-stream.com](https://rtsp-stream.com/) to convert RTSP to WebRTC or HLS.
- Update the frontend video player with the generated playable URL.

---

## 📜 License
MIT License – free to use, modify, and distribute.
