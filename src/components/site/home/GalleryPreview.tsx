'use client'

import { Camera, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

export function GalleryPreview() {
  const galleryImages = useSiteStore((s) => s.galleryImages)
  const { ref, inView } = useInView()

  if (galleryImages.length === 0) return null

  const previewImages = galleryImages.slice(0, 6)

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Gallery</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Take a look at our clinic and the results we deliver.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
          {previewImages.map((img, i) => (
            <div
              key={img.id}
              className={`aspect-square rounded-xl overflow-hidden img-zoom transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {img.image ? (
                <img
                  src={img.image}
                  alt={img.title || 'Gallery image'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-teal-50 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-teal-200" />
                </div>
              )}
            </div>
          ))}
        </div>

        {galleryImages.length > 6 && (
          <div className="text-center mt-10">
            <Button variant="outline" onClick={() => { window.location.hash = '#/gallery' }}>
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
