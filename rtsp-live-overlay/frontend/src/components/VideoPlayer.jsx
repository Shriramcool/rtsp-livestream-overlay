import React, { useEffect, useRef } from 'react'
import Hls from 'hls.js'

export default function VideoPlayer({ src, volume, playing, onTogglePlay, onVolume }) {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    if (Hls.isSupported()) {
      if (hlsRef.current) hlsRef.current.destroy()
      const hls = new Hls({ maxBufferLength: 10 })
      hlsRef.current = hls
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (playing) video.play()
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      if (playing) video.play()
    }

    return () => { if (hlsRef.current) hlsRef.current.destroy() }
  }, [src])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.volume = volume ?? 0.7
  }, [volume])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (playing) video.play()
    else video.pause()
  }, [playing])

  return (
    <div className="card">
      <div className="video-wrap">
        <video ref={videoRef} controls playsInline />
      </div>
      <div className="toolbar" style={{ marginTop: 8 }}>
        <button onClick={onTogglePlay}>{playing ? 'Pause' : 'Play'}</button>
        <div style={{ width: 160 }}>
          <label>Volume: {Math.round(volume * 100)}%</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolume(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  )
}
