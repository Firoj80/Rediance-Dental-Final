'use client'

import { useCallback, useSyncExternalStore } from 'react'

interface RouteInfo {
  route: string
  params: Record<string, string>
}

const ROUTE_PATTERNS: { pattern: RegExp; name: string; paramKeys: string[] }[] = [
  { pattern: /^#\/home$/, name: '/', paramKeys: [] },
  { pattern: /^#\/about$/, name: 'about', paramKeys: [] },
  { pattern: /^#\/services$/, name: 'services', paramKeys: [] },
  { pattern: /^#\/services\/(.+)$/, name: 'service-detail', paramKeys: ['slug'] },
  { pattern: /^#\/gallery$/, name: 'gallery', paramKeys: [] },
  { pattern: /^#\/testimonials$/, name: 'testimonials', paramKeys: [] },
  { pattern: /^#\/blog$/, name: 'blog', paramKeys: [] },
  { pattern: /^#\/blog\/(.+)$/, name: 'blog-detail', paramKeys: ['slug'] },
  { pattern: /^#\/contact$/, name: 'contact', paramKeys: [] },
  { pattern: /^#\/book$/, name: 'book', paramKeys: [] },
  { pattern: /^#\/$/, name: '/', paramKeys: [] },
]

function parseHash(hash: string): RouteInfo {
  for (const { pattern, name, paramKeys } of ROUTE_PATTERNS) {
    const match = hash.match(pattern)
    if (match) {
      const params: Record<string, string> = {}
      paramKeys.forEach((key, i) => {
        params[key] = decodeURIComponent(match[i + 1])
      })
      return { route: name, params }
    }
  }
  return { route: '/', params: {} }
}

// Cache to ensure stable object references between renders
let cachedHash = ''
let cachedSnapshot: RouteInfo = { route: '/', params: {} }

const defaultSnapshot: RouteInfo = { route: '/', params: {} }

function getHashSnapshot(): RouteInfo {
  const hash = typeof window !== 'undefined' ? (window.location.hash || '#/') : ''
  if (hash !== cachedHash) {
    cachedHash = hash
    cachedSnapshot = parseHash(hash)
  }
  return cachedSnapshot
}

function subscribeToHash(callback: () => void): () => void {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

export function useHashRouter() {
  const routeInfo = useSyncExternalStore(subscribeToHash, getHashSnapshot, () => defaultSnapshot)

  const navigate = useCallback((hash: string) => {
    if (typeof window !== 'undefined') {
      window.location.hash = hash
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [])

  return {
    route: routeInfo.route,
    params: routeInfo.params,
    navigate,
  }
}
