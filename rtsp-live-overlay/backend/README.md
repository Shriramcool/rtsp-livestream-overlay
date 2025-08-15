# Backend (Flask + MongoDB)

## Quickstart

```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
export MONGODB_URI="mongodb://localhost:27017"
export MONGODB_DB="rtsp_overlay"
export PORT=5001
python app.py
```

API base: `http://localhost:5001/api`

### Endpoints
- `GET /api/health`
- `GET /api/overlays`
- `POST /api/overlays`
- `GET /api/overlays/:id`
- `PUT/PATCH /api/overlays/:id`
- `DELETE /api/overlays/:id`
- `GET /api/settings`
- `PUT/PATCH /api/settings`

## RTSP in the Browser
Browsers can't play RTSP natively. Convert RTSP -> HLS (`.m3u8`) or WebRTC.
Simple HLS pipeline with FFmpeg:

```bash
mkdir -p hls
ffmpeg -rtsp_transport tcp -i INPUT_RTSP   -fflags nobuffer -flags low_delay -preset veryfast -tune zerolatency   -c:v libx264 -g 48 -keyint_min 48 -x264-params "scenecut=0:open_gop=0"   -c:a aac -b:a 128k   -f hls -hls_time 2 -hls_list_size 5 -hls_flags delete_segments+independent_segments   hls/stream.m3u8

# Serve ./hls (e.g., python3 -m http.server 8000) and put the URL into Settings.hlsUrl
# Example: http://localhost:8000/hls/stream.m3u8
```
