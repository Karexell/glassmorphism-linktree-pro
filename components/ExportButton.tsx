'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Check, Loader2 } from 'lucide-react'
import { EditorData } from '@/types'
import { exportZip } from '@/lib/exportZip'

interface Props {
  data: EditorData
}

export default function ExportButton({ data }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')

  const handleExport = async () => {
    setState('loading')
    try {
      await exportZip(data)
      setState('done')
      setTimeout(() => setState('idle'), 2000)
    } catch {
      setState('idle')
    }
  }

  return (
    <motion.button
      onClick={handleExport}
      disabled={state === 'loading'}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300"
      style={{
        background: state === 'done'
          ? 'rgba(16, 185, 129, 0.15)'
          : 'rgba(168, 130, 255, 0.1)',
        border: `1px solid ${state === 'done' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(168, 130, 255, 0.15)'}`,
        color: state === 'done' ? '#6ee7b7' : '#c4a8ff',
      }}
    >
      {state === 'idle' && <Download size={13} />}
      {state === 'loading' && <Loader2 size={13} className="animate-spin" />}
      {state === 'done' && <Check size={13} />}
      {state === 'loading' ? 'Generating...' : state === 'done' ? 'Downloaded!' : 'Export ZIP'}
    </motion.button>
  )
}
