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
      {/* Hero */}
      <section className="bg-primary py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">Patient Testimonials</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Hear what our patients have to say about their experience.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {clinicLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : (
            <div ref={ref} className="space-y-6">
              {testimonials.map((testimonial, i) => (
                <div
                  key={testimonial.id}
                  className={`bg-white rounded-xl border p-6 lg:p-8 transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${j < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-foreground/90 leading-relaxed text-lg mb-6 italic">
                    &ldquo;{testimonial.review}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    {testimonial.photo ? (
                      <img
                        src={testimonial.photo}
                        alt={testimonial.patientName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {testimonial.patientName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                      </div>
                    )}
                    <p className="font-medium text-foreground">{testimonial.patientName}</p>
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No testimonials yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
