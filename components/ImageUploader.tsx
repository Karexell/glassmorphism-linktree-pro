'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, X } from 'lucide-react'

interface Props {
  value: string
  onChange: (v: string) => void
  label: string
  placeholder: string
  shape: 'circle' | 'rounded' | 'square'
  compact?: boolean
}

export default function ImageUploader({ value, onChange, label, placeholder, shape, compact }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const radius = shape === 'circle' ? '9999px' : shape === 'square' ? '10px' : '14px'

  return (
    <div>
      {label && <label className="text-xs text-white/40 mb-1.5 block">{label}</label>}
      {value ? (
        <div className="relative group">
          <div
            className={`overflow-hidden border border-white/10 ${compact ? 'w-12 h-12' : 'w-full max-h-32'}`}
            style={{ borderRadius: radius }}
          >
            <img
              src={value}
              alt=""
              className="w-full h-full object-cover"
              style={{ borderRadius: radius }}
            />
          </div>
          <button
            onClick={() => onChange('')}
            className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition border border-white/10"
          >
            <X size={10} className="text-white/80" />
          </button>
        </div>
      ) : (
        <motion.button
          type="button"
          onClick={() => inputRef.current?.click()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02] hover:bg-white/[0.04] transition text-xs text-white/25 hover:text-white/40 ${compact ? 'py-2' : 'py-3'}`}
        >
          <Upload size={13} />
          {placeholder}
        </motion.button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  )
}
