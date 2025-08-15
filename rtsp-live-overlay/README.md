# RTSP Livestream Landing Page with Overlays (Flask + React + MongoDB)

This project satisfies the assignment requirements:

- **Play livestream** from RTSP (converted to HLS for browser playback)
- **Basic controls**: play/pause and volume
- **Overlay options**: add text/image overlays, drag/resize
- **CRUD API** for overlays and player settings (HLS URL, volume)
- **Tech stack**: Python (Flask), MongoDB, React, HLS.js

## Architecture

Browsers cannot play RTSP directly, so we convert **RTSP → HLS (.m3u8)** using FFmpeg, then play HLS with **hls.js**.

```
RTSP camera/URL → FFmpeg (RTSP→HLS) → Static HTTP server → React player (hls.js)
                                             ↑
                                    Flask API + MongoDB (overlays/settings)
```

## Quickstart (Dev)

### 1) Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# Export env
export MONGODB_URI="mongodb://localhost:27017"
export MONGODB_DB="rtsp_overlay"
export PORT=5001
python app.py
```

### 2) Frontend

```bash
cd frontend
npm i
npm run dev
```

### 3) RTSP → HLS (example)

```bash
mkdir -p hls
ffmpeg -rtsp_transport tcp -i INPUT_RTSP   -fflags nobuffer -flags low_delay -preset veryfast -tune zerolatency   -c:v libx264 -g 48 -keyint_min 48 -x264-params "scenecut=0:open_gop=0"   -c:a aac -b:a 128k   -f hls -hls_time 2 -hls_list_size 5 -hls_flags delete_segments+independent_segments   hls/stream.m3u8
# Serve hls/ over http (e.g. python3 -m http.server 8000) and paste http://localhost:8000/hls/stream.m3u8 into the app.
```

## Notes
- If you already have an HLS URL from a service, paste it directly.
- For production, host the HLS output on Nginx/S3/CloudFront and deploy Flask behind a reverse proxy.
