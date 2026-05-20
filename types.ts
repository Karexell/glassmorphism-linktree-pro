export interface LinkItem {
  id: string
  title: string
  url: string
  icon: string
  customIcon?: string
  shareEnabled?: boolean
  shareText?: string
  shareIcon?: 'share' | 'copy' | 'link'
  shareButtonColor?: string
  shareButtonTextColor?: string
}

export interface LinkFolder {
  id: string
  name: string
  links: LinkItem[]
}

export type TemplateId = 'cosmic' | 'aurora' | 'nebula'

export interface FloatingImage {
  id: string
  src: string
  x: number
  y: number
  width: number
  borderRadius: number
  opacity: number
}

export interface EditorData {
  name: string
  bio: string
  avatarUrl: string
  backgroundUrl: string
  backgroundType: 'image' | 'video'
  videoLoop: boolean
  glassOpacity: number
  blurIntensity: number
  glassBorder: number
  backgroundDim: number
  textColor: string
  folderNameColor: string
  glassTint: string
  cardRadius: number
  avatarRadius: number
  iconRadius: number
  templateId: string
  folders: LinkFolder[]
  floatingImages: FloatingImage[]
}

export interface TemplateProps {
  data: EditorData
  isPreview?: boolean
  selectedImageId?: string | null
  onSelectImage?: (id: string | null) => void
  onUpdateImage?: (id: string, updates: Partial<FloatingImage>) => void
  onDeleteImage?: (id: string) => void
}
