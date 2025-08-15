import React, { useEffect, useState } from 'react'
import VideoPlayer from './components/VideoPlayer.jsx'
import OverlayEditor from './components/OverlayEditor.jsx'
import { OverlaysAPI, SettingsAPI } from './api.js'

export default function App() {
  const [hlsUrl, setHlsUrl] = useState('')
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [overlays, setOverlays] = useState([])

  useEffect(() => {
    (async () => {
      const s = await SettingsAPI.get()
      setVolume(s.volume ?? 0.7)
      setHlsUrl(s.hlsUrl ?? '')
      const list = await OverlaysAPI.list()
      setOverlays(list)
    })()
  }, [])

  const handleSaveOverlay = async (item, idx) => {
    const payload = {
      name: item.name, type: item.type, content: item.content,
      x: item.x, y: item.y, width: item.width, height: item.height, style: item.style
    }
    let saved
    if (item._id) saved = await OverlaysAPI.update(item._id, payload)
    else saved = await OverlaysAPI.create(payload)
    setOverlays(prev => prev.map((it, i) => i === idx ? saved : it))
  }

  const handleDeleteOverlay = async (id, idx) => {
    await OverlaysAPI.remove(id)
    setOverlays(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSaveSettings = async () => {
    const s = await SettingsAPI.save({ hlsUrl, volume })
    setHlsUrl(s.hlsUrl ?? '')
    setVolume(s.volume ?? 0.7)
  }

  return (
    <div>
      <header>
        <div className="brand">RTSP Livestream + Overlays</div>
        <div className="toolbar">
          <input style={{ width: 320 }} value={hlsUrl} onChange={(e) => setHlsUrl(e.target.value)} placeholder="HLS .m3u8 URL" />
          <button onClick={handleSaveSettings}>Save Settings</button>
        </div>
      </header>

      <div className="container">
        <div>
          <div className="card">
            <div className="video-wrap">
              <video id="live-video" style={{ width: '100%', height: '100%' }} />
              <div className="overlay-surface">
                {overlays.map((it, idx) => (
                    <div key={idx} style={{ position: 'absolute', left: it.x, top: it.y, width: it.width, height: it.height }}>
                      {it.type === 'text' ? (
                        <div
                          className="text-content"
                          style={{ color: it.style?.color, background: it.style?.background, opacity: it.style?.opacity, fontSize: it.style?.fontSize }}
                        >
                          {it.content}
                        </div>
                      ) : (
                        <img className="image-content" src={it.content} alt={it.name} style={{ opacity: it.style?.opacity }} />
                      )}
                    </div>
                ))}
              </div>
            </div>
            <div className="toolbar" style={{ marginTop: 8 }}>
              <button onClick={() => setPlaying(p => !p)}>{playing ? 'Pause' : 'Play'}</button>
              <div style={{ width: 160 }}>
                <label>Volume: {Math.round(volume * 100)}%</label>
                <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
              </div>
            </div>
          </div>

          {/* The actual player instance with HLS.js */}
          <VideoPlayer
            key={hlsUrl}
            src={hlsUrl}
            volume={volume}
            playing={playing}
            onTogglePlay={() => setPlaying(p => !p)}
            onVolume={setVolume}
          />
        </div>

        <div>
          <OverlayEditor
            items={overlays}
            setItems={setOverlays}
            onSave={handleSaveOverlay}
            onDelete={handleDeleteOverlay}
          />
        </div>
      </div>

      <footer>Paste your HLS (.m3u8) URL above. Convert RTSP to HLS via FFmpeg. Overlays are persisted in MongoDB.</footer>
    </div>
  )
}
