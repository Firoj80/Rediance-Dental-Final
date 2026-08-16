'use client'

import { useState, useMemo } from 'react'
import { Camera, X } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { useSiteStore, type GalleryImageData } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

export function GalleryPage() {
  const galleryImages = useSiteStore((s) => s.galleryImages)
  const clinicLoading = useSiteStore((s) => s.clinicLoading)
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightboxImage, setLightboxImage] = useState<GalleryImageData | null>(null)
  const { ref, inView } = useInView()

  const categories = useMemo(() => {
    const cats = new Set<string>()
    galleryImages.forEach((img) => {
      if (img.category) cats.add(img.category)
    })
    return ['all', ...Array.from(cats)]
  }, [galleryImages])

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return galleryImages
    return galleryImages.filter((img) => img.category === activeCategory)
  }, [galleryImages, activeCategory])

  if (clinicLoading) {
    return (
      <div className="pt-20">
        {/* Compact header skeleton */}
        <section className="bg-white border-b border-slate-100 py-14 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-3 w-16 mb-3" />
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </section>
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="pt-20">
      {/* Compact Page Header */}
      <section className="bg-white border-b border-slate-100 py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label text-emerald-600 mb-3 block">Gallery</span>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Our Gallery
          </h1>
          <p className="text-slate-500 text-sm">
            Explore our clinic, facilities, and treatment results.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-4 py-2 text-sm font-medium transition-colors rounded-full
                    ${activeCategory === cat
                      ? 'bg-emerald-700 text-white'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                    }
                  `}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          )}

          {/* Image Grid */}
          <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightboxImage(img)}
                className={`
                  aspect-square rounded-xl overflow-hidden img-zoom group relative
                  transition-all duration-500
                  ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                style={{ transitionDelay: `${(i % 8) * 60}ms` }}
              >
                {img.image ? (
                  <img src={img.image} alt={img.title || 'Gallery image'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-amber-50 flex items-center justify-center">
                    <Camera className="w-10 h-10 text-emerald-200" />
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-white text-xs font-medium truncate">
                    {img.title || ''}
                  </span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-400 text-sm">No images in this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-2xl">
          <DialogTitle className="sr-only">{lightboxImage?.title || 'Gallery Image'}</DialogTitle>
          {lightboxImage && (
            <div>
              {lightboxImage.image ? (
                <img
                  src={lightboxImage.image}
                  alt={lightboxImage.title || 'Gallery image'}
                  className="w-full max-h-[80vh] object-contain"
                />
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-emerald-100 to-amber-50 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-emerald-200" />
                </div>
              )}
              {lightboxImage.title && (
                <div className="p-4 border-t border-slate-100">
                  <p className="font-medium text-slate-900">{lightboxImage.title}</p>
                  {lightboxImage.category && (
                    <p className="text-sm text-slate-400">{lightboxImage.category}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
