'use client'

import { useState, useMemo } from 'react'
import { Camera, X } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
        <section className="bg-primary py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Skeleton className="h-10 w-48 mx-auto" />
          </div>
        </section>
        <section className="py-16 lg:py-24 bg-muted/30">
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
      {/* Hero */}
      <section className="bg-primary py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">Gallery</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Explore our clinic, facilities, and treatment results.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length > 2 && (
            <div className="flex justify-center mb-10">
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  {categories.slice(1).map((cat) => (
                    <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}

          <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightboxImage(img)}
                className={`aspect-square rounded-xl overflow-hidden img-zoom card-hover transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${(i % 8) * 60}ms` }}
              >
                {img.image ? (
                  <img src={img.image} alt={img.title || 'Gallery image'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-teal-50 flex items-center justify-center">
                    <Camera className="w-10 h-10 text-teal-200" />
                  </div>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No images in this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
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
                <div className="aspect-[4/3] bg-teal-50 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-teal-200" />
                </div>
              )}
              {lightboxImage.title && (
                <div className="p-4 border-t">
                  <p className="font-medium text-foreground">{lightboxImage.title}</p>
                  {lightboxImage.category && (
                    <p className="text-sm text-muted-foreground">{lightboxImage.category}</p>
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
