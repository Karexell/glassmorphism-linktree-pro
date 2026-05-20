'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EditorData, FloatingImage, TemplateId } from '@/types'
import EditorPanel from '@/components/EditorPanel'
import TemplateSelector from '@/components/TemplateSelector'
import ExportButton from '@/components/ExportButton'
import ScreenshotButton from '@/components/ScreenshotButton'
import CosmicTemplate from '@/components/templates/CosmicTemplate'
import AuroraTemplate from '@/components/templates/AuroraTemplate'
import NebulaTemplate from '@/components/templates/NebulaTemplate'
import { Sparkles, PanelLeftClose, PanelLeft } from 'lucide-react'

const defaultData: EditorData = {
  name: 'Alex Rivera',
  bio: 'Designer, developer & creative technologist building at the intersection of art and code.',
  avatarUrl: '',
  backgroundUrl: '',
  backgroundType: 'image',
  videoLoop: true,
  glassOpacity: 6,
  blurIntensity: 28,
  glassBorder: 6,
  backgroundDim: 50,
  textColor: '#ffffff',
  folderNameColor: '#ffffff',
  glassTint: '#ffffff',
  cardRadius: 18,
  avatarRadius: 9999,
  iconRadius: 12,
  templateId: 'cosmic',
  floatingImages: [],
  folders: [
    {
      id: '1',
      name: 'Social',
      links: [
        { id: '1', title: 'Twitter / X', url: 'https://x.com', icon: 'twitter' },
        { id: '2', title: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
        { id: '3', title: 'YouTube', url: 'https://youtube.com', icon: 'youtube' },
      ],
    },
    {
      id: '2',
      name: 'Work',
      links: [
        { id: '4', title: 'Portfolio', url: 'https://example.com', icon: 'globe' },
        { id: '5', title: 'GitHub', url: 'https://github.com', icon: 'github' },
        { id: '6', title: 'Email Me', url: 'mailto:hello@example.com', icon: 'mail' },
      ],
    },
  ],
}

const templateComponents: Record<TemplateId, React.ComponentType<any>> = {
  cosmic: CosmicTemplate,
  aurora: AuroraTemplate,
  nebula: NebulaTemplate,
}

export default function Home() {
  const [data, setData] = useState<EditorData>(defaultData)
  const [panelOpen, setPanelOpen] = useState(true)
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)

  const TemplateComponent = templateComponents[data.templateId as TemplateId] || CosmicTemplate

  const addFloatingImage = useCallback((img: FloatingImage) => {
    setData(prev => ({ ...prev, floatingImages: [...prev.floatingImages, img] }))
    setSelectedImageId(img.id)
  }, [])

  const removeFloatingImage = useCallback((id: string) => {
    setData(prev => ({ ...prev, floatingImages: prev.floatingImages.filter(i => i.id !== id) }))
    if (selectedImageId === id) setSelectedImageId(null)
  }, [selectedImageId])

  const updateFloatingImage = useCallback((id: string, updates: Partial<FloatingImage>) => {
    setData(prev => ({
      ...prev,
      floatingImages: prev.floatingImages.map(i => i.id === id ? { ...i, ...updates } : i),
    }))
  }, [])

  return (
    <div className="h-[100dvh] flex flex-col bg-[#030008]">
      {/* Top Bar */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 border-b border-white/[0.04] bg-white/[0.015] backdrop-blur-xl z-20 flex-shrink-0"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            onClick={() => setPanelOpen(!panelOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 sm:p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] transition"
            aria-label={panelOpen ? 'Close editor panel' : 'Open editor panel'}
          >
            {panelOpen ? (
              <PanelLeftClose size={16} className="text-white/40" />
            ) : (
              <PanelLeft size={16} className="text-white/40" />
            )}
          </motion.button>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-purple-400/80" />
            <span
              className="text-xs sm:text-sm font-semibold text-white/70"
              style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}
            >
              Glass Links
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block">
            <TemplateSelector
              selected={data.templateId as TemplateId}
              onSelect={(id) => setData({ ...data, templateId: id })}
            />
          </div>
          <ScreenshotButton />
          <ExportButton data={data} />
        </div>
      </motion.header>

      {/* Mobile template selector */}
      <div className="sm:hidden px-4 py-2 border-b border-white/[0.03] bg-white/[0.01]">
        <TemplateSelector
          selected={data.templateId as TemplateId}
          onSelect={(id) => setData({ ...data, templateId: id })}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Editor Panel */}
        <AnimatePresence mode="wait">
          {panelOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="border-r border-white/[0.04] bg-white/[0.01] overflow-hidden flex-shrink-0 hidden sm:block"
            >
              <div className="w-[380px] h-full">
                <EditorPanel
                  data={data}
                  onChange={setData}
                  selectedImageId={selectedImageId}
                  onSelectImage={setSelectedImageId}
                  onAddImage={addFloatingImage}
                  onRemoveImage={removeFloatingImage}
                  onUpdateImage={updateFloatingImage}
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile editor */}
        <div className="sm:hidden flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 overflow-hidden relative min-h-0">
            <div className="absolute inset-0 overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={data.templateId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="min-h-full"
                  data-preview="true"
                >
                  <TemplateComponent
                    data={data}
                    selectedImageId={selectedImageId}
                    onSelectImage={setSelectedImageId}
                    onUpdateImage={updateFloatingImage}
                    onDeleteImage={removeFloatingImage}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="h-[45vh] border-t border-white/[0.04] overflow-hidden">
            <EditorPanel
              data={data}
              onChange={setData}
              selectedImageId={selectedImageId}
              onSelectImage={setSelectedImageId}
              onAddImage={addFloatingImage}
              onRemoveImage={removeFloatingImage}
              onUpdateImage={updateFloatingImage}
            />
          </div>
        </div>

        {/* Desktop Preview */}
        <main className="flex-1 overflow-hidden relative hidden sm:block">
          <div className="absolute inset-0 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={data.templateId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="min-h-full"
                data-preview="true"
              >
                <TemplateComponent
                  data={data}
                  selectedImageId={selectedImageId}
                  onSelectImage={setSelectedImageId}
                  onUpdateImage={updateFloatingImage}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
