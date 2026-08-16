'use client'

import { ArrowRight } from 'lucide-react'
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
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="section-label text-emerald-600 mb-3 block">Gallery</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            A Glimpse of Our Clinic
          </h2>
          <p className="text-slate-500 leading-relaxed">
            See our modern facility, equipment, and treatment results.
          </p>
        </div>

        {/* Grid */}
        <div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {previewImages.map((img, i) => (
            <div
              key={img.id}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ${
                i === 0 ? 'row-span-2 min-h-[260px] sm:min-h-[340px]' : 'min-h-[130px] sm:min-h-[165px]'
              } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {img.image ? (
                <>
                  <img
                    src={img.image}
                    alt={img.caption || 'Clinic gallery'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-lg bg-slate-200" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={() => { window.location.hash = '#/gallery' }}
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            View Full Gallery
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
