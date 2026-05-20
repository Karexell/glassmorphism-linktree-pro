'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Share2, Copy, Link, Check } from 'lucide-react'
import { hexToRgba } from '@/lib/templateConfig'

interface Props {
  url: string
  shareText?: string
  shareIcon?: 'share' | 'copy' | 'link'
  shareButtonColor?: string
  shareButtonTextColor?: string
  iconRadius?: number
}

export default function ShareButton({
  url,
  shareText = '',
  shareIcon = 'copy',
  shareButtonColor = '#ffffff',
  shareButtonTextColor = '#ffffff',
  iconRadius = 12,
}: Props) {
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (shareIcon === 'share' && navigator.share) {
      try {
        await navigator.share({ url })
        return
      } catch {
        // fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const IconComp = shareIcon === 'copy' ? Copy : shareIcon === 'link' ? Link : Share2

  return (
    <div ref={ref} className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
      <motion.button
        onClick={handleShare}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        title={copied ? 'Copied!' : shareText || 'Copy link'}
        className="inline-flex items-center justify-center w-7 h-7 transition-all duration-200"
        style={{
          background: copied
            ? 'rgba(16, 185, 129, 0.15)'
            : hexToRgba(shareButtonColor, 0.08),
          border: `1px solid ${copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`,
          borderRadius: `${Math.max(iconRadius - 2, 6)}px`,
          color: copied ? '#6ee7b7' : (shareButtonTextColor || '#ffffff'),
        }}
      >
        {copied ? (
          <Check size={12} />
        ) : (
          <IconComp size={12} />
        )}
      </motion.button>
    </div>
  )
}
