'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { EditorData, FloatingImage, LinkItem, LinkFolder } from '@/types'
import { Plus, Trash2, GripVertical, FolderPlus, Folder, ChevronDown, ChevronRight, Image, Video, Repeat, Upload, X } from 'lucide-react'
import ImageUploader from './ImageUploader'
import ImageControls from './ImageControls'
import { useState, useRef } from 'react'

interface Props {
  data: EditorData
  onChange: (data: EditorData) => void
  selectedImageId?: string | null
  onSelectImage?: (id: string | null) => void
  onAddImage?: (img: FloatingImage) => void
  onRemoveImage?: (id: string) => void
  onUpdateImage?: (id: string, updates: Partial<FloatingImage>) => void
}

export default function EditorPanel({ data, onChange, selectedImageId, onSelectImage, onAddImage, onRemoveImage, onUpdateImage }: Props) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(data.folders.map(f => f.id)))
  const videoInputRef = useRef<HTMLInputElement>(null)

  const update = (key: keyof EditorData, value: any) => {
    onChange({ ...data, [key]: value })
  }

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const addFolder = () => {
    const newFolder: LinkFolder = {
      id: Date.now().toString(),
      name: '',
      links: [],
    }
    update('folders', [...data.folders, newFolder])
    setExpandedFolders(prev => new Set(prev).add(newFolder.id))
  }

  const removeFolder = (folderId: string) => {
    update('folders', data.folders.filter(f => f.id !== folderId))
  }

  const updateFolderName = (folderId: string, name: string) => {
    update('folders', data.folders.map(f => f.id === folderId ? { ...f, name } : f))
  }

  const addLink = (folderId: string) => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: '',
      url: '',
      icon: 'globe',
      customIcon: '',
    }
    update('folders', data.folders.map(f =>
      f.id === folderId ? { ...f, links: [...f.links, newLink] } : f
    ))
  }

  const updateLink = (folderId: string, linkId: string, field: keyof LinkItem, value: any) => {
    update('folders', data.folders.map(f =>
      f.id === folderId
        ? { ...f, links: f.links.map(l => l.id === linkId ? { ...l, [field]: value } : l) }
        : f
    ))
  }

  const removeLink = (folderId: string, linkId: string) => {
    update('folders', data.folders.map(f =>
      f.id === folderId ? { ...f, links: f.links.filter(l => l.id !== linkId) } : f
    ))
  }

  const handleVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      update('backgroundUrl', reader.result as string)
      update('backgroundType', 'video')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const iconOptions = [
    'globe', 'github', 'twitter', 'instagram', 'youtube',
    'music', 'mail', 'linkedin', 'twitch', 'send', 'link',
  ]

  const accentColor = '#a882ff'

  return (
    <div className="h-full overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-thin">
      {/* Profile Section */}
      <section>
        <h3
          className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-3"
          style={{ color: `${accentColor}80` }}
        >
          Profile
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/40 mb-1 block">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Your name"
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/15 focus:outline-none focus:border-purple-500/30 transition"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Bio</label>
            <textarea
              value={data.bio}
              onChange={(e) => update('bio', e.target.value)}
              placeholder="A short bio about yourself"
              rows={2}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/15 focus:outline-none focus:border-purple-500/30 transition resize-none"
            />
          </div>
          <ImageUploader
            value={data.avatarUrl}
            onChange={(v) => update('avatarUrl', v)}
            label="Avatar"
            placeholder="Upload avatar"
            shape="circle"
          />
        </div>
      </section>

      {/* Appearance Section */}
      <section>
        <h3
          className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-3"
          style={{ color: `${accentColor}80` }}
        >
          Appearance
        </h3>
        <div className="space-y-4">
          {/* Background Type Toggle */}
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Background</label>
            <div className="flex gap-1 mb-2">
              <button
                onClick={() => update('backgroundType', 'image')}
                className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] py-2 rounded-lg border transition ${
                  data.backgroundType === 'image'
                    ? 'bg-purple-500/10 border-purple-500/20 text-purple-300/80'
                    : 'bg-white/[0.02] border-white/[0.04] text-white/25 hover:text-white/40'
                }`}
              >
                <Image size={12} /> Image
              </button>
              <button
                onClick={() => update('backgroundType', 'video')}
                className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] py-2 rounded-lg border transition ${
                  data.backgroundType === 'video'
                    ? 'bg-purple-500/10 border-purple-500/20 text-purple-300/80'
                    : 'bg-white/[0.02] border-white/[0.04] text-white/25 hover:text-white/40'
                }`}
              >
                <Video size={12} /> Video
              </button>
            </div>

            {data.backgroundType === 'image' ? (
              <ImageUploader
                value={data.backgroundUrl}
                onChange={(v) => update('backgroundUrl', v)}
                label=""
                placeholder="Upload image"
                shape="rounded"
              />
            ) : (
              <div>
                {data.backgroundUrl && data.backgroundType === 'video' ? (
                  <div className="relative group mb-2">
                    <video
                      src={data.backgroundUrl}
                      muted
                      playsInline
                      className="w-full max-h-32 object-cover rounded-xl border border-white/[0.06]"
                    />
                    <button
                      onClick={() => { update('backgroundUrl', ''); update('backgroundType', 'image') }}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition border border-white/10"
                    >
                      <X size={12} className="text-white/80" />
                    </button>
                  </div>
                ) : null}
                <motion.button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.03] transition text-xs text-white/25 hover:text-white/40"
                >
                  <Upload size={14} />
                  {data.backgroundUrl ? 'Replace video' : 'Upload video'}
                </motion.button>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFile}
                  className="hidden"
                />
              </div>
            )}

            {data.backgroundType === 'video' && data.backgroundUrl && (
              <motion.button
                type="button"
                onClick={() => update('videoLoop', !data.videoLoop)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-lg border text-xs transition ${
                  data.videoLoop
                    ? 'bg-purple-500/15 border-purple-400/20 text-purple-300/80'
                    : 'bg-white/[0.02] border-white/[0.04] text-white/30 hover:text-white/50'
                }`}
              >
                <Repeat size={12} />
                {data.videoLoop ? 'Looping' : 'Loop off'}
              </motion.button>
            )}
          </div>

          {/* Sliders */}
          {[
            { key: 'glassOpacity' as const, label: 'Glass Opacity', min: 0, max: 100, suffix: '%' },
            { key: 'blurIntensity' as const, label: 'Blur Intensity', min: 0, max: 100, suffix: 'px' },
            { key: 'glassBorder' as const, label: 'Border Opacity', min: 0, max: 50, suffix: '%' },
            { key: 'backgroundDim' as const, label: 'Background Dim', min: 0, max: 100, suffix: '%' },
            { key: 'cardRadius' as const, label: 'Card Corner', min: 0, max: 32, suffix: 'px' },
            { key: 'iconRadius' as const, label: 'Icon Corner', min: 0, max: 24, suffix: 'px' },
          ].map(slider => (
            <div key={slider.key}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-white/40">{slider.label}</label>
                <span className="text-[11px] text-white/25">{data[slider.key]}{slider.suffix}</span>
              </div>
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                value={data[slider.key]}
                onChange={(e) => update(slider.key, Number(e.target.value))}
                className="w-full"
              />
            </div>
          ))}

          {/* Avatar Shape */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-white/40">Avatar Shape</label>
              <span className="text-[11px] text-white/25">{data.avatarRadius >= 9999 ? 'Circle' : `${data.avatarRadius}px`}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={data.avatarRadius >= 9999 ? 100 : data.avatarRadius}
              onChange={(e) => {
                const v = Number(e.target.value)
                update('avatarRadius', v >= 100 ? 9999 : v)
              }}
              className="w-full"
            />
          </div>

          {/* Color pickers */}
          {[
            { key: 'textColor' as const, label: 'Text Color' },
            { key: 'folderNameColor' as const, label: 'Folder Name Color' },
            { key: 'glassTint' as const, label: 'Panel Tint' },
          ].map(cp => (
            <div key={cp.key}>
              <label className="text-xs text-white/40 mb-1 block">{cp.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data[cp.key] || '#ffffff'}
                  onChange={(e) => update(cp.key, e.target.value)}
                  className="w-8 h-8 rounded-lg border border-white/[0.06] cursor-pointer bg-transparent"
                />
                <span className="text-[11px] text-white/25">{data[cp.key] || '#ffffff'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Images Section */}
      <section>
        <h3
          className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-3"
          style={{ color: `${accentColor}80` }}
        >
          Floating Images
        </h3>
        <ImageControls
          images={data.floatingImages || []}
          selectedId={selectedImageId || null}
          onSelect={onSelectImage || (() => {})}
          onAdd={onAddImage || (() => {})}
          onRemove={onRemoveImage || (() => {})}
          onUpdate={onUpdateImage || (() => {})}
        />
      </section>

      {/* Folders Section */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3
            className="text-[10px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: `${accentColor}80` }}
          >
            Link Folders
          </h3>
          <motion.button
            onClick={addFolder}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/60 bg-white/[0.03] hover:bg-white/[0.06] px-2.5 py-1.5 rounded-lg transition"
          >
            <FolderPlus size={11} /> New Folder
          </motion.button>
        </div>

        <div className="space-y-3">
          {data.folders.map((folder) => (
            <motion.div
              key={folder.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.015] border border-white/[0.04] rounded-xl overflow-hidden"
            >
              <div className="flex items-center gap-2 p-3 border-b border-white/[0.03]">
                <button
                  onClick={() => toggleFolder(folder.id)}
                  className="text-white/25 hover:text-white/50 transition"
                >
                  {expandedFolders.has(folder.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                <Folder size={12} className="text-white/25 flex-shrink-0" />
                <input
                  type="text"
                  value={folder.name}
                  onChange={(e) => updateFolderName(folder.id, e.target.value)}
                  placeholder="Folder name (optional)"
                  className="flex-1 bg-transparent text-xs text-white/60 placeholder-white/15 focus:outline-none"
                />
                <span className="text-[10px] text-white/15">{folder.links.length}</span>
                <button
                  onClick={() => removeFolder(folder.id)}
                  className="text-white/15 hover:text-red-400 transition ml-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              <AnimatePresence>
                {expandedFolders.has(folder.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 space-y-2.5">
                      {folder.links.map((link, i) => (
                        <div
                          key={link.id}
                          className="bg-white/[0.015] border border-white/[0.04] rounded-lg p-2.5 space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <GripVertical size={10} className="text-white/10" />
                            <span className="text-[10px] text-white/15 flex-1">Link {i + 1}</span>
                            <button
                              onClick={() => removeLink(folder.id, link.id)}
                              className="text-white/10 hover:text-red-400 transition"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => updateLink(folder.id, link.id, 'title', e.target.value)}
                            placeholder="Link title"
                            className="w-full bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/15 focus:outline-none focus:border-purple-500/20 transition"
                          />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => updateLink(folder.id, link.id, 'url', e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/15 focus:outline-none focus:border-purple-500/20 transition"
                          />
                          <select
                            value={link.icon}
                            onChange={(e) => updateLink(folder.id, link.id, 'icon', e.target.value)}
                            className="w-full bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-1.5 text-xs text-white/40 focus:outline-none focus:border-purple-500/20 transition appearance-none"
                          >
                            {iconOptions.map((icon) => (
                              <option key={icon} value={icon} className="bg-gray-900">{icon}</option>
                            ))}
                          </select>
                          <ImageUploader
                            value={link.customIcon || ''}
                            onChange={(v) => updateLink(folder.id, link.id, 'customIcon', v)}
                            label="Custom Icon"
                            placeholder="Upload icon"
                            shape="square"
                            compact
                          />
                          <div className="pt-1.5 border-t border-white/[0.03] space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-white/25">Share button</span>
                              <select
                                value={link.shareIcon || 'copy'}
                                onChange={(e) => updateLink(folder.id, link.id, 'shareIcon', e.target.value as any)}
                                className="bg-white/[0.02] border border-white/[0.04] rounded-md px-2 py-1 text-[10px] text-white/40 focus:outline-none focus:border-purple-500/20 transition appearance-none"
                              >
                                <option value="share" className="bg-gray-900">Share</option>
                                <option value="copy" className="bg-gray-900">Copy</option>
                                <option value="link" className="bg-gray-900">Link</option>
                              </select>
                            </div>
                            <input
                              type="text"
                              value={link.shareText || ''}
                              onChange={(e) => updateLink(folder.id, link.id, 'shareText', e.target.value)}
                              placeholder="Tooltip text (optional)"
                              className="w-full bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/15 focus:outline-none focus:border-purple-500/20 transition"
                            />
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="text-[10px] text-white/20 mb-1 block">Btn color</label>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="color"
                                    value={link.shareButtonColor || '#ffffff'}
                                    onChange={(e) => updateLink(folder.id, link.id, 'shareButtonColor', e.target.value)}
                                    className="w-6 h-6 rounded border border-white/[0.06] cursor-pointer bg-transparent"
                                  />
                                  <span className="text-[10px] text-white/20">{link.shareButtonColor || '#ffffff'}</span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <label className="text-[10px] text-white/20 mb-1 block">Icon color</label>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="color"
                                    value={link.shareButtonTextColor || '#ffffff'}
                                    onChange={(e) => updateLink(folder.id, link.id, 'shareButtonTextColor', e.target.value)}
                                    className="w-6 h-6 rounded border border-white/[0.06] cursor-pointer bg-transparent"
                                  />
                                  <span className="text-[10px] text-white/20">{link.shareButtonTextColor || '#ffffff'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <motion.button
                        onClick={() => addLink(folder.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-1.5 text-[11px] text-white/25 hover:text-white/40 bg-white/[0.015] hover:bg-white/[0.03] py-2 rounded-lg border border-dashed border-white/[0.04] transition"
                      >
                        <Plus size={10} /> Add Link
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {data.folders.length === 0 && (
            <div className="text-center py-8 text-white/10 text-xs">
              No folders yet. Add a folder to organize your links.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
