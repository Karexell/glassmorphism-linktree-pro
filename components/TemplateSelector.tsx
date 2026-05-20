'use client'

import { motion } from 'framer-motion'
import { TemplateId } from '@/types'

const templates: { id: TemplateId; name: string; gradient: string; glow: string }[] = [
  {
    id: 'cosmic',
    name: 'Cosmic',
    gradient: 'from-[#a882ff] to-[#6c5ce7]',
    glow: 'rgba(168, 130, 255, 0.3)',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    gradient: 'from-[#06d6a0] to-[#118ab2]',
    glow: 'rgba(6, 214, 160, 0.3)',
  },
  {
    id: 'nebula',
    name: 'Nebula',
    gradient: 'from-[#ff6b9d] to-[#c44dff]',
    glow: 'rgba(255, 107, 157, 0.3)',
  },
]

interface Props {
  selected: TemplateId
  onSelect: (id: TemplateId) => void
}

export default function TemplateSelector({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-2">
      {templates.map((t) => (
        <motion.button
          key={t.id}
          onClick={() => onSelect(t.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 ${
            selected === t.id
              ? 'bg-white/[0.08] border border-white/[0.15]'
              : 'bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05]'
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full bg-gradient-to-br ${t.gradient}`}
            style={selected === t.id ? { boxShadow: `0 0 10px ${t.glow}` } : {}}
          />
          <span className="text-[11px] text-white/50 font-medium">{t.name}</span>
        </motion.button>
      ))}
    </div>
  )
}
