import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { EditorData } from '@/types'
import { getTheme, hexToRgba } from './templateConfig'

export async function exportZip(data: EditorData) {
  const theme = getTheme(data.templateId)
  const textColor = data.textColor || '#ffffff'
  const glassTint = data.glassTint || '#ffffff'
  const glassOpacity = data.glassOpacity / 100
  const blurIntensity = data.blurIntensity || 28
  const glassBorder = (data.glassBorder ?? 6) / 100
  const bgDim = (data.backgroundDim ?? 50) / 100
  const cardRadius = data.cardRadius || 18
  const avatarRadius = data.avatarRadius === 9999 ? '50%' : `${data.avatarRadius}px`
  const iconRadius = data.iconRadius || 12

  const iconSvg: Record<string, string> = {
    globe: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    github: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
    twitter: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>',
    instagram: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
    youtube: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none"/></svg>',
    music: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    mail: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    linkedin: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
    twitch: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/></svg>',
    send: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    link: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    external: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    share: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    copy: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    shareLink: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  }

  const getIconSvg = (iconName: string) => iconSvg[iconName] || iconSvg.globe

  const getShareIconSvg = (iconName?: string) => {
    if (iconName === 'copy') return iconSvg.copy
    if (iconName === 'link') return iconSvg.shareLink
    return iconSvg.share
  }

  const linksHtml = data.folders.map(folder => {
    const folderLabel = folder.name
      ? `<h2 style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.14em;margin:0 0 8px 4px;color:${data.folderNameColor || `${textColor}40`}">${folder.name}</h2>`
      : ''
    const linksItems = folder.links.map(link => {
      const iconContent = link.customIcon
        ? `<img src="${link.customIcon}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:${iconRadius}px">`
        : getIconSvg(link.icon || 'globe')
      const iconBg = link.customIcon ? 'transparent' : theme.iconBg
      const shareIcon = link.shareIcon || 'copy'
      const shareBtnBg = hexToRgba(link.shareButtonColor || '#ffffff', 0.08)
      const shareBtnBgHover = hexToRgba(link.shareButtonColor || '#ffffff', 0.18)
      const shareBtnColor = link.shareButtonTextColor || '#ffffff'
      const shareTooltip = (link.shareText || 'Copy link').replace(/'/g, "\\'")
      const shareBtn = `<button onclick="event.preventDefault();event.stopPropagation();var btn=this;navigator.clipboard&&navigator.clipboard.writeText('${(link.url || '').replace(/'/g, "\\'")}').then(function(){btn.innerHTML='<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'12\\' height=\\'12\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2.5\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><polyline points=\\'20 6 9 17 4 12\\'/></svg>';btn.style.background='rgba(16,185,129,0.15)';btn.style.borderColor='rgba(16,185,129,0.2)';btn.style.color='#6ee7b7';setTimeout(function(){btn.innerHTML='${getShareIconSvg(shareIcon).replace(/'/g, "\\'")}';btn.style.background='${shareBtnBg}';btn.style.borderColor='rgba(255,255,255,0.05)';btn.style.color='${shareBtnColor}'},1500)})" title="${shareTooltip}" style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;flex-shrink:0;background:${shareBtnBg};border:1px solid rgba(255,255,255,0.05);border-radius:${Math.max(iconRadius - 2, 6)}px;color:${shareBtnColor};cursor:pointer;font-size:0;line-height:0;transition:all 0.2s" onmouseover="this.style.background='${shareBtnBgHover}';this.style.transform='scale(1.15)'" onmouseout="this.style.background='${shareBtnBg}';this.style.transform='scale(1)'">${getShareIconSvg(shareIcon)}</button>`
      return `
        <a href="${link.url || '#'}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:${hexToRgba(glassTint, glassOpacity)};backdrop-filter:blur(${blurIntensity}px);-webkit-backdrop-filter:blur(${blurIntensity}px);border:1px solid rgba(255,255,255,${glassBorder});border-radius:${iconRadius + 8}px;text-decoration:none;color:${textColor}CC;transition:transform 0.3s cubic-bezier(0.16,1,0.3,1),box-shadow 0.3s" onmouseover="this.style.transform='scale(1.02) translateY(-2px)';this.style.boxShadow='0 8px 32px rgba(0,0,0,0.3)'" onmouseout="this.style.transform='scale(1)';this.style.boxShadow='none'">
          <div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;background:${iconBg};border-radius:${iconRadius}px;color:${theme.accent}">${iconContent}</div>
          <span style="flex:1;font-weight:500;font-size:14px">${link.title || 'Link'}</span>
          ${shareBtn}
          ${iconSvg.external}
        </a>`
    }).join('')
    return `${folderLabel}<div style="display:flex;flex-direction:column;gap:8px">${linksItems}</div>`
  }).join('')

  const avatarHtml = data.avatarUrl
    ? `<img src="${data.avatarUrl}" alt="${data.name}" style="display:block;margin:0 auto;width:96px;height:96px;max-width:96px;aspect-ratio:1;object-fit:cover;border:1px solid rgba(255,255,255,0.06);border-radius:${avatarRadius}">`
    : `<div style="display:block;margin:0 auto;width:96px;height:96px;max-width:96px;aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;font-family:'Syne',sans-serif;background:linear-gradient(145deg,#1a1030,#0a0618);border:1px solid rgba(255,255,255,0.06);border-radius:${avatarRadius};color:${theme.accent}">${(data.name || '?').charAt(0).toUpperCase()}</div>`

  const backgroundHtml = data.backgroundUrl
    ? data.backgroundType === 'video'
      ? `<video src="${data.backgroundUrl}" autoplay muted playsinline ${data.videoLoop ? 'loop' : ''} style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:${bgDim}"></video>`
      : `<div style="position:absolute;inset:0;background-image:url(${data.backgroundUrl});background-size:cover;background-position:center;opacity:${bgDim}"></div>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${data.name || 'My Links'}</title>
  <meta name="description" content="${data.bio || ''}">
  <meta property="og:title" content="${data.name || 'My Links'}">
  <meta property="og:description" content="${data.bio || ''}">
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#030008">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Syne:wght@600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: #030008;
      position: relative;
      overflow: hidden;
    }
    .container {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 448px;
    }
    .card {
      background: ${hexToRgba(glassTint, glassOpacity)};
      backdrop-filter: blur(${blurIntensity}px);
      -webkit-backdrop-filter: blur(${blurIntensity}px);
      border: 1px solid rgba(255,255,255,${glassBorder});
      border-radius: ${cardRadius}px;
      padding: 28px 24px;
      text-align: center;
      margin-bottom: 16px;
    }
    .name {
      font-family: 'Syne', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: ${textColor};
      margin: 16px 0 6px;
      letter-spacing: -0.03em;
      text-shadow: 0 0 40px ${theme.nameGlow};
    }
    .bio {
      font-size: 13px;
      color: ${textColor}80;
      line-height: 1.6;
      font-weight: 300;
      letter-spacing: 0.01em;
    }
    .links { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
    .footer { text-align: center; margin-top: 24px; font-size: 10px; color: ${textColor}20; letter-spacing: 0.06em; }
    @media (prefers-reduced-motion: reduce) {
      * { animation: none !important; transition: none !important; }
    }
  </style>
</head>
<body>
  ${backgroundHtml}
  <div class="container">
    <div class="card">
      ${avatarHtml}
      <h1 class="name">${data.name || 'Your Name'}</h1>
      <p class="bio">${data.bio || ''}</p>
    </div>
    <div class="links">
      ${linksHtml}
    </div>
    <p class="footer">Built with Glass Links</p>
  </div>
</body>
</html>`

  const zip = new JSZip()
  zip.file('index.html', html)
  zip.file('README.md', `# ${data.name || 'My Links'}\n\nStatic link-in-bio page built with [Glass Links](https://github.com/Karexell/glassmorphism-linktree).\n\nOpen \`index.html\` in a browser to view.\n`)

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, `${(data.name || 'links').toLowerCase().replace(/\s+/g, '-')}.zip`)
}
