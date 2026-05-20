import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Glass Links — Premium Linktree Builder',
  description: 'Create stunning glassmorphism link-in-bio pages with cinematic visuals and smooth animations.',
  openGraph: {
    title: 'Glass Links — Premium Linktree Builder',
    description: 'Create stunning glassmorphism link-in-bio pages',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#030008',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#030008] text-white min-h-screen overflow-hidden">
        {children}
      </body>
    </html>
  )
}
