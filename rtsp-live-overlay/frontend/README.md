# Frontend (React + Vite)

## Quickstart

```bash
cd frontend
npm i
npm run dev
```

Vite dev server runs on http://localhost:5173 and proxies /api to the Flask backend.

In the top bar, paste your HLS `.m3u8` URL (produced by converting RTSP via FFmpeg) and click **Save Settings**. Then hit **Play**.

### Overlays
- Use the editor panel to add **Text** or **Image** overlays.
- Drag and resize in the preview. Click **Save** to persist to MongoDB.
- Saved overlays render on top of the live video in real time.
