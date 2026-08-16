'use client'

import { ArrowRight, Camera } from 'lucide-react'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

export function GalleryPreview() {
  const galleryImages = useSiteStore((s) => s.galleryImages)
  const { ref, inView } = useInView()

  if (galleryImages.length === 0) return null

  const previewImages = galleryImages.slice(0, 6)

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-xl mb-14 mx-auto text-center">
          <span className="section-label text-emerald-600 mb-3 block">Gallery</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3 leading-tight">
            A Glimpse of Our Clinic
          </h2>
          <p className="text-slate-500 leading-relaxed text-[15px]">
            See our modern facility, equipment, and the care we provide.
          </p>
        </div>
        <div className="-mt-8 mb-10 text-center">
          <button
            onClick={() => { window.location.hash = '#/gallery' }}
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-full px-6 py-2.5 transition-all"
          >
            View Full Gallery
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Masonry-style Grid */}
        <div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {previewImages.map((img, i) => (
            <div
              key={img.id}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-600 ${
                i === 0 ? 'row-span-2 min-h-[300px] sm:min-h-[400px]' : 'min-h-[140px] sm:min-h-[190px]'
              } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {img.image ? (
                <>
                  <img
                    src={img.image}
                    alt={img.caption || 'Clinic gallery'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    <p className="text-white text-sm font-medium truncate">
                      {img.title || 'Gallery Image'}
                    </p>
                    {img.category && (
                      <p className="text-white/70 text-xs mt-0.5">{img.category}</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
