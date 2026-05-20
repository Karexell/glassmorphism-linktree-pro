'use client'

import { motion } from 'framer-motion'
import { TemplateProps } from '@/types'
import { getTheme, hexToRgba } from '@/lib/templateConfig'
import {
  Globe, Github, Twitter, Instagram, Youtube, Music,
  Mail, Link, ExternalLink, Linkedin, Twitch, Send
} from 'lucide-react'
import ShareButton from '@/components/ShareButton'

const iconMap: Record<string, React.ComponentType<any>> = {
  globe: Globe, github: Github, twitter: Twitter,
  instagram: Instagram, youtube: Youtube, music: Music,
  mail: Mail, link: Link, external: ExternalLink,
  linkedin: Linkedin, twitch: Twitch, send: Send,
}

export default function CosmicTemplate({ data }: TemplateProps) {
  const theme = getTheme(data.templateId)

  const glassBorderOpacity = (data.glassBorder ?? 6) / 100
  const bgDim = (data.backgroundDim ?? 50) / 100

  const glassStyle = {
    background: hexToRgba(data.glassTint || '#ffffff', data.glassOpacity / 100),
    backdropFilter: `blur(${data.blurIntensity}px)`,
    WebkitBackdropFilter: `blur(${data.blurIntensity}px)`,
    border: `1px solid rgba(255, 255, 255, ${glassBorderOpacity})`,
    borderRadius: `${data.cardRadius || 20}px`,
  }

  const textColor = data.textColor || '#ffffff'

  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center p-4 relative overflow-hidden grain"
      style={{ background: '#030008' }}
    >
      {/* Ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [-30, 30, -30], x: [-15, 15, -15], scale: [1, 1.08, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full"
          style={{ background: theme.orbColors[0], filter: 'blur(80px)' }}
        />
        <motion.div
          animate={{ y: [20, -30, 20], x: [10, -15, 10], scale: [1, 1.05, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ background: theme.orbColors[1], filter: 'blur(80px)' }}
        />
        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(circle, ${theme.orbColors[0]}, transparent 70%)`, filter: 'blur(60px)' }}
        />
      </div>

      {data.backgroundUrl && data.backgroundType === 'video' ? (
        <video
          src={data.backgroundUrl}
          autoPlay
          muted
          playsInline
          loop={data.videoLoop}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: bgDim }}
        />
      ) : data.backgroundUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ opacity: bgDim, backgroundImage: `url(${data.backgroundUrl})` }}
        />
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Profile Card */}
        <motion.div
          style={glassStyle}
          className="p-6 sm:p-8 mb-4 text-center"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          {/* Avatar */}
          <div className="inline-block mb-5">
            {data.avatarUrl ? (
              <motion.img
                src={data.avatarUrl}
                alt={data.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover border border-white/[0.08]"
                style={{ borderRadius: data.avatarRadius === 9999 ? '9999px' : `${data.avatarRadius}px` }}
                whileHover={{ scale: 1.05 }}
              />
            ) : (
              <motion.div
                className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-2xl sm:text-3xl font-bold"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  background: `linear-gradient(145deg, #1a1030, #0a0618)`,
                  borderRadius: data.avatarRadius === 9999 ? '9999px' : `${data.avatarRadius}px`,
                  color: theme.accent,
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
                whileHover={{ scale: 1.05 }}
              >
                {(data.name || '?').charAt(0).toUpperCase()}
              </motion.div>
            )}
          </div>

          <h1
            className="text-xl sm:text-2xl font-bold mb-2"
            style={{
              fontFamily: "'Syne', sans-serif",
              color: textColor,
              textShadow: `0 0 40px ${theme.nameGlow}`,
              letterSpacing: '-0.03em',
            }}
          >
            {data.name || 'Your Name'}
          </h1>
          <p
            className="text-xs sm:text-sm leading-relaxed max-w-xs mx-auto"
            style={{ color: `${textColor}80`, fontWeight: 300, letterSpacing: '0.01em' }}
          >
            {data.bio || 'Your bio goes here'}
          </p>
        </motion.div>

        {/* Folders */}
        {data.folders.map((folder) => (
          <div key={folder.id} className="mb-4">
            {folder.name && (
              <h2
                className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-2 px-1"
                style={{ color: data.folderNameColor || `${textColor}40` }}
              >
                {folder.name}
              </h2>
            )}
            <div className="space-y-2">
              {folder.links.map((link, i) => {
                const IconComp = iconMap[link.icon || 'globe'] || Globe
                return (
                  <motion.a
                    key={link.id}
                    href={link.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ ...glassStyle, borderRadius: `${(data.iconRadius || 12) + 8}px` }}
                    className="flex items-center gap-3.5 p-3.5 sm:p-4 cursor-pointer group transition-all duration-300 hover:border-white/[0.15]"
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center overflow-hidden flex-shrink-0"
                      style={{ background: link.customIcon ? 'transparent' : theme.iconBg, borderRadius: `${data.iconRadius || 12}px` }}
                    >
                      {link.customIcon ? (
                        <img src={link.customIcon} alt="" className="w-full h-full object-cover" style={{ borderRadius: `${data.iconRadius || 12}px` }} />
                      ) : (
                        <IconComp size={17} style={{ color: theme.accent }} />
                      )}
                    </div>
                    <span className="flex-1 font-medium text-sm" style={{ color: `${textColor}E6` }}>{link.title || 'Link'}</span>
                    <ShareButton
                      url={link.url}
                      shareText={link.shareText}
                      shareIcon={link.shareIcon || 'copy'}
                      shareButtonColor={link.shareButtonColor}
                      shareButtonTextColor={link.shareButtonTextColor}
                      iconRadius={data.iconRadius}
                    />
                    <ExternalLink size={13} style={{ color: `${textColor}30` }} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                  </motion.a>
                )
              })}
            </div>
          </div>
        ))}

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-[10px] mt-6"
          style={{ color: `${textColor}20`, letterSpacing: '0.06em' }}
        >
          Built with Glass Links
        </motion.p>
      </motion.div>
    </div>
  )
}
