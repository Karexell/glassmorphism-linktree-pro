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

export default function NebulaTemplate({ data }: TemplateProps) {
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

  const particles = [
    { size: 80, x: 12, y: 18, delay: 0 },
    { size: 60, x: 75, y: 25, delay: 1.5 },
    { size: 100, x: 40, y: 55, delay: 0.8 },
    { size: 50, x: 85, y: 65, delay: 2.2 },
    { size: 70, x: 20, y: 75, delay: 1.2 },
    { size: 90, x: 60, y: 40, delay: 0.5 },
  ]

  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center p-4 relative overflow-hidden grain"
      style={{ background: '#030008' }}
    >
      {/* Nebula particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40, 0],
              opacity: [0.15, 0.4, 0.15],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 8 + i * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
            className="absolute rounded-full"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: theme.particleColors[i % 2],
              filter: 'blur(40px)',
            }}
          />
        ))}
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
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Profile Card */}
        <motion.div style={glassStyle} className="p-5 sm:p-7 mb-4 text-center">
          <motion.div
            className="inline-block mb-5"
            whileHover={{ scale: 1.03 }}
          >
            {data.avatarUrl ? (
              <img
                src={data.avatarUrl}
                alt={data.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover border border-white/[0.08]"
                style={{
                  borderRadius: data.avatarRadius === 9999 ? '9999px' : `${data.avatarRadius}px`,
                }}
              />
            ) : (
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-2xl sm:text-3xl font-bold"
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
          </motion.div>
          <h1
            className="text-xl sm:text-2xl font-bold"
            style={{
              fontFamily: "'Syne', sans-serif",
              background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em',
            }}
          >
            {data.name || 'Your Name'}
          </h1>
          <p className="text-xs sm:text-sm mt-2 font-light" style={{ color: `${textColor}55` }}>
            {data.bio || 'Your bio goes here'}
          </p>
        </motion.div>

        {/* Folders */}
        {data.folders.map((folder) => (
          <div key={folder.id} className="mb-3.5">
            {folder.name && (
              <h2
                className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-2 px-1"
                style={{ color: data.folderNameColor || `${theme.from}50` }}
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
                    whileHover={{ scale: 1.02, x: 3 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ ...glassStyle, borderRadius: `${(data.iconRadius || 12) + 8}px` }}
                    className="flex items-center gap-3 p-3.5 sm:p-4 cursor-pointer group transition-all duration-300 hover:border-white/[0.12]"
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center overflow-hidden flex-shrink-0"
                      style={{ background: link.customIcon ? 'transparent' : theme.iconBg, borderRadius: `${data.iconRadius || 12}px` }}
                    >
                      {link.customIcon ? (
                        <img src={link.customIcon} alt="" className="w-full h-full object-cover" style={{ borderRadius: `${data.iconRadius || 12}px` }} />
                      ) : (
                        <IconComp size={16} style={{ color: theme.accent }} />
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
