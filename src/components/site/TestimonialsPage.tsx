'use client'

import { Star } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

export function TestimonialsPage() {
  const testimonials = useSiteStore((s) => s.testimonials)
  const clinicLoading = useSiteStore((s) => s.clinicLoading)
  const { ref, inView } = useInView()

  return (
    <div className="pt-20">
      {/* Compact Page Header */}
      <section className="bg-white border-b border-slate-100 py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label text-emerald-600 mb-3 block">Testimonials</span>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Patient Reviews
          </h1>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {clinicLoading ? (
            <div className="space-y-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div ref={ref} className="space-y-5">
              {testimonials.map((testimonial, i) => (
                <div
                  key={testimonial.id}
                  className={`bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100 relative transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {/* Decorative quote mark */}
                  <span className="absolute top-4 left-6 text-emerald-200 text-6xl font-serif leading-none select-none">
                    &ldquo;
                  </span>

                  {/* Review text */}
                  <p className="text-slate-600 leading-relaxed relative z-10 pl-2 mb-6">
                    {testimonial.review}
                  </p>

                  {/* Bottom: avatar + name + date + stars */}
                  <div className="flex items-center gap-3 relative z-10">
                    {testimonial.photo ? (
                      <img
                        src={testimonial.photo}
                        alt={testimonial.patientName}
                        className="rounded-full w-10 h-10 object-cover"
                      />
                    ) : (
                      <div className="bg-emerald-100 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">
                        {testimonial.patientName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">{testimonial.patientName}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              className={`w-3.5 h-3.5 ${
                                j < testimonial.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && (
                <div className="text-center py-12">
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
