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

export default function AuroraTemplate({ data }: TemplateProps) {
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
      {/* Aurora waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, ${theme.orbColors[0]} 15%, transparent 30%, ${theme.orbColors[1]} 45%, transparent 60%, ${theme.orbColors[0]} 75%, transparent 90%)`,
          }}
        />
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], y: [-20, 20, -20] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-0 right-0 h-2/3"
          style={{ background: `linear-gradient(180deg, ${theme.orbColors[0]}, transparent)` }}
        />
        <motion.div
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{ background: `linear-gradient(0deg, ${theme.orbColors[1]}, transparent)` }}
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
          className="p-5 sm:p-7 mb-5 text-center"
          whileHover={{ scale: 1.01 }}
        >
          <div className="inline-block mb-4">
            {data.avatarUrl ? (
              <img
                src={data.avatarUrl}
                alt={data.name}
                className="w-18 h-18 sm:w-20 sm:h-20 object-cover border border-white/[0.08]"
                style={{ borderRadius: data.avatarRadius === 9999 ? '9999px' : `${data.avatarRadius}px` }}
              />
            ) : (
              <div
                className="w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center text-xl sm:text-2xl font-bold"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  background: `linear-gradient(145deg, ${theme.from}15, ${theme.to}10)`,
                  borderRadius: data.avatarRadius === 9999 ? '9999px' : `${data.avatarRadius}px`,
                  color: theme.accent,
                  border: `1px solid ${theme.from}20`,
                }}
              >
                {(data.name || '?').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h1
            className="text-lg sm:text-xl font-semibold mb-1"
            style={{
              fontFamily: "'Syne', sans-serif",
              color: textColor,
              letterSpacing: '-0.02em',
            }}
          >
            {data.name || 'Your Name'}
          </h1>
          <p className="text-xs sm:text-sm font-light" style={{ color: `${textColor}66` }}>
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
            <div className="grid grid-cols-1 gap-2">
              {folder.links.map((link, i) => {
                const IconComp = iconMap[link.icon || 'globe'] || Globe
                return (
                  <motion.a
                    key={link.id}
                    href={link.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.015, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ ...glassStyle, borderRadius: `${(data.iconRadius || 12) + 6}px` }}
                    className="flex items-center gap-3 p-3 sm:p-3.5 cursor-pointer group transition-all duration-300 hover:border-white/[0.12]"
                  >
                    <div
                      className="w-9 h-9 flex items-center justify-center overflow-hidden flex-shrink-0"
                      style={{ background: link.customIcon ? 'transparent' : theme.iconBg, borderRadius: `${data.iconRadius || 12}px` }}
                    >
                      {link.customIcon ? (
                        <img src={link.customIcon} alt="" className="w-full h-full object-cover" style={{ borderRadius: `${data.iconRadius || 12}px` }} />
                      ) : (
                        <IconComp size={15} style={{ color: theme.accent }} />
                      )}
                    </div>
                    <span className="flex-1 font-medium text-sm" style={{ color: `${textColor}CC` }}>{link.title || 'Link'}</span>
                    <ShareButton
                      url={link.url}
                      shareText={link.shareText}
                      shareIcon={link.shareIcon || 'copy'}
                      shareButtonColor={link.shareButtonColor}
                      shareButtonTextColor={link.shareButtonTextColor}
                      iconRadius={data.iconRadius}
                    />
                    <ExternalLink size={12} style={{ color: `${textColor}25` }} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                  </motion.a>
                )
              })}
            </div>
          </div>
        ))}

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
