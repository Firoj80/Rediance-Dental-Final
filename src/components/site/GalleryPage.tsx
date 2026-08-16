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
            <Skeleton className="h-3 w-16 mb-3" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </section>
        <section className="py-14 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
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
          <span className="section-label text-emerald-600 mb-3 block">Gallery</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Our Gallery
          </h1>
          <p className="text-slate-500 text-[15px]">
            Explore our clinic, facilities, and treatment results.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-5 py-2.5 text-sm font-medium transition-all duration-200 rounded-full
                    ${activeCategory === cat
                      ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/15'
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
          <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightboxImage(img)}
                className={`
                  aspect-square rounded-2xl overflow-hidden group relative cursor-pointer
                  transition-all duration-600
                  ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
                `}
                style={{ transitionDelay: `${(i % 8) * 60}ms` }}
              >
                {img.image ? (
                  <>
                    <img src={img.image} alt={img.title || 'Gallery image'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
                      <span className="text-white text-sm font-medium truncate">
                        {img.title || ''}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <Camera className="w-10 h-10 text-slate-300" />
                  </div>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16">
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
                <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-slate-300" />
                </div>
              )}
              {lightboxImage.title && (
                <div className="p-5 border-t border-slate-100">
                  <p className="font-medium text-slate-900">{lightboxImage.title}</p>
                  {lightboxImage.category && (
                    <p className="text-sm text-slate-400 mt-0.5">{lightboxImage.category}</p>
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