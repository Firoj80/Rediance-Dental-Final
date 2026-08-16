'use client'

import { Star } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

const MAX_REVIEWS = 9

export function TestimonialsPage() {
  const testimonials = useSiteStore((s) => s.testimonials)
  const clinicLoading = useSiteStore((s) => s.clinicLoading)
  const { ref, inView } = useInView()

  const displayedTestimonials = testimonials.slice(0, MAX_REVIEWS)

  return (
    <div className="pt-20">
      {/* Compact Page Header */}
      <section className="bg-white border-b border-slate-100 py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label text-emerald-600 mb-3 block">Testimonials</span>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Patient Reviews
          </h1>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-10 lg:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {clinicLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedTestimonials.map((testimonial, i) => (
                <div
                  key={testimonial.id}
                  className={`bg-white rounded-2xl p-6 border border-slate-100 relative transition-all duration-500 flex flex-col h-full ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {/* Decorative quote mark */}
                  <span className="absolute top-4 right-5 text-emerald-100 text-5xl font-serif leading-none select-none">
                    &ldquo;
                  </span>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${
                          j < testimonial.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="text-slate-600 leading-relaxed relative z-10 text-sm flex-1 line-clamp-5">
                    {testimonial.review}
                  </p>

                  {/* Bottom: avatar + name */}
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100 relative z-10">
                    {testimonial.photo ? (
                      <img
                        src={testimonial.photo}
                        alt={testimonial.patientName}
                        className="rounded-full w-10 h-10 object-cover"
                      />
                    ) : (
                      <div className="bg-emerald-100 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                        {testimonial.patientName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-slate-900">
                      {testimonial.patientName}
                    </span>
                  </div>
                </div>
              ))}
              {displayedTestimonials.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <p className="text-slate-400 text-sm">No testimonials yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
