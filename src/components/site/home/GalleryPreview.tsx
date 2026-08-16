'use client'

import { Camera, ArrowRight } from 'lucide-react'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

export function GalleryPreview() {
  const galleryImages = useSiteStore((s) => s.galleryImages)
  const { ref, inView } = useInView()

  if (galleryImages.length === 0) return null

  const previewImages = galleryImages.slice(0, 6)

  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <span className="section-label text-emerald-600 mb-3 block">Gallery</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            A Glimpse of Our Clinic
          </h2>
        </div>

        {/* Masonry-like grid */}
        <div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {previewImages.map((img, i) => (
            <div
              key={img.id}
              className={`group relative overflow-hidden rounded-xl transition-all duration-500 ${
                i === 0 ? 'row-span-2 min-h-[280px] sm:min-h-[360px]' : 'min-h-[140px] sm:min-h-[170px]'
              } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {img.image ? (
                <>
                  <img
                    src={img.image}
                    alt={img.title || 'Gallery image'}
                    className="rounded-xl object-cover w-full h-full img-zoom"
                  />
                  {/* Hover overlay with Camera icon */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white/90" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-amber-50 rounded-xl flex items-center justify-center">
                  <Camera className="w-8 h-8 text-emerald-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={() => { window.location.hash = '#/gallery' }}
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg px-6 py-2.5 text-sm transition-colors inline-flex items-center gap-2"
          >
            View Gallery
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}