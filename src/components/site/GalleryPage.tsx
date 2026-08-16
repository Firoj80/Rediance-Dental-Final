'use client'

import { useState, useMemo } from 'react'
import { Camera } from 'lucide-react'
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
        <section className="page-header">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <Skeleton className="h-3 w-16 mb-3 bg-surface-variant" />
            <Skeleton className="h-8 w-48 mb-2 bg-surface-variant" />
            <Skeleton className="h-4 w-64 bg-surface-variant" />
          </div>
        </section>
        <section className="py-10 lg:py-14 bg-surface">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl bg-surface-variant" />
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
      <section className="page-header">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
          <span className="section-label text-teal mb-3 block">Gallery</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-heading tracking-tight mb-2">
            Our Gallery
          </h1>
          <p className="text-body text-[15px]">
            Explore our clinic, facilities, and treatment results.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-10 lg:py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-5 py-2.5 text-sm font-medium transition-all duration-200 rounded
                    ${activeCategory === cat
                      ? 'bg-teal text-teal-text'
                      : 'text-body hover:text-teal'
                    }
                  `}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          )}

          {/* Image Grid */}
          <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightboxImage(img)}
                className={`
                  aspect-square rounded-xl overflow-hidden group relative cursor-pointer
                  transition-all duration-600
                  ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
                `}
                style={{ transitionDelay: `${(i % 8) * 60}ms` }}
              >
                {img.image ? (
                  <>
                    <img src={img.image} alt={img.title || 'Gallery image'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a111a]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
                      <span className="text-white text-sm font-medium truncate">
                        {img.title || ''}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-surface-low flex items-center justify-center">
                    <Camera className="w-10 h-10 text-surface-variant" />
                  </div>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16">
                <p className="text-subtle text-sm">No images in this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-xl bg-surface-low border-border-subtle">
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
                <div className="aspect-[4/3] bg-surface-low flex items-center justify-center">
                  <Camera className="w-16 h-16 text-surface-variant" />
                </div>
              )}
              {lightboxImage.title && (
                <div className="p-5 border-t border-border-subtle">
                  <p className="font-medium text-foreground">{lightboxImage.title}</p>
                  {lightboxImage.category && (
                    <p className="text-sm text-subtle mt-0.5">{lightboxImage.category}</p>
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
