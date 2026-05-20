'use client'

import { useRef } from 'react'
import { FloatingImage } from '@/types'
import { ImagePlus, Trash2 } from 'lucide-react'

interface Props {
  images: FloatingImage[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onAdd: (img: FloatingImage) => void
  onRemove: (id: string) => void
  onUpdate: (id: string, updates: Partial<FloatingImage>) => void
}

export default function ImageControls({ images, selectedId, onSelect, onAdd, onRemove, onUpdate }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const src = reader.result as string
      const img = new window.Image()
      img.onload = () => {
        const aspect = img.height / img.width
        const defaultW = 30
        onAdd({
          id: `img-${Date.now()}`,
          src,
          x: 35,
          y: 20,
          width: defaultW,
          borderRadius: 0,
          opacity: 100,
        })
      }
      img.src = src
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const selected = images.find(i => i.id === selectedId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button
        onClick={() => inputRef.current?.click()}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '10px 14px', background: 'rgba(168, 130, 255, 0.1)',
          border: '1px solid rgba(168, 130, 255, 0.25)', borderRadius: 10,
          color: '#a882ff', fontSize: 13, fontWeight: 500, cursor: 'pointer',
        }}
      >
        <ImagePlus size={16} /> Add Image
      </button>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />

      {images.length === 0 && (
        <p style={{ fontSize: 12, color: '#ffffff30', textAlign: 'center', padding: '8px 0' }}>No images added yet.</p>
      )}

      {images.map(img => (
        <div
          key={img.id}
          onClick={() => onSelect(img.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: 8, borderRadius: 10, cursor: 'pointer',
            background: img.id === selectedId ? 'rgba(168, 130, 255, 0.12)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${img.id === selectedId ? 'rgba(168, 130, 255, 0.35)' : 'rgba(255,255,255,0.06)'}`,
          }}
        >
          <img
            src={img.src}
            alt=""
            style={{
              width: 40, height: 40, objectFit: 'cover', borderRadius: 8, flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, color: '#ffffffcc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {img.width.toFixed(0)}% wide &middot; R{img.borderRadius}
            </div>
            <div style={{ fontSize: 11, color: '#ffffff40' }}>
              x:{img.x.toFixed(0)}% y:{img.y.toFixed(0)}%
            </div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onRemove(img.id) }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 6,
              color: '#ef4444', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}

      {selected && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '10px 8px', background: 'rgba(168, 130, 255, 0.06)', borderRadius: 10, border: '1px solid rgba(168, 130, 255, 0.15)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#a882ff', marginBottom: 2 }}>Selected Image</div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, color: '#ffffff60' }}>Corner Radius: {selected.borderRadius}px</span>
            <input type="range" min={0} max={100} value={selected.borderRadius} onChange={e => onUpdate(selected.id, { borderRadius: Number(e.target.value) })} style={{ accentColor: '#a882ff' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, color: '#ffffff60' }}>Opacity: {selected.opacity}%</span>
            <input type="range" min={10} max={100} value={selected.opacity} onChange={e => onUpdate(selected.id, { opacity: Number(e.target.value) })} style={{ accentColor: '#a882ff' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, color: '#ffffff60' }}>Width: {selected.width.toFixed(1)}%</span>
            <input type="range" min={5} max={100} step={0.5} value={selected.width} onChange={e => onUpdate(selected.id, { width: Number(e.target.value) })} style={{ accentColor: '#a882ff' }} />
          </label>
        </div>
      )}
    </div>
  )
}
