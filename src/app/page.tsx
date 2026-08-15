'use client'

import dynamic from 'next/dynamic'

const SiteApp = dynamic(() => import('@/components/site/SiteApp').then(m => ({ default: m.SiteApp })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  return <SiteApp />
}
