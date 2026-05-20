'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Check, Loader2 } from 'lucide-react'

export default function ScreenshotButton() {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')

  const takeScreenshot = async () => {
    setState('loading')
    try {
      const { default: html2canvas } = await import('html2canvas-pro')

      const previewEls = document.querySelectorAll('[data-preview="true"]')
      let el: HTMLElement | null = null

      for (let i = 0; i < previewEls.length; i++) {
        const rect = previewEls[i].getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          el = previewEls[i].querySelector('[class*="min-h-"]') as HTMLElement
          if (el) break
        }
      }

      if (!el) {
        setState('idle')
        return
      }

      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#030008',
        useCORS: true,
        allowTaint: true,
        width: el.scrollWidth,
        height: el.scrollHeight,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
      })

      const link = document.createElement('a')
      link.download = 'glass-links-preview.png'
      link.href = canvas.toDataURL('image/png')
      link.click()

      setState('done')
      setTimeout(() => setState('idle'), 2000)
    } catch {
      setState('idle')
    }
  }

  return (
    <motion.button
      onClick={takeScreenshot}
      disabled={state === 'loading'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] text-xs text-white/40 hover:text-white/70 transition disabled:opacity-50"
    >
      {state === 'loading' ? (
        <Loader2 size={13} className="animate-spin" />
      ) : state === 'done' ? (
        <Check size={13} className="text-green-400" />
      ) : (
        <Camera size={13} />
      )}
      <span className="hidden sm:inline">
        {state === 'done' ? 'Saved' : 'Screenshot'}
      </span>
    </motion.button>
  )
}
