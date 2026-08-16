import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert any Google Maps URL to an embeddable format.
 * Handles: embed URLs (passthrough), place URLs with @coordinates,
 * /place/ paths, ?q= params, and short URLs (maps.app.goo.gl).
 */
export function toGoogleMapsEmbedUrl(url: string): string | null {
  if (!url) return null

  // 1. Already an embed URL — use as-is
  if (url.includes('/maps/embed') || url.includes('output=embed')) {
    return url
  }

  // 2. Extract @lat,lng from URL (works for place URLs, regular maps URLs)
  const coordMatch = url.match(/@([\d.\-]+),([\d.\-]+)/)
  if (coordMatch) {
    const lat = coordMatch[1]
    const lng = coordMatch[2]
    // Extract zoom level if present (e.g., @26.226,84.365,17z)
    const zoomMatch = url.match(/@[\d.\-]+,[\d.\-]+,(\d+)z/)
    const zoom = zoomMatch ? zoomMatch[1] : '15'
    return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&ie=UTF8&iwloc=&output=embed`
  }

  // 3. Short URL (maps.app.goo.gl) — can't auto-convert, return null
  // so the UI can show a fallback link instead
  if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
    return null
  }

  // 4. Try to extract /place/... path
  const placeMatch = url.match(/\/place\/([^/?]+)/)
  if (placeMatch) {
    const place = encodeURIComponent(placeMatch[1])
    return `https://maps.google.com/maps?q=${place}&z=15&ie=UTF8&iwloc=&output=embed`
  }

  // 5. Try to extract ?q=... param
  const qMatch = url.match(/[?&]q=([^&]+)/)
  if (qMatch) {
    return `https://maps.google.com/maps?q=${qMatch[1]}&z=15&ie=UTF8&iwloc=&output=embed`
  }

  // 6. Fallback: can't convert, return null
  return null
}

/**
 * Check if a Google Maps URL is a short URL that can't be embedded
 */
export function isGoogleMapsShortUrl(url: string): boolean {
  if (!url) return false
  return url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')
}
