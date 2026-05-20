export interface ThemeConfig {
  from: string
  to: string
  accent: string
  orbColors: string[]
  particleColors: string[]
  iconBg: string
  nameGlow: string
}

const themes: Record<string, ThemeConfig> = {
  cosmic: {
    from: '#a882ff',
    to: '#6c5ce7',
    accent: '#c4a8ff',
    orbColors: ['rgba(168, 130, 255, 0.18)', 'rgba(108, 92, 231, 0.15)'],
    particleColors: ['rgba(168, 130, 255, 0.25)', 'rgba(108, 92, 231, 0.2)'],
    iconBg: 'rgba(168, 130, 255, 0.1)',
    nameGlow: 'rgba(168, 130, 255, 0.3)',
  },
  aurora: {
    from: '#06d6a0',
    to: '#118ab2',
    accent: '#06d6a0',
    orbColors: ['rgba(6, 214, 160, 0.2)', 'rgba(17, 138, 178, 0.18)'],
    particleColors: ['rgba(6, 214, 160, 0.25)', 'rgba(17, 138, 178, 0.2)'],
    iconBg: 'rgba(6, 214, 160, 0.1)',
    nameGlow: 'rgba(6, 214, 160, 0.3)',
  },
  nebula: {
    from: '#ff6b9d',
    to: '#c44dff',
    accent: '#ff85b1',
    orbColors: ['rgba(255, 107, 157, 0.18)', 'rgba(196, 77, 255, 0.15)'],
    particleColors: ['rgba(255, 107, 157, 0.25)', 'rgba(196, 77, 255, 0.2)'],
    iconBg: 'rgba(255, 107, 157, 0.1)',
    nameGlow: 'rgba(255, 107, 157, 0.3)',
  },
}

export function getTheme(templateId: string): ThemeConfig {
  return themes[templateId] || themes.cosmic
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
