import React from 'react'
import { Rnd } from 'react-rnd'

export default function OverlayEditor({ items, setItems, onSave, onDelete }) {
  const addText = () => {
    setItems(prev => [...prev, {
      _id: undefined,
      name: 'Text Overlay',
      type: 'text',
      content: 'Sample Text',
      x: 40, y: 40, width: 240, height: 80,
      style: { color: '#ffffff', background: 'transparent', opacity: 1, fontSize: 20 }
    }])
  }
  const addImage = () => {
    const url = prompt('Image URL (PNG/JPG/SVG):')
    if (!url) return
    setItems(prev => [...prev, {
      _id: undefined,
      name: 'Logo',
      type: 'image',
      content: url,
      x: 60, y: 60, width: 160, height: 100,
      style: { opacity: 1 }
    }])
  }

  const updateItem = (idx, patch) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, ...patch } : it))
  }

  return (
    <div className="card">
      <div className="toolbar" style={{ marginBottom: 8 }}>
        <button onClick={addText}>+ Text</button>
        <button onClick={addImage}>+ Image</button>
      </div>

      <div className="small" style={{ marginBottom: 8 }}>
        Drag/resize overlays on the video. Click an item below to rename, edit content, save or delete.
      </div>

      <div className="list">
        {items.map((it, idx) => (
          <div key={idx} className="row">
            <div style={{ display: 'grid' }}>
              <strong>{it.name}</strong>
              <span className="small">{it.type} {it._id ? '· saved' : '· unsaved'}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                style={{ width: 140 }}
                value={it.name}
                onChange={(e) => updateItem(idx, { name: e.target.value })}
                placeholder="Name"
              />
              {it.type === 'text' ? (
                <input
                  style={{ width: 160 }}
                  value={it.content}
                  onChange={(e) => updateItem(idx, { content: e.target.value })}
                  placeholder="Text"
                />
              ) : (
                <input
                  style={{ width: 200 }}
                  value={it.content}
                  onChange={(e) => updateItem(idx, { content: e.target.value })}
                  placeholder="Image URL"
                />
              )}
              <button onClick={() => onSave(it, idx)}>{it._id ? 'Update' : 'Save'}</button>
              {it._id && <button onClick={() => onDelete(it._id, idx)}>Delete</button>}
            </div>
          </div>
        ))}
      </div>

      {/* Overlay Surface Preview */}
      <div className="video-wrap" style={{ marginTop: 12 }}>
        <div className="overlay-surface">
          {items.map((it, idx) => (
            <Rnd
              key={idx}
              bounds="parent"
              size={{ width: it.width,  height: it.height }}
              position={{ x: it.x, y: it.y }}
              onDragStop={(e, d) => updateItem(idx, { x: d.x, y: d.y })}
              onResizeStop={(e, dir, ref, delta, pos) => {
                updateItem(idx, { width: parseFloat(ref.style.width), height: parseFloat(ref.style.height), x: pos.x, y: pos.y })
              }}
              className="overlay-item"
            >
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
            </Rnd>
          ))}
        </div>
      </div>
    </div>
  )
}
